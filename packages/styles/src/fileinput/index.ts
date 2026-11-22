export const style = /*css*/ `
    .p-fileinput {
        display: flex;
        flex-direction: column;
        gap: dt('fileinput.gap');
        min-width: 0;
    }

    .p-fileinput-input {
        display: none;
    }

    .p-fileinput-dropzone {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: dt('fileinput.dropzone.gap');
        padding: dt('fileinput.dropzone.padding');
        text-align: center;
        cursor: pointer;
        color: dt('fileinput.dropzone.color');
        background: dt('fileinput.dropzone.background');
        border: 1.5px dashed dt('fileinput.dropzone.border.color');
        border-radius: dt('fileinput.dropzone.border.radius');
        outline-color: transparent;
        transition:
            background dt('fileinput.transition.duration'),
            border-color dt('fileinput.transition.duration'),
            outline-color dt('fileinput.transition.duration'),
            box-shadow dt('fileinput.transition.duration');
    }

    .p-fileinput-dropzone:hover {
        border-color: dt('fileinput.dropzone.hover.border.color');
    }

    .p-fileinput-dropzone:focus-visible {
        box-shadow: dt('fileinput.dropzone.focus.ring.shadow');
        outline: dt('fileinput.dropzone.focus.ring.width') dt('fileinput.dropzone.focus.ring.style') dt('fileinput.dropzone.focus.ring.color');
        outline-offset: dt('fileinput.dropzone.focus.ring.offset');
    }

    .p-fileinput-dropzone-active,
    .p-fileinput-dropzone-active:hover {
        border-style: solid;
        border-color: dt('fileinput.dropzone.active.border.color');
        background: dt('fileinput.dropzone.active.background');
    }

    .p-fileinput-invalid .p-fileinput-dropzone,
    .p-fileinput-invalid .p-fileinput-add,
    .p-fileinput-invalid .p-fileinput-avatar {
        border-color: dt('fileinput.dropzone.invalid.border.color');
    }

    .p-fileinput-disabled .p-fileinput-dropzone,
    .p-fileinput-disabled .p-fileinput-add,
    .p-fileinput-disabled .p-fileinput-avatar {
        cursor: default;
        color: dt('fileinput.dropzone.disabled.color');
        background: dt('fileinput.dropzone.disabled.background');
        border-color: dt('fileinput.dropzone.border.color');
    }

    .p-fileinput-dropzone-icon {
        width: dt('fileinput.icon.size');
        height: dt('fileinput.icon.size');
        color: dt('fileinput.icon.color');
    }

    .p-fileinput-label {
        font-weight: dt('fileinput.dropzone.font.weight');
    }

    .p-fileinput-browse {
        text-decoration: underline;
        text-underline-offset: 3px;
    }

    .p-fileinput-hint {
        color: dt('fileinput.hint.color');
        font-size: dt('fileinput.hint.font.size');
    }

    .p-fileinput-sm .p-fileinput-dropzone {
        padding: dt('fileinput.dropzone.sm.padding');
        font-size: dt('fileinput.dropzone.sm.font.size');
    }

    .p-fileinput-lg .p-fileinput-dropzone {
        padding: dt('fileinput.dropzone.lg.padding');
        font-size: dt('fileinput.dropzone.lg.font.size');
    }

    .p-fileinput-summary {
        display: flex;
        align-items: center;
        gap: dt('fileinput.summary.gap');
        color: dt('fileinput.summary.color');
        font-size: dt('fileinput.summary.font.size');
        font-variant-numeric: tabular-nums;
    }

    .p-fileinput-summary .p-fileinput-progress {
        flex: 1 1 auto;
    }

    .p-fileinput-progress {
        height: dt('fileinput.progress.height');
        border-radius: dt('fileinput.progress.border.radius');
        background: dt('fileinput.progress.background');
        overflow: hidden;
        min-width: 3rem;
    }

    .p-fileinput-progress-value {
        height: 100%;
        background: dt('fileinput.progress.value.background');
        transition: width 0.15s linear;
    }

    .p-fileinput-list {
        list-style: none;
        margin: 0;
        padding: 0;
        border: 1px solid dt('fileinput.list.border.color');
        border-radius: dt('fileinput.list.border.radius');
        overflow: hidden;
    }

    .p-fileinput-item {
        display: flex;
        align-items: center;
        gap: dt('fileinput.item.gap');
        padding: dt('fileinput.item.padding');
    }

    .p-fileinput-item + .p-fileinput-item {
        border-top: 1px solid dt('fileinput.item.border.color');
    }

    .p-fileinput-item-error {
        background: dt('fileinput.item.error.background');
    }

    .p-fileinput-thumbnail {
        flex: none;
        display: grid;
        place-items: center;
        overflow: hidden;
        width: dt('fileinput.thumbnail.size');
        height: dt('fileinput.thumbnail.size');
        border-radius: dt('fileinput.thumbnail.border.radius');
        background: dt('fileinput.thumbnail.background');
        color: dt('fileinput.thumbnail.color');
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .p-fileinput-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .p-fileinput-info {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .p-fileinput-name {
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .p-fileinput-path {
        color: dt('fileinput.meta.color');
        font-weight: 400;
    }

    .p-fileinput-meta {
        display: flex;
        align-items: center;
        gap: dt('fileinput.meta.gap');
        color: dt('fileinput.meta.color');
        font-size: dt('fileinput.meta.font.size');
        font-variant-numeric: tabular-nums;
    }

    .p-fileinput-meta .p-fileinput-progress {
        flex: 1 1 auto;
        max-width: 14rem;
    }

    .p-fileinput-status-done {
        color: dt('fileinput.status.success.color');
    }

    .p-fileinput-error {
        color: dt('fileinput.status.error.color');
    }

    .p-fileinput-actions {
        flex: none;
        display: flex;
        gap: 0.25rem;
    }

    .p-fileinput-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: dt('fileinput.action.size');
        height: dt('fileinput.action.size');
        padding: 0;
        border: 0;
        border-radius: dt('fileinput.action.border.radius');
        background: transparent;
        color: dt('fileinput.action.color');
        cursor: pointer;
        text-decoration: none;
        outline-color: transparent;
        transition:
            background dt('fileinput.transition.duration'),
            color dt('fileinput.transition.duration');
    }

    .p-fileinput-action:hover {
        background: dt('fileinput.action.hover.background');
        color: dt('fileinput.action.hover.color');
    }

    .p-fileinput-action:focus-visible {
        box-shadow: dt('fileinput.action.focus.ring.shadow');
        outline: dt('fileinput.action.focus.ring.width') dt('fileinput.action.focus.ring.style') dt('fileinput.action.focus.ring.color');
        outline-offset: dt('fileinput.action.focus.ring.offset');
    }

    .p-fileinput-grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(dt('fileinput.grid.item.min.width'), 1fr));
        gap: dt('fileinput.grid.gap');
    }

    .p-fileinput-tile {
        position: relative;
        aspect-ratio: 1;
        min-width: 0;
        overflow: hidden;
        border: 1px solid dt('fileinput.tile.border.color');
        border-radius: dt('fileinput.tile.border.radius');
        background: dt('fileinput.tile.background');
    }

    .p-fileinput-tile > img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .p-fileinput-tile-error {
        border-color: dt('fileinput.tile.error.border.color');
    }

    .p-fileinput-tile-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 0.375rem;
        padding: 0.625rem;
        background: dt('fileinput.tile.overlay.background');
        color: dt('fileinput.tile.overlay.color');
        font-size: 0.75rem;
        font-variant-numeric: tabular-nums;
    }

    .p-fileinput-tile-overlay .p-fileinput-progress {
        background: color-mix(in srgb, dt('fileinput.tile.overlay.color'), transparent 70%);
    }

    .p-fileinput-tile-overlay .p-fileinput-progress-value {
        background: dt('fileinput.tile.overlay.color');
    }

    .p-fileinput-tile-error .p-fileinput-tile-overlay {
        justify-content: center;
        align-items: center;
        text-align: center;
        padding-top: 2.5rem;
        background: dt('fileinput.tile.error.overlay.background');
    }

    .p-fileinput-tile-actions {
        position: absolute;
        top: 0.375rem;
        inset-inline-end: 0.375rem;
        display: flex;
        gap: 0.25rem;
    }

    .p-fileinput-tile-actions .p-fileinput-action,
    .p-fileinput-tile-actions .p-fileinput-action:hover {
        width: 1.75rem;
        height: 1.75rem;
        background: dt('fileinput.tile.action.background');
        color: dt('fileinput.tile.action.color');
    }

    .p-fileinput-cover {
        position: absolute;
        top: 0.375rem;
        inset-inline-start: 0.375rem;
        padding: 0.125rem 0.5rem;
        border-radius: 999px;
        background: dt('fileinput.tile.action.background');
        color: dt('fileinput.tile.action.color');
        font-size: 0.6875rem;
        font-weight: 600;
    }

    .p-fileinput-tile-done {
        position: absolute;
        bottom: 0.375rem;
        inset-inline-start: 0.375rem;
        display: grid;
        place-items: center;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: dt('fileinput.status.success.color');
        color: dt('fileinput.tile.overlay.color');
    }

    .p-fileinput-tile-done svg {
        width: 0.625rem;
        height: 0.625rem;
    }

    .p-fileinput-add {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        width: 100%;
        aspect-ratio: 1;
        font: inherit;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        color: dt('fileinput.icon.color');
        background: dt('fileinput.dropzone.background');
        border: 1.5px dashed dt('fileinput.dropzone.border.color');
        border-radius: dt('fileinput.tile.border.radius');
        outline-color: transparent;
        transition:
            background dt('fileinput.transition.duration'),
            border-color dt('fileinput.transition.duration'),
            color dt('fileinput.transition.duration');
    }

    .p-fileinput-add:hover {
        border-color: dt('fileinput.dropzone.hover.border.color');
        color: dt('fileinput.dropzone.color');
    }

    .p-fileinput-add:focus-visible,
    .p-fileinput-avatar:focus-visible {
        box-shadow: dt('fileinput.dropzone.focus.ring.shadow');
        outline: dt('fileinput.dropzone.focus.ring.width') dt('fileinput.dropzone.focus.ring.style') dt('fileinput.dropzone.focus.ring.color');
        outline-offset: dt('fileinput.dropzone.focus.ring.offset');
    }

    .p-fileinput-add.p-fileinput-dropzone-active {
        border-style: solid;
        border-color: dt('fileinput.dropzone.active.border.color');
        background: dt('fileinput.dropzone.active.background');
    }

    .p-fileinput-avatar-variant {
        align-items: flex-start;
    }

    .p-fileinput-avatar {
        position: relative;
        display: grid;
        place-items: center;
        overflow: hidden;
        width: dt('fileinput.avatar.size');
        height: dt('fileinput.avatar.size');
        padding: 0;
        cursor: pointer;
        color: dt('fileinput.avatar.color');
        background: dt('fileinput.avatar.background');
        border: 1.5px dashed dt('fileinput.avatar.border.color');
        border-radius: 50%;
        outline-color: transparent;
    }

    .p-fileinput-avatar-square {
        border-radius: dt('fileinput.avatar.square.border.radius');
    }

    .p-fileinput-avatar-filled {
        border-style: solid;
    }

    .p-fileinput-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .p-fileinput-avatar-overlay {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        background: dt('fileinput.avatar.overlay.background');
        color: dt('fileinput.avatar.overlay.color');
        font-size: 0.75rem;
        font-weight: 600;
        opacity: 0;
        transition: opacity dt('fileinput.transition.duration');
    }

    .p-fileinput-avatar:hover .p-fileinput-avatar-overlay,
    .p-fileinput-avatar:focus-visible .p-fileinput-avatar-overlay,
    .p-fileinput-avatar-uploading .p-fileinput-avatar-overlay {
        opacity: 1;
    }

    .p-fileinput-disabled .p-fileinput-avatar .p-fileinput-avatar-overlay {
        opacity: 0;
    }

    .p-fileinput-avatar-icon {
        width: 1.75rem;
        height: 1.75rem;
    }

    .p-fileinput-avatar-error {
        font-size: dt('fileinput.meta.font.size');
        color: dt('fileinput.status.error.color');
    }

    @media (prefers-reduced-motion: reduce) {
        .p-fileinput-progress-value {
            transition: none;
        }
    }
`;
