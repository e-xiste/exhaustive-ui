<div align="center">
  <img src="https://exhaustive-ui.e-xiste.com/large-icon.svg" alt="ExhaustiveUI" width="140" />
</div>

# @exhaustive-ui/themes

Official themes and presets for [ExhaustiveUI](https://github.com/e-xiste/exhaustive-ui).

This package contains a collection of professionally designed themes and presets for ExhaustiveUI, powered by the core engine in `@exhaustive-ui/styled`. It includes design tokens, component styles, and various aesthetic flavors to jumpstart your project.

## Features

- **Standard Presets**: Built-in presets including Aura, Lara, Nora, and Material.
- **Design Tokens**: Comprehensive set of tokens for colors, spacing, typography, and more.
- **Component Themes**: Fine-grained styling for over 80+ ExhaustiveUI components.
- **Extensible**: Easily extend or customize existing presets to match your brand.
- **Typed Definitions**: Full TypeScript support for all theme configurations and tokens.

## Installation

```bash
npm install @exhaustive-ui/themes
```

## Core Presets

ExhaustiveUI Themes comes with several curated presets:

- **Aura**: A modern, sleek design with a focus on whitespace and clarity.
- **Lara**: A versatile and clean aesthetic, suitable for a wide range of applications.
- **Nora**: A distinct look with unique design choices for modern interfaces.
- **Material**: Follows Material Design principles for a familiar and functional UI.

## Usage

### Using a Preset

You can apply a preset globally using the `definePreset` utility:

```typescript
import { definePreset } from '@exhaustive-ui/themes';
import Aura from '@exhaustive-ui/themes/aura';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            // ...
            950: '{blue.950}'
        }
    }
});
```

### Direct Token Access

Access design tokens directly for use in your own styled components:

```typescript
import { tokens } from '@exhaustive-ui/themes/tokens';

const primaryColor = tokens['primary.color'];
```

## Usage in ExhaustiveUI

This package is the primary source of themes for `@exhaustive-ui/core`. It provides the visual layer that brings components to life. Use this package when you want to switch between official themes or create a custom theme based on one of the existing presets.

## License

MIT
