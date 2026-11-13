import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const OUT = path.join(ROOT, "replica", "clone-screens");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9333;
const PROFILE = path.join(os.tmpdir(), "portfolio-clone-chrome");

const PAGES = [
  ["home", "/"],
  ["factory", "/factory"],
  ["blog-index", "/blog/"],
  ["blog-post", "/blog/how-a-change-ships.html"],
  ["blog-post-2", "/blog/pricing-the-payout.html"],
  ["blog-post-3", "/blog/delete-a-feature.html"],
  ["not-found", "/404.html"],
];
const WIDTHS = [390, 800, 1440];

const CLIPS = {
  home: [".flagship--warm", ".flagship--ink", ".lab", ".trusted", ".closing"],
  factory: [".floor-room", ".office", ".factory-cast"],
  "blog-index": [".blog-list"],
  "blog-post": [".post-body"],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const fn of this.listeners.get(msg.method) || []) fn(msg.params);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  once(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout ${method}`)), timeout);
      const fn = (params) => {
        clearTimeout(timer);
        this.listeners.set(method, (this.listeners.get(method) || []).filter((f) => f !== fn));
        resolve(params);
      };
      this.listeners.set(method, [...(this.listeners.get(method) || []), fn]);
    });
  }
}

async function waitForChrome() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return await res.json();
    } catch {}
    await sleep(150);
  }
  throw new Error("Chrome did not start");
}

async function main() {
  if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  await mkdir(OUT, { recursive: true });
  await rm(PROFILE, { recursive: true, force: true });

  const chrome = spawn(CHROME, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-color-profile=srgb",
    "--font-render-hinting=none",
    "about:blank",
  ], { stdio: "ignore" });

  try {
    await waitForChrome();
    const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", reject, { once: true });
    });
    const cdp = new CDP(ws);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });

    const report = [];

    for (const width of WIDTHS) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width < 600,
      });

      for (const [name, route] of PAGES) {
        const loaded = cdp.once("Page.loadEventFired");
        await cdp.send("Page.navigate", { url: `http://127.0.0.1:4173${route}` });
        await loaded;
        await cdp.send("Runtime.evaluate", {
          expression: `(async () => {
            await document.fonts.ready;
            const imgs = [...document.images];
            imgs.forEach(img => { img.loading = "eager"; });
            await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => {
              img.addEventListener("load", r, { once: true });
              img.addEventListener("error", r, { once: true });
            })));
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 250))));
          })()`,
          awaitPromise: true,
        });

        const diag = await cdp.send("Runtime.evaluate", {
          expression: `(() => {
            const els = [...document.querySelectorAll('body *')];
            const wide = els.filter(el => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);
            }).filter(el => !el.closest('.ticker')).slice(0, 6).map(el => ({
              tag: el.tagName.toLowerCase(),
              cls: String(el.className).slice(0, 50),
              right: Math.round(el.getBoundingClientRect().right)
            }));
            return {
              title: document.title,
              h1: document.querySelectorAll('h1').length,
              docWidth: document.documentElement.scrollWidth,
              viewport: innerWidth,
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              wide,
              missingAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
              brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
              bodyFont: getComputedStyle(document.body).fontFamily,
              navLinksVisible: getComputedStyle(document.querySelector('.nav-links')).display,
              mainText: document.querySelector('main').innerText.length,
              height: Math.round(document.documentElement.scrollHeight)
            };
          })()`,
          returnByValue: true,
        });

        const metrics = await cdp.send("Page.getLayoutMetrics");
        const size = metrics.cssContentSize;
        const shot = await cdp.send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(size.height), scale: 1 },
        });
        const file = path.join(OUT, `${name}-${width}.png`);
        await writeFile(file, Buffer.from(shot.data, "base64"));

        const view = await cdp.send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: false,
        });
        await writeFile(path.join(OUT, `${name}-${width}-view.png`), Buffer.from(view.data, "base64"));

        for (const [i, selector] of (CLIPS[name] || []).entries()) {
          const rect = await cdp.send("Runtime.evaluate", {
            expression: `(() => {
              const el = document.querySelector(${JSON.stringify(selector)});
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
            })()`,
            returnByValue: true,
          });
          const box = rect.result.value;
          if (!box) continue;
          const clip = await cdp.send("Page.captureScreenshot", {
            format: "png",
            captureBeyondViewport: true,
            clip: { x: box.x, y: box.y, width: Math.ceil(box.width), height: Math.ceil(box.height), scale: 1 },
          });
          const slug = selector.replace(/[^a-z0-9]+/gi, "").slice(0, 24);
          await writeFile(path.join(OUT, `clip-${name}-${width}-${i}-${slug}.png`), Buffer.from(clip.data, "base64"));
        }

        report.push({ page: name, route, width, file: path.relative(ROOT, file), ...diag.result.value });
        console.log(`${width}px ${route} -> ${path.basename(file)} (${size.height}px tall)`);
      }
    }

    await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
      mobile: false,
    });
    const ogLoaded = cdp.once("Page.loadEventFired");
    await cdp.send("Page.navigate", { url: "http://127.0.0.1:4173/assets/og.svg" });
    await ogLoaded;
    await cdp.send("Runtime.evaluate", {
      expression: "document.fonts.ready.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))",
      awaitPromise: true,
    });
    const og = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    await writeFile(path.join(ROOT, "assets", "og.png"), Buffer.from(og.data, "base64"));
    console.log("wrote assets/og.png (1200x630)");
    const bad = report.filter((r) => r.overflow || r.missingAlt || (r.brokenImages || []).length || r.h1 !== 1);
    console.log(`\n${report.length} shots, ${bad.length} with layout/a11y flags`);
    if (bad.length) console.log(JSON.stringify(bad, null, 2));
  } finally {
    chrome.kill();
    await sleep(300);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
