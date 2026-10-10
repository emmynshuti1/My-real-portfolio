/* ==========================================================================
   Nshuti Emmanuel — Portfolio
   Theme, navigation, scroll effects, project filtering and contact form
   ========================================================================== */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. Theme ---------- */
  const THEME_KEY = "portfolio-theme";
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const metaTheme = $('meta[name="theme-color"]');

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (metaTheme) metaTheme.setAttribute("content", theme === "light" ? "#f4f7fc" : "#060911");
    if (themeToggle) {
      const next = theme === "light" ? "dark" : "light";
      themeToggle.setAttribute("aria-label", "Switch to " + next + " theme");
      themeToggle.setAttribute("title", "Switch to " + next + " theme");
    }
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage blocked */ }
    }
  }

  let stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
  // Dark-first: respect an explicit saved choice, otherwise stay dark.
  applyTheme(stored === "light" || stored === "dark" ? stored : "dark", false);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next, true);
    });
  }

  /* ---------- 2. Header state, scroll progress, back to top ---------- */
  const header = $("#siteHeader");
  const progressBar = $("#progressBar");
  const backToTop = $("#backToTop");
  let ticking = false;

  function onScrollFrame() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;

    if (progressBar) progressBar.style.width = (ratio * 100).toFixed(2) + "%";
    if (backToTop) {
      backToTop.style.setProperty("--progress", ratio.toFixed(4));
      backToTop.classList.toggle("is-visible", scrollTop > 400);
    }
    if (header) header.classList.toggle("is-scrolled", scrollTop > 20);

    updateActiveNav(scrollTop);
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- 3. Mobile navigation ---------- */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  if (navToggle && navMenu) {
    const setMenu = (open) => {
      navMenu.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setMenu(!navMenu.classList.contains("is-open"));
    });

    navMenu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) setMenu(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        setMenu(false);
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) setMenu(false);
    });
  }

  /* ---------- 4. Scroll spy ---------- */
  const navLinks = $$(".nav-link");
  const sections = navLinks
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  function updateActiveNav(scrollTop) {
    if (!sections.length) return;
    const offset = (header ? header.offsetHeight : 72) + 90;
    let currentId = sections[0].id;

    for (const section of sections) {
      if (section.offsetTop - offset <= scrollTop) currentId = section.id;
    }
    // Snap to the last section when the page is scrolled to the very bottom.
    if (window.innerHeight + scrollTop >= document.documentElement.scrollHeight - 4) {
      currentId = sections[sections.length - 1].id;
    }

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + currentId);
    });
  }

  /* ---------- 5. Reveal on scroll ---------- */
  const revealItems = $$("[data-reveal]");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute("data-reveal-delay");
            if (delay) entry.target.style.transitionDelay = delay + "ms";
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 6. Typing effect ---------- */
  const typingEl = $("#typingText");
  if (typingEl) {
    const words = [
      "Web Development",
      "Desktop Software",
      "Cybersecurity Fundamentals"
    ];

    if (prefersReducedMotion) {
      typingEl.textContent = words[0];
    } else {
      let wordIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const word = words[wordIndex];
        charIndex += deleting ? -1 : 1;
        typingEl.textContent = word.substring(0, charIndex);

        let delay = deleting ? 45 : 85;
        if (!deleting && charIndex === word.length) {
          delay = 1800;
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          delay = 380;
        }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 700);
    }
  }

  /* ---------- 7. Count-up stats ---------- */
  const counters = $$(".count");

  function runCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }
    const duration = 1300;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    const statsEl = $(".stats");
    if ("IntersectionObserver" in window && statsEl) {
      const statsObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              counters.forEach(runCounter);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      statsObserver.observe(statsEl);
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- 8. Project filtering ---------- */
  const filters = $$(".filter");
  const projects = $$(".project");
  const emptyMsg = $("#projectsEmpty");

  if (filters.length && projects.length) {
    // Keep the counts in the markup honest, whatever the markup contains.
    filters.forEach((btn) => {
      const cat = btn.getAttribute("data-filter");
      const countEl = $(".filter-count", btn);
      if (!countEl) return;
      const n = cat === "all"
        ? projects.length
        : projects.filter((p) => p.getAttribute("data-category") === cat).length;
      countEl.textContent = String(n);
    });

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-filter");
        filters.forEach((b) => b.classList.toggle("is-active", b === btn));

        let visible = 0;
        projects.forEach((project) => {
          const match = cat === "all" || project.getAttribute("data-category") === cat;
          project.classList.toggle("is-hidden", !match);
          if (match) visible++;
        });

        if (emptyMsg) emptyMsg.hidden = visible > 0;
      });
    });
  }

  /* ---------- 9. Pointer spotlight on project cards ---------- */
  if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    projects.forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
      });
    });
  }

  /* ---------- 10. Copy email ---------- */
  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.getAttribute("data-email") || "";
      const original = copyBtn.innerHTML;

      const flash = (label, icon) => {
        copyBtn.innerHTML = '<i class="fas ' + icon + '" aria-hidden="true"></i> ' + label;
        setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
      };

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const tmp = document.createElement("textarea");
          tmp.value = email;
          tmp.setAttribute("readonly", "");
          tmp.style.position = "fixed";
          tmp.style.opacity = "0";
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand("copy");
          document.body.removeChild(tmp);
        }
        flash("Copied!", "fa-check");
      } catch (e) {
        flash("Copy failed", "fa-xmark");
      }
    });
  }

  /* ---------- 11. Contact form ---------- */
  const form = $("#messageForm");
  if (form) {
    const statusEl = $("#formStatus");
    const submitBtn = $("#submitBtn");

    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters)."),
      email: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address.",
      subject: (v) => (v.trim().length >= 2 ? "" : "Please add a short subject."),
      message: (v) => (v.trim().length >= 10 ? "" : "Please write at least 10 characters.")
    };

    const setError = (name, message) => {
      const input = form.elements[name];
      const field = input ? input.closest(".field") : null;
      const errorEl = $('[data-error-for="' + name + '"]', form);
      if (field) field.classList.toggle("has-error", Boolean(message));
      if (errorEl) errorEl.textContent = message;
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
    };

    const setStatus = (message, kind) => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.toggle("is-success", kind === "success");
      statusEl.classList.toggle("is-error", kind === "error");
    };

    const setLoading = (loading) => {
      if (!submitBtn) return;
      submitBtn.classList.toggle("is-loading", loading);
      submitBtn.disabled = loading;
    };

    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      if (!input) return;
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("has-error")) {
          setError(name, rules[name](input.value));
        }
      });
      input.addEventListener("blur", () => setError(name, rules[name](input.value)));
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Honeypot: silently ignore bot submissions.
      const honey = form.elements["_honey"];
      if (honey && honey.value) {
        setStatus("Message sent. Thanks for reaching out!", "success");
        form.reset();
        return;
      }

      const values = {};
      let firstInvalid = null;

      Object.keys(rules).forEach((name) => {
        const input = form.elements[name];
        if (!input) return;
        values[name] = input.value;
        const message = rules[name](input.value);
        setError(name, message);
        if (message && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        setStatus("Please fix the highlighted fields.", "error");
        firstInvalid.focus();
        return;
      }

      setLoading(true);
      setStatus("Sending…", "");

      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        _subject: "New portfolio message — Nshuti Emmanuel",
        _template: "table",
        _captcha: "false"
      };

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Request failed: " + response.status);

        setStatus("Thanks " + payload.name.split(" ")[0] + " — your message is on its way. I'll reply within 24 hours.", "success");
        form.reset();
      } catch (error) {
        // Network or service failure: fall back to a normal form post so the
        // message is never lost, even if it means leaving the page.
        setStatus("Opening the secure form…", "");
        form.noValidate = true;
        form.submit();
      } finally {
        setLoading(false);
      }
    });
  }

  /* ---------- 12. Footer year ---------- */
  const yearEl = $("#currentYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 13. Initial paint ---------- */
  onScrollFrame();
})();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
      .catch((error) => console.error("Service worker registration failed:", error));
  });
}
