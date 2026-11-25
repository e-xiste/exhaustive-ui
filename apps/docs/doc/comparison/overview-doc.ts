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
                <table class="doc-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ExhaustiveUI</th>
                            <th>PrimeNG</th>
                            <th>Optimus UI</th>
                            <th>Angular Material</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>Version</b></td>
                            <td>22.9.0</td>
                            <td>22.1.5</td>
                            <td>2.1.0</td>
                            <td>22.3.0</td>
                        </tr>
                        <tr>
                            <td><b>License</b></td>
                            <td>MIT</td>
                            <td>Commercial from v22, with a free Community license under conditions; v21 and earlier are MIT</td>
                            <td>MIT</td>
                            <td>MIT</td>
                        </tr>
                        <tr>
                            <td><b>Angular</b></td>
                            <td>22</td>
                            <td>22, from 22.1</td>
                            <td>22, from 22.2.1</td>
                            <td>22 and 23</td>
                        </tr>
                        <tr>
                            <td><b>Maintained by</b></td>
                            <td>e-xiste and the community</td>
                            <td>PrimeTek, a company</td>
                            <td>OpenNG and the community</td>
                            <td>The Angular team at Google</td>
                        </tr>
                        <tr>
                            <td><b>Origin</b></td>
                            <td>Fork of Optimus UI</td>
                            <td>Original</td>
                            <td>Fork of PrimeNG v21</td>
                            <td>Original</td>
                        </tr>
                        <tr>
                            <td><b>Signals API</b></td>
                            <td>Every component</td>
                            <td>Not compared here</td>
                            <td>Migration in progress</td>
                            <td>Not compared here</td>
                        </tr>
                        <tr>
                            <td><b>From PrimeNG v21</b></td>
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
    `
})
export class ComparisonOverviewDoc {}
