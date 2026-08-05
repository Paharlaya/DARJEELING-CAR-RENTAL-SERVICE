/* The day accordion. Exactly one day is open at a time — an itinerary always
   has a "current" day, and it keeps the image panel meaningful. Opening a day
   crossfades the right-hand image to that day's photo.

   Deep links work: /itineraries/gld-07.html#day-3 opens day 3 and scrolls to
   it, which is useful when you want to send a customer straight to one day. */
(function () {
  "use strict";

  var root = document.querySelector("[data-days]");
  if (!root) return;

  var days = Array.prototype.slice.call(root.querySelectorAll(".day"));
  var images = Array.prototype.slice.call(root.querySelectorAll(".days__frame img"));
  var caption = root.querySelector("[data-day-caption]");
  if (!days.length) return;

  function open(n) {
    days.forEach(function (day) {
      var toggle = day.querySelector(".day__toggle");
      var isTarget = toggle && toggle.getAttribute("data-day") === String(n);
      day.classList.toggle("is-open", isTarget);
      if (toggle) toggle.setAttribute("aria-expanded", isTarget ? "true" : "false");
    });

    images.forEach(function (img) {
      var isTarget = img.getAttribute("data-day") === String(n);
      img.classList.toggle("is-active", isTarget);
      if (isTarget && caption) {
        caption.textContent = img.getAttribute("data-caption") || "";
      }
    });
  }

  root.addEventListener("click", function (e) {
    var toggle = e.target.closest ? e.target.closest(".day__toggle") : null;
    if (!toggle) return;
    var n = toggle.getAttribute("data-day");
    // Radio behaviour: re-clicking the open day leaves it open, so the
    // itinerary always has a current day and the image panel always matches.
    if (toggle.getAttribute("aria-expanded") === "true") return;
    open(n);
    if (history.replaceState) history.replaceState(null, "", "#day-" + n);
  });

  function fromHash() {
    var m = /^#day-(\d+)$/.exec(window.location.hash);
    if (!m) return false;
    var n = parseInt(m[1], 10);
    if (!(n >= 1 && n <= days.length)) return false;
    open(n);
    return true;
  }

  if (fromHash()) {
    var el = document.getElementById("day-" + /\d+/.exec(window.location.hash)[0]);
    if (el) {
      window.setTimeout(function () {
        el.scrollIntoView({ behavior: "auto", block: "center" });
      }, 60);
    }
  }

  window.addEventListener("hashchange", fromHash);
})();
