# SEO Content Strategy

## Goal

This site should not behave as a pure mirror of `raymondhouch.com`.
Its best role is a curated archive site that:

- preserves older newsletters and selected social posts,
- gives them a stable home,
- selectively earns search visibility,
- links readers into `raymondhouch.com` and `lifehacker.tw`.

## Core Decision

Do not use one global SEO rule for every page.

- High-value archive pages: `index,follow`
- Thin archive pages or utility pages: `noindex,follow`
- Search, auth, dashboard pages: `noindex,follow`

## What Should Be Indexed

Index these pages:

- Newsletter issues with a unique title and summary
- Curated social posts with added framing, commentary, or takeaway
- Evergreen topic pages that group multiple past posts
- Archive posts that contain at least one meaningful contextual link back to the main sites

Do not index these pages:

- Search result pages
- Auth, sign-in, sign-up, dashboard pages
- Thin content pages with only a short quote or repost
- Duplicate pages that add no editorial value

## Recommended Content Rules

For every indexable article:

- Keep a stable `slug`
- Write a unique `summary`
- Add one clear topic/category
- Add 2-5 tags
- Add 1-3 contextual links to `raymondhouch.com` or `lifehacker.tw`
- Add a short editor note if the source was originally a Facebook post

## Canonical Rule

Default rule:

- Indexable archive content should use self-canonical

Exception:

- Use canonical-to-main only when a page is effectively a duplicate of a main-site article

The repo now supports:

- global mode with `NEXT_PUBLIC_SEO_CANONICAL_MODE=self|main`
- per-post override with `post.ext.canonical_mode`

## Per-Post Notion Controls

Use `ext` JSON for page-level control.

Examples:

```json
{"noindex": true}
```

```json
{"canonical_mode": "main"}
```

```json
{"noindex": false, "canonical_mode": "self"}
```

## Linking Strategy

Treat this site as a top-of-funnel archive, not the final conversion destination.

Recommended outbound patterns:

- Newsletter archive -> related long-form article on `raymondhouch.com`
- Social post archive -> related toolkit/course page on `lifehacker.tw`
- Topic collections -> one primary CTA and one secondary reading link

Avoid:

- sitewide footer stuffing
- repetitive exact-match anchors
- unrelated forced links

## Current Reality Check

As of the latest local build:

- the site builds successfully,
- sitemap generation works,
- but current content data still produces `0` valid article URLs in sitemap stats.

This means the immediate blocker is content hygiene, not crawler configuration.

## Execution Order

1. Fix Notion content fields so archive posts generate valid `slug` and `href`
2. Mark thin/duplicate posts as `noindex`
3. Keep only high-value archive posts indexable
4. Add contextual links back to main sites
5. Re-submit sitemap after valid posts appear
