import { Injectable } from '@angular/core';
import { style as tour_style } from '@exhaustive-ui/styles/tour';
import { BaseStyle } from '@exhaustive-ui/core/base';

const classes = {
    root: ({ instance }) => ['p-tour p-component', { 'p-tour-no-mask': !instance.mask() }],
    mask: 'p-tour-mask',
    maskPath: 'p-tour-mask-path',
    spotlight: 'p-tour-spotlight',
    blocker: 'p-tour-blocker',
    card: ({ instance }) => ['p-tour-card', { 'p-tour-card-centered': instance.placement$() === 'center', 'p-tour-card-positioned': instance.positioned() }],
    arrow: 'p-tour-arrow',
    header: 'p-tour-header',
    title: 'p-tour-title',
    pcCloseButton: 'p-tour-close-button',
    content: 'p-tour-content',
    footer: 'p-tour-footer',
    progress: 'p-tour-progress',
    counter: 'p-tour-counter',
    dots: 'p-tour-dots',
    dot: ({ active }) => ['p-tour-dot', { 'p-tour-dot-active': active }],
    actions: 'p-tour-actions',
    pcPrevButton: 'p-tour-prev-button',
    pcNextButton: 'p-tour-next-button'
};

@Injectable()
export class TourStyle extends BaseStyle {
    name = 'tour';

    style = tour_style;

    classes = classes;
}

/**
 *
 * Tour guides the user through the interface, one step at a time: a spotlight highlights an element and a card explains it.
 *
 * [Live Demo](https://exhaustive-ui.com/tour/)
 *
 * @module tourstyle
 *
 */
export enum TourClasses {
    /**
     * Class name of the root element
     */
    root = 'p-tour',
    /**
     * Class name of the mask
     */
    mask = 'p-tour-mask',
    /**
     * Class name of the spotlight ring
     */
    spotlight = 'p-tour-spotlight',
    /**
     * Class name of the element that covers the target when interaction is disabled
     */
    blocker = 'p-tour-blocker',
    /**
     * Class name of the card
     */
    card = 'p-tour-card',
    /**
     * Class name of the arrow
     */
    arrow = 'p-tour-arrow',
    /**
     * Class name of the header
     */
    header = 'p-tour-header',
    /**
     * Class name of the title
     */
    title = 'p-tour-title',
    /**
     * Class name of the close button
     */
    pcCloseButton = 'p-tour-close-button',
    /**
     * Class name of the content
     */
    content = 'p-tour-content',
    /**
     * Class name of the footer
     */
    footer = 'p-tour-footer',
    /**
     * Class name of the progress
     */
    progress = 'p-tour-progress',
    /**
     * Class name of the step counter
     */
    counter = 'p-tour-counter',
    /**
     * Class name of the dots
     */
    dots = 'p-tour-dots',
    /**
     * Class name of a dot
     */
    dot = 'p-tour-dot',
    /**
     * Class name of the actions
     */
    actions = 'p-tour-actions',
    /**
     * Class name of the back button
     */
    pcPrevButton = 'p-tour-prev-button',
    /**
     * Class name of the next button
     */
    pcNextButton = 'p-tour-next-button'
}

export interface TourStyle extends BaseStyle {}
