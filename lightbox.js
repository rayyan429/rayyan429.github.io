// Lightbox: open project photos in an overlay on the same page instead of a new tab.
(function () {
  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-nav lb-prev" aria-label="Previous photo">&larr;</button>' +
    '<figure><img alt=""></figure>' +
    '<button class="lb-nav lb-next" aria-label="Next photo">&rarr;</button>';
  document.body.appendChild(box);

  var img = box.querySelector("img");
  var group = [];
  var index = 0;
  var lastFocus = null;

  function show(i) {
    index = (i + group.length) % group.length;
    var link = group[index];
    var thumb = link.querySelector("img");
    img.src = link.getAttribute("href");
    img.alt = thumb ? thumb.alt : "";
    box.classList.toggle("single", group.length < 2);
  }

  function open(link) {
    // the photos that belong to the same project slide (or section) form one group
    var scope = link.closest(".slide") || link.closest("section") || document;
    group = Array.prototype.filter.call(
      scope.querySelectorAll('a[href^="images/"]'),
      function (a) { return /\.(jpe?g|png|svg|webp|gif)$/i.test(a.getAttribute("href")); }
    );
    lastFocus = document.activeElement;
    show(group.indexOf(link));
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  }

  function close() {
    box.classList.remove("open");
    document.body.style.overflow = "";
    img.src = "";
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="images/"]');
    if (!link || !/\.(jpe?g|png|svg|webp|gif)$/i.test(link.getAttribute("href"))) return;
    e.preventDefault();
    open(link);
  });

  box.addEventListener("click", function (e) {
    if (e.target.closest(".lb-prev")) return show(index - 1);
    if (e.target.closest(".lb-next")) return show(index + 1);
    if (e.target.closest(".lb-close") || !e.target.closest("figure")) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(index + 1);
    if (e.key === "ArrowLeft") show(index - 1);
  });
})();
