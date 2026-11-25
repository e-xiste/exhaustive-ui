import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'comparison-overview-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Last checked on 2026-11-25. ExhaustiveUI is our project, so read this page with that in mind: the facts link to their source, and the section on when another library suits you better is meant seriously. If something is wrong or out of
                date,
                <a href="https://github.com/e-xiste/exhaustive-ui/issues" target="_blank" rel="noopener noreferrer" class="doc-link">open an issue</a>.
            </p>
            <div class="overflow-x-auto">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <td></td>
                            <th scope="col">ExhaustiveUI</th>
                            <th scope="col">PrimeNG</th>
                            <th scope="col">Optimus UI</th>
                            <th scope="col">Angular Material</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Version</th>
                            <td>22.9.0</td>
                            <td>22.1.5</td>
                            <td>2.1.0</td>
                            <td>22.3.0</td>
                        </tr>
                        <tr>
                            <th scope="row">License</th>
                            <td>MIT</td>
                            <td>MIT up to v21, then commercial with a free tier under conditions</td>
                            <td>MIT</td>
                            <td>MIT</td>
                        </tr>
                        <tr>
                            <th scope="row">Angular</th>
                            <td>22</td>
                            <td>22, from 22.1</td>
                            <td>22, from 22.2.1</td>
                            <td>22 and 23</td>
                        </tr>
                        <tr>
                            <th scope="row">Maintained by</th>
                            <td>e-xiste and the community</td>
                            <td>PrimeTek, a company</td>
                            <td>OpenNG and the community</td>
                            <td>The Angular team at Google</td>
                        </tr>
                        <tr>
                            <th scope="row">Origin</th>
                            <td>Fork of Optimus UI</td>
                            <td>Original</td>
                            <td>Fork of PrimeNG v21</td>
                            <td>Original</td>
                        </tr>
                        <tr>
                            <th scope="row">Signals API</th>
                            <td>Every component</td>
                            <td>Not compared here</td>
                            <td>Migration in progress</td>
                            <td>Not compared here</td>
                        </tr>
                        <tr>
                            <th scope="row">From PrimeNG v21</th>
                            <td>Schematic</td>
                            <td>Their own upgrade path</td>
                            <td>See their documentation</td>
                            <td>Manual rewrite</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>Versions, licenses and Angular ranges are those published on npm.</p>
        </app-docsectiontext>
    `,
    styles: `
        .comparison-table {
            width: 100%;
            min-width: 36rem;
            margin-bottom: 1.5rem;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 0.875rem;
            line-height: 1.4;
        }
        .comparison-table :is(th, td) {
            padding: 0.625rem 0.5rem;
            border-bottom: 1px solid var(--border-color);
            text-align: start;
            vertical-align: top;
        }
        .comparison-table th {
            font-weight: 600;
        }
    `
})
export class ComparisonOverviewDoc {}
