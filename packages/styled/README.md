<div align="center">
  <img src="https://exhaustive-ui.com/large-icon.svg" alt="ExhaustiveUI" width="140" />
</div>

# @exhaustive-ui/styled

Styled utilities and theme management system for [ExhaustiveUI](https://github.com/e-xiste/exhaustive-ui).

This package provides the core engine for the design system in ExhaustiveUI, offering powerful tools for theming, CSS-in-JS capabilities, and dynamic styling.

## Features

- **Theme Engine**: Robust configuration for presets, dark mode, and CSS layers.
- **Dynamic Palettes**: Helpers to update primary and surface palettes at runtime.
- **Color Utilities**: Advanced color manipulation including tints, shades, mixing, and palette generation.
- **StyleSheet Management**: Centralized control over CSS variables and style injection.
- **Design Tokens**: Seamless integration with design tokens (`dt`) for consistent styling.

## Installation

```bash
npm install @exhaustive-ui/styled
```

## Core Concepts

### Theme Configuration
Configure the global behavior of your design system, including dark mode selectors and CSS layer integration.

### Presets
Define and update theme presets dynamically using `definePreset` and `updatePreset`.

### Dynamic Palettes
Easily switch primary colors or surface tones:
- `updatePrimaryPalette(palette)`
- `updateSurfacePalette(palette)`

### Color Helpers
Utility functions to manage color scales:
- `mix(color1, color2, weight)`
- `tint(color, percent)`
- `shade(color, percent)`
- `palette(color)`

## Usage in ExhaustiveUI

This package is automatically integrated into `@exhaustive-ui/core`. If you are building custom components or themes that need to interact with the Exhaustive design system, this package provides the necessary low-level APIs.

## License

MIT
