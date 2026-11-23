import type { SchedulerDesignTokens, SchedulerTokenSections } from '@exhaustive-ui/themes/types/scheduler';

export const root: SchedulerTokenSections.Root = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    gap: '0.75rem',
    transitionDuration: '{transition.duration}'
};

export const header: SchedulerTokenSections.Header = {
    gap: '0.5rem',
    padding: '0.75rem 0.75rem 0'
};

export const title: SchedulerTokenSections.Title = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '{text.color}'
};

export const grid: SchedulerTokenSections.Grid = {
    borderColor: '{content.border.color}',
    slotBorderColor: 'color-mix(in srgb, {content.border.color}, transparent 50%)'
};

export const weekday: SchedulerTokenSections.Weekday = {
    color: '{text.muted.color}',
    fontSize: '0.8125rem',
    fontWeight: '600',
    padding: '0.5rem'
};

export const day: SchedulerTokenSections.Day = {
    padding: '0.25rem',
    gap: '2px',
    minHeight: '6.5rem',
    outsideColor: '{text.muted.color}',
    selectedBackground: '{highlight.background}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const dayNumber: SchedulerTokenSections.DayNumber = {
    size: '1.75rem',
    fontSize: '0.8125rem',
    fontWeight: '500',
    color: '{text.color}',
    borderRadius: '50%'
};

export const today: SchedulerTokenSections.Today = {
    fontWeight: '700'
};

export const event: SchedulerTokenSections.Event = {
    borderWidth: '3px',
    borderRadius: '{border.radius.xs}',
    padding: '0.125rem 0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    gap: '0.25rem',
    hoverShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    draggingOpacity: '0.45',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const more: SchedulerTokenSections.More = {
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    hoverBackground: '{content.hover.background}',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.125rem 0.375rem',
    borderRadius: '{border.radius.xs}'
};

export const slot: SchedulerTokenSections.Slot = {
    height: '1.5rem',
    hoverBackground: '{content.hover.background}'
};

export const timeLabel: SchedulerTokenSections.TimeLabel = {
    color: '{text.muted.color}',
    fontSize: '0.6875rem',
    width: '4.5rem'
};

export const columnHeader: SchedulerTokenSections.ColumnHeader = {
    padding: '0.5rem 0.25rem',
    color: '{text.muted.color}',
    fontSize: '0.75rem',
    numberFontSize: '1.25rem',
    numberFontWeight: '500'
};

export const allDay: SchedulerTokenSections.AllDay = {
    minHeight: '2rem',
    labelColor: '{text.muted.color}',
    labelFontSize: '0.6875rem'
};

export const nowIndicator: SchedulerTokenSections.NowIndicator = {
    size: '2px'
};

export const selection: SchedulerTokenSections.Selection = {
    background: '{highlight.background}',
    borderColor: '{primary.color}'
};

export const agenda: SchedulerTokenSections.Agenda = {
    padding: '0.75rem',
    gap: '1rem',
    dateColor: '{text.color}',
    dateFontWeight: '600',
    datePadding: '0.25rem 0.5rem',
    dateBorderColor: '{content.border.color}',
    itemPadding: '0.5rem',
    itemGap: '0.75rem',
    itemBorderRadius: '{content.border.radius}',
    itemHoverBackground: '{content.hover.background}',
    timeColor: '{text.muted.color}',
    timeWidth: '9.5rem',
    dotSize: '0.625rem'
};

export const popover: SchedulerTokenSections.Popover = {
    width: '16rem',
    gap: '0.25rem',
    headerFontWeight: '600'
};

export const empty: SchedulerTokenSections.Empty = {
    color: '{text.muted.color}',
    padding: '2rem 1rem'
};

export const colorScheme: SchedulerTokenSections.ColorScheme = {
    light: {
        day: {
            outsideBackground: '{surface.50}'
        },
        today: {
            numberBackground: '{primary.700}',
            numberColor: '#ffffff'
        },
        event: {
            background: '{primary.100}',
            color: '{primary.900}',
            borderColor: '{primary.600}'
        },
        nowIndicator: {
            color: '{red.600}'
        }
    },
    dark: {
        day: {
            outsideBackground: '{surface.950}'
        },
        today: {
            numberBackground: '{primary.400}',
            numberColor: '{surface.900}'
        },
        event: {
            background: 'color-mix(in srgb, {primary.400}, transparent 78%)',
            color: '{primary.100}',
            borderColor: '{primary.400}'
        },
        nowIndicator: {
            color: '{red.400}'
        }
    }
};

export default {
    root,
    header,
    title,
    grid,
    weekday,
    day,
    dayNumber,
    today,
    event,
    more,
    slot,
    timeLabel,
    columnHeader,
    allDay,
    nowIndicator,
    selection,
    agenda,
    popover,
    empty,
    colorScheme
} satisfies SchedulerDesignTokens;
