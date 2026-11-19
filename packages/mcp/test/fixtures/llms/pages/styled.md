# Styled Mode

Choose from a variety of pre-styled themes or develop your own.

## Architecture-

ExhaustiveUI is a design agnostic library so unlike some other UI libraries it does not enforce a certain styling such as material design. Styling is decoupled from the components using the themes instead. A theme consists of two parts; base and preset . The base is the style rules with CSS variables as placeholders whereas the preset is a set of design tokens to feed a base by mapping the tokens to CSS variables. A base may be configured with different presets, currently Aura, Material, Lara and Nora are the available built-in options. The core of the styled mode architecture is based on a concept named design token , a preset defines the token configuration in 3 tiers; primitive , semantic and component . Primitive Tokens Primitive tokens have no context, a color palette is a good example for a primitive token such as blue-50 to blue-900 . A token named blue-500 may be used as the primary color, the background of a message however on its own, the name of the token does not indicate context. Usually they are utilized by the semantic tokens. Semantic Tokens Semantic tokens define content and their names indicate where they are utilized, a well known example of a semantic token is the primary.color . Semantic tokens map to primitive tokens or other semantic tokens. The colorScheme token group is a special variable to define tokens based on the color scheme active in the application, this allows defining different tokens based on the color scheme like dark mode. Component Tokens Component tokens are isolated tokens per component such as inputtext.background or button.color that map to the semantic tokens. As an example, button.background component token maps to the primary.color semantic token which maps to the green.500 primitive token. Best Practices Use primitive tokens when defining the core color palette and semantic tokens to specify the common design elements such as focus ring, primary colors and surfaces. Components tokens should only be used when customizing a specific component. By defining your own design tokens as a custom preset, you'll be able to define your own style without touching CSS. Overriding the ExhaustiveUI components using style classes is not a best practice and should be the last resort, design tokens are the suggested approach.

## Bootstrap-

Bootstrap has a reboot utility to reset the CSS of the standard elements. If you are including this utility, you may give it a layer while importing it.

## Colors-

Color palette of a preset is defined by the primitive design token group. You can access colors using CSS variables or the $dt utility. @for (color of colors; track color) { {{ color }} @for (shade of shades; track shade) { {{ shade }} } }

## Colorscheme-

A token can be defined per color scheme using light and dark properties of the colorScheme property. Each token can have specific values based on the current color scheme. Common Pitfall When customizing an existing preset, your token overrides may be ignored if you don't properly account for color scheme variations. If the original preset defines a token using the colorScheme property, but your customization only provides a direct value, your override will be ignored because the colorScheme property takes precedence over direct values and the system will continue using the preset's scheme-specific values. When customizing tokens that are not defined with colorScheme in the original preset, your customizations will be applied successfully regardless of how you structure them; whether direct or under colorScheme. Best Practices Check how tokens are defined in the preset before customizing from the source . Always maintain the same structure (direct value or colorScheme) as the original preset. Consider both light and dark mode values when overriding scheme-dependent tokens. This approach ensures your customizations will be applied correctly regardless of the user's selected color scheme.

## Component-

The design tokens of a specific component is defined at components layer. Overriding components tokens is not the recommended approach if you are building your own style, building your own preset should be preferred instead. This configuration is global and applies to all card components, in case you need to customize a particular component on a page locally, view the Scoped CSS section for an example.

## Darkmode-

ExhaustiveUI uses the system as the default darkModeSelector in theme configuration. If you have a dark mode switch in your application, set the darkModeSelector to the selector you utilize such as .my-app-dark so that ExhaustiveUI can fit in seamlessly with your color scheme. Following is a very basic example implementation of a dark mode switch, you may extend it further by involving prefers-color-scheme to retrieve it from the system initially and use localStorage to make it stateful. See this article for more information. In case you prefer to use dark mode all the time, apply the darkModeSelector initially and never change it. It is also possible to disable dark mode completely using false or none as the value of the selector.

## Definepreset-

The definePreset utility is used to customize an existing preset during the ExhaustiveUI setup. The first parameter is the preset to customize and the second is the design tokens to override.

## Dt-

The $dt function returns the information about a token like the full path and value. This would be useful if you need to access tokens programmatically.

## Extend-

The theming system can be extended by adding custom design tokens and additional styles. This feature provides a high degree of customization, allowing you to adjust styles according to your needs, as you are not limited to the default tokens. The example preset configuration adds a new accent button with custom button.accent.color and button.accent.inverse.color tokens. It is also possible to add tokens globally to share them within the components.

