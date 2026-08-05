/* Header condense, terrace-contour draw-in, and scroll reveals.
   The terrace contours are the Ridgeline between sections: each path is
   measured so its stroke-dasharray matches its own length, then drawn when
   it scrolls into view. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Header ---------------------------------------------------------- */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Measure each contour so the draw-in is proportional ------------- */
  var paths = document.querySelectorAll(".terrace--draw path");
  for (var i = 0; i < paths.length; i++) {
    try {
      paths[i].style.setProperty("--len", Math.ceil(paths[i].getTotalLength()));
    } catch (e) {
      /* getTotalLength unsupported — CSS fallback length applies */
    }
  }

  /* --- Reveal on scroll ----------------------------------------------- */
  var targets = document.querySelectorAll(".reveal, .terrace--draw");

  if (reduce || !("IntersectionObserver" in window)) {
    for (var j = 0; j < targets.length; j++) targets[j].classList.add("is-visible");
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
  );

  for (var k = 0; k < targets.length; k++) io.observe(targets[k]);
})();
