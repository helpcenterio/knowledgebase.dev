# Knowledge base launch checklist

Use this as a release checklist. Assign one person to each section and record evidence, not just a checkmark. A static template publishes public files: never put internal or customer-specific information in it.

## 1. Pick the first useful scope
- [ ] Review recent support conversations and group repeated customer tasks.
- [ ] Pick the questions that block onboarding, payment, or a core workflow.
- [ ] Record article owner, evidence, priority, and review date in content-audit.csv.
- [ ] Choose 4–7 task-based categories in the words customers use.
- [ ] Keep a clear route to a human when the content does not resolve the issue.

## 2. Make each article trustworthy
- [ ] Start with a direct answer that includes relevant plan, role, or regional limits.
- [ ] Verify every step using an account with the target customer's permissions.
- [ ] Use the actual labels in your product.
- [ ] Include an observable success state and a safe failure path.
- [ ] Check billing and policy statements with their owner.
- [ ] Replace every sample company, example instruction, date, and placeholder.
- [ ] Remove passwords, tokens, personal data, and private screenshots.

## 3. Test the reader's experience
- [ ] Search for the ten most common customer phrases; open each top result.
- [ ] Test a query with no results and check the recovery route.
- [ ] Navigate home → topic → article → related article with the keyboard.
- [ ] Test at a narrow phone width and at 200% browser zoom.
- [ ] Check focus outlines, link text, and color contrast in both themes.
- [ ] Check contact links reach the right team.
- [ ] Open the site with JavaScript disabled; navigation and articles must still work.

## 4. Prepare search and AI discovery
- [ ] Set your real canonical site URL and regenerate the sitemap.
- [ ] Verify published pages return HTTP 200 and missing URLs return 404.
- [ ] Keep article text in the HTML response, not behind a client-only renderer.
- [ ] Keep structured data consistent with visible content.
- [ ] Link related articles and remove broken links.
- [ ] Submit the sitemap in your search engine webmaster tools.
- [ ] Review robots directives; a robots rule is not access control.
- [ ] Test your AI assistant against a small set of known questions and exceptions.

## 5. Migrate and launch
- [ ] Map every old public URL to a new destination in redirect-map.csv.
- [ ] Export articles, images, categories, and translations before switching.
- [ ] Keep old hosting and exports until the cutover is verified.
- [ ] Implement permanent redirects on the web server; the CSV is only a plan.
- [ ] Check HTTPS and redirects on the real domain.
- [ ] Check image and download URLs after publishing.
- [ ] Re-crawl the old URL list and confirm each final destination.

## 6. Keep it useful
- [ ] Schedule a monthly review of unanswered searches and support escalations.
- [ ] Record a baseline before claiming ticket reduction or self-service resolution.
- [ ] Review high-risk policy and billing content when its source changes.
- [ ] Track translations that need updating in translation-tracker.csv.
- [ ] Assign a backup owner before handing the help center to another team.
