/* Fleet turntable. The outgoing vehicle rotates away, the incoming one
   rotates in from the side you asked for. Specs come from a data attribute
   so the markup stays the single source of truth. */
(function () {
  "use strict";

  var root = document.querySelector("[data-fleet]");
  if (!root) return;

  var cars = Array.prototype.slice.call(root.querySelectorAll(".fleet__car"));
  var dots = Array.prototype.slice.call(root.querySelectorAll(".fleet__dot"));
  var nameEl = root.querySelector("[data-fleet-name]");
  var specsEl = root.querySelector("[data-fleet-specs]");
  var prevBtn = root.querySelector("[data-fleet-prev]");
  var nextBtn = root.querySelector("[data-fleet-next]");
  if (cars.length < 2) return;

  var specs = [];
  try {
    specs = JSON.parse(root.getAttribute("data-specs") || "[]");
  } catch (e) {
    specs = [];
  }

  var index = 0;
  var busy = false;

  function render(next, reverse) {
    if (busy || next === index) return;
    busy = true;

    root.classList.toggle("fleet--rev", !!reverse);

    var out = cars[index];
    out.classList.remove("is-active");
    out.classList.add("is-leaving");
    out.setAttribute("aria-hidden", "true");
    if (dots[index]) dots[index].setAttribute("aria-current", "false");

    index = (next + cars.length) % cars.length;

    cars[index].classList.remove("is-leaving");
    cars[index].classList.add("is-active");
    cars[index].setAttribute("aria-hidden", "false");
    if (dots[index]) dots[index].setAttribute("aria-current", "true");

    var s = specs[index];
    if (s) {
      if (nameEl) nameEl.textContent = s.name;
      if (specsEl) {
        specsEl.innerHTML = "";
        specsEl.appendChild(document.createTextNode(s.type + " · "));
        var b = document.createElement("b");
        b.textContent = s.seats;
        specsEl.appendChild(b);
        specsEl.appendChild(document.createTextNode(" · " + s.bags + " · " + s.bestFor));
      }
    }

    window.setTimeout(function () {
      out.classList.remove("is-leaving");
      busy = false;
    }, 720);
  }

  if (nextBtn) nextBtn.addEventListener("click", function () { render(index + 1, false); });
  if (prevBtn) prevBtn.addEventListener("click", function () { render(index - 1, true); });

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () { render(i, i < index); });
  });

  // Arrow keys when the turntable has focus
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { render(index + 1, false); }
    else if (e.key === "ArrowLeft") { render(index - 1, true); }
  });
})();
