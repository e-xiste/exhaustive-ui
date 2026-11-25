# Comparison

ExhaustiveUI next to PrimeNG, Optimus UI and Angular Material: license, Angular version, maintainers, and when another library suits you better.

## Overview

Last checked on 2026-11-25. ExhaustiveUI is our project, so read this page with that in mind: the facts link to their source, and the section on when another library suits you better is meant seriously. If something is wrong or out of
date,
[open an issue](https://github.com/e-xiste/exhaustive-ui/issues).

| | ExhaustiveUI | PrimeNG | Optimus UI | Angular Material |
| --- | --- | --- | --- | --- |
| Version | 22.9.1 | 22.1.5 | 2.1.0 | 22.3.0 |
| License | MIT | MIT up to v21, then commercial with a free tier under conditions | MIT | MIT |
| Angular | 22 | 22, from 22.1 | 22, from 22.2.1 | 22 and 23 |
| Maintained by | e-xiste and the community | PrimeTek, a company | OpenNG and the community | The Angular team at Google |
| Origin | Fork of Optimus UI | Original | Fork of PrimeNG v21 | Original |
| Signals API | Every component | Not compared here | Migration in progress | Not compared here |
| From PrimeNG v21 | Schematic | Their own upgrade path | See their documentation | Manual rewrite |

Versions, licenses and Angular ranges are those published on npm.

## The Libraries

### PrimeNG

PrimeNG 22 and later are [no longer released as open source](https://primeui.dev/nextchapter). A commercial license is perpetual, per developer, with a year of
updates: $599 until 2026-12-31, then $799 ([pricing](https://primeui.dev/pricing)). The
[Community license](https://primeui.dev/licenses/community) is free for individuals and students on their own projects, and for organizations with fewer than 5
developers, fewer than 10 employees, less than $1M of annual revenue and no more than $3M of outside capital, public bodies and schools excluded. The versions up to 21 stay MIT and
[receive security fixes](https://github.com/primefaces/primeng).

### Optimus UI

[Optimus UI](https://github.com/openng-org/optimus-ui) is the community fork of PrimeNG v21, and the project ExhaustiveUI comes from. It stays closer to PrimeNG's
API, and moves its components to Signals one at a time.

### Angular Material

[Angular Material](https://material.angular.dev) is made by the Angular team and follows Material Design. It has fewer components, and the strongest guarantee of
following Angular.

### ExhaustiveUI

80+ components under the MIT license, all on the Signals API, with majors that follow Angular's. It is a young project with one main maintainer and few users: that is its main risk. What limits it: the license lets anyone continue the
code, every release is published from public CI with npm provenance, and the API stays close to PrimeNG's. The [philosophy page](https://exhaustive-ui.com/philosophy) sets out what the project commits to.

## When Another Library Suits You Better

- **You want a company behind the library**, with a support contract: PrimeNG.
- **You want the smallest change from PrimeNG v21**, or a larger community of contributors: Optimus UI.
- **You follow Material Design**, or want the library of the Angular team: Angular Material.
- **You need a large user base** and years of answers online: Angular Material or PrimeNG.

## When ExhaustiveUI Suits You

- **You come from PrimeNG v21**, want Angular 22, and need a license without conditions: see the [migration guide](https://exhaustive-ui.com/migration/primeng).
- **You want every component on Signals now**, with schematics for the migration.
- **You work with coding agents** and want the API of the installed version in the package, an MCP server and a validator of templates: see [LLMs](https://exhaustive-ui.com/llms).

