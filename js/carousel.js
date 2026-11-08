/* Moves each product carousel and builds its dot controls. */
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel-track");
    var slides = root.querySelectorAll(".slide");
    var dotsWrap = root.querySelector(".carousel-dots");
    var count = slides.length;
    var index = 0;
    var timer = null;

    if (!track || count === 0) return;

    function paint() {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dotsWrap.querySelectorAll(".dot").forEach(function (dot, dotIndex) {
        if (dotIndex === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function go(nextIndex) {
      index = (nextIndex + count) % count;
      paint();
    }

    slides.forEach(function (_, slideIndex) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", "Show image " + (slideIndex + 1));
      dot.addEventListener("click", function () { go(slideIndex); });
      dotsWrap.appendChild(dot);
    });

    root.querySelector("[data-prev]").addEventListener("click", function () { go(index - 1); });
    root.querySelector("[data-next]").addEventListener("click", function () { go(index + 1); });

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === "ArrowRight") go(index + 1);
    });

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      if (reduceMotion || count < 2) return;
      stop();
      timer = window.setInterval(function () { go(index + 1); }, 7000);
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (event) {
      if (!root.contains(event.relatedTarget)) start();
    });

    paint();
    start();
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
