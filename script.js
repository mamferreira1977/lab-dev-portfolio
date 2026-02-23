const state = { routes: ["home", "about", "projects", "experience", "contact"] };

/* ======= EDITE AQUI (seus dados) ======= */
const profile = {
  cinemaName: "• MARCO ANTONIO MIRANDA FERREIRA • PORTFÓLIO",
  name: "",
  heroSubtitle: "Eu transformo ideias em soluções — com roteiro, direção e entrega.",
  aboutText:
    "Sou uma profissional focada em resultados, com paixão por construir soluções bem desenhadas, acessíveis e performáticas. " +
    "Trato cada projeto como um filme: roteiro claro, boa direção e entrega consistente.",
  quickFacts: [
    { label: "Papel", value: "Desenvolvimento • Produto • UX" },
    { label: "Base", value: "Brasil" },
    { label: "Stack", value: "HTML • CSS • JavaScript" },
    { label: "Objetivo", value: "Criar experiências incríveis" },
  ],

  email: "marcomferreira1977@hotmail.com",
  linkedin: "https://www.linkedin.com/in/marco-antonio-miranda-ferreira",
  github: "https://github.com/mamferreira1977",

  photo: "assets/foto-linkedin-3x4.jpg",
  
  cvPtPdf: "assets/CV-PT.pdf",
  cvEnPdf: "assets/CV-EN.pdf",

  skills: ["JavaScript", "HTML", "CSS", "Responsividade", "Acessibilidade", "UI/UX", "APIs", "Git"],
  highlights: ["Entrega com foco em resultado", "Organização", "Qualidade visual", "Performance e acessibilidade"],
};

const projects = [
  {
    year: 2026,
    title: "CinePortfólio",
    desc: "Cortina + contador + show de luzes + efeitos de cinema + modal CV em PDF.",
    tags: ["Front-end", "UI", "JS"],
    links: [{ label: "Demo", url: "#" }, { label: "Código", url: "#" }],
  },
  {
    year: 2025,
    title: "Timeline Dinâmica",
    desc: "Timeline com filtro, ordenação e tags via JavaScript.",
    tags: ["JavaScript", "Componentes"],
    links: [{ label: "Case", url: "#" }],
  },
];

const experiences = [
  {
    role: "Desenvolvedora Front-end",
    where: "Empresa X",
    period: "2024 — 2026",
    bullets: ["Interfaces responsivas e acessíveis.", "Integração com APIs.", "Padrões e documentação."],
  },
  {
    role: "Analista / Produto",
    where: "Projeto Y",
    period: "2022 — 2024",
    bullets: ["Melhoria de UX.", "Planejamento e acompanhamento de entregas."],
  },
];

/* ===== Helpers ===== */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

function setActiveRoute(route) {
  if (!state.routes.includes(route)) route = "home";
  $$(".page").forEach((p) => p.classList.remove("page--active"));
  $(`#page-${route}`).classList.add("page--active");
  $$(".nav__link").forEach((a) => a.classList.toggle("is-active", a.dataset.route === route));
}

function routeFromHash() {
  const hash = (location.hash || "#home").replace("#", "").trim();
  setActiveRoute(state.routes.includes(hash) ? hash : "home");
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v || "").trim());
}

function showToast(msg) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = "block";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (toast.style.display = "none"), 2200);
}

/* ===== Show: pré-luzes + contador + abrir cortina ===== */
function preShowLights(on) {
  const screen = $(".screen");
  if (!screen) return;
  screen.classList.toggle("is-preShow", !!on);
}

function openingLights() {
  const screen = $(".screen");
  if (!screen) return;

  screen.classList.add("is-opening");
  clearTimeout(openingLights._t);
  openingLights._t = setTimeout(() => screen.classList.remove("is-opening"), 3000);
}

function openCurtain() {
  setTimeout(() => {
    openingLights();
    document.body.classList.add("is-open");
    document.body.classList.remove("is-reopen");
  }, 200);
}

function reopenCurtain() {
  document.body.classList.add("is-reopen");
  document.body.classList.remove("is-open");
  void document.body.offsetWidth;
  openCurtain();
}

