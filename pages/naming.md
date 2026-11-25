# Naming Conventions

How ExhaustiveUI components, directives and templates are named.

## Components

A component is written as an element whose name is `p-` followed by the name of the component in kebab case: every word of the name is separated by a hyphen, as the
[Angular style guide](https://angular.dev/style-guide) recommends. A name made of a single word stays one word, such as `p-checkbox`, `p-listbox` or
`p-menubar`. The parts of a component follow the same rule.

## Directives

A directive enhances an element you write yourself, so it is an attribute, not an element. Its name is `p` followed by the name of the directive in camel case, as Angular attributes are: `pInputText` on an input,
`pButton` on a button, `pTooltip` on any element. There is no `p-input-text` element: InputText is the `pInputText` directive.

The directives that only make sense inside a TreeTable row keep the `tt` prefix of TreeTable, such as `ttRow` and `ttSortableColumn`.

## Legacy

Earlier versions accepted several spellings of the same element, such as `p-datePicker` and `p-datepicker` for `p-date-picker`, without the kebab case form being available everywhere. These spellings still work in v22,
so existing templates keep working, but the documentation, the examples and the generated code only use the kebab case form. Every component accepts the kebab case form.

## Templates

A template is an `ng-template` placed inside the component, with a reference that names it, such as `#header` or `#item`. The Templates section of the API reference of each component lists the exact names, read from the
source code of the component, with the context each template receives through `let-` variables. Names are case sensitive: write them exactly as listed, for example `#disabledDate` on the DatePicker.

