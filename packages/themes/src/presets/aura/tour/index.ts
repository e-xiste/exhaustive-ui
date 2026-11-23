import type { TourDesignTokens, TourTokenSections } from '@exhaustive-ui/themes/types/tour';

export const root: TourTokenSections.Root = {
    transitionDuration: '0.25s'
};

export const spotlight: TourTokenSections.Spotlight = {
    shadow: '0 0 0 2px {primary.color}'
};

export const card: TourTokenSections.Card = {
    background: '{overlay.popover.background}',
    borderColor: '{overlay.popover.border.color}',
    color: '{overlay.popover.color}',
    borderRadius: '{overlay.popover.border.radius}',
    shadow: '{overlay.popover.shadow}',
    padding: '1rem',
    width: '22rem',
    gap: '0.75rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}'
    }
};

export const arrow: TourTokenSections.Arrow = {
    size: '0.75rem'
};

export const header: TourTokenSections.Header = {
    gap: '0.5rem'
};

export const title: TourTokenSections.Title = {
    fontSize: '1rem',
    fontWeight: '600'
};

export const footer: TourTokenSections.Footer = {
    gap: '0.75rem'
};

export const counter: TourTokenSections.Counter = {
    color: '{text.muted.color}',
    fontSize: '0.875rem'
};

export const dot: TourTokenSections.Dot = {
    size: '0.5rem',
    gap: '0.375rem',
    activeBackground: '{primary.color}',
    activeWidth: '1.25rem'
};

export const actions: TourTokenSections.Actions = {
    gap: '0.5rem'
};

export const colorScheme: TourTokenSections.ColorScheme = {
    light: {
        mask: {
            background: 'rgba(0, 0, 0, 0.5)'
        },
        dot: {
            background: '{surface.300}'
        }
    },
    dark: {
        mask: {
            background: 'rgba(0, 0, 0, 0.7)'
        },
        dot: {
            background: '{surface.600}'
        }
    }
};

export default {
    root,
    spotlight,
    card,
    arrow,
    header,
    title,
    footer,
    counter,
    dot,
    actions,
    colorScheme
} satisfies TourDesignTokens;
