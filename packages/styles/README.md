<div align="center">
  <img src="https://exhaustive-ui.e-xiste.com/large-icon.svg" alt="ExhaustiveUI" width="140" />
</div>

# @exhaustive-ui/styles

Core style definitions and CSS utilities for [ExhaustiveUI](https://github.com/e-xiste/exhaustive-ui).

This package contains the base CSS architectural patterns and component-specific style definitions used across the ExhaustiveUI ecosystem. It leverages design tokens for highly customizable and consistent styling.

## Features

- **Component Styles**: Comprehensive CSS definitions for over 80+ UI components.
- **Design Token Integration**: Styles are powered by `dt()` (design token) functions for seamless theming.
- **Modular Architecture**: Styles are organized by component, allowing for lean bundles and targeted imports.
- **Framework Agnostic Core**: While optimized for Angular via ExhaustiveUI, the core CSS logic is highly reusable.

## Installation

```bash
npm install @exhaustive-ui/styles
```

## Core Concepts

### Style Definitions
Each component has its styles defined using standard CSS syntax, enhanced with design tokens. 

Example of a button style fragment:
```css
.p-button {
    background: dt('button.primary.background');
    color: dt('button.primary.color');
    border-radius: dt('button.border.radius');
    transition: background dt('button.transition.duration');
}
```

### Design Tokens (`dt`)
The `dt()` function is used within the style strings to reference theme-specific values. These tokens are resolved at runtime by the `@exhaustive-ui/styled` engine.

## Usage in ExhaustiveUI

This package is a core dependency of `@exhaustive-ui/core`. Component styles are exported as named constants (e.g., `ButtonStyle`, `DataTableStyle`) and are automatically consumed by the component library to inject necessary styles into the DOM.

## License

MIT
