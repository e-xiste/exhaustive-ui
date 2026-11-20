<div align="center">
  <img src="https://exhaustive-ui.com/large-icon.svg" alt="ExhaustiveUI" width="140" />
</div>

# @exhaustive-ui/tailwindcss

Tailwind CSS utilities for [ExhaustiveUI](https://github.com/e-xiste/exhaustive-ui) — first-class integration between ExhaustiveUI theming and Tailwind CSS, plus the animation utilities missing from core Tailwind.

This package ships two libraries: a CSS package for Tailwind CSS v4 (recommended) and a JS plugin for Tailwind CSS v3. Both provide the same utilities.

## Installation

```bash
npm install @exhaustive-ui/tailwindcss
```

## Tailwind CSS v4

In the CSS file that contains the `tailwindcss` import, add the import for this package as well.

```css
@import 'tailwindcss';
@import '@exhaustive-ui/tailwindcss';
```

The stylesheet is also exported as `@exhaustive-ui/tailwindcss/v4` (and `@exhaustive-ui/tailwindcss/v4/index.css`) for tools that do not read the `style` export condition.

To align the `dark:` variant with the `darkModeSelector` of the theme, declare a custom variant:

```css
@custom-variant dark (&:where(.my-app-dark, .my-app-dark *));
```

## Tailwind CSS v3

Use the `plugins` option in your Tailwind config file.

```js
import ExhaustiveUiTailwind from '@exhaustive-ui/tailwindcss';

export default {
    // ...
    plugins: [ExhaustiveUiTailwind]
};
```

## Features

- Semantic color utilities backed by the ExhaustiveUI theme (e.g. `bg-primary`, `text-surface-500`, `text-muted-color`) that work in both styled and unstyled modes.
- Animation utilities: `animate-*` keyframes, duration, delay, direction, fill-mode, iteration, play-state, timing-function, and enter/leave helpers.
- Tailwind v4 variants for component states, such as `p-invalid:`, `p-disabled:` or `p-checked:`, for styling unstyled components through pass-through.

See the [ExhaustiveUI Tailwind documentation](https://exhaustive-ui.com/tailwind) for usage details.