async function runCountdownAndOpen() {
  const overlay = $("#countdownOverlay");
  const num = $("#countdownNumber");

  overlay.classList.add("is-on");
  overlay.setAttribute("aria-hidden", "false");

  // pré-show: luzes antes de abrir
  preShowLights(true);

  const steps = ["3", "2", "1", "AÇÃO!"];
  for (let i = 0; i < steps.length; i++) {
    num.textContent = steps[i];
    await wait(900);
  }

  // some com overlay
  overlay.classList.remove("is-on");
  overlay.setAttribute("aria-hidden", "true");

  // finaliza pré-show e abre
  preShowLights(false);
  openCurtain();
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ===== Luz reagindo ao mouse ===== */
function setupMouseLight() {
  const screen = $(".screen");
  if (!screen) return;

  let raf = null;
  let last = { x: 0.5, y: 0.45 };

  function setVars(x, y) {
    screen.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    screen.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
    screen.style.setProperty("--ml", "1");
  }

  screen.addEventListener("mousemove", (e) => {
    const rect = screen.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    last.x = Math.max(0, Math.min(1, x));
    last.y = Math.max(0, Math.min(1, y));
    screen.classList.add("has-mouse");

    if (raf) return;
    raf = requestAnimationFrame(() => {
      setVars(last.x, last.y);
      raf = null;
    });
  });

  screen.addEventListener("mouseenter", () => {
    screen.classList.add("has-mouse");
    screen.style.setProperty("--ml", "1");
  });

  screen.addEventListener("mouseleave", () => {
    screen.classList.remove("has-mouse");
    screen.style.setProperty("--ml", "0.25");
  });

  screen.style.setProperty("--ml", "0.25");
  setVars(0.5, 0.45);
}

/* ===== Render ===== */
function applyProfile() {
  $("#cinemaName").textContent = profile.cinemaName;
  $("#heroTitle").textContent = profile.name;
  $("#footerName").textContent = profile.name;
  $("#heroSubtitle").textContent = profile.heroSubtitle;
  $("#aboutText").textContent = profile.aboutText;

  const kv = $("#kvList");
  kv.innerHTML = "";
  profile.quickFacts.forEach((item) => {
    const row = document.createElement("div");
    row.className = "kv__row";
    row.innerHTML = `<span>${item.label}</span><span>${item.value}</span>`;
    kv.appendChild(row);
  });

  const ul = $("#skillsChips");
  ul.innerHTML = "";
  profile.skills.forEach((s) => {
    const li = document.createElement("li");
    li.className = "chip";
    li.textContent = s;
    ul.appendChild(li);
  });

  $("#emailValue").textContent = profile.email;
  $("#linkedinValue").textContent = profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com/i, "").replace(/\/$/, "");
  $("#githubValue").textContent = profile.github.replace(/^https?:\/\/(www\.)?github\.com/i, "").replace(/\/$/, "");

  $("#linkEmail").href = `mailto:${encodeURIComponent(profile.email)}`;
  $("#linkLinkedIn").href = profile.linkedin;
  $("#linkGitHub").href = profile.github;

  const img = $("#posterImg");
  img.src = profile.posterImgSrc || "";
}

function uniqueTags(items) {
  const set = new Set();
  items.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function renderProjectTagOptions() {
  const select = $("#projectTag");
  const tags = uniqueTags(projects);
  select.innerHTML = `<option value="all">Todas</option>`;
  tags.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });
}

