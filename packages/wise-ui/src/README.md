# WiseUi

Shared UI primitives, compositions, layouts, and tokens for the app. Domain-agnostic: no event/bloco/show concepts—use these building blocks in app screens and components.

## Using in other apps

1. **Dependency** (monorepo): add `"wise-ui": "*"` to the app’s `package.json` (root must list this repo’s `packages/*` in `workspaces`). Run `npm install` from the repo root.

2. **Tailwind**: In the app’s `tailwind.config.js`, include the package in `content` so classes used by WiseUi are generated. Prefer a path to the package source (workspace packages are often hoisted to root):
   ```js
   content: [
     "./src/**/*.{js,ts,jsx,tsx}",
     path.join(__dirname, "../../packages/wise-ui/src/**/*.{js,ts,jsx,tsx}"),
   ],
   ```
   Extend `theme` with the same fonts and `carnival` colors (see carnival-app’s `tailwind.config.js`) so tokens and primitives look correct.

3. **Peer deps**: The app must have `react`, `react-dom`, `clsx`, `framer-motion`, `lucide-react`, and `react-router-dom` installed (they are peer dependencies of the package).

## Usage

Import from the WiseUi barrel:

```ts
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

### Defining a Page

Use `Page` as the screen wrapper, then `Page.Header` and `Page.Content`. When the list is empty, pass `isEmpty` and `Page.Content` shows the default empty state (PT: "Nenhum item" / "Tente ajustar os filtros"):

```tsx
import { Page, Text, SectionHeading } from 'wise-ui';

function MyScreen() {
  const items = []; // your data
  const isLoading = false;
  const isEmpty = items.length === 0;

  return (
    <Page>
      <Page.Header gradient="sunny">
        <Text variant="title">The Best Movies of All Times</Text>
        <Text variant="subtitle">{items.length} items found</Text>
      </Page.Header>
      <Page.Content isLoading={isLoading} isEmpty={isEmpty}>
        {items.map((item) => (
          <div key={item.id}>
            <SectionHeading title={item.name} />
            {/* ... */}
          </div>
        ))}
      </Page.Content>
    </Page>
  );
}
```

`Page.Header` is a container: it accepts `gradient` (e.g. `"sunny"`, `"haze"`, `"love"`) and `children`—compose title, subtitle, search, or actions with primitives like `Text`. `Page.Content` accepts `isLoading`, `isEmpty`, and `center` for centered content.

## Structure

| Layer | Role |
|-------|-----|
| **tokens/** | Colors, spacing, typography, gradients. Single source of truth; keep in sync with `tailwind.config.js` where Tailwind classes are used. |
| **primitives/** | Low-level components: Button, Card, Badge, Input, Text, Checkbox, Divider, Show. Minimal props, no app logic. |
| **compositions/** | Combinations of primitives and tokens: SearchBarWithIcon, DateChipRow, ChipGroup, FilterPanel, TagList, SectionHeading, EmptyState, etc. |
| **layouts/** | Page (header/content/footer/empty), FilterBar, CardGrid, AppLayout, Navigation. |

## Tokens

- **gradients**: `pageHeaderGradients` and `PageHeaderGradient` for page headers.
- **spacing**, **typography**: Used by primitives/compositions; align with Tailwind if needed.

## Conventions

- Prefer WiseUi components over custom markup so styling and behavior stay consistent.
- For colors with opacity in Tailwind, use Tailwind classes (e.g. `border-carnival-orange/20`). When using token hex values, apply opacity via inline style (e.g. `${semantic.primary}33` for 20% alpha).
- App-specific UI (e.g. event title, source list, header badges) lives in `src/components`, not here.
