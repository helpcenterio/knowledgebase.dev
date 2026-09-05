import test from "node:test";
import assert from "node:assert/strict";
import { buildFiles, normalizeConfig } from "../lib/template.mjs";
import path from "node:path";
test("builds every linked page and asset for offline use", () => {
  const files = buildFiles();
  assert.equal(
    Object.keys(files).filter((x) => x.endsWith(".html")).length,
    20,
  );
  for (const [name, html] of Object.entries(files)) {
    if (!name.endsWith(".html")) continue;
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const href = match[1];
      if (/^(https?:|mailto:)/.test(href)) continue;
      const target = path.posix.normalize(
        path.posix.join(path.posix.dirname(name), href.split("#")[0]),
      );
      assert.ok(files[target], `${name} links to missing ${target}`);
    }
  }
});
test("escapes brand text and structured data", () => {
  const files = buildFiles({ brand: "</script><img src=x onerror=alert(1)>" });
  assert.ok(!files["index.html"].includes("<img src=x"));
  assert.ok(
    !files["articles/create-your-workspace.html"].includes("</script><img"),
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
  assert.match(
    files["sitemap.xml"],
    /https:\/\/help.example.com\/articles\/invite-your-team.html/,
  );
  assert.equal(buildFiles()["sitemap.xml"], undefined);
});
