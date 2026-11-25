import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { readPageSections } from './sections.mjs';

const LLMS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/llms');

describe('readPageSections', () => {
    it('reads the titles and the order of the page, nested sections included', () => {
        const sections = readPageSections(`
            import { ImportDoc } from '@/doc/table/import-doc';
            import { SingleDoc } from '@/doc/table/singleselection-doc';
            import { MultipleDoc } from '@/doc/table/multipleselection-doc';
            import { RemovedDoc } from '@/doc/table/removed-doc';

            export class TableDemo {
                docs = [
                    { id: 'import', label: 'Import', component: ImportDoc },
                    {
                        id: 'selection',
                        label: 'Row Selection',
                        children: [
                            { id: 'multiple', label: 'Multiple', component: MultipleDoc },
                            { id: 'single', label: 'Single Row Selection', component: SingleDoc }
                        ]
                    }
                ];
            }
        `);

        assert.deepEqual(
            [...sections],
            [
                ['table/import-doc', { label: 'Import', order: 0 }],
                ['table/multipleselection-doc', { label: 'Row Selection: Multiple', order: 1 }],
                ['table/singleselection-doc', { label: 'Single Row Selection', order: 2 }]
            ]
        );
    });

    it('is empty without a docs array', () => {
        assert.equal(readPageSections('export class Page {}').size, 0);
    });
});

describe('the component documents', () => {
    const { components } = JSON.parse(fs.readFileSync(path.join(LLMS_DIR, 'components.json'), 'utf8'));

    it('title their sections, instead of naming the doc file', () => {
        const raw = components.flatMap((component) => component.sections.filter((section) => /^[a-z]+(-?[a-z]+)*-?doc$/.test(section.label)).map((section) => `${component.name}: ${section.label}`));

        assert.deepEqual(raw, []);
    });

    it('have distinct titles within a component', () => {
        const repeated = components.flatMap((component) => {
            const labels = component.sections.map((section) => section.label);
            return labels.filter((label, index) => labels.indexOf(label) !== index).map((label) => `${component.name}: ${label}`);
        });

        assert.deepEqual(repeated, []);
    });
});
