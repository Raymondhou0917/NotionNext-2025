# Upstream Upgrade Roadmap

## Current State

- Local fork base: `4.8.1`
- Upstream stable tag observed: `4.9.3`
- Local Next.js: `13.5.6`
- Upstream Next.js: `14.2.30`

This is a meaningful gap. Do not jump straight to a full merge without staging.

## Why Upgrade

The upstream changes most relevant to this project are:

- Notion API compatibility fixes
- build fixes
- search/slug defensive fixes
- image format compatibility fixes
- general SmartLink and link-handling improvements

## Recommended Phases

## Phase 1: Stabilize Current Fork

Goal:

- keep current theme and custom behavior,
- ensure Zeabur build stays green,
- avoid SEO regressions.

Tasks:

- keep the current deployment fixes
- clean working tree noise from generated folders
- verify Zeabur env and port handling

Success criteria:

- `npm run build` passes locally
- Zeabur deploy succeeds

## Phase 2: Backport Only Low-Risk Fixes

Cherry-pick or manually port:

- Notion API compatibility patches
- search slug defensive fixes
- image URL compatibility fixes
- build-only fixes

Do not port yet:

- theme-wide refactors
- large TypeScript reorganizations
- broad SmartLink migrations across all themes unless needed

Success criteria:

- same theme output
- no content rendering regression
- valid sitemap generation

## Phase 3: Upgrade Runtime Stack

Target:

- Next.js 14.x
- dependency refresh close to upstream 4.9.x

Risks:

- Clerk-related breakage
- middleware/runtime behavior changes
- subtle theme rendering differences

Mitigation:

- upgrade in a dedicated branch
- snapshot test key pages: home, archive, article, tag, category
- compare built HTML for SEO-critical tags

## Phase 4: Notion API Future-Proofing

Reason:

- Notion's older database query endpoint is deprecated in newer API versions

Action:

- isolate your Notion data layer before broad UI upgrades
- compare upstream fixes around `getNotionAPI`, `getSiteData`, and block fetching
- be ready to migrate to data source oriented access if the current client path breaks

## Merge Strategy

Recommended order:

1. create a dedicated branch from current main
2. diff local custom files against upstream
3. classify files into:
   - local business customization
   - safe upstream sync targets
   - high-risk conflict areas
4. merge or port in batches

High-risk local files:

- `blog.config.js`
- `components/SEO.js`
- `lib/sitemap.xml.js`
- `lib/notion/mapImage.js`
- theme files under `themes/hexo`

## Practical Next Batch

The next concrete upgrade batch should focus on:

- `package.json`
- Notion API integration files
- image mapping
- search defensiveness
- build fixes only

This keeps the scope small enough to verify on Zeabur.
