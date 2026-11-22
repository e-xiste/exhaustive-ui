import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/**
 * Index the library sources for what the typings drop: input defaults and transforms.
 * Keyed by class name; a class name can exist in several entry points, so each entry keeps its file.
 */
export function collectSourceInfo(srcDir) {
    const index = new Map();

    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name !== 'node_modules' && !entry.name.startsWith('__')) walk(full);
            } else if (entry.name.endsWith('.ts') && !/\.(test|spec|d)\.ts$/.test(entry.name)) {
                indexFile(full);
            }
        }
    };

    const indexFile = (file) => {
        const sf = ts.createSourceFile(file, fs.readFileSync(file, 'utf-8'), ts.ScriptTarget.Latest, true);
        const entry = path.relative(srcDir, file).split(path.sep)[0];
        sf.forEachChild((node) => {
            if (!ts.isClassDeclaration(node) || !node.name) return;
            const members = new Map();
            for (const member of node.members) {
                if (!member.name || !(ts.isPropertyDeclaration(member) || ts.isSetAccessor(member) || ts.isGetAccessor(member))) continue;
                const info = readSourceMember(member);
                if (info) members.set(member.name.getText(), { ...members.get(member.name.getText()), ...info });
            }
            if (!index.has(node.name.text)) index.set(node.name.text, []);
            index.get(node.name.text).push({ entry, members });
        });
    };

    walk(srcDir);
    return index;
}

function readSourceMember(member) {
    const info = {};
    const inputDecorator = ts.getDecorators(member)?.find((d) => ts.isCallExpression(d.expression) && d.expression.expression.getText() === 'Input');
    const decoratorOptions = inputDecorator?.expression.arguments[0];
    if (decoratorOptions && ts.isObjectLiteralExpression(decoratorOptions)) info.transform = transformName(decoratorOptions);

    const init = ts.isPropertyDeclaration(member) ? member.initializer : undefined;
    if (init && ts.isCallExpression(init)) {
        const callee = init.expression.getText();
        if (/^(input|model)(\.required)?$/.test(callee)) {
            const required = callee.endsWith('.required');
            const options = init.arguments[required ? 0 : 1];
            if (!required && init.arguments[0]) info.default = init.arguments[0].getText();
            if (options && ts.isObjectLiteralExpression(options)) info.transform = transformName(options);
            return info;
        }
        if (/^output(FromObservable)?$/.test(callee)) return info;
    }
    if (init && !(ts.isNewExpression(init) && init.expression.getText() === 'EventEmitter')) info.default = init.getText();

    return info.default !== undefined || info.transform !== undefined ? info : null;
}

function transformName(options) {
    const transform = options.properties.find((p) => p.name?.getText() === 'transform');
    if (!transform) return undefined;
    const text = ts.isPropertyAssignment(transform) ? transform.initializer.getText() : transform.getText();
    return text.length <= 40 ? text : 'custom';
}

export function findSourceMember(sourceInfo, className, entry, property) {
    const candidates = sourceInfo.get(className);
    if (!candidates) return undefined;
    const match = candidates.find((c) => c.entry === entry && c.members.has(property)) ?? candidates.find((c) => c.members.has(property));
    return match?.members.get(property);
}

export function cleanDefault(value) {
    if (value === undefined || value === true) return undefined;
    const text = String(value).trim();
    if (text === '' || text === 'undefined' || text === 'null' || text.length > 120) return undefined;
    return text;
}

/**
 * The value type of a signal input or model as TypeDoc prints it: `InputSignal<string>` -> `string`,
 * `InputSignalWithTransform<boolean, unknown>` -> `boolean`, `ModelSignal<number>` -> `number`.
 */
export function unwrapSignalType(type) {
    const match = /^(?:InputSignal|InputSignalWithTransform|ModelSignal)<([\s\S]*)>$/.exec(type?.trim() ?? '');
    if (!match) return type;
    let depth = 0;
    for (let i = 0; i < match[1].length; i++) {
        const c = match[1][i];
        if ('<([{'.includes(c)) depth++;
        else if ('>)]}'.includes(c)) depth--;
        else if (c === ',' && depth === 0) return match[1].slice(0, i).trim();
    }
    return match[1].trim();
}
