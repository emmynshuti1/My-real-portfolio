# NSHUTI | Official Portfolio of Nshuti Emmanuel

Personal portfolio of **Nshuti Emmanuel**, an IT student and web developer based in Rubavu, Rwanda.

**Live site:** [NSHUTI — Official Portfolio](https://emmynshuti1.github.io/My-real-portfolio/)

## What's here

A single-page, dependency-free static site — just HTML, CSS and JavaScript, deployed with GitHub Pages.

| File | Purpose |
| --- | --- |
| `index.html` | Page markup, meta/OG tags and JSON-LD structured data |
| `style.css` | Design tokens, layout and components |
| `script.js` | Theme switching, navigation, scroll effects, project filtering, contact form |
| `manifest.webmanifest`, `service-worker.js` | Installable PWA metadata and offline app shell |
| `favicon.svg`, `favicon-192.png`, `pwa-icon-512.png` | Site and install icons |
| `sitemap.xml`, `robots.txt`, `BingSiteAuth.xml` | Search engine configuration |

## Features

- **Dark-first design** with a light theme toggle that remembers your choice
- **Responsive** from 320px up, with a proper mobile navigation panel
- **Accessible** — skip link, keyboard navigation, ARIA labels, visible focus rings, and full `prefers-reduced-motion` support
- **Scroll-spy navigation** with a reading-progress bar
- **Filterable projects** sourced from real GitHub repositories
- **Working contact form** with inline validation, loading and success states
- **Installable PWA** with a cached offline portfolio shell

## Contact form

The contact form validates the visitor's details and opens a prefilled email draft addressed to
`nshutiemmanuel860@gmail.com`. Visitors must review the draft and press Send in their email app.
If their device has no email handler configured, the form displays the address for manual email.

## Notes

- The hero photo is served locally in responsive 320px and 640px JPEG sizes to avoid a third-party
  dependency on the initial page load.
- `apex-website.png` is a real screenshot of the APEX project; other project covers use CSS
  artwork and can be swapped for screenshots by replacing the `.project-cover` block.

## Running locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

&copy; 2026 NSHUTI Emmanuel.
