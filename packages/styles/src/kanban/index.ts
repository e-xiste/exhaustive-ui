export const style = /*css*/ `
    .p-kanban {
        display: block;
        position: relative;
        min-width: 0;
        max-width: 100%;
    }

    .p-kanban-board {
        display: flex;
        align-items: flex-start;
        gap: dt('kanban.board.gap');
        padding: dt('kanban.board.padding');
        box-sizing: border-box;
        /* positioned, so that the visually hidden texts of the columns are clipped with them */
        position: relative;
        /* the columns never widen the page: the board takes the width of its container and scrolls */
        width: 0;
        min-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        overscroll-behavior-x: contain;
        scrollbar-width: thin;
    }

    /*
     * the edges of a board that scrolls fade out, so that a column cut by the edge reads as more to scroll; the scrollbar
     * stays visible as well, thin, and a second mask layer keeps it out of the fade
     */
    .p-kanban-board-overflow-left,
    .p-kanban-board-overflow-right {
        mask-size:
            100% 100%,
            100% 0.75rem;
        mask-position:
            0 0,
            0 100%;
        mask-repeat: no-repeat;
    }

    .p-kanban-board-overflow-left {
        mask-image: linear-gradient(to right, transparent, #000 2.5rem), linear-gradient(#000, #000);
    }

    .p-kanban-board-overflow-right {
        mask-image: linear-gradient(to left, transparent, #000 2.5rem), linear-gradient(#000, #000);
    }

    .p-kanban-board-overflow-left.p-kanban-board-overflow-right {
        mask-image: linear-gradient(to right, transparent, #000 2.5rem, #000 calc(100% - 2.5rem), transparent), linear-gradient(#000, #000);
    }

    .p-kanban-scrollable .p-kanban-board {
        align-items: stretch;
    }

    .p-kanban-column {
        display: flex;
        flex-direction: column;
        /* columns shrink to their min width before the board scrolls */
        flex: 0 1 dt('kanban.column.width');
        min-width: dt('kanban.column.min.width');
        max-height: 100%;
        box-sizing: border-box;
        padding: dt('kanban.column.padding');
        background: dt('kanban.column.background');
        border: 1px solid dt('kanban.column.border.color');
        border-radius: dt('kanban.column.border.radius');
        transition:
            border-color dt('kanban.transition.duration'),
            background dt('kanban.transition.duration');
    }

    .p-kanban-column-over-limit {
        border-color: dt('kanban.column.over.limit.border.color');
        background: dt('kanban.column.over.limit.background');
    }

    .p-kanban-column-refused {
        border-color: dt('kanban.column.refused.border.color');
        border-style: dashed;
        cursor: no-drop;
    }

    .p-kanban-column-collapsed {
        flex: 0 0 auto;
        width: dt('kanban.column.collapsed.width');
        /* grows when the count, such as "12 / 15", is wider than the strip */
        min-width: min-content;
        /* as tall as the other columns of the board */
        align-self: stretch;
        padding-inline: 0.25rem;
        align-items: center;
    }

    .p-kanban-collapsible .p-kanban-column-collapsed {
        cursor: pointer;
    }

    .p-kanban-collapsible .p-kanban-column-collapsed:hover {
        background: dt('kanban.column.collapsed.hover.background');
    }

    .p-kanban-collapsible .p-kanban-column-collapsed:hover .p-kanban-column-toggle {
        background: dt('kanban.column.action.hover.background');
        color: dt('kanban.column.action.hover.color');
    }

    .p-kanban-column-header {
        display: flex;
        align-items: center;
        gap: dt('kanban.column.header.gap');
        padding: dt('kanban.column.header.padding');
        color: dt('kanban.column.header.color');
        flex: 0 0 auto;
        min-width: 0;
    }

    .p-kanban-column-collapsed .p-kanban-column-header {
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
        padding: 0;
    }

    .p-kanban-column-heading {
        display: flex;
        align-items: center;
        gap: dt('kanban.column.header.gap');
        flex: 1 1 auto;
        min-width: 0;
    }

    .p-kanban-column-collapsed .p-kanban-column-heading {
        flex-direction: column;
        min-height: 0;
        max-width: 100%;
        overflow: hidden;
    }

    /* only the title is written vertically: the count stays horizontal, above it */
    .p-kanban-column-collapsed .p-kanban-column-title {
        writing-mode: vertical-rl;
        /* takes the height left in the strip, without making it taller than the other columns */
        flex: 1 1 0;
        min-height: 4rem;
        max-height: 100%;
    }

    /* in right-to-left layouts the vertical title starts at the bottom: keep it under the count */
    .p-kanban-column-collapsed .p-kanban-column-title:dir(rtl) {
        text-align: end;
    }

    .p-kanban-column-title {
        font-weight: dt('kanban.column.header.font.weight');
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
    }

    .p-kanban-column-count {
        flex: 0 0 auto;
        padding: dt('kanban.column.count.padding');
        border-radius: dt('kanban.column.count.border.radius');
        font-size: dt('kanban.column.count.font.size');
        font-weight: dt('kanban.column.count.font.weight');
        line-height: 1.25;
        background: dt('kanban.column.count.background');
        color: dt('kanban.column.count.color');
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }

    .p-kanban-column-collapsed .p-kanban-column-count {
        order: -1;
        max-width: 100%;
        box-sizing: border-box;
    }

    .p-kanban-column-collapsed .p-kanban-column-toggle svg:dir(rtl) {
        transform: scaleX(-1);
    }

    .p-kanban-column-count-full {
        background: dt('kanban.column.count.full.background');
        color: dt('kanban.column.count.full.color');
    }

    .p-kanban-column-count-over-limit {
        background: dt('kanban.column.count.over.limit.background');
        color: dt('kanban.column.count.over.limit.color');
    }

    .p-kanban-column-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: dt('kanban.column.action.size');
        height: dt('kanban.column.action.size');
        padding: 0;
        margin: 0;
        border: 0 none;
        border-radius: dt('kanban.column.action.border.radius');
        background: transparent;
        color: dt('kanban.column.action.color');
        cursor: pointer;
        outline-color: transparent;
        transition:
            background dt('kanban.transition.duration'),
            color dt('kanban.transition.duration'),
            outline-color dt('kanban.transition.duration'),
            box-shadow dt('kanban.transition.duration');
    }

    .p-kanban-column-handle {
        cursor: grab;
        touch-action: none;
    }

    .p-kanban-column-action:hover {
        background: dt('kanban.column.action.hover.background');
        color: dt('kanban.column.action.hover.color');
    }

    .p-kanban-column-action:focus-visible {
        box-shadow: dt('kanban.column.action.focus.ring.shadow');
        outline: dt('kanban.column.action.focus.ring.width') dt('kanban.column.action.focus.ring.style') dt('kanban.column.action.focus.ring.color');
        outline-offset: dt('kanban.column.action.focus.ring.offset');
    }

    .p-kanban-column-handle[aria-pressed='true'] {
        background: dt('kanban.column.action.grabbed.background');
        color: dt('kanban.column.action.grabbed.color');
    }

    .p-kanban-column-content {
        display: flex;
        flex-direction: column;
        gap: dt('kanban.column.gap');
        flex: 1 1 auto;
        min-height: 3rem;
        overflow-y: auto;
        margin: -4px;
        padding: 4px;
        border-radius: dt('kanban.column.border.radius');
        transition: background dt('kanban.transition.duration');
    }

    .p-kanban-column-content.cdk-drop-list-dragging,
    .p-kanban-column-content.cdk-drop-list-receiving {
        background: dt('kanban.column.drop.target.background');
    }

    .p-kanban-column-content.cdk-drop-list-dragging .p-kanban-empty {
        display: none;
    }

    .p-kanban-card-item {
        display: block;
        border-radius: dt('kanban.card.border.radius');
    }

    .p-kanban-card {
        display: block;
        box-sizing: border-box;
        padding: dt('kanban.card.padding');
        background: dt('kanban.card.background');
        color: dt('kanban.card.color');
        border: 1px solid dt('kanban.card.border.color');
        border-radius: dt('kanban.card.border.radius');
        box-shadow: dt('kanban.card.shadow');
        cursor: grab;
        overflow-wrap: anywhere;
        outline-color: transparent;
        user-select: none;
        -webkit-user-select: none;
        transition:
            border-color dt('kanban.transition.duration'),
            box-shadow dt('kanban.transition.duration'),
            outline-color dt('kanban.transition.duration'),
            transform dt('kanban.transition.duration');
    }

    .p-kanban-card:hover {
        border-color: dt('kanban.card.hover.border.color');
    }

    .p-kanban-card:focus-visible {
        box-shadow: dt('kanban.card.focus.ring.shadow');
        outline: dt('kanban.card.focus.ring.width') dt('kanban.card.focus.ring.style') dt('kanban.card.focus.ring.color');
        outline-offset: dt('kanban.card.focus.ring.offset');
    }

    .p-kanban-card-grabbed,
    .p-kanban-card-grabbed:hover {
        border-color: dt('kanban.card.grabbed.border.color');
        box-shadow: dt('kanban.card.grabbed.shadow');
        transform: rotate(-1deg);
    }

    .p-kanban-card-disabled,
    .p-kanban-card-disabled:hover {
        cursor: default;
        background: dt('kanban.card.disabled.background');
        color: dt('kanban.card.disabled.color');
        border-color: dt('kanban.card.border.color');
        box-shadow: none;
    }

    .p-kanban-card-item.cdk-drag-placeholder {
        background: dt('kanban.placeholder.background');
        outline: 2px dashed dt('kanban.placeholder.border.color');
        outline-offset: -2px;
        border-radius: dt('kanban.placeholder.border.radius');
    }

    .p-kanban-card-item.cdk-drag-placeholder > * {
        visibility: hidden;
    }

    .p-kanban-column.cdk-drag-placeholder {
        background: dt('kanban.placeholder.background');
        border: 2px dashed dt('kanban.placeholder.border.color');
    }

    .p-kanban-column.cdk-drag-placeholder > * {
        visibility: hidden;
    }

    .p-kanban-card-preview {
        box-sizing: border-box;
        list-style: none;
    }

    .p-kanban-card-preview .p-kanban-card {
        cursor: grabbing;
        box-shadow: dt('kanban.preview.shadow');
        transform: rotate(2deg);
    }

    .p-kanban-column-preview {
        box-shadow: dt('kanban.preview.shadow');
        cursor: grabbing;
    }

    .p-kanban-board.cdk-drop-list-dragging .p-kanban-column:not(.cdk-drag-placeholder),
    .p-kanban-column-content.cdk-drop-list-dragging .p-kanban-card-item:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drag-animating.p-kanban-card-item,
    .cdk-drag-animating.p-kanban-column {
        transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
    }

    .p-kanban-empty {
        padding: dt('kanban.empty.padding');
        color: dt('kanban.empty.color');
        font-size: dt('kanban.empty.font.size');
        text-align: center;
        border: 1px dashed dt('kanban.empty.border.color');
        border-radius: dt('kanban.empty.border.radius');
    }

    .p-kanban-column-footer {
        display: flex;
        flex-direction: column;
        gap: dt('kanban.column.gap');
        flex: 0 0 auto;
        padding-top: dt('kanban.column.gap');
    }

    .p-kanban-add-button {
        display: flex;
        align-items: center;
        gap: dt('kanban.add.button.gap');
        width: 100%;
        margin: 0;
        padding: dt('kanban.add.button.padding');
        border: 0 none;
        border-radius: dt('kanban.add.button.border.radius');
        background: transparent;
        color: dt('kanban.add.button.color');
        font-family: inherit;
        font-size: inherit;
        font-weight: dt('kanban.add.button.font.weight');
        text-align: start;
        cursor: pointer;
        outline-color: transparent;
        transition:
            background dt('kanban.transition.duration'),
            color dt('kanban.transition.duration'),
            outline-color dt('kanban.transition.duration'),
            box-shadow dt('kanban.transition.duration');
    }

    .p-kanban-add-button:enabled:hover {
        background: dt('kanban.add.button.hover.background');
        color: dt('kanban.add.button.hover.color');
    }

    .p-kanban-add-button:focus-visible {
        box-shadow: dt('kanban.add.button.focus.ring.shadow');
        outline: dt('kanban.add.button.focus.ring.width') dt('kanban.add.button.focus.ring.style') dt('kanban.add.button.focus.ring.color');
        outline-offset: dt('kanban.add.button.focus.ring.offset');
    }

    .p-kanban-add-button:disabled {
        cursor: default;
        opacity: 0.6;
    }

    .p-kanban-disabled .p-kanban-card,
    .p-kanban-disabled .p-kanban-column-handle {
        cursor: default;
    }

    @media (max-width: 640px) {
        .p-kanban-board {
            scroll-snap-type: x mandatory;
            scroll-padding-inline: dt('kanban.board.gap');
        }

        .p-kanban-column {
            scroll-snap-align: start;
        }

        .p-kanban-column:not(.p-kanban-column-collapsed) {
            flex-basis: min(85%, dt('kanban.column.width'));
        }

        .p-kanban-dragging .p-kanban-board {
            scroll-snap-type: none;
        }
    }

    @keyframes p-kanban-fade-in {
        from {
            opacity: 0;
        }
    }

    /* folding and unfolding a column fades its new content in */
    .p-kanban-column-collapsed > .p-kanban-column-header,
    .p-kanban-column-content,
    .p-kanban-column-footer {
        animation: p-kanban-fade-in dt('kanban.transition.duration') ease-out;
    }

    @media (prefers-reduced-motion: reduce) {
        .p-kanban-column-collapsed > .p-kanban-column-header,
        .p-kanban-column-content,
        .p-kanban-column-footer {
            animation: none;
        }

        .p-kanban-card,
        .p-kanban-card-grabbed,
        .p-kanban-card-preview .p-kanban-card {
            transform: none;
            transition: none;
        }
    }
`;
