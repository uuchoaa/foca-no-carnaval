# WiseUI Design System

Domain-agnostic React component library providing primitives, compositions, layouts, and design tokens for building consistent carnival/event applications.

## Architecture

WiseUI follows a layered architecture:

```
tokens/      → Design tokens (colors, spacing, typography, gradients)
primitives/  → Low-level components (Button, Card, Input, Text, Badge, etc.)
compositions/→ Combined primitives (SearchBarWithIcon, ChipGroup, FilterPanel, etc.)
layouts/     → Page structure (Page, AppLayout, Navigation, CardGrid, etc.)
contexts/    → Shared context (WiseAppContext for nav & i18n)
```

## Installation

### 1. Add Dependency

In your app's `package.json`:

```json
{
  "dependencies": {
    "wise-ui": "*"
  }
}
```

Run `npm install` from monorepo root.

### 2. Configure Tailwind

In `tailwind.config.js`, include WiseUI source in content:

```js
const path = require('path');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    path.join(__dirname, '../../packages/wise-ui/src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        carnival: {
          yellow: '#FFD700',
          orange: '#FF8C00',
          purple: '#9370DB',
          pink: '#FF69B4',
          green: '#32CD32',
        },
      },
      fontFamily: {
        hero: ['Pacifico', 'cursive'],
        display: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

### 3. Install Peer Dependencies

```bash
npm install react react-dom clsx framer-motion lucide-react react-router-dom
```

## Usage

### Basic Import

```tsx
import {
  Page,
  Button,
  Card,
  Text,
  SearchBarWithIcon,
  DateChipRow,
  pageHeaderGradients,
} from 'wise-ui';
```

### Page Structure

Use `Page` as the root wrapper with `Page.Header` and `Page.Content`:

```tsx
import { Page, Text } from 'wise-ui';

function EventListScreen() {
  const events = []; // your data
  const isLoading = false;
  const isEmpty = events.length === 0;

  return (
    <Page>
      <Page.Header gradient="sunny">
        <Text variant="title">Eventos</Text>
        <Text variant="subtitle">{events.length} eventos encontrados</Text>
      </Page.Header>
      <Page.Content isLoading={isLoading} isEmpty={isEmpty}>
        {events.map((event) => (
          <Card key={event.id}>{event.name}</Card>
        ))}
      </Page.Content>
    </Page>
  );
}
```

**`Page.Header` Props:**
- `gradient`: `"sunny"` | `"haze"` | `"love"` (required)
- `children`: Content (title, subtitle, actions, etc.)

**`Page.Content` Props:**
- `isLoading`: Shows loading spinner when `true`
- `isEmpty`: Shows empty state when `true` and not loading
- `center`: Centers content vertically/horizontally
- `gap`: Spacing between children (`0` | `2` | `4` | `8` | `12` | `16` | `24` | `32`)

### Context Provider

Wrap your app with `WiseAppContext.Provider`:

```tsx
import { WiseAppContext } from 'wise-ui';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  const contextValue = {
    nav: {
      isActive: (path: string) => location.pathname === path,
    },
    copy: {
      filtros: 'Filtros',
      emptyTitle: 'Nenhum item encontrado',
      emptyDescription: 'Tente ajustar os filtros',
    },
  };

  return (
    <WiseAppContext.Provider value={contextValue}>
      {/* Your app */}
    </WiseAppContext.Provider>
  );
}
```

## Components

### Primitives

Low-level building blocks with minimal props and no business logic.

#### Button

```tsx
<Button variant="primary" size="md" onClick={() => {}}>
  Click me
</Button>
```

**Props:**
- `variant`: `"primary"` | `"secondary"` | `"ghost"` (default: `"primary"`)
- `size`: `"sm"` | `"md"` | `"lg"` (default: `"md"`)
- `className`: Additional Tailwind classes
- All standard button HTML attributes

#### Text

```tsx
<Text variant="title" color="primary">Hello World</Text>
```

**Props:**
- `variant`: `"hero"` | `"title"` | `"subtitle"` | `"body"` | `"small"` | `"chip"` | `"caption"`
- `color`: `"primary"` | `"muted"` | `"secondary"` | `"inverse"`

Renders semantic HTML based on variant (`h1`, `h2`, `p`, `span`).

#### Card

```tsx
<Card variant="default" interactive>
  <Text variant="body">Card content</Text>
</Card>
```

**Props:**
- `variant`: `"default"` | `"highlight"` | `"muted"`
- `interactive`: Adds hover shadow effect

#### Badge

```tsx
<Badge color="orange">New</Badge>
```

**Props:**
- `color`: `"orange"` | `"purple"` | `"blue"` | `"green"` | `"gray"`

#### Input

```tsx
<Input 
  value={query} 
  onChange={setQuery} 
  placeholder="Search..." 
