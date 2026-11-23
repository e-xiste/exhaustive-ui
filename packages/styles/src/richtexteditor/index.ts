export const style = /*css*/ `
    .p-richtexteditor {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 0;
        color: dt('richtexteditor.color');
        background: dt('richtexteditor.background');
        border: 1px solid dt('richtexteditor.border.color');
        border-radius: dt('richtexteditor.border.radius');
        box-shadow: dt('richtexteditor.shadow');
        outline-color: transparent;
        transition:
            background dt('richtexteditor.transition.duration'),
            border-color dt('richtexteditor.transition.duration'),
            outline-color dt('richtexteditor.transition.duration'),
            box-shadow dt('richtexteditor.transition.duration');
    }

    .p-richtexteditor:not(.p-disabled):not(.p-richtexteditor-focus):hover {
        border-color: dt('richtexteditor.hover.border.color');
    }

    .p-richtexteditor-focus {
        border-color: dt('richtexteditor.focus.border.color');
        box-shadow: dt('richtexteditor.focus.ring.shadow');
        outline: dt('richtexteditor.focus.ring.width') dt('richtexteditor.focus.ring.style') dt('richtexteditor.focus.ring.color');
        outline-offset: dt('richtexteditor.focus.ring.offset');
    }

    .p-richtexteditor.p-invalid {
        border-color: dt('richtexteditor.invalid.border.color');
    }

    .p-richtexteditor-filled {
        background: dt('richtexteditor.filled.background');
    }

    .p-richtexteditor-filled.p-richtexteditor-focus {
        background: dt('richtexteditor.filled.focus.background');
    }

    .p-richtexteditor.p-disabled {
        opacity: 1;
        background: dt('richtexteditor.disabled.background');
        color: dt('richtexteditor.disabled.color');
    }

    .p-richtexteditor-fluid {
        width: 100%;
    }

    .p-richtexteditor-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: dt('richtexteditor.toolbar.gap');
        padding: dt('richtexteditor.toolbar.padding');
        background: dt('richtexteditor.toolbar.background');
        border-block-end: 1px solid dt('richtexteditor.toolbar.border.color');
        border-start-start-radius: inherit;
        border-start-end-radius: inherit;
    }

    .p-richtexteditor-separator {
        display: inline-block;
        width: 1px;
        height: dt('richtexteditor.separator.height');
        margin: dt('richtexteditor.separator.margin');
        background: dt('richtexteditor.separator.background');
    }

    .p-richtexteditor-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: dt('richtexteditor.button.size');
        height: dt('richtexteditor.button.size');
        padding: 0;
        margin: 0;
        border: 0 none;
        border-radius: dt('richtexteditor.button.border.radius');
        background: transparent;
        color: dt('richtexteditor.button.color');
        font-family: inherit;
        font-size: dt('richtexteditor.button.font.size');
        line-height: 1;
        cursor: pointer;
        user-select: none;
        outline-color: transparent;
        transition:
            background dt('richtexteditor.transition.duration'),
            color dt('richtexteditor.transition.duration'),
            outline-color dt('richtexteditor.transition.duration'),
            box-shadow dt('richtexteditor.transition.duration');
    }

    .p-richtexteditor-button:not(:disabled):not([aria-disabled='true']):hover {
        background: dt('richtexteditor.button.hover.background');
        color: dt('richtexteditor.button.hover.color');
    }

    .p-richtexteditor-button.p-richtexteditor-button-active,
    .p-richtexteditor-button.p-richtexteditor-button-active:not(:disabled):hover {
        background: dt('richtexteditor.button.active.background');
        color: dt('richtexteditor.button.active.color');
    }

    .p-richtexteditor-button:focus-visible {
        box-shadow: dt('richtexteditor.button.focus.ring.shadow');
        outline: dt('richtexteditor.button.focus.ring.width') dt('richtexteditor.button.focus.ring.style') dt('richtexteditor.button.focus.ring.color');
        outline-offset: dt('richtexteditor.button.focus.ring.offset');
    }

    .p-richtexteditor-button:disabled,
    .p-richtexteditor-button[aria-disabled='true'] {
        cursor: default;
        opacity: 0.5;
    }

    .p-richtexteditor-button-icon {
        width: dt('richtexteditor.button.icon.size');
        height: dt('richtexteditor.button.icon.size');
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }

    .p-richtexteditor-icon-bold {
        font-weight: 800;
        font-size: 1.125em;
    }

    .p-richtexteditor-icon-italic {
        font-style: italic;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 1.125em;
    }

    .p-richtexteditor-icon-underline {
        text-decoration: underline;
        text-underline-offset: 2px;
        font-size: 1.0625em;
    }

    .p-richtexteditor-icon-strike {
        text-decoration: line-through;
        font-size: 1.0625em;
    }

    .p-richtexteditor-sm .p-richtexteditor-button {
        width: dt('richtexteditor.button.sm.size');
        height: dt('richtexteditor.button.sm.size');
    }

    .p-richtexteditor-lg .p-richtexteditor-button {
        width: dt('richtexteditor.button.lg.size');
        height: dt('richtexteditor.button.lg.size');
    }

    .p-richtexteditor-content {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: dt('richtexteditor.content.min.height');
        overflow-y: auto;
        cursor: text;
    }

    .p-richtexteditor.p-disabled .p-richtexteditor-content {
        cursor: default;
    }

    .p-richtexteditor-editor {
        position: relative;
        flex: 1 1 auto;
        padding: dt('richtexteditor.content.padding');
        font-size: dt('richtexteditor.content.font.size');
        line-height: dt('richtexteditor.content.line.height');
        color: inherit;
        outline: 0 none;
        word-wrap: break-word;
        white-space: pre-wrap;
        white-space: break-spaces;
        font-variant-ligatures: none;
        font-feature-settings: 'liga' 0;
    }

    .p-richtexteditor-sm .p-richtexteditor-editor {
        padding: dt('richtexteditor.content.sm.padding');
        font-size: dt('richtexteditor.content.sm.font.size');
    }

    .p-richtexteditor-lg .p-richtexteditor-editor {
        padding: dt('richtexteditor.content.lg.padding');
        font-size: dt('richtexteditor.content.lg.font.size');
    }

    .p-richtexteditor-editor > * {
        margin-block: 0;
    }

    .p-richtexteditor-editor > * + * {
        margin-block-start: dt('richtexteditor.content.gap');
    }

    .p-richtexteditor-editor h1,
    .p-richtexteditor-editor h2,
    .p-richtexteditor-editor h3,
    .p-richtexteditor-editor h4,
    .p-richtexteditor-editor h5,
    .p-richtexteditor-editor h6 {
        font-family: inherit;
        color: dt('richtexteditor.heading.color');
        font-weight: dt('richtexteditor.heading.font.weight');
        line-height: dt('richtexteditor.heading.line.height');
    }

    .p-richtexteditor-editor h1 {
        font-size: dt('richtexteditor.heading.h1.font.size');
    }

    .p-richtexteditor-editor h2 {
        font-size: dt('richtexteditor.heading.h2.font.size');
    }

    .p-richtexteditor-editor h3 {
        font-size: dt('richtexteditor.heading.h3.font.size');
    }

    .p-richtexteditor-editor h4,
    .p-richtexteditor-editor h5,
    .p-richtexteditor-editor h6 {
        font-size: 1em;
    }

    .p-richtexteditor-editor ul,
    .p-richtexteditor-editor ol {
        padding-inline-start: 1.5em;
    }

    .p-richtexteditor-editor ul {
        list-style: disc;
    }

    .p-richtexteditor-editor ol {
        list-style: decimal;
    }

    .p-richtexteditor-editor ul ul {
        list-style: circle;
    }

    .p-richtexteditor-editor li::marker {
        color: dt('richtexteditor.blockquote.color');
    }

    .p-richtexteditor-editor li > p {
        margin: 0;
    }

    .p-richtexteditor-editor li + li {
        margin-block-start: 0.25em;
    }

    .p-richtexteditor-editor a {
        color: dt('richtexteditor.link.color');
        text-decoration: underline;
        text-underline-offset: 2px;
        cursor: text;
    }

    .p-richtexteditor-editor a:hover {
        color: dt('richtexteditor.link.hover.color');
    }

    .p-richtexteditor-editor code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
        font-size: dt('richtexteditor.code.font.size');
        padding: dt('richtexteditor.code.padding');
        border-radius: dt('richtexteditor.code.border.radius');
        background: dt('richtexteditor.code.background');
        color: dt('richtexteditor.code.color');
    }

    .p-richtexteditor-editor pre {
        padding: dt('richtexteditor.code.block.padding');
        border-radius: dt('richtexteditor.code.block.border.radius');
        background: dt('richtexteditor.code.block.background');
        color: dt('richtexteditor.code.block.color');
        overflow-x: auto;
        white-space: pre-wrap;
    }

    .p-richtexteditor-editor pre code {
        padding: 0;
        background: transparent;
        color: inherit;
        border-radius: 0;
    }

    .p-richtexteditor-editor blockquote {
        margin-inline: 0;
        padding: dt('richtexteditor.blockquote.padding');
        border-inline-start: dt('richtexteditor.blockquote.border.width') solid dt('richtexteditor.blockquote.border.color');
        color: dt('richtexteditor.blockquote.color');
    }

    .p-richtexteditor-editor hr {
        border: 0 none;
        border-block-start: 1px solid dt('richtexteditor.toolbar.border.color');
        margin-block: 1em;
    }

    .p-richtexteditor-editor .p-richtexteditor-placeholder::before {
        content: attr(data-placeholder);
        float: inline-start;
        height: 0;
        color: dt('richtexteditor.content.placeholder.color');
        pointer-events: none;
    }

    .p-richtexteditor-editor:not(.ProseMirror)::before {
        content: attr(data-placeholder);
        color: dt('richtexteditor.content.placeholder.color');
    }

    .p-richtexteditor-editor [contenteditable='false'] {
        white-space: normal;
    }

    .p-richtexteditor-editor [contenteditable='false'] [contenteditable='true'] {
        white-space: pre-wrap;
    }

    .p-richtexteditor-editor img.ProseMirror-separator {
        display: inline !important;
        border: none !important;
        margin: 0 !important;
        width: 0 !important;
        height: 0 !important;
    }

    .p-richtexteditor-editor .ProseMirror-gapcursor {
        display: none;
        pointer-events: none;
        position: absolute;
        margin: 0;
    }

    .p-richtexteditor-editor .ProseMirror-gapcursor::after {
        content: '';
        display: block;
        position: absolute;
        top: -2px;
        width: 20px;
        border-top: 1px solid currentColor;
        animation: p-richtexteditor-cursor-blink 1.1s steps(2, start) infinite;
    }

    .p-richtexteditor-editor.ProseMirror-focused .ProseMirror-gapcursor {
        display: block;
    }

    .p-richtexteditor-editor.ProseMirror-hideselection *::selection {
        background: transparent;
    }

    .p-richtexteditor-editor.ProseMirror-hideselection * {
        caret-color: transparent;
    }

    @keyframes p-richtexteditor-cursor-blink {
        to {
            visibility: hidden;
        }
    }

    .p-richtexteditor-link-panel {
        position: absolute;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: dt('richtexteditor.link.panel.gap');
        width: dt('richtexteditor.link.panel.width');
        max-width: 100%;
        box-sizing: border-box;
        padding: dt('richtexteditor.link.panel.padding');
        background: dt('richtexteditor.link.panel.background');
        color: dt('richtexteditor.link.panel.color');
        border: 1px solid dt('richtexteditor.link.panel.border.color');
        border-radius: dt('richtexteditor.link.panel.border.radius');
        box-shadow: dt('richtexteditor.link.panel.shadow');
    }

    .p-richtexteditor-link-label {
        font-weight: 500;
        font-size: 0.875rem;
    }

    .p-richtexteditor-link-input {
        font-family: inherit;
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
        padding: dt('richtexteditor.link.input.padding');
        color: dt('richtexteditor.link.input.color');
        background: dt('richtexteditor.link.input.background');
        border: 1px solid dt('richtexteditor.link.input.border.color');
        border-radius: dt('richtexteditor.link.input.border.radius');
        outline-color: transparent;
        appearance: none;
    }

    .p-richtexteditor-link-input::placeholder {
        color: dt('richtexteditor.link.input.placeholder.color');
    }

    .p-richtexteditor-link-input:focus {
        border-color: dt('richtexteditor.link.input.focus.border.color');
        box-shadow: dt('richtexteditor.link.input.focus.ring.shadow');
        outline: dt('richtexteditor.link.input.focus.ring.width') dt('richtexteditor.link.input.focus.ring.style') dt('richtexteditor.link.input.focus.ring.color');
        outline-offset: dt('richtexteditor.link.input.focus.ring.offset');
    }

    .p-richtexteditor-link-input[aria-invalid='true'] {
        border-color: dt('richtexteditor.link.input.invalid.border.color');
    }

    .p-richtexteditor-link-error {
        font-size: 0.875rem;
        color: dt('richtexteditor.link.panel.error.color');
    }

    .p-richtexteditor-link-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: dt('richtexteditor.link.panel.gap');
    }

    .p-richtexteditor-link-button {
        font-family: inherit;
        font-size: 0.875rem;
        font-weight: dt('richtexteditor.link.button.font.weight');
        padding: dt('richtexteditor.link.button.padding');
        border: 0 none;
        border-radius: dt('richtexteditor.link.button.border.radius');
        background: transparent;
        color: dt('richtexteditor.link.button.color');
        cursor: pointer;
        outline-color: transparent;
    }

    .p-richtexteditor-link-button:hover {
        background: dt('richtexteditor.link.button.hover.background');
    }

    .p-richtexteditor-link-button:focus-visible {
        box-shadow: dt('richtexteditor.link.button.focus.ring.shadow');
        outline: dt('richtexteditor.link.button.focus.ring.width') dt('richtexteditor.link.button.focus.ring.style') dt('richtexteditor.link.button.focus.ring.color');
        outline-offset: dt('richtexteditor.link.button.focus.ring.offset');
    }

    .p-richtexteditor-link-apply,
    .p-richtexteditor-link-apply:hover {
        background: dt('richtexteditor.link.button.apply.background');
        color: dt('richtexteditor.link.button.apply.color');
    }

    .p-richtexteditor-link-apply:hover {
        background: dt('richtexteditor.link.button.apply.hover.background');
    }

    .p-richtexteditor-footer {
        display: flex;
        justify-content: flex-end;
        padding: dt('richtexteditor.footer.padding');
        border-block-start: 1px solid dt('richtexteditor.footer.border.color');
        color: dt('richtexteditor.footer.color');
        font-size: dt('richtexteditor.footer.font.size');
    }

    .p-richtexteditor-count {
        font-variant-numeric: tabular-nums;
    }

    .p-richtexteditor-count-limit {
        color: dt('richtexteditor.footer.limit.color');
    }

    @media (prefers-reduced-motion: reduce) {
        .p-richtexteditor,
        .p-richtexteditor-button {
            transition: none;
        }
    }
`;
