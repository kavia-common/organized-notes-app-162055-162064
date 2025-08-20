# Organized Notes - Angular Frontend

A modern, minimalistic notes app built with Angular 19. Features:
- Create, edit, delete notes
- Organize by category and tags
- Search across title/content/category/tags
- Responsive UI with top navbar, sidebar, and right-side editor drawer
- Light theme using Primary #1976d2, Accent #ffd600, Secondary #424242

## Development server

Install dependencies and start:

```bash
npm i
npm start
```

Open `http://localhost:3000/` (port configured in angular.json).

## Usage

- New Note: Use "+ New Note" button in the top bar.
- Filter by Category/Tag: Use the left sidebar; "Clear filters" resets.
- Search: Use the search field in the top bar.
- Edit: Click a note to open the editor drawer; Save/Close/Delete actions available.

Notes are stored locally in your browser (localStorage). No backend required.

## Build

```bash
npm run build
```

Artifacts will be in `dist/angular`.

## Tests

```bash
npm test
```

## Tech

- Angular 19 Standalone APIs
- Signals for state and computed filters
- LocalStorage persistence