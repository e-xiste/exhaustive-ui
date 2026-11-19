<div align="center">
  <img src="https://exhaustive-ui.e-xiste.com/large-icon.svg" alt="ExhaustiveUI" width="140" />
</div>

# ExhaustiveUI Locale

i18n and l7n locales for the components of [ExhaustiveUI](https://exhaustive-ui.e-xiste.com/), vendored from the community supported [PrimeLocale](https://github.com/primefaces/primelocale) repository.

## Installation

```bash
npm install @exhaustive-ui/locale
```

## Usage

Import a locale from its subpath and pass it to the ExhaustiveUI configuration:

```ts
import { de } from '@exhaustive-ui/locale/js/de.js';

provideExhaustive({
    translation: de
});
```

Or import the aggregate `all` export, which contains every locale keyed by language code (e.g. `all.de`):

```ts
import { all } from '@exhaustive-ui/locale';

provideExhaustive({
    translation: all.de
});
```

Or import the raw JSON for a single locale — note that each JSON file wraps its messages under the language-code key, so the messages are at `de.de`, not `de`:

```ts
import de from '@exhaustive-ui/locale/de.json';

provideExhaustive({
    translation: de.de
});
```

The package ships ESM modules (`js/`), CommonJS modules (`cjs/`), and the raw `*.json` files.

## Contributing

Translations are maintained upstream in the [PrimeLocale](https://github.com/primefaces/primelocale) repository — please contribute new languages and fixes there.