/>
```

#### Checkbox

```tsx
<Checkbox 
  checked={isChecked} 
  onChange={setIsChecked} 
  label="Accept terms"
/>
```

#### Divider

```tsx
<Divider />
```

#### Show

Conditional rendering utility:

```tsx
<Show condition={isLoading} fallback={<Text>Not loading</Text>}>
  <LoadingSpinner />
</Show>
```

### Compositions

Higher-level components combining primitives.

#### SearchBarWithIcon

```tsx
import { Search, X } from 'lucide-react';

<SearchBarWithIcon
  icon={Search}
  clearIcon={X}
  value={query}
  onChange={setQuery}
  placeholder="Buscar eventos..."
/>
```

#### ChipGroup

```tsx
<ChipGroup
  label="Categorias"
  options={[
    { id: 'music', label: 'Música', color: 'orange' },
    { id: 'food', label: 'Gastronomia', color: 'purple' },
  ]}
  selectedIds={selectedCategories}
  onToggle={(id) => toggleCategory(id)}
/>
```

#### DateChipRow

```tsx
<DateChipRow
  items={[
    { id: '1', label: 'Segunda', active: true },
    { id: '2', label: 'Terça', active: false },
  ]}
  onSelect={(id) => setSelectedDate(id)}
/>
```

#### TabGroup

```tsx
<TabGroup
  tabs={[
    { id: 'all', label: 'Todos' },
    { id: 'favorites', label: 'Favoritos' },
  ]}
  activeTabId={activeTab}
  onChange={setActiveTab}
/>
```

#### FilterPanel

```tsx
<FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)}>
  <ChipGroup {...filterProps} />
</FilterPanel>
```

#### EmptyState

```tsx
import { Inbox } from 'lucide-react';

<EmptyState
  icon={<Inbox size={48} />}
  title="Nenhum evento"
  description="Não há eventos neste período"
/>
```

#### LoadingSpinner

```tsx
<LoadingSpinner />
```

#### SectionHeading

```tsx
<SectionHeading title="Próximos Eventos" />
```

#### BackButton

```tsx
<BackButton onClick={() => navigate(-1)} />
```

#### FavButton

```tsx
<FavButton isFavorite={isFav} onToggle={() => toggleFav()} />
```

#### ShareButton

```tsx
<ShareButton onShare={() => shareEvent()} />
```

#### InfoCard

```tsx
<InfoCard 
  icon={<MapPin />} 
  label="Local" 
  value="Praça Central"
/>
```

#### TimeInfo

```tsx
<TimeInfo startTime="14:00" endTime="18:00" />
```

#### IconLabel

```tsx
<IconLabel icon={Clock} label="2 horas" />
```

#### LocationText

```tsx
<LocationText location="Centro, Salvador" />
```

#### DescriptionText

```tsx
<DescriptionText text="Evento imperdível..." />
```

#### HeaderContent

```tsx
<HeaderContent 
  title="Carnaval 2026" 
  subtitle="Salvador, Bahia"
/>
```

#### Field

Form field wrapper with label and error:

```tsx
<Field label="Email" error={errors.email}>
  <Input value={email} onChange={setEmail} />
</Field>
```

#### CheckboxField

```tsx
<CheckboxField
  checked={agreeTerms}
  onChange={setAgreeTerms}
  label="Aceito os termos"
/>
```

#### TagList

```tsx
<TagList 
  tags={[
    { id: '1', label: 'Música', color: 'orange' },
    { id: '2', label: 'Dança', color: 'purple' },
  ]} 
/>
```

#### AnimatedContainer

Wrapper with framer-motion fade-in:

```tsx
<AnimatedContainer>
  <Card>Content</Card>
</AnimatedContainer>
```

#### ErrorMessage

```tsx
<ErrorMessage message="Erro ao carregar eventos" />
```

### Layouts

#### AppLayout

Root layout with navigation:

```tsx
import { Home, Calendar, User } from 'lucide-react';

<AppLayout
  navItems={[
    { path: '/', label: 'Início', icon: Home },
    { path: '/events', label: 'Eventos', icon: Calendar },
    { path: '/profile', label: 'Perfil', icon: User },
  ]}
>
  {children}
</AppLayout>
```

Shows sidebar on desktop, bottom nav on mobile.

#### Navigation

```tsx
<Navigation 
  variant="sidebar" // or "bottom"
  items={navItems}
/>
```

#### FilterBar

Horizontal filter container:

```tsx
<FilterBar>
  <ChipGroup {...} />
  <DateChipRow {...} />
