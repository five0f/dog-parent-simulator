# Design system

Version: 1.0

## Colors

### Neutral

- `--color-background`: `#C8BBA3`
- `--color-surface`: `#EFE0B8`
- `--color-surface-secondary`: `#D8C48F`

### Text

- `--color-ink`: `#1E130D`
- `--color-ink-soft`: `#5A4434`
- `--color-description`: `#5A4434`
- `--color-ui-text`: `#EBD3B4`

### Borders

- `--color-border`: `#2A211B`

### States

- `--color-success`: `#6F8B4E`
- `--color-warning`: `#E5C75E`
- `--color-danger`: `#B94235`

## Typography

Primary font: Patrick Hand.

Fallback: Comic Sans MS, Trebuchet MS, sans-serif.

## Font sizes

- `xs`: `12px`
- `sm`: `14px`
- `base`: `16px`
- `lg`: `20px`
- `xl`: `24px`
- `2xl`: `32px`

## Font weights

- `regular`: `400`
- `medium`: `500`
- `bold`: `700`

## Border radius

- `small`: `6px`
- `medium`: `10px`
- `large`: `16px`

Do not use perfectly circular UI components unless explicitly required.

## Borders

- Default: `2px solid #2A211B`
- Strong: `3px solid #2A211B`

Avoid thin `1px` borders.

## Shadows

- Card shadow: `4px 4px 0 rgba(0, 0, 0, 0.25)`
- Button shadow: `3px 3px 0 rgba(0, 0, 0, 0.25)`

Avoid blur shadows, glassmorphism, and modern soft elevation.

## Spacing scale

- `xs`: `4px`
- `sm`: `8px`
- `md`: `12px`
- `lg`: `16px`
- `xl`: `24px`
- `2xl`: `32px`
- `3xl`: `48px`

## Layout

### Scene layout

The environment occupies most of the screen. Characters are positioned near the center.

UI overlays should not cover primary scene elements.

### Content width

Maximum content width: `1200px`.

### Safe area

Minimum outer padding: `24px`.

## Components

### Top menu button

Used for the `Day` and `Bublik` HUD actions.

- Background: `--top-button` image asset
- Layout: icon above label
- Position: top right
- Hover and focus: slight brightness increase

### Info panel

Used for the day and dog modal panels.

- Background: `--choice-card` image asset
- Position: right aligned on desktop, centered on mobile
- Maximum height: viewport constrained with internal scrolling
- Backdrop closes the panel

### Choice card

Used for event decisions.

- Min height: `56px`
- Padding: `16px`
- Width: fixed on desktop, horizontally scrollable on mobile
- Background: `--choice-card` image asset
- Hover and focus: slight brightness increase

### Event panel

Contains current event text.

- Background: `--dialog-panel` image asset
- Position: bottom center above the action bar
- Width: fixed on desktop, viewport constrained on mobile
- Text: title plus optional subtitle

### HUD

The HUD is not location navigation. It shows dog identity, trust hearts, day/time, and top menu
buttons.

### Trust hearts

Used for the trust meter.

- Five slots
- Filled state uses `--heart-full`
- Empty state uses `--heart-empty` as a mask

## Icons

Style:

- hand-drawn
- single color
- simple shapes

No gradients, glossy effects, or 3D effects.

## Animations

- Duration: `150ms-250ms`
- Easing: `ease-out`

Allowed:

- hover
- fade
- scale

Avoid bouncing, floating, and excessive motion.

## Responsive rules

- Target resolution: `1920x1080`
- Minimum supported width: `320px`

UI should remain readable on narrow phones. Choice cards may scroll horizontally below `900px`.

## Asset rules

Character assets are the source of truth.

- Do not modify proportions through CSS.
- Do not distort proportions.
- Do not apply outlines.
- Do not apply glow effects.
- All UI must adapt to existing assets.

## Accessibility

- Minimum text size: `14px`
- Minimum button height: `44px`
- Interactive elements must have visible hover states.
- Text contrast must remain readable on all surfaces.
