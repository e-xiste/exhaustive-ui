import { Component } from '@angular/core';
import { SchedulerEvent, SchedulerLabels, SchedulerModule } from '@exhaustive-ui/core/scheduler';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';

@Component({
    selector: 'locale-doc',
    standalone: true,
    imports: [SchedulerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Dates and times are formatted with <i>Intl.DateTimeFormat</i> in the <i>locale</i>, which defaults to the <i>LOCALE_ID</i> of the application; <i>hour12</i> forces a 12 or 24-hour clock. <i>firstDayOfWeek</i>, from 0 for Sunday to 6
                for Saturday, defaults to the <i>firstDayOfWeek</i> of the translation configuration, and the Today button to its <i>today</i> text. Every other text, the view names and the screen reader messages included, can be replaced through
                <i>labels</i>.
            </p>
            <p>
                Like any JavaScript date, the dates are read and displayed in the time zone of the browser: convert the dates of another time zone before passing them. The time grid follows the clock, so on the days of a daylight saving time change
                the events stay on their hour lines, and a day is always one calendar day when navigating or moving an event.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-scheduler [events]="events" locale="fr-FR" [firstDayOfWeek]="1" [labels]="labels" />
        </div>
        <app-code></app-code>
        <app-docsectiontext>
            <p>The translation configuration sets the first day of the week and the Today text for every Scheduler, DatePicker included.</p>
        </app-docsectiontext>
        <app-code [code]="configCode" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
    `
})
export class LocaleDoc {
    labels: Partial<SchedulerLabels> = {
        today: "Aujourd'hui",
        previous: 'Précédent',
        next: 'Suivant',
        views: 'Vue',
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour',
        agenda: 'Agenda',
        allDay: 'Toute la journée',
        more: '+{0} autres',
        moreAriaLabel: '{0} autres événements le {1}',
        eventCount: '{0} événements',
        noEvents: 'Aucun événement sur cette période',
        weekOf: 'Semaine du {0}',
        moved: '{0} déplacé au {1}',
        editableHint: 'Alt et les flèches déplacent l’événement, Alt Maj et haut ou bas le redimensionnent'
    };

    events: SchedulerEvent[] = [];

    configCode: Code = {
        typescript: `providers: [
    provideExhaustive({
        translation: { firstDayOfWeek: 1, today: "Aujourd'hui" }
    })
]`
    };

    constructor() {
        const today = new Date();
        const day = (offset: number, hour = 0, minute = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, hour, minute);
        this.events = [
            { id: 1, title: 'Réunion d’équipe', start: day(0, 9), end: day(0, 10) },
            { id: 2, title: 'Déjeuner', start: day(1, 12, 30), end: day(1, 14), color: '#fbbf24' },
            { id: 3, title: 'Congés', start: day(4), end: day(8), allDay: true, color: '#0f766e' }
        ];
    }
}
