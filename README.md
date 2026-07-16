# 🚀 Adapto Astro Client

A multi-language, CMS-integrated Astro template powered by
[Adapto](https://adaptocms.com). It uses a **Hybrid Routing Architecture** to
balance automated dynamic content with high-polish, hand-built collection
pages.

## ⚡ Setup

1. Copy `.env.example` to `.env` and fill in your credentials:

```sh
ADAPTO_API_URL=https://public-api.adaptocms.com/v1
ADAPTO_API_KEY=your_api_key_here
```

2. `npm install`, then `npm run dev`.

## 📂 Project Structure

```text
/
├── settings.ts
├── src/
│   ├── lib/adapto.ts     # Configured adapto-client-sdk instance
│   ├── content.config.ts # Astro collections wired to SDK loaders & schemas
│   ├── content/loaders/
│   ├── components/       # UI components (Pagination, Microcopy, LanguageSwitch, …)
│   ├── utils/            # Shared logic (buildTranslationMap, link builders)
│   ├── types/            # Template-local types (languages)
│   └── pages/
│       └── [...lang]/    # Optional language prefix ([...lang] matches / or /ro)
│           ├── index.astro            # Homepage
│           ├── about.astro            # CMS page + microcopy example
│           ├── contact.astro          # CMS page + form example
│           ├── articles/              # Dedicated Blog/News system
│           │   ├── [slug].astro
│           │   ├── categories.astro
│           │   └── category/[category]/[...page].astro
│           ├── showcase/              # Hand-built collection example
│           │   ├── [...page].astro
│           │   └── [slug].astro
│           └── [collection_slug]/     # Fallback for all other collections
│               ├── [...page].astro
│               └── [item_slug].astro
```

---

## 🛣️ Routing & Priority

Astro uses a file-based routing system. To prevent conflicts, it is important
to understand the **Order of Priority**:

1. **Static Folders:** Any folder named explicitly (like `/articles/` or `/showcase/`) takes **highest priority**.
2. **Dynamic Parameters:** `[collection_slug]` acts as a catch-all.
3. **Rest Parameters:** `[...lang]` or `[...page]` are evaluated last.

---

## 🛠️ Bespoke Collection Pages

### What are they?

By default, every Custom Collection in your CMS renders automatically through
the dynamic `[collection_slug]` routes. A **bespoke** collection is one you
take over with hand-built pages — a unique layout, custom fields rendering,
galleries, sidebars. The `showcase/` directory is the worked example.

### How to create one:

1. **Registry:** Open `settings.ts` and add the collection's slug:

```typescript
export const BESPOKE_COLLECTION_SLUGS: string[] = ['showcase', 'portfolio'];
```

2. **Exclusion:** The dynamic `[collection_slug]` routes automatically skip
   every slug in this array.
3. **Manual Pages:** Create a folder in `src/pages/[...lang]/` named after the
   slug (e.g. `portfolio/`) with your own `[...page].astro` (listing) and
   `[slug].astro` (detail) files — copy `showcase/` as a starting point.

### ⚠️ The "Articles" Rule

**Do not add `articles` to `BESPOKE_COLLECTION_SLUGS`.** Articles are a
reserved system collection with their own predefined directory and logic.

---

## 🧞 Common Developer Commands

| Command           | Action                                                      |
| ----------------- | ----------------------------------------------------------- |
| `npm install`     | Installs all project dependencies.                          |
| `npm run dev`     | Starts local development server at `http://localhost:4321`. |
| `npm run build`   | Bundles the site into the `dist/` folder for production.    |
| `npm run preview` | Locally previews the production build.                      |

---

## ✅ Verifying changes

This template ships no test framework — changes are verified by exercising the
real behaviour before they're considered done:

1. `npm run build` succeeds — **including with blank `ADAPTO_API_URL`/`ADAPTO_API_KEY`**
   (a fresh, unconfigured project must build and render onboarding, not crash).
2. `npm run dev` boots **with** a valid key (the site renders).
3. `npm run dev` boots **without** a key (an onboarding page renders — no crash).
4. No dead links in nav/footer against an empty tenant.
5. Visual review of the changed surface (for styling: visible focus, sufficient
   contrast, semantic landmarks).

---

## 🌍 Localization & Paths

The project supports an optional default language.

- **Default Language (e.g., EN):** Accessible at `/showcase` or `/articles`.
- **Other Languages (e.g., RO):** Accessible at `/ro/showcase` or `/ro/articles`.
