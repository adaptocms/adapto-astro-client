# 🚀 Adapto Astro Client

A multi-language, CMS-integrated Astro project. This client uses a **Hybrid Routing Architecture** to balance automated dynamic content with high-polish, custom-designed collections.

## 📂 Project Structure

```text
/
├── src/
│   ├── components/       # UI Components (Pagination, DynamicFieldRenderer)
│   ├── utils/            # Shared logic (buildTranslationMap, link builders)
│   ├── content.config.ts # Zod Schemas & CUSTOM_COLLECTIONS registry
│   └── pages/
│       └── [...lang]/    # Optional language prefix ([...lang] matches / or /ro)
│           ├── index.astro       # Homepage
│           ├── articles/         # [RESERVED] Dedicated Blog/News system
│           │   ├── [...page].astro
│           │   └── [slug].astro
│           ├── showcase/         # [CUSTOM] Manual UI Collection
│           │   ├── [...page].astro
│           │   └── [slug].astro
│           ├── [collection_slug]/ # [DYNAMIC] Fallback for all other collections
│           │   ├── [...page].astro
│           │   └── [item_slug].astro
└── CUSTOM_COLLECTIONS.md # (Optional) Detailed manual collection guide

```

---

## 🛣️ Routing & Priority

Astro uses a file-based routing system. To prevent conflicts, it is important to understand the **Order of Priority**:

1. **Static Folders:** Any folder named explicitly (like `/articles/` or `/showcase/`) takes **highest priority**.
2. **Dynamic Parameters:** `[collection_slug]` acts as a catch-all.
3. **Rest Parameters:** `[...lang]` or `[...page]` are evaluated last.

---

## 🛠️ Custom Collections

### What are they?

Custom Collections are CMS collections that require a **bespoke UI**. While the system can render any collection automatically, "Custom" ones are intercepted to provide unique layouts (e.g., a "Showcase" with technical sidebars or a "Portfolio" with galleries).

### How to create one:

1. **Registry:** Open `src/content.config.ts`. Add the collection to the `CUSTOM_COLLECTIONS` array.
```typescript
export const CUSTOM_COLLECTIONS = [
  { id: "uuid-from-cms", name: "Showcase", slug: "showcase" }
];

```


2. **Exclusion:** The dynamic route `[collection_slug]` automatically filters out any slug found in this array.
3. **Manual Page:** Create a folder in `src/pages/[...lang]/` named after your slug (e.g., `showcase/`).
4. **Implementation:** Build your `[...page].astro` (listing) and `[slug].astro` (detail) files within that folder.

### ⚠️ The "Articles" Rule

**Do not add `articles` to the `CUSTOM_COLLECTIONS` array.** `articles` is a reserved system collection with its own predefined directory and logic. Adding it to the custom array will cause filtering logic to fail.

---

## 🧞 Common Developer Commands

| Command | Action |
| --- | --- |
| `npm install` | Installs all project dependencies. |
| `npm run dev` | Starts local development server at `http://localhost:4321`. |
| `npm run build` | Bundles the site into the `dist/` folder for production. |
| `npm run preview` | Locally previews the production build. |

---

## 🌍 Localization & Paths

The project supports an optional default language.

* **Default Language (e.g., EN):** Accessible at `/showcase` or `/articles`.
* **Other Languages (e.g., RO):** Accessible at `/ro/showcase` or `/ro/articles`.

