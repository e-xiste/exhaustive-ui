import { Component } from '@angular/core';

interface VersionCompatibilityEntry {
    exhaustiveUi: string;
    angular: string;
}

@Component({
    selector: 'app-version-compatibility',
    standalone: true,
    template: `
        <table class="doc-table">
            <thead>
                <tr>
                    <th>ExhaustiveUI</th>
                    <th>Angular</th>
                </tr>
            </thead>
            <tbody>
                @for (entry of entries; track entry.exhaustiveUi) {
                    <tr>
                        <td>{{ entry.exhaustiveUi }}</td>
                        <td>{{ entry.angular }}</td>
                    </tr>
                }
            </tbody>
        </table>
    `
})
export class AppVersionCompatibility {
    entries: VersionCompatibilityEntry[] = [{ exhaustiveUi: 'v22', angular: 'v22' }];
}
