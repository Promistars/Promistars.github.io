(function () {
  const PROFILE = window.__PROFILE__;
  const state = {
    lang: localStorage.getItem("site-lang") || "zh",
    phoneVisible: false
  };

  const email = ["Promistars", String.fromCharCode(64), "163.com"].join("");
  const phone = ["182", "6779", "0152"].join("");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function renderProjects(data) {
    const root = document.querySelector("[data-project-list]");
    root.innerHTML = data.projects.items
      .map((item, index) => {
        const highlights = item.highlights
          .map((line) => `<li>${escapeHtml(line)}</li>`)
          .join("");
        return `
          <article class="panel project-card ${index === 0 ? "is-open" : ""}">
            <button class="project-button" type="button" aria-expanded="${index === 0}" data-project-toggle>
              <span>
                <h3>${escapeHtml(item.name)}</h3>
                <p class="project-role">${escapeHtml(item.role)}</p>
              </span>
              <span class="project-period">${escapeHtml(item.period)}</span>
            </button>
            <p class="project-intro">${escapeHtml(item.intro)}</p>
            <ul class="project-details">${highlights}</ul>
          </article>
        `;
      })
      .join("");

    root.querySelectorAll("[data-project-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".project-card");
        const open = card.classList.toggle("is-open");
        button.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function renderHonors(data) {
    const root = document.querySelector("[data-honor-grid]");
    root.innerHTML = data.honors.blocks
      .map((block) => {
        const items = block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
        return `
          <article class="panel honor-card">
            <h3>${escapeHtml(block.title)}</h3>
            <ul>${items}</ul>
          </article>
        `;
      })
      .join("");
  }

  function renderLeadership(data) {
    const root = document.querySelector("[data-leadership-list]");
    root.innerHTML = data.leadership.items
      .map((item) => {
        const bullets = item.bullets.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
        return `
          <article class="panel timeline-card">
            <div class="timeline-head">
              <h3>${escapeHtml(item.title)}</h3>
              <span>${escapeHtml(item.period)}</span>
            </div>
            <ul>${bullets}</ul>
          </article>
        `;
      })
      .join("");
  }

  function setupInteractiveCards(root = document) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    root.querySelectorAll(".panel, .hero-card").forEach((card) => {
      if (card.dataset.floatBound === "true") return;
      card.dataset.floatBound = "true";

      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;
        const tiltY = (px - 0.5) * 7;
        const tiltX = (0.5 - py) * 7;

        card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function updateContact(data) {
    const emailLink = document.querySelector("[data-email-link]");
    emailLink.textContent = email;
    emailLink.href = `mailto:${email}`;
    setText("[data-phone-value]", state.phoneVisible ? phone : data.contact.phoneMasked);
    setText("[data-phone-toggle]", state.phoneVisible ? data.contact.hidePhone : data.contact.revealPhone);
  }

  function applyLanguage() {
    const data = PROFILE[state.lang] || PROFILE.zh;
    document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
    document.title = data.metaTitle;
    document.querySelector('meta[name="description"]').setAttribute("content", data.description);

    setText("[data-name]", data.name);
    setText("[data-name-meaning]", data.nameMeaning);
    Object.keys(data.nav).forEach((key) => setText(`[data-nav="${key}"]`, data.nav[key]));
    setText("[data-lang-toggle]", data.nav.langSwitch);
    Object.keys(data.hero).forEach((key) => setText(`[data-hero="${key}"]`, data.hero[key]));
    Object.keys(data.about).forEach((key) => setText(`[data-about="${key}"]`, data.about[key]));
    Object.keys(data.education).forEach((key) => setText(`[data-education="${key}"]`, data.education[key]));
    setText("[data-projects-title]", data.projects.title);
    setText("[data-honors-title]", data.honors.title);
    setText("[data-leadership-title]", data.leadership.title);
    Object.keys(data.contact).forEach((key) => setText(`[data-contact="${key}"]`, data.contact[key]));

    renderProjects(data);
    renderHonors(data);
    renderLeadership(data);
    updateContact(data);
    setupInteractiveCards();
  }

  function setupCanvas() {
    const canvas = document.getElementById("ambient");
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = Array.from({ length: reducedMotion ? 0 : 54 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00028,
      vy: (Math.random() - 0.5) * 0.00028,
      r: Math.random() * 1.2 + 0.4
    }));
    let width = 0;
    let height = 0;
    let raf = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(15, 118, 110, 0.045)";
      ctx.lineWidth = 1;
      const grid = 54;
      for (let x = 0; x < width + grid; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(time * 0.00018 + x * 0.01) * 3, 0);
        ctx.lineTo(x + Math.cos(time * 0.00014 + x * 0.006) * 3, height);
        ctx.stroke();
      }
      for (let y = 0; y < height + grid; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.cos(time * 0.00016 + y * 0.01) * 3);
        ctx.lineTo(width, y + Math.sin(time * 0.00012 + y * 0.006) * 3);
        ctx.stroke();
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = "rgba(15, 118, 110, 0.22)";
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
  }

  document.querySelector("[data-lang-toggle]").addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    localStorage.setItem("site-lang", state.lang);
    applyLanguage();
  });

  document.querySelector("[data-copy-email]").addEventListener("click", async () => {
    const data = PROFILE[state.lang] || PROFILE.zh;
    try {
      await navigator.clipboard.writeText(email);
      setText("[data-copy-email]", data.contact.copied);
      window.setTimeout(() => setText("[data-copy-email]", data.contact.copy), 1800);
    } catch {
      window.prompt("Email", email);
    }
  });

  document.querySelector("[data-phone-toggle]").addEventListener("click", () => {
    state.phoneVisible = !state.phoneVisible;
    updateContact(PROFILE[state.lang] || PROFILE.zh);
  });

  applyLanguage();
  setupInteractiveCards();
  setupCanvas();
})();
