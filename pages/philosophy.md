# Philosophy

Why ExhaustiveUI exists, what it commits to, and where it stops.

## Why This Fork Exists

In June 2026 PrimeTek moved future major versions of PrimeNG, starting with v22, to a commercial license, and the repository of the MIT versions now receives security fixes only. They explained their reasoning in
[their own announcement](https://primeui.dev/nextchapter), and it is worth reading. Maintaining a component library of this size for a decade, largely for free, is genuinely hard,
and we do not think the decision was made lightly.

The OpenNG community answered first, with [Optimus UI](https://github.com/openng-org/optimus-ui): a fork of the last MIT licensed version of PrimeNG, v21. ExhaustiveUI is a fork of
Optimus UI, so it carries the same code, the same history and the same license.

Another fork needs a reason. Ours is a different pace and a different scope:

- **Modernize everything at once.** Every component moved to Signals, OnPush and the built-in control flow for Angular 22, instead of one component at a time.
- **Clear the inherited backlog.** Bugs carried over from PrimeNG and Optimus UI are reproduced, fixed and covered by a test, and the documentation is checked against the code.
- **Let AI carry a real share of the work**, and make the library easy for AI coding agents to use correctly. The section below explains how.

ExhaustiveUI is not an official fork. It is not endorsed by PrimeTek or by the OpenNG team, and it stays MIT.

## How AI Is Used

ExhaustiveUI is maintained with AI coding agents, and we say so plainly. They do a large part of the work that a small project could not otherwise afford:

- reproducing reported bugs in a real browser, then fixing them with a regression test;
- migrating components, such as the move to Signals;
- auditing the library: server rendering, strict template type checking, accessibility with axe on every documentation page, color contrast in every theme;
- checking that the documentation, the API tables and every generated example match the code.

AI output is not trusted on its own word. Every change goes through the same gates: about 8,800 unit tests, a type check of every documentation example, a format check and CI on every commit, then a review before it is merged.
Packages are built and published by CI, with npm provenance, never from a personal machine.

The other half is making the library usable by AI. Agents tend to write PrimeNG code from memory. ExhaustiveUI ships an MCP server, an agent skill and a compact card per component, so they read the real API of the installed version,
and a validator that names the replacement of every removed input. The [AI agents guide](https://exhaustive-ui.com/llms) explains how to set them up.

## What We Commit To

Four commitments, in the order we would want to read them if we were choosing a dependency:

### MIT, with no second tier

Every package we publish is MIT licensed. There is no paid edition, no enterprise build, no feature held back behind a subscription, and no plan to introduce one. If that ever changed, it would be a fork of this project rather than a
relicensing of it, because the code we inherited is MIT and so is everything we add to it.

### We track Angular

Our release cadence follows Angular's. When a new Angular major lands, the priority is a compatible ExhaustiveUI major — before new features, before refactors. Staying upgradeable is the single most valuable thing a component library
can do for the applications built on it.

### Bugs before features

We inherited a large backlog along with the code. Fixing what is broken ranks above adding what is missing. Feature requests are triaged and welcome, but they generally ship when someone in the community implements them.

### No surprises in your bundle

The library sends no telemetry, phones no home, and requires no account or key to use. What you install is what runs.

## What We Do Not Do

Naming the limits is what makes the commitments above worth anything. Here is what ExhaustiveUI is not.

### There is no commercial support

No SLA, no support contract, no guaranteed response time. Issues and discussions are answered when there is time. If your organisation needs contractual guarantees, this project cannot provide them and you should plan accordingly.

### There are no premium templates, blocks or design tooling

PrimeTek's application templates, block library and visual theme designer are their commercial products. They are not part of what was MIT licensed, so they are not part of this fork and will not be reimplemented. Theming here means
editing preset objects in code, which is documented in full.

### We are not chasing feature parity with PrimeNG v22 and beyond

PrimeNG continues under its own license and its own roadmap. ExhaustiveUI diverges from v21 forward. Some things they add, we will not have. Some things we fix, they will not. Treat the two as separate libraries that share an
ancestor, not as a free copy of a paid product.

### The bus factor is real

ExhaustiveUI is maintained by one person, in their own time, with AI doing a large share of the work. We would rather say that plainly than imply a larger organisation stands behind it. The best way to change that number is to
[contribute](https://github.com/e-xiste/exhaustive-ui).

## How Decisions Are Made

Everything happens in the open, in the [repository](https://github.com/e-xiste/exhaustive-ui). There is no private roadmap and no internal issue tracker. What you see in the issues,
the discussions and the [roadmap](https://exhaustive-ui.com/roadmap) is the whole plan.

Today the project has a single maintainer, who reviews and merges every change and cuts the releases. Pull requests are welcome from anyone; the [contribution guide](https://exhaustive-ui.com/contribution) explains how to
send one. If regular contributors appear, we would rather share merge rights with them than route everything through one person.

Versions follow Angular: ExhaustiveUI 22 targets Angular 22. Breaking changes are avoided within a major and come with an `ng update` migration when a major requires them. The names we inherited that no longer fit, the package
scope, the CSS cascade layer and the icon library, were changed once, in 22.0, with the [PrimeNG](https://exhaustive-ui.com/migration/primeng) and
[Optimus UI](https://exhaustive-ui.com/migration/optimus) migration schematics, rather than dripping renames across releases.

## PrimeNG and PrimeTek

ExhaustiveUI is not affiliated with, endorsed by, or sponsored by PrimeTek. PrimeNG, PrimeFaces, PrimeReact, PrimeVue and PrimeFlex are their trademarks. The rename from the inherited names — the packages, the CSS layer, the icon
library — is a trademark matter, not a technical one, and it is why we ship a [migration schematic](https://exhaustive-ui.com/migration/primeng) rather than asking you to rewrite imports by hand.

References to PrimeNG remain throughout this documentation and the source, and they are deliberate. Attribution is the point: this library is PrimeTek's decade of work plus whatever the community adds on top. Pretending otherwise
would be both dishonest and useless to anyone trying to find their way around a familiar API.

The code we forked was published under the MIT license, and we distribute it under those same terms, with the original copyright notices intact.

## Sustainability

The honest answer to "how is this funded" is: it mostly is not. e-xiste covers the hosting and the domain; the work is volunteered. That is a fragile arrangement, and it is the main risk to this project — larger than any technical
risk we can see today.

The things that actually help, roughly in order of impact:

- Reproducing and triaging issues. A bug with a minimal reproduction is several times more likely to get fixed.
- Sending pull requests, especially for issues labelled `help wanted`.
- Answering questions in discussions, so the same answer is not written five times.
- Improving this documentation. Every page has a source file and every fix is welcome.
- Telling your employer you depend on it. Sponsored maintenance time is worth more than any one-off donation.

The [contribution guide](https://exhaustive-ui.com/contribution) covers how to get started.

