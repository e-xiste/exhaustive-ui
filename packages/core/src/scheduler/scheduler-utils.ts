import type { SchedulerEvent } from '@exhaustive-ui/core/types/scheduler';

/**
 * Date helpers of the Scheduler, on native Date in local time. Days are added through the calendar fields, so that
 * a day stays a day across daylight saving time changes.
 * @internal
 */

export const MINUTE = 60_000;
export const DAY = 86_400_000;

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

export const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * MINUTE);

/** Date of the day at the given minute, counted from midnight in calendar time. */
export const atMinutes = (day: Date, minutes: number) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes);

export const minutesOfDay = (date: Date) => date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;

export const startOfWeek = (date: Date, firstDayOfWeek: number) => {
    const day = startOfDay(date);
    const diff = (day.getDay() - firstDayOfWeek + 7) % 7;
    return addDays(day, -diff);
};

export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, months: number) => {
    const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
};

export const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Number of calendar days from a to b, ignoring the time and daylight saving time. */
export const dayDiff = (a: Date, b: Date) => Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DAY);

export const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

export const format = (text: string, ...values: (string | number)[]) => values.reduce<string>((acc, value, index) => acc.split(`{${index}}`).join(String(value)), text);

export const isValidDate = (value: unknown): value is Date => value instanceof Date && !isNaN(value.getTime());

/**
 * An event with its resolved end and kind.
 */
export interface NormalizedEvent {
    event: SchedulerEvent;
    start: Date;
    end: Date;
    allDay: boolean;
    /** Displayed in the all-day row of the time grid: all-day events and events of 24 hours or more. */
    allDayRow: boolean;
    editable: boolean;
    order: number;
}

export const normalizeEvent = (event: SchedulerEvent, order: number, editable: boolean): NormalizedEvent | null => {
    if (!event || !isValidDate(event.start)) {
        return null;
    }
    const allDay = !!event.allDay;
    let start = event.start;
    let end: Date;
    if (allDay) {
        start = startOfDay(event.start);
        if (isValidDate(event.end) && event.end.getTime() > start.getTime()) {
            const endDay = startOfDay(event.end);
            end = event.end.getTime() > endDay.getTime() ? addDays(endDay, 1) : endDay;
        } else {
            end = addDays(start, 1);
        }
    } else {
        end = isValidDate(event.end) && event.end.getTime() > start.getTime() ? event.end : addMinutes(start, 60);
    }
    return { event, start, end, allDay, allDayRow: allDay || end.getTime() - start.getTime() >= DAY, editable: event.editable ?? editable, order };
};

export const compareEvents = (a: NormalizedEvent, b: NormalizedEvent) => {
    if (a.allDayRow !== b.allDayRow) return a.allDayRow ? -1 : 1;
    return a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime() || a.order - b.order;
};

export const overlaps = (start: Date, end: Date, rangeStart: Date, rangeEnd: Date) => start.getTime() < rangeEnd.getTime() && end.getTime() > rangeStart.getTime();

/**
 * A timed event clipped to one column of the time grid, with its position in percent.
 */
export interface TimedSegment {
    key: string;
    item: NormalizedEvent;
    start: Date;
    end: Date;
    /** The segment holds the real start of the event. */
    isStart: boolean;
    /** The segment holds the real end of the event, where the resize handle is. */
    isEnd: boolean;
    top: number;
    height: number;
    left: number;
    width: number;
}

/**
 * Clips the events to the hours of a day and lays out the overlapping ones side by side: each group of events that
 * overlap one another is split into columns, and an event spreads over the columns on its right that are free.
 */
export const layoutDay = (items: NormalizedEvent[], day: Date, startHour: number, endHour: number): TimedSegment[] => {
    const dayStart = atMinutes(day, startHour * 60);
    const dayEnd = atMinutes(day, endHour * 60);
    // Positions follow the wall clock, like the hour labels, so that a day of 23 or 25 hours keeps its events on their hours.
    const startMinutes = startHour * 60;
    const total = endHour * 60 - startMinutes;
    const wall = (date: Date) => dayDiff(day, date) * 1440 + minutesOfDay(date);
    const segments: (TimedSegment & { column: number })[] = [];
    for (const item of items) {
        if (!overlaps(item.start, item.end, dayStart, dayEnd)) continue;
        const start = item.start.getTime() > dayStart.getTime() ? item.start : dayStart;
        const end = item.end.getTime() < dayEnd.getTime() ? item.end : dayEnd;
        const from = wall(start);
        // When the clocks go back, the end can read earlier than the start: keep the real duration.
        const to = Math.max(wall(end), from + (end.getTime() - start.getTime()) / MINUTE);
        segments.push({
            key: `${item.event.id}|${dayKey(day)}`,
            item,
            start,
            end,
            isStart: item.start.getTime() >= dayStart.getTime(),
            isEnd: item.end.getTime() <= dayEnd.getTime(),
            top: ((from - startMinutes) / total) * 100,
            height: ((Math.min(to, endHour * 60) - from) / total) * 100,
            left: 0,
            width: 100,
            column: 0
        });
    }
    segments.sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime() || a.item.order - b.item.order);

    let cluster: (TimedSegment & { column: number })[] = [];
    let columnsEnd: number[] = [];
    let clusterEnd = -Infinity;
    const flush = () => {
        const count = columnsEnd.length;
        for (const segment of cluster) {
            let span = 1;
            for (let next = segment.column + 1; next < count; next++) {
                const blocked = cluster.some((other) => other.column === next && other.start.getTime() < segment.end.getTime() && other.end.getTime() > segment.start.getTime());
                if (blocked) break;
                span++;
            }
            segment.left = (segment.column / count) * 100;
            segment.width = (span / count) * 100;
        }
        cluster = [];
        columnsEnd = [];
    };
    for (const segment of segments) {
        if (segment.start.getTime() >= clusterEnd) {
            flush();
            clusterEnd = -Infinity;
        }
        let column = columnsEnd.findIndex((end) => end <= segment.start.getTime());
        if (column === -1) {
            column = columnsEnd.length;
            columnsEnd.push(segment.end.getTime());
        } else {
            columnsEnd[column] = segment.end.getTime();
        }
        segment.column = column;
        cluster.push(segment);
        clusterEnd = Math.max(clusterEnd, segment.end.getTime());
    }
    flush();
    return segments;
};

/**
 * Parses a CSS color in hex or rgb() notation into its channels.
 */
export const parseColor = (color: string): [number, number, number] | null => {
    const value = color.trim().toLowerCase();
    let match = /^#([0-9a-f]{3,8})$/.exec(value);
    if (match) {
        let hex = match[1];
        if (hex.length === 3 || hex.length === 4) {
            hex = hex
                .slice(0, 3)
                .split('')
                .map((c) => c + c)
                .join('');
        }
        if (hex.length !== 6 && hex.length !== 8) return null;
        return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    }
    match = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(value);
    if (match) {
        return [Number(match[1]), Number(match[2]), Number(match[3])];
    }
    return null;
};

const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

export const luminance = ([r, g, b]: [number, number, number]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

export const contrastRatio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

export const DARK_TEXT = '#000000';
export const LIGHT_TEXT = '#ffffff';

/**
 * Picks black or white text, whichever contrasts most with the background: one of them always reaches 4.5:1.
 */
export const textColorFor = (rgb: [number, number, number]) => {
    const background = luminance(rgb);
    return contrastRatio(background, 0) >= contrastRatio(background, 1) ? DARK_TEXT : LIGHT_TEXT;
};
