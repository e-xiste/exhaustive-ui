<div align="center">
  <img src="https://exhaustive-ui.e-xiste.com/large-icon.svg" alt="ExhaustiveUI" width="140" />
</div>

# @exhaustive-ui/tailwindcss

Tailwind CSS utilities for [ExhaustiveUI](https://github.com/e-xiste/exhaustive-ui) — first-class integration between ExhaustiveUI theming and Tailwind CSS, plus the animation utilities missing from core Tailwind.

This package ships two libraries: a CSS package compatible with Tailwind CSS v4, and a JS plugin for Tailwind CSS v3.

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
- Variants such as `p-dark` for dark-mode styling of ExhaustiveUI components.

See the [ExhaustiveUI Tailwind documentation](https://github.com/e-xiste/exhaustive-ui) for usage details.
