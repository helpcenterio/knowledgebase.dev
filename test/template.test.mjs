import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import {
  articles,
  buildFiles,
  categories,
  loadContent,
  normalizeConfig,
} from "../lib/template.mjs";
import path from "node:path";
const pages = (files) =>
  Object.keys(files).filter((x) => x.endsWith(".html")).length;
const decode = (segment) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};
const assertLinksResolve = (files) => {
  for (const [name, html] of Object.entries(files)) {
    if (!name.endsWith(".html")) continue;
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const href = match[1];
      if (/^(https?:|mailto:)/.test(href)) continue;
      const target = path.posix
        .normalize(
          path.posix.join(path.posix.dirname(name), href.split(/[?#]/)[0]),
        )
        .split("/")
        .map(decode)
        .join("/");
      assert.ok(files[target], `${name} links to missing ${target}`);
    }
  }
};
const article = (slug, category, extra = {}) => ({
  slug,
  category,
  title: `Title ${slug}`,
  summary: `Summary ${slug}`,
  answer: "Short answer.",
  updated: "2026-10-01",
  sections: [{ id: "section-1", title: "Steps", html: "<p>Do this.</p>" }],
  ...extra,
});
// A small set that shares no slugs or category ids with the sample content.
const own = {
  categories: [
    { id: "setup", title: "Setup", description: "Start here.", icon: "rocket" },
    { id: "billing", title: "Billing", description: "Pay us.", icon: "card" },
  ],
  articles: [
    article("install", "setup"),
    article("configure", "setup"),
    article("pay", "billing"),
  ],
  images: {},
};
test("builds every linked page and asset for offline use", () => {
  // Runs against your own content/ folder, so it also checks your links and images.
  const files = buildFiles();
  assert.equal(pages(files), 2 + categories.length + articles.length);
  assertLinksResolve(files);
});
test("builds a content set of three articles with no broken links", () => {
  const files = buildFiles({}, own);
  assert.equal(pages(files), 7);
  assertLinksResolve(files);
  for (const [name, html] of Object.entries(files))
    if (name.endsWith(".html"))
      assert.doesNotMatch(
        html,
        /undefined|invite-your-team|troubleshooting|Sample article|example content/,
        name,
      );
  assert.match(files["index.html"], /href="\.\/search\.html">Search articles/);
  assert.match(files["index.html"], /<span>1 article<\/span>/);
  assert.match(
    files["articles/install.html"],
    /<time datetime="2026-10-01">October 1, 2026<\/time>/,
  );
  assert.match(files["articles/install.html"], /Keep exploring/);
  assert.doesNotMatch(files["articles/pay.html"], /Keep exploring/);
});
test("ships images from content/images that articles reference", (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), "compass-content-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  mkdirSync(path.join(dir, "images", "setup"), { recursive: true });
  writeFileSync(path.join(dir, "images", "setup", "install screen.png"), png);
  writeFileSync(path.join(dir, "images", "diagram#1.png"), png);
  writeFileSync(path.join(dir, "images", "__proto__"), png);
  writeFileSync(path.join(dir, "images", ".DS_Store"), "");
  // A folder link back to images/ must not loop or be copied.
  symlinkSync(
    path.join(dir, "images"),
    path.join(dir, "images", "setup", "loop"),
    "junction",
  );
  writeFileSync(
    path.join(dir, "categories.json"),
    JSON.stringify(own.categories),
  );
  writeFileSync(
    path.join(dir, "articles.json"),
    JSON.stringify([
      article("install", "setup", {
        sections: [
          {
            id: "section-1",
            title: "Steps",
            html: '<p><img src="../images/setup/install%20screen.png" alt="The install screen"><img src="../images/diagram%231.png" alt="Diagram"><img src="../images/__proto__" alt="Odd name"></p>',
          },
        ],
      }),
      ...own.articles.slice(1),
    ]),
  );
  const content = loadContent(dir),
    files = buildFiles({}, content);
  assert.deepEqual(files["images/setup/install screen.png"], png);
  assert.deepEqual(files["images/diagram#1.png"], png);
  assert.deepEqual(files["images/__proto__"], png);
  assert.deepEqual(
    Object.keys(files)
      .filter((f) => f.startsWith("images/"))
      .sort(),
    [
      "images/__proto__",
      "images/diagram#1.png",
      "images/setup/install screen.png",
    ],
  );
  assertLinksResolve(files);
  assert.throws(
    () => assertLinksResolve(buildFiles({}, { ...content, images: {} })),
    /articles\/install\.html links to missing images\/setup\/install screen\.png/,
  );
});
test("home page Popular links follow the popular flags in your content", () => {
  const home = (list) =>
    buildFiles({}, { ...own, articles: list })["index.html"];
  const links = (html, from, to) =>
    [
      ...html
        .split(from)[1]
        .split(to)[0]
        .matchAll(/href="([^"]+)"/g),
    ].map((m) => m[1]);
  const flagged = home([
    own.articles[0],
    own.articles[1],
    { ...own.articles[2], popular: "Pay an invoice" },
  ]);
  assert.match(
    flagged,
    /Popular: <a href="\.\/articles\/pay\.html">Pay an invoice<\/a><\/div>/,
  );
  assert.deepEqual(links(flagged, "A good place to start", "</section>"), [
    "./articles/install.html",
    "./articles/pay.html",
    "./articles/configure.html",
  ]);
  const unflagged = home(own.articles);
  assert.deepEqual(links(unflagged, "Popular:", "</div>"), [
    "./articles/install.html",
    "./articles/configure.html",
  ]);
  assert.match(unflagged, />Title configure<\/a><\/div>/);
  const single = home([own.articles[0]]);
  assert.deepEqual(links(single, "A good place to start", "</section>"), [
    "./articles/install.html",
  ]);
});
test("explains content mistakes instead of building broken pages", () => {
  const build = (list) => () => buildFiles({}, { ...own, articles: list });
  assert.throws(
    build([article("lost", "nowhere")]),
    /article "lost" uses category "nowhere", which is not an id in content\/categories\.json/,
  );
  assert.throws(build([article("../escape", "setup")]), /slug "\.\.\/escape"/);
  assert.throws(
    build([article("twice", "setup"), article("twice", "billing")]),
    /slug "twice" must be unique/,
  );
});
test("escapes brand text and structured data", () => {
  const files = buildFiles({ brand: "</script><img src=x onerror=alert(1)>" });
  assert.ok(!files["index.html"].includes("<img src=x"));
  assert.ok(
    !files[`articles/${articles[0].slug}.html`].includes("</script><img"),
  );
});
test("rejects unsafe URL schemes and unknown themes", () => {
  const c = normalizeConfig({
    siteUrl: "javascript:alert(1)",
    websiteUrl: "data:text/html,bad",
    accent: "red;evil",
    mode: "unknown",
  });
  assert.equal(c.siteUrl, "");
  assert.equal(c.websiteUrl, "");
  assert.equal(c.accent, "pine");
  assert.equal(c.mode, "light");
});
test("uses the requested appearance and only real canonical URLs", () => {
  const files = buildFiles({
    brand: "Orbit",
    mode: "dark",
    accent: "ocean",
    siteUrl: "https://help.example.com",
  });
  assert.match(files["index.html"], /data-theme="dark" data-accent="ocean"/);
  assert.ok(
    files["sitemap.xml"].includes(
      `https://help.example.com/articles/${articles[0].slug}.html`,
    ),
  );
  assert.equal(buildFiles()["sitemap.xml"], undefined);
});
