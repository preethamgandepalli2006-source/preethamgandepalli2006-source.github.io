/* =========================================================
   Portfolio scripts - Gandepalli Preetham
   Features: mobile nav, active link highlight, typing effect,
   scroll reveal, CGPA bars, counters, GitHub sync, certificates,
   resume check, form validation (EmailJS), back-to-top
   ========================================================= */
/* =========================================================
   LINKEDIN_URL - used by every LinkedIn button and link on the site
   (Home button, Contact "LinkedIn Profile" button/row, and the LinkedIn
   account email). All of them open this profile in a new tab.
   To change it, edit only this line.
   ========================================================= */
const LINKEDIN_URL = "https://www.linkedin.com/in/preetham-gandepalli-4a7b02348/";

/* =========================================================
   EMAILJS CONFIGURATION - contact form (https://www.emailjs.com/docs/)
   All three values are set. To change them later see README.md, "Contact form (EmailJS)".
     EMAILJS_SERVICE_ID  : your Gmail service (Email Services > Service ID)
     EMAILJS_TEMPLATE_ID : your template with {{name}} {{email}} {{subject}} {{message}} (Email Templates > Template ID)
     EMAILJS_PUBLIC_KEY  : Account > General > Public Key (meant for browser code; never put the Private Key here)
   The Public Key is designed to be used in browser code, so it is safe to publish.
   Until all three are set, the form shows "Email service is not configured."
   ========================================================= */
const EMAILJS_SERVICE_ID = "service_4oxvsi6";
// Template ID as supplied for the working form. If EmailJS ever answers "The template ID not found",
// copy the ID again from EmailJS > Email Templates (careful: letter o vs digit 0, digit 1 vs letter l).
const EMAILJS_TEMPLATE_ID = "template_h03m5yl";
const EMAILJS_PUBLIC_KEY = "sA9zoPQtOJMPBhd9Z";

/* =========================================================
   CERTIFICATES AND ACHIEVEMENTS (Certifications section)
   Listed from your resume (titles, issuers and dates exactly as written there). Only real certificates may be listed. Add one object per certificate, e.g.
     { title: "Exact certificate name", issuer: "Issuing organisation", date: "Month YYYY",
       image: "assets/certificates/my-certificate.jpg",   // optional preview image
       pdf: "assets/certificates/my-certificate.pdf" },   // optional PDF
   Put the files in assets/certificates/. Only title is required. Paths must start with assets/ or https://
   ========================================================= */
const CERTIFICATES = [
  { title: "C Essentials 1", issuer: "Cisco Networking Academy", date: "March 2025" },
  { title: "HTML Essentials", issuer: "Cisco Networking Academy", date: "July 2025" },
  { title: "CSS Essentials", issuer: "Cisco Networking Academy", date: "August 2025" },
  { title: "JavaScript Essentials 1", issuer: "Cisco Networking Academy", date: "October 2025" },
  { title: "JavaScript Essentials 2", issuer: "Cisco Networking Academy", date: "October 2025" },
  { title: "Database Management System", issuer: "Infosys", date: "December 2025" },
];

