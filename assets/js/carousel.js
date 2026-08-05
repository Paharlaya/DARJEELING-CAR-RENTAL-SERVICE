/* Hero carousel. Five slides, fixed headline, per-slide caption.
   Indicators are progress rules rather than dots, so you can see how long
   until it moves.

   Pausing is tracked as state, not as paired enter/leave events. The earlier
   version paused on mouseenter and resumed on mouseleave, which broke on
   scroll: when the hero moves out from under a stationary cursor the browser
   fires mouseleave lazily — only once the pointer next moves — so the carousel
   paused and never resumed. There is no hover pause now; the controls are
   explicit, and hovering the copy column should not stop the images.

   It stops only when it genuinely should: the tab is hidden, the hero is
   scrolled out of view, a control has keyboard focus, or reduced motion is on. */
(function () {
  "use strict";

  var root = document.querySelector("[data-carousel]");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".hero__slide"));
  var bars = Array.prototype.slice.call(root.querySelectorAll(".hero__bar"));
  var caption = root.querySelector("[data-hero-caption]");
  if (slides.length < 2) return;

  var DURATION = 6000; // must match --slide-dur in main.css
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  var index = 0;
  var timer = null;

  /* Every reason the carousel might be stopped. It runs only when all clear. */
  var blocked = { hidden: false, offscreen: false, focused: false };

  function shouldRun() {
    return !reduce.matches && !blocked.hidden && !blocked.offscreen && !blocked.focused;
  }

  /* The fill is a CSS animation and the advance is a JS timer, so a resume has
     to restart both or the bar finishes early and the two drift apart. */
  function restartBar() {
    var bar = bars[index];
    if (!bar) return;
    bar.classList.remove("is-paused");
    bar.setAttribute("aria-current", "false");
    void bar.offsetWidth; // force reflow
    bar.setAttribute("aria-current", "true");
  }

  function clearTimer() {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
  }

  function queueNext() {
    clearTimer();
    if (!shouldRun()) return;
    timer = window.setTimeout(function () {
      show(index + 1);
    }, DURATION);
  }

  function show(next) {
    var target = (next + slides.length) % slides.length;

    if (target !== index) {
      slides[index].classList.remove("is-active");
      slides[index].setAttribute("aria-hidden", "true");
      if (bars[index]) {
        bars[index].classList.remove("is-paused");
        bars[index].setAttribute("aria-current", "false");
      }

      index = target;

      slides[index].classList.add("is-active");
      slides[index].setAttribute("aria-hidden", "false");
      if (bars[index]) bars[index].setAttribute("aria-current", "true");
      if (caption) caption.textContent = slides[index].getAttribute("data-caption") || "";
    } else {
      restartBar();
    }

    queueNext();
  }

  /* Called whenever a blocking reason changes. Only acts on an actual
     transition, so a redundant sync can't reset the bar mid-cycle. */
  function sync() {
    if (shouldRun()) {
      if (!timer) {
        restartBar();
        queueNext();
      }
    } else {
      clearTimer();
      var bar = bars[index];
      if (bar) bar.classList.add("is-paused");
    }
  }

  bars.forEach(function (bar, i) {
    bar.addEventListener("click", function () {
      show(i);
    });
  });

  /* Tabbing to the controls pauses, which is the keyboard user's way to stop
     the motion. Gated on :focus-visible so a mouse click — which also moves
     focus to the button — does not leave the carousel stuck. */
  function inNav(el) {
    return el && el.closest && el.closest(".hero__nav");
  }

  root.addEventListener("focusin", function (e) {
    if (!inNav(e.target)) return;
    var viaKeyboard = false;
    try {
      viaKeyboard = e.target.matches(":focus-visible");
    } catch (err) {
      viaKeyboard = false; // older browser: treat as mouse, keep playing
    }
    if (!viaKeyboard) return;
    blocked.focused = true;
    sync();
  });

  root.addEventListener("focusout", function (e) {
    if (!inNav(e.target)) return;
    blocked.focused = false;
    sync();
  });

  document.addEventListener("visibilitychange", function () {
    blocked.hidden = document.hidden;
    sync();
  });

  /* Don't animate a hero nobody can see — and pick straight back up on return. */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        blocked.offscreen = !entries[0].isIntersecting;
        sync();
      },
      { threshold: 0 }
    ).observe(root);
  }

  if (typeof reduce.addEventListener === "function") {
    reduce.addEventListener("change", sync);
  }

  sync();
})();
