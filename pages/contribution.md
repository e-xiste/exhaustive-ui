# Contribution Guide

How to contribute to ExhaustiveUI.

## Introduction

ExhaustiveUI is a community-maintained Angular UI library, stewarded by e-xiste and dedicated to providing high-quality, versatile and accessible UI components that help developers build better applications faster.

### Development Setup

To begin with, clone the ExhaustiveUI repository from GitHub:

```typescript
git clone https://github.com/e-xiste/exhaustive-ui.git
cd exhaustive-ui
```

Then run the documentation app in your local environment at `http://localhost:4200/`.

```typescript
pnpm install
pnpm run dev
```

### Project Structure

ExhaustiveUI's project structure is organized as follows:

```typescript
- apps
  - docs                       // this documentation website
  - tailwind-playgrounds       // Tailwind integration sandboxes
- packages
  - core                       // components, directives and services
  - themes                     // built-in theme presets
  - styled                     // styled-mode theming engine
  - styles                     // base styles
  - tailwindcss                // Tailwind CSS plugin
  - locale                     // i18n locales
  - motion                     // animation utilities
  - utils                      // shared helpers
```

## Help Needed

ExhaustiveUI is a community-driven project stewarded by e-xiste, and we appreciate any help you can provide. Here are some areas where you can contribute:

### Issue Triage

Help us manage issues by;

- Reproducing reported bugs
- Clarifying issue descriptions
- Tagging issues with appropriate labels

### Sending Pull Requests

We encourage you to send pull requests, especially for issues tagged with the `help-needed` label.

### Community Support

Assist other users by participating in the issue tracker and [GitHub discussions](https://github.com/e-xiste/exhaustive-ui/discussions). Your expertise can help others solve
problems and improve their experience with ExhaustiveUI.

## AI Contributions

Contributions written with AI coding agents are welcome, on the same terms as any other: the pull request is yours. You understand the change and can answer questions about it in review, it is scoped to one problem, and it comes with
tests that fail without the fix. The repository ships what agents need: the `@exhaustive-ui/mcp` server, the `exhaustive-ui` agent skill and the LLM docs, generated from this site.

## Pathway

ExhaustiveUI offers an organization structure involving contributors and the core team:

### Contributor Role

After a certain period of frequent contributions, a community member is offered the Contributor role. On average, it may take about three months, but the exact duration can vary depending on the individual commitment.

### Committer Role

If a contributor actively participates in the codebase and PRs, their role may be upgraded to a Committer level, providing direct commit access to the ExhaustiveUI codebase.

## Benefits

Contributing to ExhaustiveUI comes with several benefits. Being part of an open-source project will enhance your career and open up exciting opportunities. You'll gain significant visibility in the developer community while improving
yourself as a professional.

