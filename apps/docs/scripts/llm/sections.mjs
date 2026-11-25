import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/** The value of a property of an object literal, when it is there. */
function property(object, name) {
    return object.properties.find((member) => ts.isPropertyAssignment(member) && member.name.getText() === name)?.initializer;
}

function text(node) {
    return node && ts.isStringLiteralLike(node) ? node.text : undefined;
}

/**
 * The sections of a documentation page, read from its `docs` array: for each doc file (`table/basic-doc`, its
 * directory and name), the title it has on the site and its position. The title of a nested section starts with
 * the one of its group (`Selection: Single`), since the Markdown output has no table of contents to show it.
 */
export function readPageSections(source) {
    const file = ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest, true);
    const files = new Map();
    const sections = new Map();

    for (const statement of file.statements) {
        if (ts.isImportDeclaration(statement) && statement.importClause?.namedBindings && ts.isNamedImports(statement.importClause.namedBindings)) {
            for (const element of statement.importClause.namedBindings.elements) {
                files.set(element.name.text, text(statement.moduleSpecifier).split('/').slice(-2).join('/'));
            }
        }
    }

    const collect = (array, group) => {
        for (const entry of array.elements) {
            if (!ts.isObjectLiteralExpression(entry)) continue;

            const label = text(property(entry, 'label'));
            const component = property(entry, 'component');
            const children = property(entry, 'children');
            const docFile = component && files.get(component.getText());
            const title = group && label && !label.toLowerCase().includes(group.toLowerCase()) ? `${group}: ${label}` : label;

            if (docFile && title && !sections.has(docFile)) {
                sections.set(docFile, { label: title, order: sections.size });
            }
            if (children && ts.isArrayLiteralExpression(children)) {
                collect(children, title);
            }
        }
    };

    const visit = (node) => {
        if (ts.isPropertyDeclaration(node) && node.name.getText() === 'docs' && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
            collect(node.initializer);
        }
        ts.forEachChild(node, visit);
    };
    visit(file);

    return sections;
}

/** The sections of `pages/<name>/index.ts`; empty when there is no such page. */
export function getPageSections(pagesDir, name) {
    const pagePath = path.join(pagesDir, name, 'index.ts');

    return fs.existsSync(pagePath) ? readPageSections(fs.readFileSync(pagePath, 'utf-8')) : new Map();
}
