# contentIo — Project Summary

## Current State

contentIo is a Next.js TypeScript app for turning screenshots and code into polished visual posts. The current build includes:

- A branded landing page with hero, feature cards, workflow, testimonials, FAQ, CTA, and footer.
- An editor workspace for code and screenshot-based content.
- Live preview and export flow.
- MongoDB-backed design storage.
- Light and dark mode support with the favicon used as the app brand image.

## Main Files

- [app/page.tsx](app/page.tsx) -> landing route.
- [app/editor/page.tsx](app/editor/page.tsx) -> editor route.
- [components/LandingPage.tsx](components/LandingPage.tsx) -> homepage UI.
- [components/Navbar.tsx](components/Navbar.tsx) -> top navigation, theme toggle, branding.
- [components/EditorStudio.tsx](components/EditorStudio.tsx) -> editor shell and live workflow.
- [components/CodeEditor.tsx](components/CodeEditor.tsx) -> code rendering and syntax highlighting.
- [components/StyleControls.tsx](components/StyleControls.tsx) -> style sliders and layout controls.
- [components/UploadBox.tsx](components/UploadBox.tsx) -> screenshot upload UI.
- [components/PreviewCard.tsx](components/PreviewCard.tsx) -> landing page thumbnail card.
- [components/ExportButton.tsx](components/ExportButton.tsx) -> export/download action.
- [app/api/designs/route.ts](app/api/designs/route.ts) -> design CRUD API.
- [lib/models/Design.ts](lib/models/Design.ts) -> stored design schema.
- [lib/mongodb.ts](lib/mongodb.ts) -> MongoDB connection helper.
- [app/globals.css](app/globals.css) -> global theme and light/dark styling.

## If You Want To Change Something

### Landing page copy or layout
Edit [components/LandingPage.tsx](components/LandingPage.tsx).

Use this file for hero text, feature cards, testimonials, FAQ, CTA text, and footer content.

### Navbar, logo, and theme behavior
Edit [components/Navbar.tsx](components/Navbar.tsx).

Use this file for the favicon image, top announcement bar, theme toggle, and responsive nav.

### Editor workspace
Edit [components/EditorStudio.tsx](components/EditorStudio.tsx).

Use this file for the editor shell, preview flow, export path, and light/dark sync.

### Code editor behavior
Edit [components/CodeEditor.tsx](components/CodeEditor.tsx).

Use this file if you want to add a language, change syntax styling, or adjust code rendering.

### Screenshot upload and preview
Edit [components/UploadBox.tsx](components/UploadBox.tsx) and [components/PreviewCard.tsx](components/PreviewCard.tsx).

Use these files when the screenshot path, upload interaction, or landing-card preview needs updates.

### Save/load or new editor fields
Edit [app/api/designs/route.ts](app/api/designs/route.ts) and [lib/models/Design.ts](lib/models/Design.ts).

If you add a new field in the editor, it usually needs API and model changes too.

### Global colors and light/dark mode
Edit [app/globals.css](app/globals.css) and [app/layout.tsx](app/layout.tsx).

Use these files for theme defaults, metadata, icons, and page-shell styling.

## How The Pieces Connect

1. The homepage lives in [app/page.tsx](app/page.tsx) and renders [components/LandingPage.tsx](components/LandingPage.tsx).
2. The editor route lives in [app/editor/page.tsx](app/editor/page.tsx) and renders [components/EditorStudio.tsx](components/EditorStudio.tsx).
3. The editor UI writes data to the API route in [app/api/designs/route.ts](app/api/designs/route.ts).
4. The API uses [lib/mongodb.ts](lib/mongodb.ts) and [lib/models/Design.ts](lib/models/Design.ts) to persist designs.
5. Theme and visual overrides are controlled by [app/globals.css](app/globals.css) plus the theme toggle logic in the navbar/editor.

## Screenshot UI Already Done

The screenshot-first part of the product is already present in the current build:

- Landing page demo block showing screenshot-style presentation.
- Upload box for bringing in screenshot assets.
- Live preview panel in the editor.
- Export/download action.
- Branding updated to the favicon image.
- Copy updated so the product is about screenshots and code, not screenshots only.

## Local Run

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

## Notes

- The project now uses a custom dark-mode class with `data-theme` so light mode stays white.
- The favicon image is used as the brand mark throughout the landing and editor UI.
- If you add a new feature, update the UI, the data model, and the API together.

Generated on: 2026-05-01
