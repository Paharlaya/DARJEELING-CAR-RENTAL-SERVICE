/* Hero carousel. Five slides, fixed headline, per-slide caption.
   Indicators are progress rules rather than dots, so you can see how long
   until it moves. Pauses on hover and on focus; under reduced-motion it
   shows the first slide and never advances. */
(function () {
  "use strict";

  var root = document.querySelector("[data-carousel]");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".hero__slide"));
  var bars = Array.prototype.slice.call(root.querySelectorAll(".hero__bar"));
  var caption = root.querySelector("[data-hero-caption]");
  if (slides.length < 2) return;

  var DURATION = 6000;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var index = 0;
  var timer = null;

  function show(next) {
    if (next === index) return;
    slides[index].classList.remove("is-active");
    slides[index].setAttribute("aria-hidden", "true");
    if (bars[index]) bars[index].setAttribute("aria-current", "false");

    index = (next + slides.length) % slides.length;

    slides[index].classList.add("is-active");
    slides[index].setAttribute("aria-hidden", "false");
    if (bars[index]) bars[index].setAttribute("aria-current", "true");
    if (caption) caption.textContent = slides[index].getAttribute("data-caption") || "";
  }

  function start() {
    stop();
    if (reduce.matches) return;
    timer = window.setTimeout(function () {
      show(index + 1);
      start();
    }, DURATION);
  }

  function stop() {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
  }

  function pause() {
    stop();
    if (bars[index]) bars[index].classList.add("is-paused");
  }

  /* The bar fill is a CSS animation and the advance is a JS timer. Resuming
     restarts the timer from zero, so the bar has to restart too or the two
     drift apart and the fill finishes early. */
  function resume() {
    var bar = bars[index];
    if (bar) {
      bar.classList.remove("is-paused");
      bar.setAttribute("aria-current", "false");
      void bar.offsetWidth; // force reflow so the animation restarts
      bar.setAttribute("aria-current", "true");
    }
    start();
  }

  bars.forEach(function (bar, i) {
    bar.addEventListener("click", function () {
      show(i);
      start();
    });
  });

  root.addEventListener("mouseenter", pause);
  root.addEventListener("mouseleave", resume);
  root.addEventListener("focusin", pause);
  root.addEventListener("focusout", resume);

  // Don't animate against a hidden tab
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) pause();
    else resume();
  });

  reduce.addEventListener("change", function () {
    if (reduce.matches) stop();
    else start();
  });

  start();
})();
