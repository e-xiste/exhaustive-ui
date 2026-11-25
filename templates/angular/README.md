# ExhaustiveUI starter

An Angular 22 application with [ExhaustiveUI](https://exhaustive-ui.com) (MIT licensed), ready for coding agents: instructions in `AGENTS.md` and `CLAUDE.md`, and the MCP server configured for Claude Code, Cursor and VS Code.

```bash
npx tiged e-xiste/exhaustive-ui/templates/angular my-app
cd my-app
npm install
npm start
```

- `npm run build` builds the application, `npm test` runs the unit tests.
- `npx -y @exhaustive-ui/mcp check` validates the ExhaustiveUI templates.
- The theme preset is in `src/app/app.config.ts`: see [theming](https://exhaustive-ui.com/theming/styled).
