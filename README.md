git # ContentIo

ContentIo is a Next.js app for turning screenshots and code into polished, social-ready visuals. The current build includes a branded landing page, a live editor workspace, a MongoDB-backed design API, and a light/dark theme system with the custom favicon used across the UI.

## What Is Already Built

- Landing page with hero, feature cards, workflow, testimonials, FAQ, CTA, and footer.
- Editor workspace with code editing, screenshot handling, live preview, style controls, and export.
- Light and dark mode support with theme persistence in `localStorage`.
- Custom favicon branding used in the navbar, hero, CTA buttons, footer, and editor header.
- MongoDB-backed design storage through the API route and Mongoose model.
- Code support for JavaScript, TypeScript, Python, Bash, Java, and C++.

## Where To Edit Things

If you want to change a specific part of the app, start with the file listed here.

| What you want to change | Edit these files |
| --- | --- |
| Home page text, hero layout, feature cards, FAQ, testimonials, footer | [components/LandingPage.tsx](components/LandingPage.tsx), [app/page.tsx](app/page.tsx) |
| Top navigation, logo, theme toggle, mobile menu | [components/Navbar.tsx](components/Navbar.tsx) |
| Editor layout, header, preview surface, save/export flow | [components/EditorStudio.tsx](components/EditorStudio.tsx), [app/editor/page.tsx](app/editor/page.tsx) |
| Code editor syntax highlighting, language switching, theme sync | [components/CodeEditor.tsx](components/CodeEditor.tsx) |
| Style controls such as padding, background, layout, aspect ratio | [components/StyleControls.tsx](components/StyleControls.tsx) |
| Screenshot upload and drag-and-drop handling | [components/UploadBox.tsx](components/UploadBox.tsx) |
| Export/download button behavior | [components/ExportButton.tsx](components/ExportButton.tsx) |
| Small preview cards and gallery-style thumbnail UI | [components/PreviewCard.tsx](components/PreviewCard.tsx) |
| Design save/load API | [app/api/designs/route.ts](app/api/designs/route.ts) |
| MongoDB connection | [lib/mongodb.ts](lib/mongodb.ts) |
| Design schema/model | [lib/models/Design.ts](lib/models/Design.ts) |
| Global theme colors, dark-mode overrides, page background | [app/globals.css](app/globals.css) |
| Metadata, icons, and app shell | [app/layout.tsx](app/layout.tsx) |

## How The App Fits Together

### 1. Landing Page

The root route is [app/page.tsx](app/page.tsx), which renders [components/LandingPage.tsx](components/LandingPage.tsx).

Use this page when you want to:

- Rewrite the marketing copy.
- Change the first impression of the product.
- Add or remove feature cards.
- Update the screenshot demo block.
- Change CTA buttons such as `Open Editor`.
- Edit the FAQ, testimonials, support section, or footer.

If you want a new visual section on the homepage, add it inside `components/LandingPage.tsx` and keep the page-level container styles consistent with `app/globals.css`.

### 2. Navbar And Branding

[components/Navbar.tsx](components/Navbar.tsx) controls:

- The logo and favicon image.
- The top announcement bar.
- The light/dark toggle.
- Desktop navigation links.
- Mobile navigation.
- Signed-in / signed-out actions.

If you want to change the logo, replace the favicon image, or adjust theme behavior, this is the first file to edit.

### 3. Editor Workspace

[app/editor/page.tsx](app/editor/page.tsx) renders [components/EditorStudio.tsx](components/EditorStudio.tsx), which is the main product surface.

Use this file when you want to change:

- The editor header.
- The back button and editor branding.
- The main editor layout.
- Export/download behavior.
- Theme switching inside the editor.
- Code-versus-screenshot workflow.

### 4. Code Editing

[components/CodeEditor.tsx](components/CodeEditor.tsx) is responsible for code rendering and syntax highlighting.

If you want to:

- Add a new programming language.
- Change syntax theme colors.
- Adjust line-number styling.
- Modify how code is synced with the preview.

start here.

### 5. Screenshot Upload And Preview

These files work together for the screenshot UI:

- [components/UploadBox.tsx](components/UploadBox.tsx) handles upload and drag-and-drop.
- [components/PreviewCard.tsx](components/PreviewCard.tsx) controls preview tile presentation.
- [components/EditorStudio.tsx](components/EditorStudio.tsx) wires the upload and preview flow into the editor.

If you want to improve screenshot handling, change the upload box first, then update the preview and editor wiring.

### 6. Styling And Theme

