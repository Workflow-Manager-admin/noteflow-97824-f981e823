# NoteFlow Frontend (notes_frontend)

A responsive web app for taking, editing, and organizing notes. Built with [Vue 3](https://vuejs.org/), [Pinia](https://pinia.vuejs.org/) for state management, and [Vite](https://vite.dev/) for the build tool. This app communicates with the NoteFlow backend via REST APIs.

---

## Features

- **Create, edit, and delete notes**
- **Rich text editing** (using TipTap)
- **Organize notes** by custom folder/category
- **Live search and filter**
- **Responsive design** for desktop and mobile
- **Modern, minimalist UI**

---

## Setup & Usage

### Requirements

- Node.js (v18+ recommended)
- npm

### Installation

```bash
cd notes_frontend
npm install
```

### Development mode (hot reload)

```bash
npm run dev
```

Visit: `http://localhost:3000/`

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint and format

```bash
npm run lint
npm run format
```

### Run unit tests

```bash
npm run test:unit
```

---

## Connecting to Backend

By default, the frontend expects the backend NoteFlow API to be available at `/api/notes`.  
To connect to a different backend URL, set the Vite environment variable:  

```
VITE_API_URL=http://localhost:3000/notes
```

You can do this by creating a `.env` file or running:

```bash
VITE_API_URL=http://localhost:3000/notes npm run dev
```

---

## Application Layout

- **Sidebar:** lists and filters notes; "New Note" button.
- **Main Panel:** view, edit, or create the active note.
- **Editor:** rich text with formatting, title, folder/category input.
- **Search:** live search on note title/content.

---

## Note Model (Frontend/Backend)

```ts
interface Note {
  id: string;
  title: string;
  content: string;
  organization?: string; // Folder/category (matches "folder" in backend)
  createdAt: string;
  updatedAt: string;
}
```
For detailed model, see backend docs.

---

## Example API Requests

_See backend documentation or [API docs](../notes_backend/README.md) for full details._  
Sample (assumes dev server defaults):

```ts
// Fetch all notes
await axios.get('/api/notes');

// Create
await axios.post('/api/notes', { title: "Sample", content: "<b>Test note</b>", organization: "Work" });
```

---

## Project Structure

- `src/`
  - `api/notes.ts` — API utility functions and type definitions
  - `stores/notes.ts` — Pinia store for note state
  - `views/` and `components/` — UI, editors, lists, search, etc.

---

## Screenshots

> _Add screenshots of the UI here (optional)_

---

## License

MIT or as otherwise specified.
