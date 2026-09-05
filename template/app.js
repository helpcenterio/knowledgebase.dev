(() => {
  const $ = (s) => document.querySelector(s),
    root = document.documentElement;
  try {
    const theme = localStorage.getItem("compass-color-mode");
    if (theme === "light" || theme === "dark") root.dataset.theme = theme;
  } catch {}
  $(".theme-toggle")?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("compass-color-mode", root.dataset.theme);
    } catch {}
  });
  $(".print-button")?.addEventListener("click", () => window.print());
  const input = $("#search"),
    dropdown = $("#instant-results"),
    results = $("#search-results");
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const search = (q) => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return (window.COMPASS_ARTICLES || [])
      .map((a) => ({
        ...a,
        score: words.reduce(
          (s, w) =>
            s +
            (a.title.toLowerCase().includes(w) ? 6 : 0) +
            (a.summary.toLowerCase().includes(w) ? 3 : 0) +
            (a.text.toLowerCase().includes(w) ? 1 : 0),
          0,
        ),
      }))
      .filter((a) =>
        words.every((w) =>
          (a.title + " " + a.summary + " " + a.text).toLowerCase().includes(w),
        ),
      )
      .sort((a, b) => b.score - a.score);
  };
  const link = (a) =>
    `<a href="${document.body.dataset.base}articles/${a.slug}.html" ${results ? 'class="article-link"' : ""}><span>${esc(a.title)}<small>${esc(a.summary)}</small></span></a>`;
  function show() {
    if (!input) return;
    const q = input.value.slice(0, 200),
      found = search(q);
    if (results) {
      results.innerHTML = found.map(link).join("");
      $("#search-summary").textContent = q.trim()
        ? `${found.length} ${found.length === 1 ? "article" : "articles"} for “${q}”${found.length ? "" : ". Try a shorter phrase, or browse all topics."}`
        : "Enter a few words to search all articles.";
      results.hidden = !found.length;
      dropdown.hidden = true;
    } else {
      dropdown.hidden = !q.trim();
      dropdown.innerHTML = found.length
        ? found.slice(0, 5).map(link).join("")
        : "<p>No matches yet. Try “password” or “invoice”.</p>";
    }
  }
  input?.addEventListener("input", show);
  if (results && input) {
    input.value =
      new URLSearchParams(location.search).get("q")?.slice(0, 200) || "";
    show();
    $(".search-box").addEventListener("submit", (e) => {
      e.preventDefault();
      history.replaceState(null, "", "?q=" + encodeURIComponent(input.value));
      show();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement.tagName,
      ) &&
      input
    ) {
      e.preventDefault();
      input.focus();
    }
    if (e.key === "Escape" && dropdown) {
      dropdown.hidden = true;
      input.blur();
    }
  });
  document.addEventListener("click", (e) => {
    if (dropdown && !e.target.closest(".search-wrap")) dropdown.hidden = true;
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            document
              .querySelectorAll(".toc a")
              .forEach((a) => a.removeAttribute("aria-current"));
            $(`.toc a[href="#${entry.target.id}"]`)?.setAttribute(
              "aria-current",
              "location",
            );
          }
        }
      },
      { rootMargin: "-10% 0px -65% 0px" },
    );
    document
      .querySelectorAll(".article section[id]")
      .forEach((s) => observer.observe(s));
  }
  // The preview accepts only its own origin. Downloads work without the preview host.
  window.addEventListener("message", (e) => {
    if (e.origin !== location.origin || e.data?.type !== "compass:theme")
      return;
    if (["pine", "ocean", "violet"].includes(e.data.accent))
      root.dataset.accent = e.data.accent;
    if (["light", "dark"].includes(e.data.mode))
      root.dataset.theme = e.data.mode;
    if (typeof e.data.brand === "string") {
      const brand = $(".brand");
      for (const n of brand?.childNodes || []) {
        if (n.nodeType === 3 && n.textContent.trim()) {
          n.textContent = e.data.brand.slice(0, 40);
          break;
        }
      }
      const eyebrow = $(".help-hero>.eyebrow");
      if (eyebrow)
        eyebrow.textContent = e.data.brand.slice(0, 40) + " HELP CENTER";
    }
  });
})();
