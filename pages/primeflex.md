# PrimeFlex

Moving from PrimeFlex to Tailwind CSS.

## Compatibility

If you are staying on PrimeFlex for now, ExhaustiveUI pairs with PrimeFlex v4 — the same combination that worked with PrimeNG v18 and newer, since the styling architecture is unchanged. PrimeFlex v3 targeted the older PrimeNG releases
and is not a supported pairing here.

Neither version is tested against ExhaustiveUI releases, so treat this as "should work", not as a supported configuration. The migration below is the path we actually maintain.

## Migration

PrimeFlex class names map closely onto Tailwind's, so most of the work is mechanical. PrimeTek's
[primeclt](https://www.npmjs.com/package/primeclt) ships a `pf2tw` command that does the conversion, and it works on any codebase — it rewrites class names and does not care
which component library you use.

```bash
npm install -g primeclt
```

Run `pf2tw` in a directory containing the files to convert.

```bash
prime pf2tw
```

`pf2tw` was written for Tailwind v3. Tailwind v4 renamed a few of the utilities it produces, for example `shadow-sm` to `shadow-xs`, `rounded` to `rounded-sm` and `flex-grow` to `grow`. On Tailwind
v4, check the converted classes against the [renamed utilities](https://tailwindcss.com/docs/upgrade-guide#renamed-utilities) list of the Tailwind upgrade guide.

A handful of PrimeFlex classes have no Tailwind counterpart and are left alone. Replace them with flexbox or grid utilities by hand:

- formgrid
- formgroup
- formgroup-inline
- col
- col-fixed
- field
- field-checkbox
- field-radiobutton
- reset

## Overview

[PrimeFlex](https://primeflex.org) was PrimeTek's lightweight CSS utility library, designed to accompany PrimeNG. PrimeTek stopped maintaining it before the relicensing, on the
grounds that most applications already bring their own utility layer — Tailwind, Bootstrap or something in-house — and a second one only overlaps with it.

ExhaustiveUI does not maintain PrimeFlex either, and for the same reason. Nothing in this library depends on it, and no component requires it. If your application already uses PrimeFlex it will keep working, but it will not receive
updates from us, and we suggest moving to Tailwind CSS.

## Tailwindcss

Tailwind CSS is the replacement we suggest. This documentation site is itself built with it, and we publish `@exhaustive-ui/tailwindcss` for first-class integration — a plugin that teaches Tailwind about the theme's design
tokens and puts the component styles in a cascade layer you can override cleanly.

See the [Tailwind CSS guide](https://exhaustive-ui.com/tailwind) for setup with either Tailwind v3 or v4, and the next section for converting existing PrimeFlex classes.

