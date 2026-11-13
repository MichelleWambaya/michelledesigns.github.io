
/* Lena Marques portfolio — interactions (vanilla JS) */
(function () {
  "use strict";

  /* ---------- custom cursor ---------- */
  const cursor = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  if (cursor && ring && window.matchMedia("(hover:hover)").matches) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a, button, .float-card, .sg-item, .pg-item").forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
    });
  }

  /* ---------- nav scroll state ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = document.querySelector(".nav-burger");
  const overlay = document.querySelector(".menu-overlay");
  if (burger && overlay) {
    burger.addEventListener("click", () => {
      const open = overlay.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    overlay.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        overlay.classList.remove("open");
        burger.classList.remove("open");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- scroll reveals ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.08 + "s";
    io.observe(el);
  });

  /* ---------- 3D shape parallax (depth layers follow the cursor) ---------- */
  const stage = document.querySelector(".shape-stage");
  if (stage && window.matchMedia("(hover:hover)").matches) {
    const shapes = [...stage.querySelectorAll(".shape")].map((el) => ({
      el,
      depth: parseFloat(el.dataset.depth || "0.5"),
      bx: parseFloat(el.dataset.bx || "0"),
      by: parseFloat(el.dataset.by || "0"),
    }));
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    (function drift() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      shapes.forEach((s) => {
        const x = s.bx + cx * 34 * s.depth;
        const y = s.by + cy * 26 * s.depth;
        s.el.style.translate = `${x}px ${y}px`;
      });
      requestAnimationFrame(drift);
    })();
  }

  /* ---------- gentle device-orientation parallax on touch ---------- */
  if (stage && window.DeviceOrientationEvent && !window.matchMedia("(hover:hover)").matches) {
    window.addEventListener("deviceorientation", (e) => {
      const x = (e.gamma || 0) / 45, y = (e.beta || 0) / 45;
      stage.querySelectorAll(".shape").forEach((el) => {
        const d = parseFloat(el.dataset.depth || "0.5");
        el.style.translate = `${x * 24 * d}px ${y * 18 * d}px`;
      });
    });
  }

  /* ---------- hero floating cards: cursor repel ---------- */
  const cards = document.querySelectorAll(".float-card");
  if (cards.length && window.matchMedia("(hover:hover)").matches) {
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        card.style.transform = `rotate(0deg) translate(${dx * 10}px, ${dy * 10}px) scale(1.05)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- contact form (front-end demo) ---------- */
  const form = document.querySelector(".ct-form form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = form.parentElement.querySelector(".sent-msg");
      if (msg) msg.style.display = "block";
      form.reset();
    });
  }
})();
