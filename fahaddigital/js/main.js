/* ============================================================
   Fahad Digital — Web Design Portfolio
   main.js — lightweight, no dependencies
   ============================================================ */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector(".site-header");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (menu) menu.setAttribute("aria-hidden", open ? "false" : "true");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("menu-open"));
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    // Stagger siblings that share a parent for a gentle cascade.
    var groups = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, 0);
      var index = groups.get(parent);
      groups.set(parent, index + 1);
      el.style.setProperty("--reveal-delay", Math.min(index * 90, 360) + "ms");
    });

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-nav a, .mobile-menu nav a")
  );

  var sections = [];
  ["home", "work", "services", "about", "contact"].forEach(function (id) {
    var section = document.getElementById(id);
    if (section) sections.push(section);
  });

  function hashOf(href) {
    var i = href.indexOf("#");
    return i === -1 ? null : href.slice(i);
  }
  function pageOf(href) {
    var i = href.indexOf("#");
    var page = i === -1 ? href : href.slice(0, i);
    var q = page.indexOf("?");
    return q === -1 ? page : page.slice(0, q);
  }

  var currentPage = location.pathname.split("/").pop() || "index.html";

  // Same-page anchor highlighting (homepage scrollspy)
  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var isActive = hashOf(link.getAttribute("href")) === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // Page-level active state (e.g. pricing.html, contact.html)
  navLinks.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (pageOf(href) === currentPage && hashOf(href) === null) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
})();
