// Projects slideshow: arrows, dots, counter, keyboard, swipe (native scroll-snap)
(function () {
  var track = document.querySelector(".carousel");
  if (!track) return;
  var slides = track.querySelectorAll(".slide");
  var dots = document.querySelectorAll(".dots button");
  var counter = document.getElementById("proj-i");
  var current = 0;

  function go(i) {
    i = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  // size the track to the visible slide so short slides don't leave a gap
  function fit() { track.style.height = slides[current].offsetHeight + "px"; }

  function update() {
    var w = track.clientWidth;
    var i = Math.round(track.scrollLeft / (w + 16));
    if (i === current && counter.textContent) return;
    current = Math.max(0, Math.min(slides.length - 1, i));
    counter.textContent = current + 1;
    fit();
    dots.forEach(function (d, k) { d.classList.toggle("on", k === current); });
  }

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { go(current + Number(btn.dataset.dir)); });
  });
  dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k); }); });

  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1); }
  });

  var t;
  track.addEventListener("scroll", function () { clearTimeout(t); t = setTimeout(update, 60); });
  window.addEventListener("resize", function () { update(); fit(); });
  window.addEventListener("load", fit);
  fit();
  dots[0] && dots[0].classList.add("on");
})();
