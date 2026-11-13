/* Always start at the top after a reload.

   Browsers restore the previous scroll position on reload. That fights
   the hero motion, which assumes the page opens at y=0. Setting
   scrollRestoration to "manual" early in the head cancels the restore,
   and the extra scroll on load covers engines that restore later.

   This only reacts to a reload. Normal navigations, deep links with a
   hash, in-page anchors and back/forward keep their usual behaviour. */
(function () {
  "use strict";

  var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  var type = nav ? nav.type : "";
  if (!type && performance.navigation) {
    type = performance.navigation.type === 1 ? "reload" : "";
  }
  if (type !== "reload") return;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  var toTop = function () {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  toTop();
  window.addEventListener("load", toTop, { once: true });
  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) toTop();
  }, { once: true });
})();
