# Responsive UL Elements Checklist

## Layout

- [ ] **Container Width**: Use `max-width` with `margin: auto` to center UL and prevent unbounded width on large screens
- [ ] **Responsive Padding**: Apply viewport-based padding (e.g., `px-4 md:px-6 lg:px-8`) that scales appropriately
- [ ] **Flex/Grid for LI**: Use `flex` or `grid` for LI elements to create multi-column layouts on tablet/desktop
- [ ] **Stack on Mobile**: Default to single-column LI stack on mobile, transition to multi-column at breakpoints
- [ ] **Horizontal Scroll Prevention**: Ensure UL doesn't overflow horizontally; use `overflow-x: hidden`
- [ ] **Full-width on Mobile**: Consider `w-full` for UL containers on mobile for edge-to-edge appearance

## Typography

- [ ] **Responsive Font Sizes**: Use fluid typography (e.g., `text-sm md:text-base`) for LI text
- [ ] **Line Height**: Set `leading-relaxed` (1.625+) for better readability on all devices
- [ ] **Font Weight Consistency**: Ensure consistent weight across all LI elements
- [ ] **Text Overflow Handling**: Use `truncate` or `line-clamp` for long LI text on mobile
- [ ] **Text Alignment**: Default to `text-left`; consider `text-center` for centered designs

## Spacing

- [ ] **LI Vertical Spacing**: Use `space-y-2` or `space-y-3` for consistent LI separation
- [ ] **Icon-Text Gap**: Set `gap-2` or `gap-3` between bullet icons and text
- [ ] **Padding Scale**: Increase padding on larger screens (e.g., `p-3 md:p-4 lg:p-5`)
- [ ] **UL Internal Padding**: Add `px-4` on mobile, scale up to `px-6` on tablet, `px-8` on desktop
- [ ] **Margin Collapse**: Account for margin collapsing; use gap instead of margin between LIs

## Touch Targets

- [ ] **Minimum Height**: Ensure LI touch targets are at least 44px tall on mobile (`min-h-[44px]`)
- [ ] **Clickable LIs**: If LIs are interactive, use `cursor-pointer` and add hover states
- [ ] **Tap Highlight**: Consider `-webkit-tap-highlight-color: transparent` for better UX
- [ ] **Touch-Friendly Spacing**: Increase spacing between clickable LIs to prevent accidental taps

## Accessibility

- [ ] **Semantic Markup**: Use `<ul>` for unordered lists, `<ol>` for ordered lists
- [ ] **List Semantic Role**: Add `role="list"` if UL is used for non-list purposes
- [ ] **Screen Reader Support**: Ensure list items are announced correctly by screen readers
- [ ] **Focus States**: Add visible focus indicators for interactive LIs (`:focus-visible`)
- [ ] **Color Contrast**: Maintain WCAG AA contrast (4.5:1 for normal text) in LI content
- [ ] **Reduced Motion**: Respect `prefers-reduced-motion` for any animated list transitions

## Performance

- [ ] **CSS Containment**: Use `content-visibility: auto` for long lists
- [ ] **Virtualization**: Consider virtual scrolling for very long lists (100+ items)
- [ ] **Avoid Nested ULs**: Limit nesting depth to 2-3 levels maximum
- [ ] **Optimize Animations**: Use `transform` and `opacity` for list animations, avoid layout-triggering properties

## CSS Techniques

- [ ] **CSS Grid for LI**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsive LI grid
- [ ] **Flex Wrap**: Use `flex-wrap` for flexible LI wrapping across breakpoints
- [ ] **Container Queries**: Consider `@container` for truly modular list components
- [ ] **Clamp for Sizing**: Use `clamp()` for fluid spacing and sizing
- [ ] **Custom Properties**: Use CSS variables (`--ul-gap`, `--li-padding`) for consistent theming
- [ ] **Media vs Container Queries**: Prefer container queries for component-level responsiveness

## Testing Strategies

- [ ] **Viewport Testing**: Test at mobile (375px), tablet (768px), desktop (1024px+), large desktop (1440px+)
- [ ] **Touch Testing**: Verify touch interactions on actual mobile devices
- [ ] **Keyboard Navigation**: Test full keyboard accessibility (Tab, Arrow keys)
- [ ] **Screen Reader Testing**: Test with NVDA, VoiceOver, or JAWS
- [ ] **Orientation Changes**: Test both portrait and landscape orientations
- [ ] **Reduced Motion**: Test with motion preferences enabled
- [ ] **High DPI Displays**: Verify rendering on Retina/2x displays
- [ ] **Browser Testing**: Test across Chrome, Firefox, Safari, Edge
- [ ] **Zoom Levels**: Test at 100%, 125%, 150%, 200% zoom levels

## Common Patterns

### Responsive List with Icons
```jsx
<ul className="space-y-3 px-4 md:px-6">
  {items.map((item) => (
    <li key={item.id} className="flex items-start gap-3 min-h-[44px]">
      <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
      <span className="text-sm md:text-base text-slate-700">{item.text}</span>
    </li>
  ))}
</ul>
```

### Grid Layout for LI
```jsx
<ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {items.map((item) => (
    <li className="p-4 bg-white rounded-lg">{item.content}</li>
  ))}
</ul>
```

### Inline-flex for Horizontal Lists
```jsx
<ul className="flex flex-wrap gap-2">
  {tags.map((tag) => (
    <li className="px-3 py-1 bg-slate-100 rounded-full text-sm">{tag}</li>
  ))}
</ul>
```

## Implementation Checklist

Before deploying, verify:

1. [ ] Mobile view shows single-column stacked LIs
2. [ ] Tablet view optionally shows 2 columns or maintains readability
3. [ ] Desktop view uses appropriate layout (columns, grid, or spacious single column)
4. [ ] All text is readable without zooming
5. [ ] Touch targets are minimum 44x44px on mobile
6. [ ] No horizontal overflow on any viewport
7. [ ] Keyboard users can navigate all interactive LIs
8. [ ] Screen readers announce list structure correctly
9. [ ] Animations respect reduced-motion preferences
10. [ ] Performance is acceptable on 3G connections