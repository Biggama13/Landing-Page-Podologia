/* ==========================================================================
   PODOLOGIA – LANDING PAGE
   JavaScript puro (sem dependências)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1) CONFIGURAÇÕES  ←  EDITE AQUI
   -------------------------------------------------------------------------- */
const CONFIG = {
  // Número do WhatsApp com código do país + DDD, só dígitos. Ex.: 5513999998888
  // Todos os botões com o atributo data-wa usam este número automaticamente.
  whatsappNumber: "5513991212112",

  // Mensagem padrão (cada botão pode ter a sua própria via data-wa-msg no HTML)
  defaultMessage: "Olá! Gostaria de agendar uma avaliação.",
};

/* --------------------------------------------------------------------------
   2) SERVIÇOS  ←  EDITE AQUI (6 cards em modo placeholder)
   --------------------------------------------------------------------------
   Campos de cada serviço:
     icon        → foot | leaf | drop | shield | sparkle | heart | smile | scissors
     title       → nome do tratamento
     desc        → descrição curta (1 a 2 frases)
     placeholder → remova esta linha quando o serviço for real (some o selo "Placeholder")
   Para adicionar um 7º serviço, copie um bloco { ... } e cole no final da lista.
   -------------------------------------------------------------------------- */
const SERVICES = [
  {
    icon: "foot",
    title: "Serviço 01 · Título do tratamento",
    desc: "Descrição curta do tratamento. Substitua por um texto confirmado com a profissional.",
  },
  {
    icon: "leaf",
    title: "Serviço 02 · Título do tratamento",
    desc: "Descrição curta do tratamento. Substitua por um texto confirmado com a profissional.",
  },
  {
    icon: "drop",
    title: "Serviço 03 · Título do tratamento",
    desc: "Descrição curta do tratamento. Substitua por um texto confirmado com a profissional.",
  },
  {
    icon: "sparkle",
    title: "Serviço 04 · Título do tratamento",
    desc: "Descrição curta do tratamento. Substitua por um texto confirmado com a profissional.",
  },
  {
    icon: "shield",
    title: "Serviço 05 · Título do tratamento",
    desc: "Descrição curta do tratamento. Substitua por um texto confirmado com a profissional.",
  },
  {
    icon: "heart",
    title: "Serviço 06 · Título do tratamento",
    desc: "Descrição curta do tratamento. Substitua por um texto confirmado com a profissional.",
  },
];

/* --------------------------------------------------------------------------
   3) IMAGEM DE SUBSTITUIÇÃO (placeholder elegante)
   Chamada pelo atributo onerror das <img>. Fica fora do DOMContentLoaded
   porque precisa existir antes de a página terminar de carregar.
   -------------------------------------------------------------------------- */
