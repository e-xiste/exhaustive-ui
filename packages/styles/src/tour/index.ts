export const style = /*css*/ `
    .p-tour {
        position: fixed;
        inset: 0;
        pointer-events: none;
        animation: p-tour-fade-in dt('tour.transition.duration') ease-out;
    }

    .p-tour-mask {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
    }

    .p-tour-mask-path {
        fill: dt('tour.mask.background');
        pointer-events: auto;
        transition: d dt('tour.transition.duration') ease-in-out;
    }

    .p-tour-spotlight {
        position: absolute;
        pointer-events: none;
        box-shadow: dt('tour.spotlight.shadow');
        transition:
            top dt('tour.transition.duration') ease-in-out,
            left dt('tour.transition.duration') ease-in-out,
            width dt('tour.transition.duration') ease-in-out,
            height dt('tour.transition.duration') ease-in-out;
    }

    .p-tour-blocker {
        position: absolute;
        pointer-events: auto;
        cursor: not-allowed;
    }

    .p-tour-card {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: dt('tour.card.gap');
        box-sizing: border-box;
        width: dt('tour.card.width');
        max-width: calc(100vw - 16px);
        max-height: calc(100vh - 16px);
        padding: dt('tour.card.padding');
        pointer-events: auto;
        background: dt('tour.card.background');
        color: dt('tour.card.color');
        border: 1px solid dt('tour.card.border.color');
        border-radius: dt('tour.card.border.radius');
        box-shadow: dt('tour.card.shadow');
        outline: 0 none;
        transition:
            top dt('tour.transition.duration') ease-in-out,
            left dt('tour.transition.duration') ease-in-out,
            opacity dt('tour.transition.duration');
    }

    .p-tour-card:not(.p-tour-card-positioned),
    .p-tour-tracking .p-tour-card {
        transition: none;
    }

    .p-tour-tracking .p-tour-mask-path,
    .p-tour-tracking .p-tour-spotlight {
        transition: none;
    }

    .p-tour-card:focus-visible {
        outline: dt('tour.card.focus.ring.width') dt('tour.card.focus.ring.style') dt('tour.card.focus.ring.color');
        outline-offset: dt('tour.card.focus.ring.offset');
    }

    .p-tour-arrow {
        position: absolute;
        width: dt('tour.arrow.size');
        height: dt('tour.arrow.size');
        background: dt('tour.card.background');
        border: 1px solid dt('tour.card.border.color');
        pointer-events: none;
    }

    .p-tour-card[data-p-placement='bottom'] .p-tour-arrow {
        top: calc(dt('tour.arrow.size') / -2 - 1px);
        transform: translateX(-50%) rotate(45deg);
        clip-path: polygon(0 0, 100% 0, 0 100%);
    }

    .p-tour-card[data-p-placement='top'] .p-tour-arrow {
        bottom: calc(dt('tour.arrow.size') / -2 - 1px);
        transform: translateX(-50%) rotate(45deg);
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
    }

    .p-tour-card[data-p-placement='right'] .p-tour-arrow {
        left: calc(dt('tour.arrow.size') / -2 - 1px);
        transform: translateY(-50%) rotate(45deg);
        clip-path: polygon(0 0, 0 100%, 100% 100%);
    }

    .p-tour-card[data-p-placement='left'] .p-tour-arrow {
        right: calc(dt('tour.arrow.size') / -2 - 1px);
        transform: translateY(-50%) rotate(45deg);
        clip-path: polygon(0 0, 100% 0, 100% 100%);
    }

    .p-tour-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: dt('tour.header.gap');
    }

    .p-tour-title {
        flex: 1 1 auto;
        min-width: 0;
        align-self: center;
        font-size: dt('tour.title.font.size');
        font-weight: dt('tour.title.font.weight');
    }

    .p-tour-close-button {
        flex: 0 0 auto;
        margin-block: -0.375rem;
        margin-inline-end: -0.5rem;
    }

    .p-tour-content {
        overflow: auto;
        line-height: 1.5;
    }

    .p-tour-footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: dt('tour.footer.gap');
    }

    .p-tour-progress {
        display: flex;
        align-items: center;
        gap: dt('tour.footer.gap');
    }

    .p-tour-counter {
        color: dt('tour.counter.color');
        font-size: dt('tour.counter.font.size');
        font-variant-numeric: tabular-nums;
    }

    .p-tour-dots {
        display: flex;
        align-items: center;
        gap: dt('tour.dot.gap');
    }

    .p-tour-dot {
        width: dt('tour.dot.size');
        height: dt('tour.dot.size');
        border-radius: dt('tour.dot.size');
        background: dt('tour.dot.background');
        transition:
            width dt('tour.transition.duration'),
            background dt('tour.transition.duration');
    }

    .p-tour-dot-active {
        width: dt('tour.dot.active.width');
        background: dt('tour.dot.active.background');
    }

    .p-tour-actions {
        display: flex;
        align-items: center;
        gap: dt('tour.actions.gap');
        margin-inline-start: auto;
    }

    @keyframes p-tour-fade-in {
        from {
            opacity: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .p-tour,
        .p-tour-mask-path,
        .p-tour-spotlight,
        .p-tour-card,
        .p-tour-dot {
            animation: none;
            transition: none;
        }
    }
`;