</FilterBar>
```

#### CardGrid

Responsive grid layout:

```tsx
<CardGrid>
  {events.map(event => (
    <Card key={event.id}>{event.name}</Card>
  ))}
</CardGrid>
```

#### Stack

Flex layout utilities:

```tsx
<VStack spacing={4}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</VStack>

<HStack spacing={2}>
  <Button>Cancel</Button>
  <Button>Save</Button>
</HStack>
```

## Design Tokens

### Colors

```tsx
import { semantic, base, textColor } from 'wise-ui';

// Hex values
semantic.primary   // '#FF8C00' (orange)
semantic.secondary // '#9370DB' (purple)
semantic.accent    // '#FFD700' (yellow)
semantic.success   // '#32CD32' (green)

base.yellow  // '#FFD700'
base.orange  // '#FF8C00'
base.purple  // '#9370DB'
base.pink    // '#FF69B4'
base.green   // '#32CD32'

// Tailwind classes
textColor.primary   // 'text-gray-900'
textColor.muted     // 'text-gray-500'
textColor.secondary // 'text-gray-600'
textColor.inverse   // 'text-white'
```

**Color Opacity Pattern:**

For Tailwind classes, use built-in opacity:
```tsx
className="border-carnival-orange/20"
```

For token hex values, append hex alpha:
```tsx
style={{ borderColor: `${semantic.primary}33` }} // 20% opacity
```

### Gradients

```tsx
import { pageHeaderGradients, type PageHeaderGradient } from 'wise-ui';

// Available gradients:
// - "sunny": orange to yellow
// - "haze": purple gradient
// - "love": red to pink

<Page.Header gradient="sunny">
  {/* ... */}
</Page.Header>
```

### Typography

```tsx
import { typography } from 'wise-ui';

typography.hero      // 'text-3xl font-bold font-hero'
typography.title     // 'text-xl font-bold font-display leading-tight'
typography.subtitle  // 'capitalize font-sans'
typography.body      // 'text-base font-sans'
typography.small     // 'text-sm font-sans'
typography.chip      // 'text-sm block mb-3 font-medium font-sans'
typography.caption   // 'text-xs font-sans'
```

Use via `Text` component's `variant` prop.

### Spacing

```tsx
import { spacing } from 'wise-ui';

spacing.xs            // 4px
spacing.sm            // 8px
spacing.md            // 16px
spacing.lg            // 24px
spacing.xl            // 32px
spacing.card          // 16px
spacing.section       // 24px
spacing.screenPadding // 16px
```

Prefer Tailwind classes (`p-4`, `gap-6`, etc.) over direct token usage.

## Conventions & LLM Rules

### Component Usage

1. **Always use WiseUI components** over custom markup for consistency
2. **Import from barrel**: `import { Button, Card } from 'wise-ui'`
3. **No domain logic**: WiseUI is domain-agnostic (no event/bloco/show concepts)
4. **App-specific UI**: Create in app's `src/components`, not in WiseUI

### Page Pattern

```tsx
<Page>
  <Page.Header gradient="sunny">
    <Text variant="title">Title</Text>
    <Text variant="subtitle">Subtitle</Text>
  </Page.Header>
  <Page.Content isLoading={loading} isEmpty={items.length === 0} gap={8}>
    {items.map(item => <Card key={item.id}>{item.name}</Card>)}
  </Page.Content>
</Page>
```

**Rules:**
- Use `Page` as screen root
- Pass `isEmpty` to show automatic empty state
- Use `gap` prop for consistent vertical spacing
- Compose `Page.Header` content with `Text` and other primitives

### Color Usage

**Tailwind with opacity:**
```tsx
className="bg-carnival-orange/20 border-carnival-purple/30"
```

**Token hex with opacity:**
```tsx
style={{ borderColor: `${semantic.primary}33` }} // 20% = 33 in hex
```

**Opacity reference:**
- 10%: `1A`
- 20%: `33`
- 30%: `4D`
- 50%: `80`

### Text Component

Always use `Text` for typography:

```tsx
// ✅ Good
<Text variant="title">Event Name</Text>

// ❌ Bad
<h2 className="text-xl font-bold">Event Name</h2>
```

### Icon Integration

Use `lucide-react` icons:

```tsx
import { Calendar, MapPin, Clock } from 'lucide-react';