function imgFallback(img) {
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = "1";

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w = parseInt(img.dataset.w, 10) || 800;
  const h = parseInt(img.dataset.h, 10) || 600;
  const label = esc(img.dataset.label || "Imagem");
  const file = esc(img.dataset.file || "");
  const leaf =
    "M20 4C10 4 4 9 4 15c0 3 2 5 5 5 6 0 11-6 11-16z M4 20c3-6 7-9 11-11";

  let svg;

  if (img.dataset.variant === "logo") {
    // Emblema simples para o logo
    svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 96 96'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#C5A059'/><stop offset='1' stop-color='#D4AF37'/></linearGradient></defs>` +
      `<circle cx='48' cy='48' r='46' fill='#FFFFFF' stroke='url(#g)' stroke-width='3'/>` +
      `<g transform='translate(24 24) scale(2)' fill='none' stroke='#8E6F2E' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='${leaf}'/></g>` +
      `</svg>`;
  } else {
    const base = Math.min(w, h);
    const iconScale = Math.max(1.6, base / 180);
    const iconX = w / 2 - 12 * iconScale;
    const iconY = h / 2 - 12 * iconScale - base * 0.06;
    const fs = Math.max(13, Math.round(base / 24));
    const fsSmall = Math.max(10, Math.round(base / 40));
    svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#F3EFE6'/><stop offset='1' stop-color='#E7DCC3'/></linearGradient></defs>` +
      `<rect width='100%' height='100%' fill='url(#g)'/>` +
      `<rect x='${base * 0.04}' y='${base * 0.04}' width='${w - base * 0.08}' height='${h - base * 0.08}' rx='${base * 0.04}' fill='none' stroke='#C5A059' stroke-opacity='.45' stroke-dasharray='6 8'/>` +
      `<g transform='translate(${iconX} ${iconY}) scale(${iconScale})' fill='none' stroke='#C5A059' stroke-width='1.1' stroke-linecap='round' stroke-linejoin='round'><path d='${leaf}'/></g>` +
      `<text x='50%' y='${h / 2 + 12 * iconScale + fs * 0.6}' text-anchor='middle' font-family='Georgia, serif' font-size='${fs}' fill='#8E6F2E'>${label}</text>` +
      (file
        ? `<text x='50%' y='${h / 2 + 12 * iconScale + fs * 0.6 + fsSmall * 1.9}' text-anchor='middle' font-family='Arial, sans-serif' font-size='${fsSmall}' fill='#5C5855' fill-opacity='.8'>${file}</text>`
        : "") +
      `</svg>`;
  }

  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* Marca que o JS está ativo (as animações de "revelar" só valem com JS) */
document.documentElement.classList.add("js");

/* --------------------------------------------------------------------------
   4) INICIALIZAÇÃO (após o carregamento do HTML)
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  renderServices();
  setupWhatsAppLinks();
  setupImageSafetyNet();
  setupHeader();
  setupSmoothScroll();
  setupScrollSpy();
  setupReveal();
  setupGallery();
  setupHoursHighlight();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- WhatsApp ---------- */
  function waLink(message) {
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message || CONFIG.defaultMessage)}`;
  }

  function setupWhatsAppLinks() {
    document.querySelectorAll("[data-wa]").forEach((el) => {
      el.href = waLink(el.dataset.waMsg);
    });
  }

  /* ---------- Serviços ---------- */
  function renderServices() {
    const grid = document.getElementById("services-grid");
    if (!grid) return;

    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    grid.innerHTML = SERVICES.map((s, i) => {
      const msg = `Olá! Tenho interesse no serviço: ${s.title}`;
      return `
        <article class="service-card reveal" style="--d:${i * 80}ms">
          ${s.placeholder ? '<span class="service-card__badge">Placeholder</span>' : ""}
          <div class="service-card__icon">
            <svg class="icon" aria-hidden="true"><use href="#i-${esc(s.icon)}"/></svg>
          </div>
          <h3 class="service-card__title">${esc(s.title)}</h3>
          <p class="service-card__desc">${esc(s.desc)}</p>
          <a class="service-card__link" data-wa data-wa-msg="${esc(msg)}" href="${waLink(msg)}" target="_blank" rel="noopener">
            Agendar este serviço
            <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>
          </a>
        </article>`;
    }).join("");
  }

  /* ---------- Rede de segurança para imagens que falharam antes do script ---------- */
  function setupImageSafetyNet() {
    document.querySelectorAll("img").forEach((img) => {
      const isLazy = img.getAttribute("loading") === "lazy";
      if (!isLazy && img.getAttribute("src") && img.complete && img.naturalWidth === 0) {
        imgFallback(img);
      }
    });
  }

  /* ---------- Header + menu mobile ---------- */
  function setupHeader() {
    const header = document.getElementById("header");
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");
    if (!header || !burger || !nav) return;

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const setMenu = (open) => {
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("is-locked", open);
    };

    burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        burger.focus();
      }
    });

    // Fecha ao tocar fora do menu
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !burger.contains(e.target)) {
        setMenu(false);
      }
    });

    // Fecha ao ir para o layout desktop
    window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Rolagem suave para âncoras ---------- */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", id);

        // Acessibilidade: leva o foco para a seção
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- Destaque do link ativo conforme a rolagem ---------- */
  function setupScrollSpy() {
    const links = document.querySelectorAll(".nav__link");
    const ids = ["inicio", "servicos", "galeria", "contato"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Scroll reveal (fade-up) ---------- */
  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Galeria: filtros + lightbox ---------- */
  function setupGallery() {
    const gallery = document.getElementById("gallery");
    const filterBtns = document.querySelectorAll(".filters__btn");
    const lightbox = document.getElementById("lightbox");
    if (!gallery || !lightbox) return;

    const items = Array.from(gallery.querySelectorAll(".gallery__item"));
    const lbImg = document.getElementById("lightbox-img");
    const lbCaption = document.getElementById("lightbox-caption");
    const btnClose = lightbox.querySelector("[data-lb-close]");
    const btnPrev = lightbox.querySelector("[data-lb-prev]");
    const btnNext = lightbox.querySelector("[data-lb-next]");

    let visible = items.slice();
    let current = 0;
    let lastFocus = null;

    // Filtros
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });

        items.forEach((item) => {
          const show = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("is-hidden", !show);
          item.classList.remove("is-entering");
          if (show) {
            item.classList.add("is-visible");
            void item.offsetWidth; // reinicia a animação
            item.classList.add("is-entering");
          }
        });
        visible = items.filter((i) => !i.classList.contains("is-hidden"));
      });
    });

    // Abrir lightbox
    gallery.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery__btn");
      if (!btn) return;
      const item = btn.closest(".gallery__item");
      current = Math.max(0, visible.indexOf(item));
      lastFocus = btn;
      openLightbox();
    });

    function show(index) {
      const item = visible[index];
      if (!item) return;
      const img = item.querySelector("img");
      const btn = item.querySelector(".gallery__btn");
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || "";
      lbCaption.textContent = btn.dataset.caption || img.alt || "";
      btnPrev.classList.toggle("is-off", visible.length < 2);
      btnNext.classList.toggle("is-off", visible.length < 2);
    }

    function openLightbox() {
      show(current);
      lightbox.hidden = false;
      document.body.classList.add("is-locked");
      requestAnimationFrame(() => lightbox.classList.add("is-open"));
      btnClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      setTimeout(() => {
        lightbox.hidden = true;
        lbImg.src = "";
      }, prefersReducedMotion ? 0 : 350);
      if (lastFocus) lastFocus.focus();
    }

    function step(dir) {
      if (visible.length < 2) return;
      current = (current + dir + visible.length) % visible.length;
      show(current);
    }

    btnClose.addEventListener("click", closeLightbox);
    btnPrev.addEventListener("click", () => step(-1));
    btnNext.addEventListener("click", () => step(1));

    // Fecha ao clicar no fundo escuro
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Teclado: Esc, setas e foco preso dentro do modal
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Tab") {
        const focusables = Array.from(lightbox.querySelectorAll("button")).filter((b) => !b.classList.contains("is-off"));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Gesto de deslizar no celular
    let touchX = null;
    lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      touchX = null;
    }, { passive: true });
  }

  /* ---------- Destaca o dia de hoje na tabela de horários ---------- */
  function setupHoursHighlight() {
    const today = new Date().getDay(); // 0 = domingo ... 6 = sábado
    document.querySelectorAll(".hours tr[data-days]").forEach((row) => {
      const days = row.dataset.days.split(",").map((d) => parseInt(d.trim(), 10));
      if (days.includes(today)) row.classList.add("is-today");
    });
  }
});
