# Carnival App Design System

Closed design system: use only these tokens and primitives. No ad-hoc colors or spacing.

## Tokens

### Colors

| Token | Value | Usage |
|-------|--------|--------|
| `carnival.orange` | #FF8C00 | Blocos, primary actions |
| `carnival.purple` | #9370DB | Shows |
| `carnival.yellow` | #FFD700 | Accent |
| `carnival.green` | #32CD32 | Success, Olinda |
| `carnival.pink` | #FF69B4 | Favorites accent |

Use Tailwind: `text-carnival-orange`, `bg-carnival-purple`, etc.

### Spacing

Only use: `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px). Prefer Tailwind: `p-4`, `gap-2`, `mt-6`.

### Typography

| Variant | Tailwind |
|---------|----------|
| heading1 | text-3xl font-bold |
| heading2 | text-xl font-bold |
| body | text-base |
| small | text-sm |
| caption | text-xs |

## Primitives

### Button

- **Props**: `variant` ('primary' | 'secondary' | 'ghost'), `size` ('sm' | 'md' | 'lg'), `children`, optional `onClick` / `type`.
- **Usage**: Actions, filter chips, navigation.

```tsx
import { Button } from '@/design-system';
<Button variant="primary" size="md">Salvar</Button>
```

### Card

- **Props**: `variant` ('default' | 'highlight' | 'muted'), `children`, optional `className` for layout only.
- **Usage**: Event cards, filter panels, content blocks.

```tsx
import { Card } from '@/design-system';
<Card variant="default">...</Card>
```

### Badge

- **Props**: `color` ('orange' | 'purple' | 'blue' | 'green' | 'gray'), `children`.
- **Usage**: City, tags, event type.

```tsx
import { Badge } from '@/design-system';
<Badge color="orange">Recife</Badge>
```

### Input

- **Props**: `value`, `onChange`, `placeholder`, optional `type`.
- **Usage**: Search, forms.

```tsx
import { Input } from '@/design-system';
<Input value={q} onChange={setQ} placeholder="Buscar..." />
```

### Text

- **Props**: `variant` ('heading1' | 'heading2' | 'body' | 'small' | 'caption'), `children`, optional `className`.
- **Usage**: Headings and body text.

```tsx
import { Text } from '@/design-system';
<Text variant="heading1">Blocos</Text>
```

## Rules

1. Use only DS tokens and primitives for new UI.
2. Do not pass custom `className` to primitives for colors/spacing (except Card for layout).
3. Prefer variant/size props over custom styles.