function getFilteredProjects() {
  const q = ($("#projectSearch")?.value || "").toLowerCase().trim();
  const sort = $("#projectSort")?.value || "desc";
  const tag = $("#projectTag")?.value || "all";

  let list = [...projects];
  if (tag !== "all") list = list.filter((p) => (p.tags || []).includes(tag));

  if (q) {
    list = list.filter((p) => {
      const hay = `${p.title} ${p.desc} ${p.year} ${(p.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }

  list.sort((a, b) => (sort === "asc" ? a.year - b.year : b.year - a.year));
  return list;
}

function renderProjects() {
  const timeline = $("#timeline");
  const list = getFilteredProjects();
  timeline.innerHTML = "";

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "tItem";
    empty.innerHTML = `
      <div class="tTop">
        <h3 class="tTitle">Nenhum projeto encontrado</h3>
        <div class="tYear">—</div>
      </div>
      <p class="tDesc">Tente ajustar os filtros.</p>
    `;
    timeline.appendChild(empty);
    return;
  }

  list.forEach((p) => {
    const item = document.createElement("article");
    item.className = "tItem";

    const tags = (p.tags || []).map((t) => `<span class="badge">${t}</span>`).join("");
    const links = (p.links || [])
      .filter((l) => l?.url)
      .map((l) => `<a href="${l.url}" target="_blank" rel="noreferrer">${l.label}</a>`)
      .join("");

    item.innerHTML = `
      <div class="tTop">
        <h3 class="tTitle">${p.title || "—"}</h3>
        <div class="tYear">${p.year || ""}</div>
      </div>
      <p class="tDesc">${p.desc || ""}</p>
      <div class="tTags">${tags}</div>
      ${links ? `<div class="tLinks">${links}</div>` : ""}
    `;
    timeline.appendChild(item);
  });
}

function renderExperience() {
  const list = $("#expList");
  list.innerHTML = "";
  experiences.forEach((exp) => {
    const el = document.createElement("article");
    el.className = "expItem";
    const bullets = (exp.bullets || []).map((b) => `<li>${b}</li>`).join("");
    el.innerHTML = `
      <div class="expItem__top">
        <div>
          <h3 class="expRole">${exp.role}</h3>
          <div class="expWhere">${exp.where}</div>
        </div>
        <div class="expPeriod">${exp.period}</div>
      </div>
      <ul class="expBullets">${bullets}</ul>
    `;
    list.appendChild(el);
  });

  $("#highlightsList").innerHTML = profile.highlights.map((h) => `<li>${h}</li>`).join("");
}

/* ===== Modal CV ===== */
function setCvSrc(src) {
  const frame = $("#cvFrame");
  const notice = $("#cvNotice");
  frame.src = src;
  if (notice) {
    notice.style.display = "block";
    clearTimeout(setCvSrc._t);
    setCvSrc._t = setTimeout(() => (notice.style.display = "none"), 1400);
    frame.onload = () => (notice.style.display = "none");
  }
}

function openModal() {
  const modal = $("#cvModal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = $("#cvModal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupCvModal() {
  $("#cvDownloadPt").href = profile.cvPtPdf;
  $("#cvDownloadEn").href = profile.cvEnPdf;
  $("#cvDownloadPt").setAttribute("download", "CV-PT.pdf");
  $("#cvDownloadEn").setAttribute("download", "CV-EN.pdf");

  $("#cvViewPt").addEventListener("click", () => setCvSrc(profile.cvPtPdf));
  $("#cvViewEn").addEventListener("click", () => setCvSrc(profile.cvEnPdf));

  const openers = ["#openCvModal", "#openCvModal2"].map((id) => $(id)).filter(Boolean);
  openers.forEach((btn) =>
    btn.addEventListener("click", () => {
      openModal();
      setCvSrc(profile.cvPtPdf);
    })
  );

  $("#cvClose").addEventListener("click", closeModal);

  $("#cvModal").addEventListener("click", (e) => {
    if (e.target && e.target.matches("[data-close='true']")) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  $("#cvFullscreen").addEventListener("click", () => {
    const frame = $("#cvFrame");
    const panel = $(".modal__panel");
    const el = frame?.requestFullscreen ? frame : panel;
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
  });
}

/* ===== Form ===== */
function setError(field, msg) {
  const el = document.querySelector(`[data-error-for="${field}"]`);
  if (el) el.textContent = msg || "";
}
function clearErrors() {
  ["name", "email", "message"].forEach((f) => setError(f, ""));
}
function validateForm({ name, email, message }) {
  let ok = true;
  if (!name || name.trim().length < 2) { setError("name", "Informe seu nome (mín. 2 caracteres)."); ok = false; }
  if (!isValidEmail(email)) { setError("email", "Informe um e-mail válido."); ok = false; }
  if (!message || message.trim().length < 10) { setError("message", "Escreva uma mensagem (mín. 10 caracteres)."); ok = false; }
  return ok;
}
function makeMailto({ name, email, message }) {
  const subject = `Contato pelo CinePortfólio — ${name}`;
  const body =
`Nome: ${name}
E-mail: ${email}

Mensagem:
${message}

(Enviado via CinePortfólio)`;
  return `mailto:${encodeURIComponent(profile.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ===== Init ===== */
function init() {
  $("#year").textContent = new Date().getFullYear();

  // show inicial: contador + luzes + abrir cortina
  runCountdownAndOpen();

  setupMouseLight();

  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();

  applyProfile();
  renderProjectTagOptions();
  renderProjects();
  renderExperience();
  setupCvModal();

  $("#reopenCurtain").addEventListener("click", reopenCurtain);

  // repetir show (contador + luzes + cortina)
  $("#replayShow").addEventListener("click", () => {
    // fecha a cortina de volta visualmente
    document.body.classList.add("is-reopen");
    document.body.classList.remove("is-open");
    void document.body.offsetWidth;
    runCountdownAndOpen();
  });

  $("#projectSearch").addEventListener("input", renderProjects);
  $("#projectSort").addEventListener("change", renderProjects);
  $("#projectTag").addEventListener("change", renderProjects);

  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const data = { name: $("#name").value, email: $("#email").value, message: $("#message").value };
    if (!validateForm(data)) return;

    showToast("Abrindo seu cliente de e-mail…");
    window.location.href = makeMailto(data);
  });

  $("#copyBtn").addEventListener("click", async () => {
    clearErrors();
    const data = { name: $("#name").value, email: $("#email").value, message: $("#message").value };
    if (!validateForm(data)) return;

    const text = `Nome: ${data.name}\nE-mail: ${data.email}\n\nMensagem:\n${data.message}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Mensagem copiada!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Mensagem copiada!");
    }
  });
}

document.addEventListener("DOMContentLoaded", init);