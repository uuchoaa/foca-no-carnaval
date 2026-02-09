# Design System

Shared UI primitives, compositions, layouts, and tokens for the app. Domain-agnostic: no event/bloco/show concepts—use these building blocks in app screens and components.

## Usage

Import from the design-system barrel:

```ts
import {
  Page,
  Button,
  Card,
  Text,
  SearchBarWithIcon,
  DateChipRow,
  pageHeaderGradients,
} from '../design-system';
```

## Structure

| Layer | Role |
|-------|-----|
| **tokens/** | Colors, spacing, typography, gradients. Single source of truth; keep in sync with `tailwind.config.js` where Tailwind classes are used. |
| **primitives/** | Low-level components: Button, Card, Badge, Input, Text, Checkbox, Divider, Show. Minimal props, no app logic. |
| **compositions/** | Combinations of primitives and tokens: SearchBarWithIcon, DateChipRow, ChipGroup, FilterPanel, TagList, SectionHeading, EmptyState, etc. |
| **layouts/** | Page (header/content/footer/empty), FilterBar, CardGrid, AppLayout, NavigationBottom, NavigationSidebar. |

## Tokens

- **gradients**: `pageHeaderGradients` and `PageHeaderGradient` for page headers.
- **spacing**, **typography**: Used by primitives/compositions; align with Tailwind if needed.

## Conventions

- Prefer design-system components over custom markup so styling and behavior stay consistent.
- For colors with opacity in Tailwind, use Tailwind classes (e.g. `border-carnival-orange/20`). When using token hex values, apply opacity via inline style (e.g. `${semantic.primary}33` for 20% alpha).
- App-specific UI (e.g. event title, source list, header badges) lives in `src/components`, not here.
