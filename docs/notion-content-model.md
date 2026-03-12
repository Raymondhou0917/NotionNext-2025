# Notion Content Model

## Purpose

This repo is only as good as the Notion data feeding it.
If posts do not produce valid `slug`, `summary`, and publish metadata, the site may build but still have almost no SEO value.

## Required Database Fields

These map to the current codebase configuration.

| Field | Type | Required | Purpose |
| --- | --- | --- | --- |
| `title` | Title/Text | Yes | article title |
| `type` | Select | Yes | `Post`, `Page`, `Menu`, `SubMenu`, `Notice` |
| `status` | Select | Yes | `Published` or `Invisible` |
| `slug` | Text | Yes for indexable posts | public URL |
| `summary` | Text | Yes for indexable posts | description/snippet |
| `category` | Select | Recommended | archive grouping |
| `tags` | Multi-select | Recommended | discovery and related posts |
| `date` | Date | Yes | publish date |
| `ext` | Text(JSON) | Optional but important | SEO and rendering overrides |

## Type Rules

- `Post`: normal archive article
- `Page`: standalone page
- `Menu` / `SubMenu`: navigation only, not article content
- `Notice`: announcement type, usually not part of the archive strategy

## Status Rules

- `Published`: public and routable
- `Invisible`: accessible only if needed, but should not be considered part of the core archive

## Slug Rules

Use slugs that are:

- human-readable
- permanent
- lowercase
- hyphenated
- unique

Recommended examples:

- `newsletter-087-ai-workflow`
- `fb-notion-dashboard-review`
- `weekly-review-2023-08-14`

Avoid:

- empty slug
- raw Notion ID
- dates only without topic context
- changing slugs after publishing

## Summary Rules

Every indexable post needs a summary that answers:

- what this piece is about
- why it matters
- who should read it

Target:

- 80-160 Chinese characters if possible

## ext JSON Rules

Use `ext` to store advanced behavior.

Recommended keys:

- `noindex`: boolean
- `canonical_mode`: `self` or `main`
- `source_platform`: `newsletter` or `facebook`
- `source_url`: original post URL if needed
- `money_page_url`: preferred CTA destination on main site

Example:

```json
{
  "source_platform": "facebook",
  "source_url": "https://facebook.com/...",
  "noindex": false,
  "canonical_mode": "self",
  "money_page_url": "https://raymondhouch.com/notion/"
}
```

## Content Grading Workflow

Use this before publishing old content into the archive:

### Grade A

- unique topic
- good summary
- meaningful value on its own
- can rank or earn links

Action:

- `Published`
- self-canonical
- indexable

### Grade B

- useful archive content
- mostly for brand/history/context

Action:

- `Published`
- choose self-canonical or main-canonical case by case

### Grade C

- thin repost
- duplicate
- short status update

Action:

- `Published` if you want it visible in archive
- set `ext.noindex = true`

## Editorial Checklist

Before making a post indexable:

- `title` is clean
- `slug` exists
- `summary` exists
- `date` is correct
- `type=Post`
- `status=Published`
- at least one relevant link back to `raymondhouch.com` or `lifehacker.tw`

## Immediate Cleanup Priority

1. find published posts missing slug
2. find published posts missing summary
3. review short social reposts and mark them `noindex`
4. enrich the best newsletter entries first