[app/globals.css](app/globals.css) defines:

- Global background and foreground colors.
- The dark-mode variant binding.
- Theme-specific overrides.
- The page backdrop and vignette behavior.

If the app starts looking dark in light mode or the contrast feels wrong, this is the file to check first.

### 7. Data And API

The save/load flow is:

`EditorStudio` -> [app/api/designs/route.ts](app/api/designs/route.ts) -> [lib/models/Design.ts](lib/models/Design.ts) -> [lib/mongodb.ts](lib/mongodb.ts)

Use these files when you want to:

- Persist new editor fields.
- Add a new design property.
- Change how designs are fetched or saved.
- Add validation for editor content.

If you add a new editor control, usually you need to update all three layers:

1. UI control in `components/StyleControls.tsx` or `components/EditorStudio.tsx`.
2. Data schema in `lib/models/Design.ts`.
3. API handling in `app/api/designs/route.ts`.

## How To Integrate A New Feature

Use this as the practical workflow.

### Add A New UI Control

1. Add the control in [components/StyleControls.tsx](components/StyleControls.tsx) or [components/EditorStudio.tsx](components/EditorStudio.tsx).
2. Store the state in `EditorStudio`.
3. Pass the value into the preview, code editor, or export flow.
4. If the value should be saved, update the API and model.

### Add A New Screenshot Feature

1. Update [components/UploadBox.tsx](components/UploadBox.tsx) if the upload behavior changes.
2. Update [components/PreviewCard.tsx](components/PreviewCard.tsx) if the thumbnail or card UI changes.
3. Update [components/EditorStudio.tsx](components/EditorStudio.tsx) so the new option affects the live preview.
4. Update [app/api/designs/route.ts](app/api/designs/route.ts) and [lib/models/Design.ts](lib/models/Design.ts) if the new feature must be stored.

### Add A New Code Language

1. Update the language list in [components/EditorStudio.tsx](components/EditorStudio.tsx).
2. Add or adjust syntax highlighting in [components/CodeEditor.tsx](components/CodeEditor.tsx).
3. Update starter content or defaults if needed.
4. Verify the export preview still renders correctly.

### Add A New Export Format

1. Update [components/ExportButton.tsx](components/ExportButton.tsx).
2. Update the capture logic in [components/EditorStudio.tsx](components/EditorStudio.tsx).
3. If the output needs metadata or persistence, update the API/model too.

### Change The Branding Or Logo

1. Update the favicon asset in the app assets folder.
2. Update [components/Navbar.tsx](components/Navbar.tsx).
3. Update [components/LandingPage.tsx](components/LandingPage.tsx).
4. Update [components/EditorStudio.tsx](components/EditorStudio.tsx).
5. Update [app/layout.tsx](app/layout.tsx) if metadata icons should change too.

## Screenshot UI Work Done So Far

The screenshot UI is already set up with these pieces:

- A landing-page screenshot demo block that shows the product visually.
- A screenshot upload path in the editor.
- A preview surface that reflects style changes live.
- A code/screenshot positioning that makes the product about both inputs, not screenshots only.
- A branded favicon used throughout the interface.
- Working light and dark mode styling so the screenshot UI stays readable in both themes.

## Current Routes

- `/` -> landing page
- `/editor` -> editor workspace
- `/sign-in` and `/sign-up` -> Clerk auth pages
- `/api/designs` -> design CRUD API

## Local Development

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000` by default.

If MongoDB is not configured, editor save/load features will not work correctly. Check [lib/mongodb.ts](lib/mongodb.ts) and your environment variables before testing persistence.

## Quick Editing Guide

- Want to change homepage wording? Edit [components/LandingPage.tsx](components/LandingPage.tsx).
- Want to change the top bar or favicon? Edit [components/Navbar.tsx](components/Navbar.tsx).
- Want to change the editor? Edit [components/EditorStudio.tsx](components/EditorStudio.tsx).
- Want to change screenshot upload? Edit [components/UploadBox.tsx](components/UploadBox.tsx).
- Want to change export behavior? Edit [components/ExportButton.tsx](components/ExportButton.tsx).
- Want to change saved data? Edit [lib/models/Design.ts](lib/models/Design.ts) and [app/api/designs/route.ts](app/api/designs/route.ts).

## Notes

- The homepage now emphasizes both screenshots and code.
- The favicon is used as the brand image in the navbar and call-to-action areas.
- The app uses a custom dark-mode class together with `data-theme` so light mode stays white and dark mode stays dark.
