export const style = /*css*/ `
    .p-mention {
        display: inline-flex;
        position: relative;
        vertical-align: top;
    }

    .p-mention-fluid {
        display: flex;
        width: 100%;
    }

    .p-mention-input {
        flex: 1 1 auto;
        min-width: 0;
    }

    .p-mention-anchor {
        position: absolute;
        pointer-events: none;
        width: min(dt('mention.overlay.width'), 100%);
    }

    .p-mention-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('mention.overlay.background');
        color: dt('mention.overlay.color');
        border: 1px solid dt('mention.overlay.border.color');
        border-radius: dt('mention.overlay.border.radius');
        box-shadow: dt('mention.overlay.shadow');
        max-width: calc(100vw - 2rem);
    }

    .p-mention-list-container {
        overflow: auto;
    }

    .p-mention-list {
        margin: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: dt('mention.list.gap');
        padding: dt('mention.list.padding');
    }

    .p-mention-option {
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: dt('mention.option.gap');
        padding: dt('mention.option.padding');
        border: 0 none;
        color: dt('mention.option.color');
        background: transparent;
        transition:
            background dt('mention.transition.duration'),
            color dt('mention.transition.duration');
        border-radius: dt('mention.option.border.radius');
    }

    .p-mention-option.p-focus,
    .p-mention-option:hover {
        background: dt('mention.option.focus.background');
        color: dt('mention.option.focus.color');
    }

    .p-mention-option-label {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .p-mention-empty-message,
    .p-mention-loader {
        display: flex;
        align-items: center;
        gap: dt('mention.option.gap');
        padding: dt('mention.empty.message.padding');
        color: dt('mention.empty.message.color');
    }

    @media (prefers-reduced-motion: reduce) {
        .p-mention-option {
            transition: none;
        }
    }
`;
