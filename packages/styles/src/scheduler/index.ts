export const style = /*css*/ `
    .p-scheduler {
        display: flex;
        flex-direction: column;
        gap: dt('scheduler.gap');
        min-width: 0;
        background: dt('scheduler.background');
        color: dt('scheduler.color');
        border: 1px solid dt('scheduler.border.color');
        border-radius: dt('scheduler.border.radius');
        overflow: hidden;
    }

    .p-scheduler-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: dt('scheduler.header.gap');
        padding: dt('scheduler.header.padding');
    }

    .p-scheduler-navigation {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .p-scheduler-title {
        flex: 1 1 auto;
        min-width: 0;
        font-size: dt('scheduler.title.font.size');
        font-weight: dt('scheduler.title.font.weight');
        color: dt('scheduler.title.color');
    }

    .p-scheduler-nav-icon:dir(rtl) {
        transform: scaleX(-1);
    }

    /* Month */

    .p-scheduler-month {
        display: flex;
        flex-direction: column;
        border-top: 1px solid dt('scheduler.grid.border.color');
    }

    .p-scheduler-weekdays,
    .p-scheduler-week {
        display: grid;
        grid-template-columns: repeat(var(--p-scheduler-columns, 7), minmax(0, 1fr));
    }

    .p-scheduler-weekday {
        padding: dt('scheduler.weekday.padding');
        text-align: center;
        color: dt('scheduler.weekday.color');
        font-size: dt('scheduler.weekday.font.size');
        font-weight: dt('scheduler.weekday.font.weight');
        border-bottom: 1px solid dt('scheduler.grid.border.color');
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .p-scheduler-day {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: dt('scheduler.day.gap');
        min-width: 0;
        min-height: dt('scheduler.day.min.height');
        padding: dt('scheduler.day.padding');
        border-inline-end: 1px solid dt('scheduler.grid.border.color');
        border-bottom: 1px solid dt('scheduler.grid.border.color');
        outline-color: transparent;
        transition:
            background dt('scheduler.transition.duration'),
            outline-color dt('scheduler.transition.duration');
    }

    .p-scheduler-week > .p-scheduler-day:last-child {
        border-inline-end: 0 none;
    }

    .p-scheduler-week:last-child > .p-scheduler-day {
        border-bottom: 0 none;
    }

    .p-scheduler-selectable .p-scheduler-day {
        user-select: none;
    }

    .p-scheduler-day:focus-visible,
    .p-scheduler-slot:focus-visible {
        box-shadow: dt('scheduler.day.focus.ring.shadow');
        outline: dt('scheduler.day.focus.ring.width') dt('scheduler.day.focus.ring.style') dt('scheduler.day.focus.ring.color');
        outline-offset: calc(-1 * dt('scheduler.day.focus.ring.width'));
        z-index: 2;
    }

    .p-scheduler-day-outside {
        background: dt('scheduler.day.outside.background');
    }

    .p-scheduler-day-outside .p-scheduler-day-number {
        color: dt('scheduler.day.outside.color');
    }

    .p-scheduler-day-selected {
        background: dt('scheduler.day.selected.background');
    }

    .p-scheduler-day-number,
    .p-scheduler-column-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        align-self: flex-start;
        min-width: dt('scheduler.day.number.size');
        height: dt('scheduler.day.number.size');
        padding: 0 0.25rem;
        border-radius: dt('scheduler.day.number.border.radius');
        font-size: dt('scheduler.day.number.font.size');
        font-weight: dt('scheduler.day.number.font.weight');
        color: dt('scheduler.day.number.color');
        font-variant-numeric: tabular-nums;
    }

    .p-scheduler-day-number.p-scheduler-today,
    .p-scheduler-day-outside .p-scheduler-day-number.p-scheduler-today,
    .p-scheduler-column-number.p-scheduler-today {
        background: dt('scheduler.today.number.background');
        color: dt('scheduler.today.number.color');
        font-weight: dt('scheduler.today.font.weight');
    }

    .p-scheduler-more {
        align-self: flex-start;
        margin: 0;
        padding: dt('scheduler.more.padding');
        border: 0 none;
        border-radius: dt('scheduler.more.border.radius');
        background: transparent;
        color: dt('scheduler.more.color');
        font-family: inherit;
        font-size: dt('scheduler.more.font.size');
        font-weight: dt('scheduler.more.font.weight');
        cursor: pointer;
        outline-color: transparent;
    }

    .p-scheduler-more:hover {
        background: dt('scheduler.more.hover.background');
        color: dt('scheduler.more.hover.color');
    }

    /* Events */

    .p-scheduler-event {
        display: flex;
        align-items: baseline;
        gap: dt('scheduler.event.gap');
        width: 100%;
        min-width: 0;
        margin: 0;
        padding: dt('scheduler.event.padding');
        border: 0 none;
        border-inline-start: dt('scheduler.event.border.width') solid dt('scheduler.event.border.color');
        border-radius: dt('scheduler.event.border.radius');
        background: dt('scheduler.event.background');
        color: dt('scheduler.event.color');
        font-family: inherit;
        font-size: dt('scheduler.event.font.size');
        line-height: 1.35;
        text-align: start;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;
        outline-color: transparent;
        transition:
            box-shadow dt('scheduler.transition.duration'),
            opacity dt('scheduler.transition.duration'),
            outline-color dt('scheduler.transition.duration');
    }

    .p-scheduler-event:hover {
        box-shadow: dt('scheduler.event.hover.shadow');
    }

    .p-scheduler-event:focus-visible,
    .p-scheduler-more:focus-visible {
        box-shadow: dt('scheduler.event.focus.ring.shadow');
        outline: dt('scheduler.event.focus.ring.width') dt('scheduler.event.focus.ring.style') dt('scheduler.event.focus.ring.color');
        outline-offset: dt('scheduler.event.focus.ring.offset');
        z-index: 3;
    }

    .p-scheduler-event-title {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: dt('scheduler.event.font.weight');
    }

    .p-scheduler-event-time {
        flex-shrink: 0;
        font-variant-numeric: tabular-nums;
    }

    .p-scheduler-event-continues-before {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    .p-scheduler-event-continues-after {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-scheduler-event-editable {
        cursor: grab;
    }

    .p-scheduler-event-dragging {
        opacity: dt('scheduler.event.dragging.opacity');
    }

    .p-scheduler-ghost {
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        cursor: grabbing;
    }

    .p-scheduler-event-content {
        display: flex;
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
    }

    .p-scheduler-event-block {
        position: absolute;
        z-index: 1;
        flex-wrap: wrap;
        align-content: flex-start;
        column-gap: dt('scheduler.event.gap');
        row-gap: 0;
        box-shadow: 0 0 0 1px dt('scheduler.background');
    }

    /* An event of one slot or less: the title and the time share one line, never cut in half */
    .p-scheduler-event-block.p-scheduler-event-compact {
        flex-wrap: nowrap;
        align-items: center;
        min-height: calc(1.35em + 0.25rem);
        padding-block: 0;
    }

    /* the time gives its room to the title first */
    .p-scheduler-event-block.p-scheduler-event-compact .p-scheduler-event-time {
        flex-shrink: 100;
    }

    .p-scheduler-event-block:hover {
        box-shadow:
            0 0 0 1px dt('scheduler.background'),
            dt('scheduler.event.hover.shadow');
    }

    .p-scheduler-event-block .p-scheduler-event-time {
        flex-shrink: 1;
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .p-scheduler-event-block.p-scheduler-ghost {
        inset-inline: 0;
        z-index: 4;
    }

    .p-scheduler-resize-handle {
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        height: 0.5rem;
        cursor: ns-resize;
        touch-action: none;
    }

    .p-scheduler-resize-handle::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 50%;
        width: 1.25rem;
        height: 2px;
        margin-left: -0.625rem;
        border-radius: 1px;
        background: currentColor;
        opacity: 0;
        transition: opacity dt('scheduler.transition.duration');
    }

    .p-scheduler-event-block:hover .p-scheduler-resize-handle::after,
    .p-scheduler-event-block:focus-visible .p-scheduler-resize-handle::after {
        opacity: 0.6;
    }

    .p-scheduler-event-item {
        align-items: center;
        gap: dt('scheduler.agenda.item.gap');
        padding: dt('scheduler.agenda.item.padding');
        border-inline-start: 0 none;
        border-radius: dt('scheduler.agenda.item.border.radius');
        background: transparent;
        color: dt('scheduler.color');
        font-size: 0.875rem;
        white-space: normal;
    }

    .p-scheduler-event-item:hover {
        background: dt('scheduler.agenda.item.hover.background');
        box-shadow: none;
    }

    .p-scheduler-event-item .p-scheduler-event-time {
        color: dt('scheduler.agenda.time.color');
    }

    .p-scheduler-event-item .p-scheduler-event-title {
        white-space: nowrap;
    }

    .p-scheduler-event-dot {
        flex-shrink: 0;
        align-self: center;
        width: dt('scheduler.agenda.dot.size');
        height: dt('scheduler.agenda.dot.size');
        border-radius: 50%;
        background: dt('scheduler.event.border.color');
    }

    /* Week and day */

    .p-scheduler-time-grid {
        display: flex;
        flex-direction: column;
        min-width: 0;
        overflow-x: auto;
        border-top: 1px solid dt('scheduler.grid.border.color');
    }

    .p-scheduler-column-headers,
    .p-scheduler-all-day,
    .p-scheduler-body-content {
        display: grid;
        grid-template-columns: dt('scheduler.time.label.width') repeat(var(--p-scheduler-columns, 7), minmax(3rem, 1fr));
    }

    .p-scheduler-time-grid > * {
        min-width: calc(dt('scheduler.time.label.width') + var(--p-scheduler-columns, 7) * 3rem + 1rem);
    }

    .p-scheduler-column-headers,
    .p-scheduler-all-day {
        overflow: hidden;
        scrollbar-gutter: stable;
    }

    .p-scheduler-column-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.125rem;
        min-width: 0;
        padding: dt('scheduler.column.header.padding');
        color: dt('scheduler.column.header.color');
        font-size: dt('scheduler.column.header.font.size');
        border-inline-start: 1px solid dt('scheduler.grid.border.color');
    }

    .p-scheduler-column-number {
        align-self: center;
        min-width: 2.25rem;
        height: 2.25rem;
        font-size: dt('scheduler.column.header.number.font.size');
        font-weight: dt('scheduler.column.header.number.font.weight');
    }

    .p-scheduler-all-day {
        border-top: 1px solid dt('scheduler.grid.border.color');
    }

    .p-scheduler-all-day-label {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0.25rem 0.5rem;
        color: dt('scheduler.all.day.label.color');
        font-size: dt('scheduler.all.day.label.font.size');
        text-align: end;
    }

    .p-scheduler-all-day-cell {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        min-height: dt('scheduler.all.day.min.height');
        padding: 2px;
        border-inline-start: 1px solid dt('scheduler.grid.border.color');
    }

    .p-scheduler-body {
        overflow-y: auto;
        scrollbar-gutter: stable;
        border-top: 1px solid dt('scheduler.grid.border.color');
        overscroll-behavior: contain;
    }

    .p-scheduler-time-gutter,
    .p-scheduler-column {
        display: grid;
        grid-template-rows: repeat(var(--p-scheduler-slots, 48), dt('scheduler.slot.height'));
    }

    .p-scheduler-time-label {
        padding: 0.125rem 0.5rem 0;
        color: dt('scheduler.time.label.color');
        font-size: dt('scheduler.time.label.font.size');
        line-height: 1;
        text-align: end;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
    }

    .p-scheduler-slot + .p-scheduler-slot {
        border-top: 1px dashed dt('scheduler.grid.slot.border.color');
    }

    .p-scheduler-slot + .p-scheduler-slot-hour {
        border-top-style: solid;
        border-top-color: dt('scheduler.grid.border.color');
    }

    .p-scheduler-column {
        position: relative;
        min-width: 0;
        border-inline-start: 1px solid dt('scheduler.grid.border.color');
    }

    .p-scheduler-slot {
        position: relative;
        outline-color: transparent;
    }

    .p-scheduler-selectable .p-scheduler-column {
        user-select: none;
    }

    .p-scheduler-selectable .p-scheduler-slot:hover {
        background: dt('scheduler.slot.hover.background');
    }

    .p-scheduler-now-indicator {
        position: absolute;
        inset-inline: 0;
        z-index: 2;
        height: dt('scheduler.now.indicator.size');
        background: dt('scheduler.now.indicator.color');
        transform: translateY(-50%);
        pointer-events: none;
    }

    .p-scheduler-now-indicator::before {
        content: '';
        position: absolute;
        top: 50%;
        inset-inline-start: -0.3125rem;
        width: 0.625rem;
        height: 0.625rem;
        border-radius: 50%;
        background: dt('scheduler.now.indicator.color');
        transform: translateY(-50%);
    }

    .p-scheduler-selection {
        position: absolute;
        inset-inline: 0;
        z-index: 1;
        border: 1px solid dt('scheduler.selection.border.color');
        border-radius: 4px;
        background: dt('scheduler.selection.background');
        pointer-events: none;
    }

    /* Agenda */

    .p-scheduler-agenda {
        display: flex;
        flex-direction: column;
        gap: dt('scheduler.agenda.gap');
        padding: dt('scheduler.agenda.padding');
        border-top: 1px solid dt('scheduler.grid.border.color');
    }

    .p-scheduler-agenda-date {
        padding: dt('scheduler.agenda.date.padding');
        color: dt('scheduler.agenda.date.color');
        font-weight: dt('scheduler.agenda.date.font.weight');
        border-bottom: 1px solid dt('scheduler.agenda.date.border.color');
    }

    .p-scheduler-agenda-list,
    .p-scheduler-popover-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .p-scheduler-agenda-list {
        padding-top: 0.25rem;
    }

    .p-scheduler-agenda .p-scheduler-event-item .p-scheduler-event-time {
        flex: 0 0 auto;
        min-width: dt('scheduler.agenda.time.width');
        white-space: nowrap;
    }

    .p-scheduler-popover-list .p-scheduler-event-item .p-scheduler-event-time {
        min-width: 4.5rem;
    }

    .p-scheduler-empty {
        padding: dt('scheduler.empty.padding');
        color: dt('scheduler.empty.color');
        text-align: center;
    }

    /* Popover of the "+N more" button */

    .p-scheduler-popover-header {
        margin-bottom: 0.5rem;
        font-weight: dt('scheduler.popover.header.font.weight');
    }

    .p-scheduler-popover-list {
        gap: dt('scheduler.popover.gap');
        width: dt('scheduler.popover.width');
        max-width: calc(100vw - 3rem);
        max-height: 20rem;
        overflow-y: auto;
    }

    @media (prefers-reduced-motion: reduce) {
        .p-scheduler-day,
        .p-scheduler-event,
        .p-scheduler-resize-handle::after {
            transition: none;
        }
    }
`;
