# FAQ

Licensing, migration from PrimeNG, the ecosystem, and how support works.

## The Project

### Is ExhaustiveUI free? Will it stay free?

Yes, and yes. Every package is MIT licensed, and the code we forked was MIT too, so relicensing it is not something we could do even if we wanted to. There is no paid tier and none is planned. The
[philosophy page](https://exhaustive-ui.com/philosophy) goes into what that does and does not buy you.

### Is this an official PrimeNG fork? Are you affiliated with PrimeTek?

No. ExhaustiveUI is an independent community fork, not affiliated with, endorsed by, or sponsored by PrimeTek. It is a fork of
[Optimus UI](https://github.com/openng-org/optimus-ui) (OpenNG), itself a repository seeded with PrimeNG's MIT licensed code and history, not a GitHub fork of the
`primefaces/primeng` repository.

### Which PrimeNG version is this forked from?

PrimeNG v21, the last version published under the MIT license, by way of Optimus UI v2. ExhaustiveUI v22 is that codebase, rebranded and migrated to the Angular Signals API, with the fixes that have landed since; its major version
number follows Angular's.

### Who maintains it, and how is it funded?

A small group of volunteers, with e-xiste covering hosting and the domain. We are deliberate about not implying more than that — see
[sustainability](https://exhaustive-ui.com/philosophy) for the honest version and the ways that can change.

### Why did the name change?

Trademark, twice over. PrimeNG, PrimeFaces and PrimeFlex are PrimeTek's marks, and Optimus UI is OpenNG's, so the packages and the CSS cascade layer needed a name of their own. That is also why the rename from PrimeNG is handled by a
schematic rather than by asking you to rewrite imports by hand.

## Compatibility & Migration

### Which Angular versions are supported?

Angular v22: ExhaustiveUI v22 requires Angular v22. Our majors follow Angular's — when a new Angular major ships, a compatible ExhaustiveUI major is the first thing we work on. See the
[version compatibility table](https://exhaustive-ui.com/migration/update) in the update guide.

### How do I migrate from PrimeNG? Is it automatic?

Mostly, but not through `ng add`, which only sets up new projects and fails without changing anything when it finds an existing `primeng` dependency. Install `@exhaustive-ui/core`, then run
`ng generate @exhaustive-ui/core:migrate-from-primeng` in a PrimeNG v21 workspace updated to Angular v22: packages swapped, imports rewritten, dependencies installed. It then prints a report of anything it could not rewrite,
with file and line numbers. The [migration guide](https://exhaustive-ui.com/migration/primeng) covers the details and the manual cases.

### I am on PrimeNG v20 or older. Can I migrate directly?

No. Upgrade to PrimeNG v21 first, using PrimeNG's own migration guides, then update Angular to v22 and run the schematic. The schematic checks the version and refuses rather than producing a half-migrated workspace.

### I use Optimus UI. Can I switch?

Yes. ExhaustiveUI is a fork of Optimus UI, with the same components. On Optimus UI v2, run `ng generate @exhaustive-ui/core:migrate-from-optimus`: packages swapped, imports and configuration API renamed, CSS layer renamed,
dependencies installed. The [Optimus UI migration guide](https://exhaustive-ui.com/migration/optimus) covers the steps and the v22 migrations that follow.

### What happens to my PrimeNG license?

Nothing — it is unrelated. A PrimeNG v22 commercial license covers PrimeNG. ExhaustiveUI needs no license at all. If you hold a PrimeTek subscription for their templates or theme designer, those remain their products and do not carry
over here.

### I had an open PR on primefaces/primeng. Can I bring it here?

Yes, and we would like you to. Append `.patch` to your original pull request URL and apply it with `git am` — the contributing guide in the repository walks through it, including what to do when the patch no longer applies
cleanly.

### Can I run PrimeNG and ExhaustiveUI side by side?

Technically yes, since the package names and the CSS cascade layer differ, but you will ship two copies of the same components and two theme runtimes. Treat it as a temporary state during migration rather than a supported
configuration.

## Themes, Icons & Ecosystem

### Do the PrimeNG themes work?

The built-in presets do — Aura, Material, Lara and Nora ship in `@exhaustive-ui/themes` and are configured the same way. A preset you wrote yourself against PrimeNG v21 will work after the import paths are updated, which the
migration schematic handles.

### What about the Theme Designer, templates and blocks?

Those are PrimeTek's commercial products. They were never MIT licensed, so they are not part of this fork and we will not be reimplementing them. Theming in ExhaustiveUI means editing preset objects in code, which is documented in
full under [styled mode](https://exhaustive-ui.com/theming/styled).

### What replaced PrimeIcons?

[OpenNG Icons](https://exhaustive-ui.com/icons), installed as `@openng/icons`. The `pi pi-{icon}` class names are unchanged, so templates do not need editing — only the package name and the
stylesheet import, both of which the migration schematic rewrites.

### What about PrimeFlex?

PrimeFlex is not maintained here. We suggest Tailwind CSS instead, and ship `@exhaustive-ui/tailwindcss` for first-class integration — see the [Tailwind guide](https://exhaustive-ui.com/tailwind). The
[PrimeFlex guide](https://exhaustive-ui.com/guides/primeflex) covers moving across.

### Does ExhaustiveUI work with SSR?

This documentation site is itself an Angular SSR application built on ExhaustiveUI, prerendered at build time. So yes, and any regression there tends to be noticed quickly.

## Support & Contributing

### Is there commercial support?

No. There is no SLA, no support contract and no guaranteed response time. Issues and discussions are answered by volunteers when they have time. If your organisation needs contractual guarantees, this project cannot offer them.

### How do I report a bug?

Open an issue on [GitHub](https://github.com/e-xiste/exhaustive-ui/issues) with a minimal reproduction — a StackBlitz from any demo on this site is ideal — plus your ExhaustiveUI,
Angular and browser versions. A reproduction is the difference between a bug that gets fixed and one that sits in the backlog.

### How do I request a feature?

Open a [discussion](https://github.com/e-xiste/exhaustive-ui/discussions). Requests are triaged and welcome, but in practice they ship when someone implements them. If it matters to
you, the [contribution guide](https://exhaustive-ui.com/contribution) is the fastest route.

### Where do I ask questions?

GitHub Discussions is the primary place. There is no chat server; a written question with a reproduction gets a better answer than a real-time one.

### How does versioning work?

Semantic versioning, with majors tracking Angular majors. Breaking changes are confined to majors and documented in the
[GitHub releases](https://github.com/e-xiste/exhaustive-ui/releases).