(function () {
  "use strict";

  /* ---------- CONFIG (other settings) ---------- */
  var CONFIG = {
    linkedinUrl: LINKEDIN_URL,

    // 2) Resume: the file the "Download Resume" button points to. Put your PDF here.
    resumePath: "assets/resume.pdf",


    contactEmail: "preethamgandepalli2006@gmail.com",
    whatsappUrl: "https://wa.me/918919990149",
    typingWords: ["Software Developer", "Python Programmer", "Freelance Web Developer", "Computer Science Student"]
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Toast (small status message) ---------- */
  var toastEl = $("#toast");
  var toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 6000);
  }

  /* ---------- LinkedIn buttons ---------- */
  // Every [data-linkedin] element opens LINKEDIN_URL in a new tab.
  $$("[data-linkedin]").forEach(function (a) {
    a.href = CONFIG.linkedinUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    if (a.hasAttribute("data-show-url")) a.textContent = CONFIG.linkedinUrl.replace(/^https:\/\/(www\.)?/i, "");
  });

  /* ---------- Resume buttons ---------- */
  // assets/resume.pdf is a normal download link (works on desktop and mobile). On a web server
  // (Live Server, GitHub Pages) we also check that the file really exists; if it does not, the
  // button says so instead of downloading an error page. Browsers block that check on file://.
  function markResumeMissing(a) {
    a.classList.add("is-missing");
    a.setAttribute("aria-disabled", "true");
    a.removeAttribute("download");
    a.setAttribute("href", "#");
    a.textContent = a.classList.contains("btn") ? "Resume Not Added Yet" : "Resume (not added yet)";
    a.addEventListener("click", function (e) {
      e.preventDefault();
      showToast("Resume not added yet. Upload your PDF to " + CONFIG.resumePath + " and redeploy.");
    });
  }
  function checkResume(a) {
    a.href = CONFIG.resumePath;
    if (location.protocol === "file:" || !window.fetch) return;
    function looksLikePdf(res) {
      var type = (res.headers.get("content-type") || "").toLowerCase();
      return res.ok && (!type || type.indexOf("pdf") !== -1 || type.indexOf("octet-stream") !== -1);
    }
    fetch(CONFIG.resumePath, { method: "HEAD", cache: "no-cache" })
      .then(function (res) {
        if (res.status === 405) return fetch(CONFIG.resumePath, { cache: "no-cache" });   // server does not allow HEAD
        return res;
      })
      .then(function (res) { if (!looksLikePdf(res)) markResumeMissing(a); })
      .catch(function () { markResumeMissing(a); });
  }
  $$("[data-resume]").forEach(checkResume);

  /* ---------- "Hire Me" and service "Contact Me" buttons ---------- */
  // They scroll to the contact form (normal #contact link) and pre-fill the Subject,
  // but never overwrite a subject the visitor typed themselves.
  var subjectInput = $("#subject");
  if (subjectInput) {
    subjectInput.addEventListener("input", function () { subjectInput.dataset.autofilled = "0"; });
    $$("[data-hire], [data-service]").forEach(function (a) {
      a.addEventListener("click", function () {
        if (subjectInput.value.trim() && subjectInput.dataset.autofilled !== "1") return;
        var service = a.getAttribute("data-service");
        subjectInput.value = service ? "Enquiry: " + service : "Project enquiry";
        subjectInput.dataset.autofilled = "1";
        var field = subjectInput.closest(".field");
        if (field) field.classList.remove("invalid");
        var err = $("#subjectError");
        if (err) err.textContent = "";
      });
    });
  }

  /* ---------- Featured projects: optional "Live Demo" button ---------- */
  // A card shows "Live Demo" only if you add a real https address as data-demo-url on it in index.html.
  $$("[data-demo-url]").forEach(function (card) {
    var url = (card.getAttribute("data-demo-url") || "").trim();
    if (!/^https:\/\/[^\s"'<>]+$/i.test(url)) return;
    var badge = $("[data-badge]", card);
    var body = $(".project-body", card);
    var link = document.createElement("a");
    link.className = "btn btn-small btn-ghost demo-link";
    link.textContent = "Live Demo";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    body.insertBefore(link, badge);
  });

  /* ---------- Certificates ---------- */
  (function Certificates() {
    var grid = $("#certGrid");
    var empty = $("#certEmpty");
    if (!grid || !empty) return;
    var list = Array.isArray(CERTIFICATES) ? CERTIFICATES : [];
    function safePath(p) { return typeof p === "string" && /^(assets\/|https:\/\/)[^\s"'<>]+$/i.test(p.trim()); }
    list.forEach(function (c) {
      if (!c || typeof c.title !== "string" || !c.title.trim()) return;
      var card = document.createElement("article");
      card.className = "glass cert-card card-in";
      if (safePath(c.image)) {
        var img = document.createElement("img");
        img.src = c.image.trim();
        img.alt = "Certificate: " + c.title;
        img.loading = "lazy";
        card.appendChild(img);
      }
      var body = document.createElement("div");
      body.className = "cert-body";
      var h = document.createElement("h3");
      h.textContent = c.title;
      body.appendChild(h);
      var meta = [c.issuer, c.date].filter(function (x) { return typeof x === "string" && x.trim(); }).join(" \u00b7 ");
      if (meta) { var p = document.createElement("p"); p.textContent = meta; body.appendChild(p); }
      var target = safePath(c.pdf) ? c.pdf : (safePath(c.image) ? c.image : "");
      if (target) {
        var row = document.createElement("div");
        row.className = "btn-row";
        var a = document.createElement("a");
        a.className = "btn btn-small btn-primary";
        a.textContent = safePath(c.pdf) ? "View PDF" : "View Image";
        a.href = target.trim();
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        row.appendChild(a);
        body.appendChild(row);
      }
      card.appendChild(body);
      grid.appendChild(card);
    });
    empty.hidden = grid.children.length > 0;
  })();

  /* ---------- Mobile navigation ---------- */
  var toggle = $("#navToggle");
  var links = $("#navLinks");
  function closeMenu() {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("a", links).forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- Navbar style, back-to-top, active link ---------- */
  var navbar = $("#navbar");
  var backTop = $("#backToTop");
  var sections = $$("main section[id]");
  var navAnchors = $$(".nav-links a");

  function onScroll() {
    var y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 20);
    backTop.classList.toggle("show", y > 500);

    var current = "home";
    sections.forEach(function (s) {
      if (y >= s.offsetTop - 140) current = s.id;
    });
    navAnchors.forEach(function (a) {
      var isCurrent = a.getAttribute("href") === "#" + current;
      a.classList.toggle("active", isCurrent);
      if (isCurrent) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Typing effect ---------- */
  var typingEl = $("#typing");
  var wordIdx = 0, charIdx = 0, deleting = false;
  function type() {
    var word = CONFIG.typingWords[wordIdx];
    charIdx += deleting ? -1 : 1;
    typingEl.textContent = word.substring(0, charIdx);
    var delay = deleting ? 45 : 90;
    if (!deleting && charIdx === word.length) { deleting = true; delay = 1400; }
    else if (deleting && charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % CONFIG.typingWords.length; delay = 350; }
    setTimeout(type, delay);
  }
  if (reduceMotion) { typingEl.textContent = CONFIG.typingWords[0]; } else { type(); }

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }
    var start = null, duration = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Scroll reveal + CGPA bars + counters ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("visible");
        $$("[data-score]", el).forEach(function (bar) {
          bar.style.width = (parseFloat(bar.dataset.score) / 10 * 100) + "%";
        });
        $$("[data-count]", el).forEach(countUp);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  } else {
    // Fallback for very old browsers: show everything.
    revealEls.forEach(function (el) {
      el.classList.add("visible");
      $$("[data-score]", el).forEach(function (bar) { bar.style.width = (parseFloat(bar.dataset.score) * 10) + "%"; });
    });
  }

  /* =========================================================
     GITHUB AUTOMATIC SYNCHRONIZATION
     The GitHub REST API is the single source of truth.
     - No repository is hardcoded anywhere (HTML or JS).
     - Nothing is cached in the browser: every sync is a fresh request,
       so deleted / renamed / private repositories can never come back
       from old data.
     - If a refresh fails after an earlier success, the data on screen is
       clearly marked as STALE. If the very first load fails, nothing is
       shown (no fallback list).
     - No token or credential is used. Only public data is requested.
     ========================================================= */
  (function GitHubSync() {
    var GITHUB_USER = "preethamgandepalli2006-source";
    var API_URL = "https://api.github.com/users/" + GITHUB_USER + "/repos";
    var USER_URL = "https://api.github.com/users/" + GITHUB_USER;
    var PROFILE_URL = "https://github.com/" + GITHUB_USER;
    var PER_PAGE = 100;               // GitHub's maximum page size
    var MAX_PAGES = 10;               // safety limit (1000 repositories)
    var REFRESH_MS = 5 * 60 * 1000;   // automatic refresh interval
    var TIMEOUT_MS = 12000;           // per-request timeout

    var GH_ICON = '<svg class="gh-icon" viewBox="0 0 16 16" width="26" height="26" aria-hidden="true" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

    // ----- DOM references -----
    var grid = $("#repoGrid");
    var emptyEl = $("#repoEmpty");
    var searchEl = $("#repoSearch");
    var sortEl = $("#repoSort");
    var refreshBtn = $("#repoRefresh");
    var langBox = $("#langFilters");
    var countText = $("#repoCountText");
    var syncTime = $("#syncTime");
    var alertEl = $("#syncAlert");
    var noteEl = $("#syncNote");
    var profileCount = $("#repoCount");
    var aboutCount = $("#aboutRepoCount");
    if (!grid) return;

    // ----- State (memory only, never persisted) -----
    var state = {
      repos: null,          // last successful list, or null if no sync has succeeded yet
      signature: "",
      lastSuccess: null,    // Date of last successful sync
      stale: false,
      inFlight: false,
      blockedUntil: 0,      // timestamp until which GitHub's rate limit applies
      lastAttempt: 0,
      query: "",
      language: "all",
      sort: "updated"
    };

    /* ---------- Fetching ---------- */
    function syncError(kind, extra) {
      var e = new Error(kind);
      e.kind = kind;
      if (extra) for (var k in extra) e[k] = extra[k];
      return e;
    }

    async function fetchPage(page, bust) {
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
      var res;
      try {
        res = await fetch(API_URL + "?type=owner&sort=updated&direction=desc&per_page=" + PER_PAGE + "&page=" + page + (bust ? "&_=" + Date.now() : ""), {
          headers: { Accept: "application/vnd.github+json" },
          cache: "no-cache",           // always revalidate with GitHub, never trust the HTTP cache
          signal: controller.signal
        });
      } catch (err) {
        throw syncError(err && err.name === "AbortError" ? "timeout" : "network");
      } finally {
        clearTimeout(timer);
      }

      if (res.ok) {
        var json;
        try { json = await res.json(); } catch (e) { throw syncError("bad-response"); }
        if (!Array.isArray(json)) throw syncError("bad-response");
        return json;
      }

      var remaining = res.headers.get("x-ratelimit-remaining");
      var reset = res.headers.get("x-ratelimit-reset");
      var retryAfter = res.headers.get("retry-after");
      if (res.status === 429 || ((res.status === 403) && (remaining === "0" || retryAfter))) {
        var resetAt = reset ? Number(reset) * 1000
                    : retryAfter ? Date.now() + Number(retryAfter) * 1000
                    : Date.now() + 15 * 60 * 1000;
        throw syncError("rate-limit", { resetAt: resetAt });
      }
      if (res.status === 404) throw syncError("not-found");
      throw syncError("http", { status: res.status });
    }

    // Fetches EVERY page. If any page fails, the whole sync fails, so a
    // partial list is never shown as if it were complete.
    async function fetchAllRepos(bust) {
      var all = [];
      for (var page = 1; page <= MAX_PAGES; page++) {
        var data = await fetchPage(page, bust);
        all = all.concat(data);
        if (data.length < PER_PAGE) break;
      }
      return all;
    }

    // GitHub's own count of this account's public repositories (a second, independent API field).
    // Used ONLY to detect a mismatch with the list; the number shown on the page is always the
    // length of the list GitHub returned. Failure here is ignored.
    async function fetchReportedCount() {
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
      try {
        var res = await fetch(USER_URL, { headers: { Accept: "application/vnd.github+json" }, cache: "no-cache", signal: controller.signal });
        if (!res.ok) return null;
        var json = await res.json();
        return typeof json.public_repos === "number" ? json.public_repos : null;
      } catch (e) {
        return null;
      } finally {
        clearTimeout(timer);
      }
    }

    function isPublicRepo(r) {
      return r && r.private !== true &&
             (r.visibility === undefined || r.visibility === "public") &&
             typeof r.html_url === "string" && r.html_url.indexOf("https://github.com/") === 0;
    }

    function normalizeRepo(r) {
      return {
        id: r.id,
        name: String(r.name),
        url: r.html_url,                                   // always the CURRENT URL
        description: r.description ? String(r.description) : "",
        language: r.language ? String(r.language) : "",
        updated: r.updated_at || r.pushed_at || "",
        created: r.created_at || "",
        fork: r.fork === true,
        archived: r.archived === true
      };
    }

    function signatureOf(repos) {
      return JSON.stringify(repos.map(function (r) {
        return [r.id, r.name, r.url, r.description, r.language, r.updated, r.created, r.fork, r.archived];
      }));
    }

    /* ---------- Formatting helpers ---------- */
    function clock(d) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    function relative(iso) {
      var t = Date.parse(iso);
      if (isNaN(t)) return "";
      var m = Math.floor((Date.now() - t) / 60000);
      if (m < 1) return "just now";
      if (m < 60) return m + " min ago";
      var h = Math.floor(m / 60);
      if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
      var d = Math.floor(h / 24);
      if (d < 30) return d + (d === 1 ? " day ago" : " days ago");
      var mo = Math.floor(d / 30);
      if (mo < 12) return mo + (mo === 1 ? " month ago" : " months ago");
      var y = Math.floor(d / 365);
      return y + (y === 1 ? " year ago" : " years ago");
    }
    function dateLabel(iso) {
      var d = new Date(iso);
      return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    }
    function keyOf(name) { return String(name).toLowerCase().replace(/[^a-z0-9]/g, ""); }

    /* ---------- Rendering ---------- */
    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;   // textContent only: repo data is never parsed as HTML
      return n;
    }

    function createCard(r, animate) {
      var card = el("article", "glass repo-card" + (animate ? " card-in" : ""));
      card.setAttribute("data-repo-id", r.id);

      var head = el("div", "repo-head");
      head.insertAdjacentHTML("beforeend", GH_ICON);     // static constant, not repo data
      var titleBox = el("div");
      titleBox.appendChild(el("h4", "", r.name));
      head.appendChild(titleBox);
      card.appendChild(head);

      card.appendChild(el("p", "repo-desc" + (r.description ? "" : " is-empty"), r.description || "No description provided."));

      var tags = el("ul", "chips");
      if (r.language) tags.appendChild(el("li", "chip-live", r.language));
      if (r.fork) tags.appendChild(el("li", "", "Fork"));
      if (r.archived) tags.appendChild(el("li", "", "Archived"));
      if (tags.children.length) card.appendChild(tags);

      if (r.updated) {
        var meta = el("p", "repo-meta");
        var time = el("time", "", "Updated " + dateLabel(r.updated));
        time.setAttribute("datetime", r.updated);
        time.title = relative(r.updated);
        meta.appendChild(time);
        meta.appendChild(document.createTextNode(" · " + relative(r.updated)));
        card.appendChild(meta);
      }

      var row = el("div", "btn-row");
      var a = el("a", "btn btn-small btn-primary", "View on GitHub");
      a.href = r.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", "View " + r.name + " on GitHub");
      row.appendChild(a);
      card.appendChild(row);
      return card;
    }

    function visibleRepos() {
      var q = state.query;
      var list = state.repos.filter(function (r) {
        if (state.language !== "all" && (r.language || "__none__") !== state.language) return false;
        if (!q) return true;
        return (r.name + " " + r.description + " " + r.language).toLowerCase().indexOf(q) !== -1;
      });
      list.sort(function (a, b) {
        if (state.sort === "name") return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        var field = state.sort === "created" ? "created" : "updated";
        return Date.parse(b[field]) - Date.parse(a[field]);
      });
      return list;
    }

    function renderLanguageFilters() {
      var counts = {};
      state.repos.forEach(function (r) {
        var k = r.language || "__none__";
        counts[k] = (counts[k] || 0) + 1;
      });
      // A selected language that no longer exists (e.g. repo deleted) falls back to "All".
      if (state.language !== "all" && !counts[state.language]) state.language = "all";

      var keys = Object.keys(counts).sort(function (a, b) {
        if (a === "__none__") return 1;
        if (b === "__none__") return -1;
        return counts[b] - counts[a] || a.localeCompare(b);
      });

      langBox.textContent = "";
      function chip(key, label, n) {
        var b = el("button", "lang-chip", label + " (" + n + ")");
        b.type = "button";
        b.setAttribute("data-lang", key);
        b.setAttribute("aria-pressed", String(state.language === key));
        langBox.appendChild(b);
      }
      if (state.repos.length) {
        chip("all", "All", state.repos.length);
        keys.forEach(function (k) { chip(k, k === "__none__" ? "No language" : k, counts[k]); });
      }
    }

    function renderGrid(animate) {
      grid.setAttribute("aria-busy", "false");
      grid.textContent = "";
      emptyEl.hidden = true;
      emptyEl.textContent = "";

      if (!state.repos.length) {
        emptyEl.textContent = "No public repositories were found on this GitHub account.";
        emptyEl.hidden = false;
        return;
      }
      var list = visibleRepos();
      if (!list.length) {
        emptyEl.textContent = "No repositories match your search or filter.";
        emptyEl.hidden = false;
        return;
      }
      var frag = document.createDocumentFragment();
      list.forEach(function (r) { frag.appendChild(createCard(r, animate)); });
      grid.appendChild(frag);
      updateCountText(list.length);
    }

    function updateCountText(shown) {
      var total = state.repos.length;
      var t = "Public repositories: " + total;
      if (shown !== undefined && shown !== total) t += " · Showing " + shown;
      countText.textContent = t;
    }

    function renderAll(animate) {
      renderLanguageFilters();
      renderGrid(animate);
      updateCountText(state.repos.length ? visibleRepos().length : 0);
    }

    function updateCounts() {
      var n = String(state.repos.length);
      aboutCount.textContent = n;
      profileCount.textContent = "Public repositories on GitHub: " + n;
      profileCount.hidden = false;
    }

    function updateSyncLine() {
      if (!state.lastSuccess) { syncTime.textContent = ""; syncTime.classList.remove("is-stale"); return; }
      syncTime.textContent = "Last successful sync: " + clock(state.lastSuccess) +
        (state.stale ? " (STALE)" : " · auto-refresh every 5 min");
      syncTime.classList.toggle("is-stale", state.stale);
    }

    // Additional (non-GitHub) projects: link one ONLY when a public repository
    // with exactly the same name currently exists on the account.
    function updateAdditionalProjects() {
      $$("[data-project-key]").forEach(function (card) {
        var key = card.getAttribute("data-project-key");
        var badge = $("[data-badge]", card);
        if (badge && !badge.hasAttribute("data-default")) badge.setAttribute("data-default", badge.textContent);
        var body = $(".project-body", card);
        var existing = $("a.gh-link", card);
        var match = null;
        state.repos.forEach(function (r) { if (!match && !r.fork && keyOf(r.name) === key) match = r; });

        if (match) {
          if (!existing) {
            existing = el("a", "btn btn-small btn-primary gh-link", "Source Code");
            existing.target = "_blank";
            existing.rel = "noopener noreferrer";
            body.insertBefore(existing, badge);
          }
          existing.href = match.url;
          existing.setAttribute("aria-label", "Source code for " + match.name + " on GitHub");
          if (badge) badge.textContent = "Public GitHub repository: " + match.name;
        } else {
          if (existing) existing.remove();
          if (badge) badge.textContent = badge.getAttribute("data-default");
        }
      });
    }

    /* ---------- Alerts and failure handling ---------- */
    function reasonFor(err) {
      switch (err.kind) {
        case "network": return "Network error: could not reach GitHub.";
        case "timeout": return "GitHub took too long to respond.";
        case "rate-limit": return "GitHub's API rate limit was reached. Automatic retries resume after " + clock(new Date(err.resetAt)) + ".";
        case "not-found": return "GitHub user not found.";
        case "bad-response": return "GitHub returned an unexpected response.";
        default: return "GitHub returned an error (HTTP " + err.status + ").";
      }
    }
    function showAlert(msg) { alertEl.textContent = msg; alertEl.hidden = false; }
    function clearAlert() { alertEl.textContent = ""; alertEl.hidden = true; }

    function handleFailure(err) {
      if (err.kind === "rate-limit") state.blockedUntil = err.resetAt;
      var reason = reasonFor(err);

      if (state.repos) {
        // We have older data: keep it visible but clearly marked as stale.
        state.stale = true;
        grid.classList.add("is-stale");
        showAlert(reason + " Showing data from the last successful sync at " + clock(state.lastSuccess) +
          ". It may be out of date: repositories deleted, renamed or made private since then could still appear.");
        updateSyncLine();
      } else {
        // Never synced: show NOTHING from old/fallback data.
        grid.textContent = "";
        grid.setAttribute("aria-busy", "false");
        langBox.textContent = "";
        countText.textContent = "Public repositories: unavailable";
        emptyEl.textContent = "";
        emptyEl.appendChild(document.createTextNode("Could not load repositories from GitHub. " + reason + " "));
        var a = el("a", "", "View my repositories on GitHub");
        a.href = PROFILE_URL + "?tab=repositories";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        emptyEl.appendChild(a);
        emptyEl.hidden = false;
        clearAlert();
      }
    }

    /* ---------- The sync itself ---------- */
    async function syncRepos() {
      if (state.inFlight) return;
      state.lastAttempt = Date.now();

      if (Date.now() < state.blockedUntil) {          // still rate-limited: do not hammer the API
        handleFailure(syncError("rate-limit", { resetAt: state.blockedUntil }));
        return;
      }

      state.inFlight = true;
      refreshBtn.disabled = true;
      refreshBtn.textContent = "Refreshing...";
      try {
        var raw = await fetchAllRepos(false);
        var repos = raw.filter(isPublicRepo).map(normalizeRepo);
        var reported = await fetchReportedCount();
        if (reported !== null && reported !== repos.length) {
          // The list and GitHub's own count disagree (GitHub's API caches for up to a minute or two).
          // Try once more, bypassing caches.
          try {
            raw = await fetchAllRepos(true);
            repos = raw.filter(isPublicRepo).map(normalizeRepo);
          } catch (e) { /* keep the first result */ }
        }
        var sig = signatureOf(repos);
        var first = state.repos === null;
        var changed = sig !== state.signature;

        state.repos = repos;
        state.signature = sig;
        state.lastSuccess = new Date();
        state.stale = false;
        state.blockedUntil = 0;
        grid.classList.remove("is-stale");
        clearAlert();

        if (first || changed) renderAll(true);        // re-render only when something really changed
        updateCounts();
        updateAdditionalProjects();
        updateSyncLine();
        if (reported !== null && reported !== repos.length) {
          noteEl.textContent = "GitHub reports " + reported + " public " + (reported === 1 ? "repository" : "repositories") +
            " but returned " + repos.length + " in its list. GitHub's API can lag by a few minutes, so this page shows exactly what GitHub returned.";
          noteEl.hidden = false;
        } else {
          noteEl.textContent = "";
          noteEl.hidden = true;
        }
      } catch (err) {
        handleFailure(err.kind ? err : syncError("network"));
      } finally {
        state.inFlight = false;
        refreshBtn.disabled = false;
        refreshBtn.textContent = "Refresh Projects";
      }
    }

    /* ---------- Controls ---------- */
    searchEl.addEventListener("input", function () {
      state.query = searchEl.value.trim().toLowerCase();
      if (state.repos) renderAll(false);
    });
    sortEl.addEventListener("change", function () {
      state.sort = sortEl.value;
      if (state.repos) renderAll(false);
    });
    langBox.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".lang-chip") : null;
      if (!b) return;
      state.language = b.getAttribute("data-lang");
      renderAll(false);
    });
    refreshBtn.addEventListener("click", syncRepos);

    /* ---------- Automatic refresh ---------- */
    syncRepos();                                              // fresh data on every page load
    setInterval(function () {                                 // and every 5 minutes while open
      if (!document.hidden) syncRepos();                      // skip while the tab is hidden (saves API quota)
    }, REFRESH_MS);
    document.addEventListener("visibilitychange", function () {
      // Returning to the tab after being away: refresh right away if data is older than 5 minutes.
      if (!document.hidden && Date.now() - state.lastAttempt >= REFRESH_MS) syncRepos();
    });
  })();

  /* ---------- Contact form ---------- */
  // Sends the enquiry with EmailJS (emailjs.send). "Message sent" is shown ONLY after EmailJS
  // confirms success (HTTP 200 "OK"). If EmailJS is not configured, or sending fails, the form
  // says so clearly and never shows a fake success message.
  (function ContactForm() {
    var form = $("#contactForm");
    var statusEl = $("#formStatus");
    var fallbackEl = $("#formFallback");
    var submitBtn = $("#formSubmit");
    if (!form) return;
    var isSending = false;   // blocks duplicate submissions

    var rules = {
      name: function (v) { return v.length >= 2 ? "" : "Please enter your name (at least 2 characters)."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Please enter a valid email address."; },
      subject: function (v) { return v.length >= 3 ? "" : "Please enter a subject (at least 3 characters)."; },
      message: function (v) { return v.length >= 10 ? "" : "Message should be at least 10 characters."; }
    };

    function validateField(name) {
      var input = form.elements[name];
      var msg = rules[name](input.value.trim());
      $("#" + name + "Error").textContent = msg;
      input.closest(".field").classList.toggle("invalid", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    }
    Object.keys(rules).forEach(function (name) {
      form.elements[name].addEventListener("blur", function () { validateField(name); });
      form.elements[name].addEventListener("input", function () {
        if (form.elements[name].closest(".field").classList.contains("invalid")) validateField(name);
      });
    });

    function setStatus(text, kind) {
      statusEl.textContent = text;
      statusEl.className = "form-note" + (kind ? " " + kind : "");
    }
    function clearFallback() { fallbackEl.textContent = ""; fallbackEl.hidden = true; }

    // Shows "send it another way" links. Nothing here claims the message was sent.
    function showFallback(data) {
      clearFallback();
      var mailto = "mailto:" + CONFIG.contactEmail +
        "?subject=" + encodeURIComponent(data.subject) +
        "&body=" + encodeURIComponent("Name: " + data.name + "\nEmail: " + data.email + "\n\n" + data.message);
      fallbackEl.appendChild(document.createTextNode("You can still reach me: "));
      var a1 = document.createElement("a");
      a1.href = mailto;
      a1.textContent = "open this message in your email app";
      fallbackEl.appendChild(a1);
      fallbackEl.appendChild(document.createTextNode(" or "));
      var a2 = document.createElement("a");
      a2.href = CONFIG.whatsappUrl;
      a2.target = "_blank";
      a2.rel = "noopener noreferrer";
      a2.textContent = "message me on WhatsApp";
      fallbackEl.appendChild(a2);
      fallbackEl.appendChild(document.createTextNode("."));
      fallbackEl.hidden = false;
    }

    // Returns the names of EmailJS settings that are still empty or still a "YOUR_..." placeholder.
    function missingEmailjsSettings() {
      var settings = { EMAILJS_SERVICE_ID: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID: EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY: EMAILJS_PUBLIC_KEY };
      return Object.keys(settings).filter(function (k) {
        var v = settings[k];
        return typeof v !== "string" || v.trim() === "" || /^YOUR_/i.test(v.trim());
      });
    }

    // Makes sure the EmailJS SDK is available before sending. The <script> tag in index.html normally
    // loads it; if it is missing (slow or blocked CDN), try loading it once more before giving up.
    var sdkPromise = null;
    function ensureEmailjs() {
      if (window.emailjs && typeof window.emailjs.send === "function") return Promise.resolve(window.emailjs);
      if (!sdkPromise) {
        sdkPromise = new Promise(function (resolve, reject) {
          var tag = document.createElement("script");
          tag.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/dist/email.min.js";
          tag.onload = function () {
            if (window.emailjs && typeof window.emailjs.send === "function") resolve(window.emailjs);
            else reject(new Error("EmailJS library loaded but emailjs.send is missing"));
          };
          tag.onerror = function () { reject(new Error("EmailJS library could not be loaded (network or ad-blocker?)")); };
          document.head.appendChild(tag);
        });
        sdkPromise.catch(function () { sdkPromise = null; });   // allow another attempt on the next click
      }
      return sdkPromise;
    }

    // Turns an EmailJS error ({status, text}) into a readable reason plus a hint about the usual fix.
    // EmailJS rejects with an object like { status: 400, text: "The Template ID not found..." }.
    function describeEmailjsError(err) {
      var status = err && typeof err.status === "number" ? err.status : null;
      var text = err && (err.text || err.message) ? String(err.text || err.message) : "Unknown error";
      var hint = "";
      if (text === "timeout") hint = "EmailJS did not answer within 20 seconds. Check your internet connection and try again.";
      else if (/library could not be loaded|failed to fetch|networkerror|load failed/i.test(text) || status === 0) hint = "The browser could not reach EmailJS (internet problem, or an ad-blocker/firewall blocking emailjs.com or cdn.jsdelivr.net).";
      else if (/template/i.test(text) && /not found|invalid/i.test(text)) hint = "EMAILJS_TEMPLATE_ID in script.js does not match a template in your EmailJS account. Copy it from Email Templates (careful: letter o vs digit 0).";
      else if (/service/i.test(text) && /not found|invalid/i.test(text)) hint = "EMAILJS_SERVICE_ID in script.js does not match a service in your EmailJS account. Copy it from Email Services.";
      else if (/public key|user.?id|account not found/i.test(text)) hint = "EMAILJS_PUBLIC_KEY in script.js is wrong. Copy it from Account > General.";
      else if (status === 412 || /gmail_api|insufficient|authentication scopes|invalid_grant/i.test(text)) hint = "Gmail permission problem: in EmailJS > Email Services, reconnect the Gmail service and tick the permission to send email.";
      else if (status === 403 || /origin|domain|not allowed|restricted/i.test(text)) hint = "EmailJS is blocking this website address. In EmailJS > Account > Security, add this domain (127.0.0.1 for Live Server) or turn the restriction off.";
      else if (status === 429) hint = "Too many requests or the monthly EmailJS limit was reached. Wait and try again.";
      else if (status === 422 || /variable|corrupted/i.test(text)) hint = "The template variables are invalid. The template must use {{name}}, {{email}}, {{subject}}, {{message}}.";
      return { status: status, text: text, hint: hint };
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (isSending) return;                  // duplicate-submit guard
      setStatus("", "");
      clearFallback();

      if (form.elements.website && form.elements.website.value) return;   // honeypot: a bot filled the hidden field

      var allValid = Object.keys(rules).map(validateField).every(Boolean);
      if (!allValid) {
        setStatus("Please fix the highlighted fields.", "error");
        var firstBad = $(".field.invalid input, .field.invalid textarea", form);
        if (firstBad) firstBad.focus();
        return;
      }

      var data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        subject: form.elements.subject.value.trim(),
        message: form.elements.message.value.trim()
      };

      var missing = missingEmailjsSettings();
      if (missing.length) {
        var onLocalhost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
        var hint = onLocalhost ? " (Owner note: set " + missing.join(", ") + " at the top of script.js.)" : "";
        if (window.console) console.error("EmailJS is not configured. Still missing in script.js: " + missing.join(", "));
        setStatus("Email service is not configured. Please try again later." + hint, "error");
        showFallback(data);
        return;
      }

      // Template parameter mapping. These names MUST match the {{variables}} in the EmailJS template
      // exactly ({{name}}, {{email}}, {{subject}}, {{message}}). A name that does not match arrives blank.
      // The template's "Reply To" field is {{email}}, so replying in Gmail answers the visitor directly.
      var templateParams = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      };

      isSending = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      try {
        var emailjs = await ensureEmailjs();
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY.trim() });
        var timeout = new Promise(function (_, reject) {
          setTimeout(function () { reject(new Error("timeout")); }, 20000);
        });
        var response = await Promise.race([
          emailjs.send(EMAILJS_SERVICE_ID.trim(), EMAILJS_TEMPLATE_ID.trim(), templateParams, { publicKey: EMAILJS_PUBLIC_KEY.trim() }),
          timeout
        ]);
        if (!response || response.status !== 200) throw new Error("EmailJS did not confirm sending");

        setStatus("Message sent successfully! Thank you, I will reply to " + data.email + ".", "success");
        form.reset();                          // cleared only after confirmed success
        $$(".field.invalid", form).forEach(function (f) { f.classList.remove("invalid"); });
      } catch (err) {
        var info = describeEmailjsError(err);
        // Full details for debugging: open the browser console (F12).
        if (window.console) {
          console.group("EmailJS send FAILED");
          console.error("status:", info.status);
          console.error("text:", info.text);
          if (info.hint) console.error("likely fix:", info.hint);
          console.error("service_id:", EMAILJS_SERVICE_ID, "| template_id:", EMAILJS_TEMPLATE_ID, "| public key starts with:", EMAILJS_PUBLIC_KEY.slice(0, 4) + "...");
          console.error("params sent (names):", Object.keys(templateParams).join(", "));
          console.error("page origin:", location.origin);
          console.error("raw error object:", err);
          console.groupEnd();
        }
        setStatus("Message could not be sent. Please try again or contact me through WhatsApp. " +
          "Reason: EmailJS" + (info.status !== null ? " error " + info.status : "") + ": " + info.text + "." + (info.hint ? " " + info.hint : ""), "error");
        showFallback(data);
      } finally {
        isSending = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    });
  })();
})();
