import { readFileSync } from "node:fs";
import { icon } from "./icons.mjs";
export const articles = JSON.parse(
  readFileSync(new URL("../content/articles.json", import.meta.url)),
);
export const categories = JSON.parse(
  readFileSync(new URL("../content/categories.json", import.meta.url)),
);
export const escape = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const themes = { pine: "#24644f", ocean: "#245cc5", violet: "#7042b5" };
export function normalizeConfig(input = {}) {
  const httpUrl = (v) => {
    try {
      const u = new URL(v);
      return ["https:", "http:"].includes(u.protocol)
        ? u.href.replace(/\/$/, "")
        : "";
    } catch {
      return "";
    }
  };
  return {
    brand:
      String(input.brand || "Acme")
        .trim()
        .slice(0, 40) || "Acme",
    accent: Object.hasOwn(themes, input.accent) ? input.accent : "pine",
    mode: input.mode === "dark" ? "dark" : "light",
    siteUrl: httpUrl(input.siteUrl),
    websiteUrl: httpUrl(input.websiteUrl),
    supportEmail: /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(
      input.supportEmail || "",
    )
      ? input.supportEmail
      : "",
    description: String(
      input.description ||
        "The answers you need. A little less searching, a little more doing.",
    ).slice(0, 160),
  };
}
export function renderPage(config, kind = "home", item = null) {
  const c = normalizeConfig(config),
    inner = kind === "article" || kind === "category",
    base = inner ? "../" : "./";
  const name =
    kind === "article"
      ? item.title
      : kind === "category"
        ? item.title
        : kind === "search"
          ? "Search the help center"
          : "How can we help?";
  const path =
    kind === "article"
      ? `articles/${item.slug}.html`
      : kind === "category"
        ? `categories/${item.id}.html`
        : kind === "search"
          ? "search.html"
          : "index.html";
  const description =
    kind === "article"
      ? item.summary
      : kind === "category"
        ? item.description
        : c.description;
  const canonical = c.siteUrl ? `${c.siteUrl}/${path}` : "";
  const row = (a) =>
    `<a class="article-link" href="${base}articles/${a.slug}.html">${icon("file")}<span>${escape(a.title)}<small>${escape(a.summary)}</small></span>${icon("arrow")}</a>`;
  const card = (cat) =>
    `<a class="category-card" href="${base}categories/${cat.id}.html"><span class="category-icon">${icon(cat.icon)}</span><h2>${escape(cat.title)}</h2><p>${escape(cat.description)}</p><div class="card-bottom"><span>${articles.filter((a) => a.category === cat.id).length} articles</span>${icon("arrow")}</div></a>`;
  const search = `<form class="search-box" role="search" action="${base}search.html">${icon("search")}<label class="sr-only" for="search">Search help articles</label><input type="search" id="search" name="q" placeholder="Search for an answer…" autocomplete="off" maxlength="200"><kbd>/</kbd><button class="sr-only" type="submit">Search</button></form><div class="instant-results" id="instant-results" hidden></div>`;
  let body = "";
  if (kind === "home")
    body = `<section class="help-hero"><span class="eyebrow">${escape(c.brand)} HELP CENTER</span><h1>How can we help?</h1><p>${escape(c.description)}</p><div class="search-wrap">${search}</div><div class="popular-searches">Popular: <a href="./articles/invite-your-team.html">Invite your team</a><a href="./articles/find-your-invoices.html">Find an invoice</a></div></section><section class="categories" aria-label="Browse topics">${categories.map(card).join("")}</section><section class="reading"><div class="section-heading"><h2>A good place to start</h2><span>Small steps. Useful answers.</span></div><div class="article-list">${[articles[0], articles[1], articles[4]].map(row).join("")}</div></section>`;
  if (kind === "category")
    body = `<div class="breadcrumb"><a href="${base}index.html">All topics</a><span>/</span><span>${escape(item.title)}</span></div><section class="category-heading"><span class="category-icon">${icon(item.icon)}</span><h1>${escape(item.title)}</h1><p>${escape(item.description)}</p></section><div class="article-list category-articles">${articles
      .filter((a) => a.category === item.id)
      .map(row)
      .join("")}</div>`;
  if (kind === "search")
    body = `<section class="search-page"><a class="back-link" href="./index.html">← All topics</a><h1>Find your answer</h1><div class="search-wrap">${search}</div><p id="search-summary" aria-live="polite">Enter a few words to search all ${articles.length} articles.</p><div id="search-results" class="article-list"></div><noscript><p>Enable JavaScript for search, or <a href="./index.html">browse all topics</a>.</p></noscript></section>`;
  if (kind === "article") {
    const cat = categories.find((x) => x.id === item.category),
      related = articles.filter(
        (a) => a.category === cat.id && a.slug !== item.slug,
      );
    body = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${base}index.html">All topics</a><span>/</span><a href="${base}categories/${cat.id}.html">${escape(cat.title)}</a></nav><div class="article-layout"><aside class="topic-nav" aria-label="Topics"><p class="eyebrow">BROWSE TOPICS</p>${categories.map((t) => `<a ${t.id === cat.id ? 'aria-current="true"' : ""} href="${base}categories/${t.id}.html">${icon(t.icon)}${escape(t.title)}</a>`).join("")}</aside><article class="article"><span class="eyebrow">${escape(cat.title)}</span><h1>${escape(item.title)}</h1><p class="article-description">${escape(item.summary)}</p><p class="article-meta">Sample article · <time datetime="${item.updated}">September 5, 2026</time> · ${Math.max(1, Math.ceil(JSON.stringify(item).split(/\s+/).length / 200))} min read</p><div class="quick-answer"><strong>The short answer</strong><p>${escape(item.answer)}</p></div>${item.sections.map((s) => `<section id="${s.id}"><h2>${escape(s.title)}</h2>${s.html}</section>`).join("")}<div class="sample-note">This is example content for a fictional product. Replace these steps with your product’s verified instructions before publishing.</div><div class="related"><h2>Keep exploring</h2>${related.map(row).join("")}</div></article><aside class="toc"><p class="eyebrow">ON THIS PAGE</p>${item.sections.map((s) => `<a href="#${s.id}">${escape(s.title)}</a>`).join("")}<button class="print-button" type="button">Print article ↗</button></aside></div>`;
  }
  const structured =
    kind === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: item.title,
          description: item.summary,
          dateModified: item.updated,
          author: { "@type": "Organization", name: c.brand },
          ...(canonical ? { url: canonical } : {}),
        }
      : null;
  return `<!doctype html><html lang="en" data-theme="${c.mode}" data-accent="${c.accent}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${escape(name)} · ${escape(c.brand)} Help</title><meta name="description" content="${escape(description)}">${canonical ? `<link rel="canonical" href="${escape(canonical)}">` : ""}<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}assets/style.css">${structured ? `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, "\\u003c")}</script>` : ""}<script src="${base}assets/search-index.js" defer></script><script src="${base}assets/app.js" defer></script></head><body data-base="${base}" data-page="${kind}"><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="${base}index.html"><span class="brand-mark">${icon("book")}</span>${escape(c.brand)}<span class="brand-separator"></span><span class="help-label">Help center</span></a><nav aria-label="Main navigation">${c.websiteUrl ? `<a href="${escape(c.websiteUrl)}">Back to website ↗</a>` : ""}<button class="theme-toggle" aria-label="Switch color theme" type="button">${icon("sun")}</button></nav></header><main id="main" class="main ${kind}">${body}</main><section class="contact-strip"><span class="category-icon">${icon("life")}</span><div><h2>Still need a hand?</h2><p>${c.supportEmail ? "Our team is here to help you move forward." : "Start with troubleshooting for a few practical next steps."}</p></div><a class="contact-button" href="${c.supportEmail ? `mailto:${escape(c.supportEmail)}` : `${base}categories/troubleshooting.html`}">${c.supportEmail ? "Contact support" : "Troubleshooting"} ${icon("arrow")}</a></section><footer class="site-footer"><span>© ${new Date().getUTCFullYear()} ${escape(c.brand)}</span><span>Made with <a href="https://knowledgebase.dev/?utm_source=compass&utm_medium=template&utm_campaign=launch-kit">Compass</a> · by <a href="https://helpcenter.io/?utm_source=compass&utm_medium=template&utm_campaign=launch-kit">HelpCenter.io</a></span></footer></body></html>`;
}
export function buildFiles(config = {}) {
  const c = normalizeConfig(config),
    files = {};
  files["index.html"] = renderPage(c);
  files["search.html"] = renderPage(c, "search");
  for (const cat of categories)
    files[`categories/${cat.id}.html`] = renderPage(c, "category", cat);
  for (const article of articles)
    files[`articles/${article.slug}.html`] = renderPage(c, "article", article);
  for (const f of ["style.css", "app.js", "favicon.svg"])
    files[`assets/${f}`] = readFileSync(
      new URL(`../template/${f}`, import.meta.url),
      "utf8",
    );
  files["assets/search-index.js"] =
    `window.COMPASS_ARTICLES=${JSON.stringify(articles.map((a) => ({ slug: a.slug, title: a.title, summary: a.summary, category: a.category, text: [a.answer, ...a.sections.map((s) => s.title + " " + s.html.replace(/<[^>]+>/g, " "))].join(" ") }))).replace(/</g, "\\u003c")};`;
  if (c.siteUrl) {
    files["sitemap.xml"] =
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
        files,
      )
        .filter((f) => f.endsWith(".html") && f !== "search.html")
        .map((f) => `<url><loc>${escape(c.siteUrl)}/${f}</loc></url>`)
        .join("")}</urlset>`;
    files["robots.txt"] =
      `User-agent: *\nAllow: /\nSitemap: ${c.siteUrl}/sitemap.xml\n`;
  }
  return files;
}
