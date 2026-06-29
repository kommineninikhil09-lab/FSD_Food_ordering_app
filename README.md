# Amrit Palace — Online Food Ordering Application

A responsive front-end for an online food ordering application, built with HTML, CSS, and vanilla JavaScript (Bootstrap-style responsive grid implemented in plain CSS). Visual language follows the Amrit Palace style guide: candlelit dark sections, warm sand/cream surfaces, a single copper accent, and a whisper-weight serif paired with a geometric sans.

## Features

- **Responsive layout** — dark hero, image-overlay section, light menu section, review carousel, contact section, all adapting to mobile/tablet/desktop.
- **Dynamic menu** — menu items are loaded via `fetch()` from `data/menu.json` (an AJAX-style call) without a page reload, with a fallback to embedded data if the request fails (e.g. when opening the file directly without a server).
- **Category filtering** — client-side filter buttons (Starters / Mains / Desserts / Beverages) re-render the grid instantly.
- **Cart** — add items, adjust quantities, running total, persisted to `localStorage`, slide-out drawer UI.
- **Form validation** — the reservation/order form validates name, email, phone, and message client-side with inline error messages before "submitting".

## Project structure

```
index.html        Markup for all sections
css/style.css      Design tokens and component styling
js/app.js          Menu fetch/render, cart logic, filters, form validation
data/menu.json      Menu data served via fetch (AJAX)
```

## Running locally

Because the menu is loaded with `fetch()`, serve the folder over HTTP rather than opening `index.html` directly (some browsers block `fetch` on the `file://` protocol):

```bash
# Option 1: Python
python3 -m http.server 8080

# Option 2: Node
npx serve .
```

Then open `http://localhost:8080`.

## Version control

This project is tracked with Git. Commit changes with descriptive messages and push to the remote repository to track development history.
