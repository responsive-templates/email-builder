# Free Email Builder

A free, browser-based drag-and-drop HTML email builder with 20+ responsive templates and table-based HTML export. No signup required.

Live site (GitHub Pages): **https://responsive-templates.github.io/email-builder/**

## Features

- **3-Column Visual Editor**:
  - **Left**: Drag & drop or click-to-add blocks (`Header`, `Heading`, `Text`, `Image / Logo`, `Button`, `2 Columns`, `3 Columns`, `Divider`, `Spacer`, `Social Icons`, `Footer`).
  - **Center**: Interactive email canvas with inline text editing, drag-and-drop block reordering, duplicate/delete/move controls, Desktop (600px) / Mobile (375px) viewport toggle, and 50-step Undo/Redo.
  - **Right**: Block property inspector (typography, colors, padding, alignment, links, images) and global Email Settings (subject, preheader, canvas/body background, content width, font family).
- **Email-Client-Safe HTML Export**:
  - Compiles to XHTML 1.0 Transitional table layouts (`role="presentation"`, `cellpadding="0"`, `cellspacing="0"`), inline CSS, MSO conditional comments for Outlook, and responsive `@media` queries for mobile stacking.
- **20 Ready-to-Use JSON Templates**:
  - Covers 7 categories: Newsletter, Welcome Email, Promotional Email, Black Friday / Sale, Ecommerce, Transactional Email, and Event Invitation.
  - Every template has a dedicated preview & SEO page with one-click **Edit This Template**.
- **Local Persistence & JSON Portability**:
  - Auto-saves active projects to `localStorage`, with Export JSON, Import JSON, Copy HTML, Download `.html`, and Reset / New Email.

## Local Development

```bash
npm install
npm run dev
```

## Testing & Production Build

```bash
npm test
npm run build
```

The build outputs static pre-rendered SEO pages, `sitemap.xml`, and `robots.txt` into `dist/` and deploys automatically via GitHub Actions on push to `main`.

## License

MIT
