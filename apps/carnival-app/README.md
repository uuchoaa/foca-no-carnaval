# Carnival App - Foca no Carnaval

A fully functional React prototype for browsing carnival events in Recife and Olinda.

## Features

- **Blocos Home**: Browse and search carnival blocks with filters
- **Shows Home**: Browse and search stage performances with filters
- **Event Details**: Adaptive detailed view for both blocos and shows
- **Calendar**: Unified calendar view with event type filtering
- **Map**: Placeholder map view (coming soon)
- **Favorites**: Save and organize your favorite events

## Tech Stack

- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **date-fns** for date formatting
- **react-big-calendar** for calendar view
- **lucide-react** for icons
- **localStorage** for favorites persistence

## Project Structure

```
src/
├── data/
│   ├── blocos.json       # 16 blocos with concentration/departure times
│   └── shows.json        # 18 shows with artist info
├── contexts/
│   ├── EventsContext.jsx # Manages blocos & shows, filtering, search
│   └── FavoritesContext.jsx # localStorage-backed favorites
├── screens/
│   ├── BlocosHomeScreen.jsx
│   ├── ShowsHomeScreen.jsx
│   ├── EventDetailScreen.jsx # Adaptive layout
│   ├── CalendarScreen.jsx
│   ├── MapScreen.jsx
│   └── FavoritesScreen.jsx
├── components/
│   ├── BlocoCard.jsx
│   ├── ShowCard.jsx
│   ├── BlocoFilterPanel.jsx
│   ├── ShowFilterPanel.jsx
│   ├── SearchBar.jsx      # Debounced search
│   └── Navigation.jsx     # Bottom tab navigation
└── utils/
    └── dateHelpers.js
```

## Schema

### Blocos
```json
{
  "id": "string",
  "eventType": "bloco",
  "name": "string",
  "date": "YYYY-MM-DD",
  "concentration": { "time": "HH:MM", "dateTime": "ISO" },
  "departure": { "time": "HH:MM", "dateTime": "ISO" },
  "city": "recife" | "olinda",
  "location": { "venue": "string", "address": "string", "raw": "string" },
  "artist": "string?",
  "tags": ["string"],
  "isFree": boolean,
  "sources": [{ "id": "string", "originalId": "string", "url": "string" }]
}
```

### Shows
```json
{
  "id": "string",
  "eventType": "show",
  "name": "string",
  "date": "YYYY-MM-DD",
  "showTime": "HH:MM",
  "dateTime": "ISO",
  "artist": "string",
  "artistOrigin": "string",
  "pole": "string",
  "city": "recife" | "olinda",
  "location": { "venue": "string", "address": "string", "raw": "string" },
  "tags": ["string"],
  "isFree": boolean,
  "sources": [{ "id": "string", "originalId": "string", "url": "string" }]
}
```

## Running

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Design Highlights

- **Carnival-themed colors**: Orange, purple, yellow gradients
- **Adaptive UI**: Different layouts for blocos vs shows
- **Smooth transitions**: All interactions have polish
- **Empty states**: Clear messaging when no results
- **Mobile-first**: Responsive design with bottom navigation
- **Type-specific filters**: Blocos (has artist) vs Shows (pole, origin)

## Navigation

- 🏠 **Blocos** - Street carnival blocks
- 🎤 **Shows** - Stage performances  
- 📅 **Agenda** - Calendar view (unified)
- 🗺️ **Mapa** - Map view (placeholder)
- ❤️ **Favoritos** - Saved events (unified)
