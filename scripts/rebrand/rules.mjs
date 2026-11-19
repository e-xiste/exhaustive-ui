/**
 * Ordered text rewrite rules that turn the upstream Optimus UI sources into ExhaustiveUI.
 * Order matters: specific patterns run before the generic brand/word replacements.
 * Deliberately NOT rewritten: `@openng/icons`, `openng-org/icons`, `OpenngIcons`, "OpenNG Icons"
 * (the icon set stays OpenNG's), copyright notices, and `v1.optimus.openng.org` (upstream's v1 docs).
 */
export const RULES = [
    // --- protect upstream's v1 docs host (restored by the last rule)
    [/v1\.optimus\.openng\.org/g, '__UPSTREAM_V1_DOCS__'],

    // --- directory layout: packages/optimus-ui-<x> -> packages/<x>, packages/optimus-ui -> packages/core
    [/packages\/optimus-ui-(themes|styled|styles|tailwindcss|locale|motion|utils)(?![a-z-])/g, 'packages/$1'],
    [/packages\/optimus-ui(?![a-z-])/g, 'packages/core'],
    [/--filter '\.\/packages\/optimus-ui-\*'/g, "--filter './packages/*' --filter '!@exhaustive-ui/core'"],
    [/"\.\.\/optimus-ui-\*"/g, '"../themes", "../styled", "../styles", "../tailwindcss", "../locale", "../motion", "../utils"'],
    [/"packages\/optimus-ui-\*"/g, '"packages/themes", "packages/styled", "packages/styles", "packages/tailwindcss", "packages/locale", "packages/motion", "packages/utils"'],
    [/\.\.\/optimus-ui-(themes|styled|styles|tailwindcss|locale|motion|utils)(?![a-z-])/g, '../$1'],
    [/\.\.\/optimus-ui(?![a-z-])/g, '../core'],

    // --- npm packages
    [/@openng\/optimus-ui-\*/g, '@exhaustive-ui/*'],
    [/&#64;openng\/optimus-ui-\*/g, '&#64;exhaustive-ui/*'],
    [/@openng\/optimus-ui-(themes|styled|styles|tailwindcss|locale|motion|utils|monorepo)(?![a-z-])/g, '@exhaustive-ui/$1'],
    [/@openng\/optimus-ui(?![a-z-])/g, '@exhaustive-ui/core'],
    [/openng-optimus-ui/g, 'exhaustive-ui-core'],
    // HTML-entity-escaped `@` in docs prose, and regex-escaped `/` in scripts
    [/&#64;openng\/optimus-ui-(themes|styled|styles|tailwindcss|locale|motion|utils)(?![a-z-])/g, '&#64;exhaustive-ui/$1'],
    [/&#64;openng\/optimus-ui(?![a-z-])/g, '&#64;exhaustive-ui/core'],
    [/@openng\\\/optimus-ui-/g, '@exhaustive-ui\\/'],
    [/@openng\\\/optimus-ui(?![a-z-])/g, '@exhaustive-ui\\/core'],
    [/startsWith\('@openng\/'\)/g, "startsWith('@exhaustive-ui/')"],
    [/every @openng package/g, 'every @exhaustive-ui package'],

    // --- URLs and org
    [/optimus\.openng\.org/g, 'exhaustive-ui.e-xiste.com'],
    [/https:\/\/www\.openng\.org\//g, 'https://exhaustive-ui.e-xiste.com/'],
    [/openng-org\/optimus-ui/g, 'e-xiste/exhaustive-ui'],
    [/openng-fundation\/open-prime/g, 'e-xiste/exhaustive-ui'],

    // --- brand
    [/Optimus UI/g, 'ExhaustiveUI'],
    [/OptimusUI/g, 'ExhaustiveUI'],
    [/PrOptimusimeNG/g, 'PrimeNG'],
    [/OPTIMUS/g, 'EXHAUSTIVE'],
    [/Optimus/g, 'Exhaustive'],
    [/optimus-ui/g, 'exhaustive-ui'],
    [/optimusui/g, 'exhaustiveui'],
    [/optimusUi/g, 'exhaustiveUi'],
    [/optimus/g, 'exhaustive'],
    [/"author": "OpenN[Gg]"/g, '"author": "e-xiste"'],
    [/OpenNG Team/g, 'ExhaustiveUI Team'],
    [/__UPSTREAM_V1_DOCS__/g, 'v1.optimus.openng.org']
];

export function rebrand(text) {
    let out = text;
    for (const [pattern, replacement] of RULES) {
        out = out.replace(pattern, replacement);
    }
    return out;
}
