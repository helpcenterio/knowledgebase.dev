# Compass — the knowledge base launch kit

A polished, customizable HTML knowledge base for product teams and agencies. Built by [HelpCenter.io](https://helpcenter.io/?utm_source=knowledgebase.dev&utm_medium=referral&utm_campaign=compass-launch-kit&utm_content=readme-brand).

**[Customize & download](https://knowledgebase.dev/template/)** · **[Live demo](https://knowledgebase.dev/demo/)**

## What's included

- 20 ready-to-build pages: home, search, 6 topics, and 12 example articles.
- Working client-side full-text search with instant suggestions and a `/` shortcut.
- Three color palettes, light/dark mode, responsive layouts, keyboard focus states, and print styles.
- Article side navigation, table of contents, short answers, related articles, and optional canonical URLs / sitemap.
- Six editable Markdown article blueprints, a launch checklist, an agency handoff document, and CSVs for content audits, redirects, and translation reviews.
- No runtime dependencies, external fonts, trackers, account, or backend required.

The website download includes a ready-to-open `site/` folder plus all editable source and toolkit files. It works directly from `index.html` and can be hosted on any static host.

## Build from source

Requires Node.js 20 or newer. There is nothing to install.

```sh
git clone https://github.com/helpcenterio/knowledgebase.dev.git
cd knowledgebase.dev
npm run build
```

Open `dist/index.html`. Publish the **contents of `dist/`** to your static host. Do not publish the whole source checkout.

## Make it yours

1. Edit `config.json`: set `brand`, `accent` (`pine`, `ocean`, `violet`), `mode` (`light`, `dark`), `siteUrl`, `websiteUrl`, and `supportEmail`.
2. Replace the fictional product instructions in `content/articles.json` with verified content. Section HTML is trusted author content; do not load untrusted submissions into it.
3. Edit categories in `content/categories.json`. Match each article's category to a category ID.
4. Run `npm run build` again. Both the pages and search index regenerate together.
5. Work through `toolkit/launch-checklist.md` before publishing.

A blank support email shows a working troubleshooting link. Set a real address to enable “Contact support.” A blank site URL omits the sitemap and canonical links, so example domains cannot accidentally become your canonical URLs. Set the deployed URL and rebuild for production. The downloaded site uses relative `.html` links, including under subfolders. Dark-mode preference is saved locally in the reader's browser when storage is available.

## What this template does (and doesn't do)

This is a **public, English-language static site**, not a CMS. You maintain and publish its files. Search runs in the browser against bundled content; very large libraries may need a search service. There is no AI answer engine, access control, ticket inbox, analytics, email collection, or translation service. The translation CSV helps plan localization; it does not implement it. Redirect maps must be implemented on your host.

Need nontechnical editing, hosting with SSL, multilingual content, search analytics, and AI answers grounded in your articles? [Try HelpCenter.io](https://helpcenter.io/app/signup?preset=compass&utm_source=knowledgebase.dev&utm_medium=referral&utm_campaign=compass-launch-kit&utm_content=readme-trial). The kit's content and planning files are portable; it is not an importable HelpCenter.io theme or a Zendesk Guide theme.

## License

GPL-3.0-only. You may use and modify the template for commercial projects under the included license. If you distribute a modified version, preserve the license and provide the corresponding source under GPL-3.0. See [LICENSE](LICENSE). This repository retains the original project's license.

## Repository boundary

This public repository contains only the free template and toolkit. The knowledgebase.dev marketing website, lead collection endpoint, deployment configuration, and database integration live in a separate private repository. No credentials belong here.
