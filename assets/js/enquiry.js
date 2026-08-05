/* The enquiry form composes a WhatsApp message and opens it. There is no
   backend: nothing is sent until the customer presses send in WhatsApp.
   On an itinerary page the route is already selected by the build. */
(function () {
  "use strict";

  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var waUrl = form.getAttribute("data-wa") || "";
  var number = "";
  try {
    number = new URL(waUrl).pathname.replace(/\//g, "");
  } catch (e) {
    number = "";
  }
  if (!number) return;

  var select = form.querySelector("#f-package");

  // Allow ?package=GLD-07 to preselect, so any link can carry the route
  var qs = new URLSearchParams(window.location.search).get("package");
  if (qs && select) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value.toLowerCase() === qs.toLowerCase()) {
        select.selectedIndex = i;
        break;
      }
    }
  }

  function setError(name, message) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    var slot = form.querySelector('[data-error-for="' + name + '"]');
    if (wrap) wrap.classList.toggle("field--error", !!message);
    if (slot) slot.textContent = message || "";
  }

  function value(name) {
    var el = form.elements[name];
    return el && el.value ? el.value.trim() : "";
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var m = parseInt(parts[1], 10) - 1;
    return parts[2].replace(/^0/, "") + " " + (months[m] || parts[1]) + " " + parts[0];
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = value("name");
    var phone = value("phone");
    var ok = true;

    if (!name) {
      setError("name", "We need a name to call you by.");
      ok = false;
    } else {
      setError("name", "");
    }

    // Deliberately loose: travellers write numbers in all sorts of ways.
    if (phone.replace(/[^0-9]/g, "").length < 8) {
      setError("phone", "Add a number we can reach you on.");
      ok = false;
    } else {
      setError("phone", "");
    }

    if (!ok) {
      var bad = form.querySelector(".field--error input");
      if (bad) bad.focus();
      return;
    }

    var routeLabel = "";
    if (select && select.value) {
      routeLabel = select.options[select.selectedIndex].text;
    }

    var lines = [];
    lines.push(
      routeLabel
        ? "Hi Khangri Karpoo — I'd like to enquire about " + routeLabel + "."
        : "Hi Khangri Karpoo — I'd like to enquire about a tour of Darjeeling and Sikkim."
    );
    lines.push("");
    lines.push("Name: " + name);
    lines.push("Phone: " + phone);

    var date = formatDate(value("date"));
    if (date) lines.push("Travelling from: " + date);

    var travellers = value("travellers");
    if (travellers) lines.push("Travellers: " + travellers);

    var message = value("message");
    if (message) {
      lines.push("");
      lines.push(message);
    }

    if (!routeLabel) {
      lines.push("");
      lines.push("Could you share prices and availability?");
    } else {
      lines.push("");
      lines.push("Could you share the price and availability?");
    }

    var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });
})();
