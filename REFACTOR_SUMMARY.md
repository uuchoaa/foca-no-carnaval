# EventDetailScreen Refactoring Summary

## Design System Philosophy

The refactoring achieved a **highly opinionated, composition-based design system** with these principles:

### 1. **Zero Style Props**
- NO `className` props in app code
- NO `style` props in app code  
- All styling is internal to DS components

### 2. **Composition Over Configuration**
- NO `leftAction`/`rightAction` props
- Use `<Page.Header.Actions>` composition instead
- Components encapsulate their own behavior and animations

### 3. **Semantic Components**
- `<Show condition={}>` instead of `{condition ? ... : null}`
- `<ErrorMessage>`, `<EventTitle>`, `<EventDate>` instead of styled `<Text>`
- `<BackButton>`, `<FavButton>` instead of generic `<Button>` with props

### 4. **Built-in Animations**
- `<AnimatedContainer>` handles fade-in and spacing
- `<FavButton>` has internal scale animation
- `<SourceList>` has staggered entry animation

### 5. **Navigation Abstraction**
- `setNavigationHandler()` allows DS to control routing
- `useNavigation()` hook provides `goTo()` and `goBack()`
- App sets up handler once, DS components use it

## New DS Components

### Primitives
- `<Show>` - Conditional rendering without ternaries

### Compositions
- `<BackButton>` - Styled back navigation button
- `<FavButton>` - Animated favorite toggle with heart
- `<InfoCard>` - Card with icon header
- `<TimeInfo>` - Formatted time display (bloco/show variants)
- `<SourceList>` - Animated list of sources with links
- `<HeaderBadges>` - Event type and city badges
- `<ArtistInfo>` - Artist name with origin badge
- `<AnimatedContainer>` - Content wrapper with animations and spacing
- `<MapButton>` - Navigation to map view
- `<ShareButton>` - Share event button
- `<ErrorMessage>` - Error text styling
- `<EventTitle>` - Page header title
- `<EventDate>` - Formatted date display
- `<LocationText>` - Location info with variants
- `<DescriptionText>` - Description paragraph

## Before vs After

### Before (268 lines)
```typescript
// Many imports including clsx, motion, icons
// Manual className management
// Conditional rendering with ternaries
// Style props and className overrides
// Direct navigation calls

<Button 
  variant="ghost" 
  onClick={() => navigate(-1)}
  className="p-2 min-w-0 !bg-white/20"
>
  <ArrowLeft size={24} />
</Button>

{event.description ? (
  <Card variant="default">
    <Text className="font-medium mb-2">Sobre</Text>
    <Text className="text-gray-700">{event.description}</Text>
  </Card>
) : null}
```

### After (150 lines)
```typescript
// Clean imports - only DS and business logic
// No styling concerns
// Declarative <Show> components
// Semantic, self-contained components

<BackButton />

<Show condition={!!event.description}>
  <InfoCard icon={Calendar} title="Sobre">
    <DescriptionText>{event.description!}</DescriptionText>
  </InfoCard>
</Show>
```

## App Responsibilities

The app now ONLY handles:
1. **Business data** - fetching and managing events
2. **Business state** - favorites, filters
3. **Business logic** - event type detection, data mapping

It does NOT handle:
- Styling
- Animations
- Layout composition
- Navigation implementation
- Conditional rendering patterns

## Future: Linter Enforcement

The DS is now ready for linter rules:
- Disallow `className` prop
- Disallow `style` prop  
- Disallow native HTML elements (`<div>`, `<span>`, `<button>`, etc.)
- Enforce DS component usage only