<IconLabel icon={Calendar} label="Feb 10, 2026" />
```

**Icon size convention:**
- Default: `size={20}`
- Large: `size={24}`
- Hero: `size={48}`

### Responsive Design

WiseUI handles responsive behavior internally:
- `AppLayout`: Sidebar (desktop) → Bottom nav (mobile)
- `CardGrid`: Auto-adjusts columns
- `Page.Content`: Responsive padding

Don't override responsive classes unless necessary.

### Animation

Use built-in animated components:
- `Page`: Auto fade-in on mount
- `AnimatedContainer`: For custom animations
- `Page.EmptyState`: Animated scale-in

Avoid adding custom framer-motion animations outside WiseUI.

### Empty States

Let `Page.Content` handle empty states:

```tsx
<Page.Content isEmpty={items.length === 0}>
  {/* WiseUI shows EmptyState automatically */}
</Page.Content>
```

Custom empty states only when needed:

```tsx
<EmptyState 
  icon={<CustomIcon />} 
  title="Custom message"
  description="Custom description"
/>
```

### Form Fields

Use Field wrapper for consistent spacing and error display:

```tsx
<Field label="Nome" error={errors.name}>
  <Input value={name} onChange={setName} />
</Field>
```

### Navigation

Always use `AppLayout` with `navItems`:

```tsx
const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/events', label: 'Events', icon: Calendar },
];

<AppLayout navItems={navItems}>
  <Routes>{/* ... */}</Routes>
</AppLayout>
```

### Context Requirements

Provide `WiseAppContext` at app root:

```tsx
const contextValue = {
  nav: {
    isActive: (path) => location.pathname === path,
  },
  copy: {
    filtros: 'Filtros',
    emptyTitle: 'Nenhum item encontrado',
    emptyDescription: 'Tente ajustar os filtros',
  },
};

<WiseAppContext.Provider value={contextValue}>
  {/* App */}
</WiseAppContext.Provider>
```

### File Organization

When working with WiseUI package:

```
packages/wise-ui/
├── src/
│   ├── tokens/          # Colors, spacing, typography, gradients
│   ├── primitives/      # Button, Card, Input, Text, etc.
│   ├── compositions/    # SearchBar, ChipGroup, FilterPanel, etc.
│   ├── layouts/         # Page, AppLayout, Navigation, etc.
│   ├── contexts/        # WiseAppContext
│   └── index.ts         # Barrel exports
├── package.json
└── README.md
```

**Rules:**
- Keep tokens in sync with app's `tailwind.config.js`
- Export all public components via `index.ts`
- No app-specific logic in WiseUI
- Keep components small and focused

### TypeScript

All components are fully typed:

```tsx
import type { PageHeaderGradient, TextColor, ChipOption } from 'wise-ui';
```

Export types for props when needed by consumers.

### Commit Message Format

When modifying WiseUI:

```
feat[wise-ui]: add tooltip component
fix[wise-ui]: button hover state
refactor[wise-ui]: simplify card variants
```

### Testing Considerations

- Components expect valid context (provide `WiseAppContext` in tests)
- Mock `lucide-react` icons in tests if needed
- Test responsive behavior using viewport resizing

## Peer Dependencies Version Matrix

| Package | Minimum | Tested |
|---------|---------|--------|
| react | 18.0.0 | 19.0.0 |
| react-dom | 18.0.0 | 19.0.0 |
| clsx | 2.0.0 | 2.1.0 |
| framer-motion | 11.0.0 | 12.0.0 |
| lucide-react | 0.300.0 | 0.460.0 |
| react-router-dom | 6.0.0 | 7.1.0 |

## Migration Guide

### From Custom Components to WiseUI

1. **Replace custom buttons:**
   ```tsx
   // Before
   <button className="bg-orange-500 px-4 py-2 rounded">Click</button>
   
   // After
   <Button variant="primary" size="md">Click</Button>
   ```

2. **Replace custom page structure:**
   ```tsx
   // Before
   <div className="min-h-screen bg-gray-50">
     <header className="bg-gradient-to-r from-orange-500">
       <h1>Title</h1>
     </header>
     <main>{content}</main>
   </div>
   
   // After
   <Page>
     <Page.Header gradient="sunny">
       <Text variant="title">Title</Text>
     </Page.Header>
     <Page.Content>{content}</Page.Content>
   </Page>
   ```

3. **Replace custom text:**
   ```tsx
   // Before
   <h2 className="text-xl font-bold text-gray-900">Heading</h2>
   
   // After
   <Text variant="title" color="primary">Heading</Text>
   ```

## Troubleshooting

### Tailwind Classes Not Applied

Ensure WiseUI source is in `tailwind.config.js` content array and carnival colors are defined in theme.

### Context Errors

Wrap app with `WiseAppContext.Provider` before using any WiseUI components.

### Icons Not Rendering

Install `lucide-react`: `npm install lucide-react`.

### Type Errors

Ensure `typescript` and `@types/react` versions are compatible with React 18+.

## Examples

See `/apps/carnival-app` for complete implementation examples.

## License

Private package for internal use.
