(function () {
  var STORAGE_KEY = "coffee-house-theme";
  var root = document.documentElement;
  var themeButtons = document.querySelectorAll("[data-theme-toggle]");
  var burgerButtons = document.querySelectorAll("[data-burger]");
  var nav = document.querySelector("[data-nav]");
  var body = document.body;

  function getTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function setTheme(theme) {
    var next = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
    themeButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      button.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    });
  }

  function closeMenu() {
    if (!nav) {
      return;
    }
    nav.classList.remove("is-open");
    body.classList.remove("is-menu-open");
    burgerButtons.forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
  }

  function toggleMenu() {
    if (!nav) {
      return;
    }
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    body.classList.toggle("is-menu-open", open);
    burgerButtons.forEach(function (button) {
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  });

  burgerButtons.forEach(function (button) {
    button.addEventListener("click", toggleMenu);
  });

  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  var slides = document.querySelectorAll("[data-slide]");
  var prev = document.querySelector("[data-slider-prev]");
  var next = document.querySelector("[data-slider-next]");
  var pagers = document.querySelectorAll("[data-pager]");
  var current = 0;
  var timer;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === current);
    });
    pagers.forEach(function (pager, i) {
      pager.classList.toggle("is-active", i === current);
    });
  }

  function startSlider() {
    stopSlider();
    if (slides.length < 2) {
      return;
    }
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 6000);
  }

  function stopSlider() {
    if (timer) {
      window.clearInterval(timer);
    }
  }

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(current - 1);
      startSlider();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(current + 1);
      startSlider();
    });
  }

  pagers.forEach(function (pager, i) {
    pager.addEventListener("click", function () {
      showSlide(i);
      startSlider();
    });
  });

  showSlide(0);
  startSlider();

  var tabs = document.querySelectorAll("[data-category]");
  var cards = document.querySelectorAll("[data-product]");
  var loadMore = document.querySelector("[data-load-more]");
  var expanded = false;

  function visibleLimit() {
    return window.innerWidth <= 768 && !expanded ? 4 : cards.length;
  }

  function applyCategory(category) {
    var shown = 0;
    var limit = visibleLimit();
    var available = 0;

    cards.forEach(function (card) {
      var match = card.getAttribute("data-product") === category;
      if (match) {
        available += 1;
        shown += 1;
        card.hidden = shown > limit;
      } else {
        card.hidden = true;
      }
    });

    if (loadMore) {
      loadMore.hidden = !(window.innerWidth <= 768 && !expanded && available > 4);
    }
  }

  function activeCategory() {
    var active = document.querySelector("[data-category].is-active");
    return active ? active.getAttribute("data-category") : "coffee";
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      if (tab.classList.contains("is-active")) {
        return;
      }
      tabs.forEach(function (item) {
        item.classList.toggle("is-active", item === tab);
        item.setAttribute("aria-pressed", item === tab ? "true" : "false");
      });
      expanded = false;
      applyCategory(tab.getAttribute("data-category"));
    });
  });

  if (loadMore) {
    loadMore.addEventListener("click", function () {
      expanded = true;
      applyCategory(activeCategory());
    });
  }

  window.addEventListener("resize", function () {
    if (tabs.length) {
      if (window.innerWidth > 768) {
        expanded = false;
      }
      applyCategory(activeCategory());
    }
  });

  if (tabs.length) {
    applyCategory(activeCategory());
  }

  setTheme(getTheme());
})();
