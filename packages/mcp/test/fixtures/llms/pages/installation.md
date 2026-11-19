# Installation

Setting up ExhaustiveUI in an Angular CLI project.

## Download-

Prefer to wire things up yourself? Install the packages from the npm registry directly. The next section covers the provider setup that ng add would have written for you.

```bash
# Using npm
npm install @exhaustive-ui/core @exhaustive-ui/themes

# Using yarn
yarn add @exhaustive-ui/core @exhaustive-ui/themes

# Using pnpm
pnpm add @exhaustive-ui/core @exhaustive-ui/themes
```

## Examples-

Every example in this documentation opens in StackBlitz from the code toolbar above each demo, already wired up with the current version. The source repository is the reference for how the library itself is built and consumed.

## Icons-

ExhaustiveUI components accept any icon through templating, so an icon library is optional. That said, every example in this documentation uses the pi pi-&#123;icon&#125; classes from OpenNG Icons , and component defaults such as the DatePicker arrows reference them too. Install it if you want the demos to look the way they do here. Then import the stylesheet, either from your global stylesheet or from the styles array in angular.json .

## Nextsteps-

Once you have ExhaustiveUI up and running, we recommend exploring the following resources to gain a deeper understanding of the library. Global configuration Styled mode and unstyled mode Tailwind CSS integration Pass Through for direct access to the underlying elements Philosophy — what this project promises, and what it does not FAQ

## Ngadd-

The recommended way to add ExhaustiveUI to an Angular CLI workspace is a single command. The schematic asks which theme preset you want and then does the rest: adds &#64;exhaustive-ui/core and &#64;exhaustive-ui/themes to your dependencies wires provideExhaustive into your root providers with the chosen preset, in app.config.ts or your root NgModule installs the packages Pass the preset up front to skip the prompt, or skip the install step if you want to run it yourself: If the schematic cannot find a providers array to update it prints the three manual steps instead of guessing, so nothing in your workspace is rewritten unexpectedly. If it detects an existing primeng dependency it changes nothing and fails with an error rather than reporting success, and points you at the migration guide , which covers the migrate-from-primeng schematic. It does not run that schematic for you. The Angular CLI installs &#64;exhaustive-ui/core before the schematic runs, so the dependency stays in your package.json — the migration schematic needs it there.

```bash
ng add @exhaustive-ui/core
```

## Prerequisites-
