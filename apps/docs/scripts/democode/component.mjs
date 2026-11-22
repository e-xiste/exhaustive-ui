/**
 * Builds the standalone demo component of a doc file from the doc file's own TypeScript AST.
 *
 * The doc component compiles in the docs app, so its imports, members and constructor are already right:
 * the demo keeps them and only removes what belongs to the documentation page (AppCode, AppDocSectionText,
 * DeferredDemo, the `code` objects, the theme hooks of the docs...).
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

/** Services of the docs that StackBlitz ships as src/service/<name>.ts */
export const KNOWN_SERVICES = ['CarService', 'CountryService', 'CustomerService', 'EventService', 'NodeService', 'PhotoService', 'ProductService', 'TicketService'];

/** ExhaustiveUI API services reported in metadata.exhaustiveServices when the demo provides them */
export const EXHAUSTIVE_SERVICES = ['MessageService', 'ConfirmationService', 'DialogService', 'TreeDragDropService', 'FilterService'];

/**
 * ExhaustiveUI services that are not provided in root, with the template elements that inject them.
 * The docs app provides MessageService and ConfirmationService globally; a standalone demo must provide them.
 */
const UNROOTED_SERVICES = {
    MessageService: /<p-toast\b/,
    ConfirmationService: /<p-confirm-?(?:dialog|popup)\b/i,
    DialogService: /(?!)/,
    TreeDragDropService: /(?!)/
};
const SERVICE_ENTRY_POINTS = { MessageService: '@exhaustive-ui/core/api', ConfirmationService: '@exhaustive-ui/core/api', DialogService: '@exhaustive-ui/core/dynamicdialog', TreeDragDropService: '@exhaustive-ui/core/api' };

/** Members of the doc classes that only feed the documentation page */
const DOC_MEMBERS = new Set(['code', 'extFiles', 'routeFiles']);

/** Keys of the `Code` objects that the doc pages hand to <app-code> */
const CODE_KEYS = new Set(['typescript', 'html', 'basic', 'scss', 'command']);

/** Imports that only exist in the docs app */
export const isDocOnlyModule = (specifier) => specifier.startsWith('@/components/') || specifier.startsWith('@/assets/') || specifier === '@/domain/code' || specifier === '@/service/appconfigservice';

/** Folder of the files a demo imports with a relative path, as StackBlitz lays them out (see ROUTE_FILE_DEFINITIONS in domain/types.ts) */
const ROUTE_DIR = 'src/app/demo';

const wordRegex = (name) => new RegExp(`(?<![\\w$])${name.replace(/\$/g, '\\$')}(?![\\w$])`);
const mentions = (text, name) => wordRegex(name).test(text);

const decoratorName = (decorator) => {
    const expression = ts.isCallExpression(decorator.expression) ? decorator.expression.expression : decorator.expression;
    return ts.isIdentifier(expression) ? expression.text : undefined;
};

const memberName = (member) => (member.name && (ts.isIdentifier(member.name) || ts.isPrivateIdentifier(member.name) || ts.isStringLiteral(member.name)) ? member.name.text : undefined);

/**
 * The parts of an Angular template that can name a class member: attribute values, interpolations and
 * the parameters of control flow blocks. Element and attribute names are left out (`<p-table>` does not use `table`).
 */
function templateExpressions(template) {
    const parts = [];
    for (const match of template.matchAll(/=\s*"([^"]*)"|=\s*'([^']*)'|\{\{([\s\S]*?)\}\}|@\w+\s*\(([^)]*(?:\([^)]*\)[^)]*)*)\)|@let\s+([^;]*);/g)) {
        parts.push(match.slice(1).find((group) => group !== undefined));
    }
    return parts.join('\n');
}

/** Every identifier of a piece of TypeScript, template strings excluded: what an import must provide */
function referencedIdentifiers(code) {
    const names = new Set();
    const visit = (node) => {
        if (ts.isIdentifier(node)) names.add(node.text);
        ts.forEachChild(node, visit);
    };
    visit(ts.createSourceFile('demo.ts', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS));
    return names;
}

/** Names a top-level statement declares (none for a statement that only has side effects) */
function declaredNames(statement) {
    if (ts.isVariableStatement(statement)) return statement.declarationList.declarations.flatMap((d) => (ts.isIdentifier(d.name) ? [d.name.text] : []));
    return statement.name && ts.isIdentifier(statement.name) ? [statement.name.text] : [];
}

/** Source text of a node with its leading comments, and whether a blank line preceded it */
function nodeText(sourceFile, node) {
    const full = sourceFile.text.slice(node.getFullStart(), node.end);
    const leading = full.slice(0, node.getStart(sourceFile) - node.getFullStart());
    const blankLineBefore = /\n[ \t]*\n/.test(leading.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, ''));
    // Leading blank lines go, the indentation of the first line stays
    return { text: full.replace(/^\s*\n/, ''), blankLineBefore };
}

/** Array literal elements of a property of the @Component() argument */
function decoratorArray(componentArgument, property) {
    const assignment = componentArgument?.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === property);
    if (!assignment || !ts.isArrayLiteralExpression(assignment.initializer)) return [];
    return assignment.initializer.elements.map((element) => element.getText());
}

function parseImports(sourceFile) {
    const imports = [];
    for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement)) continue;
        const from = statement.moduleSpecifier.text;
        const clause = statement.importClause;
        const entry = { from, typeOnly: !!clause?.isTypeOnly, defaultName: clause?.name?.text, namespace: undefined, named: [], sideEffect: !clause };
        const bindings = clause?.namedBindings;
        if (bindings && ts.isNamespaceImport(bindings)) entry.namespace = bindings.name.text;
        if (bindings && ts.isNamedImports(bindings)) {
            entry.named = bindings.elements.map((element) => ({ name: element.name.text, propertyName: element.propertyName?.text, typeOnly: element.isTypeOnly }));
        }
        imports.push(entry);
    }
    return imports;
}

function printImport(entry) {
    if (entry.sideEffect) return `import '${entry.from}';`;
    const parts = [];
    if (entry.defaultName) parts.push(entry.defaultName);
    if (entry.namespace) parts.push(`* as ${entry.namespace}`);
    if (entry.named.length) parts.push(`{ ${entry.named.map((n) => `${n.typeOnly ? 'type ' : ''}${n.propertyName ? `${n.propertyName} as ` : ''}${n.name}`).join(', ')} }`);
    return `import ${entry.typeOnly ? 'type ' : ''}${parts.join(', ')} from '${entry.from}';`;
}

const importedNames = (entry) => [entry.defaultName, entry.namespace, ...entry.named.map((n) => n.name)].filter(Boolean);

/** The component class of a doc file */
function findComponentClass(sourceFile) {
    return sourceFile.statements.find((s) => ts.isClassDeclaration(s) && ts.getDecorators(s)?.some((d) => decoratorName(d) === 'Component'));
}

/**
 * Collects the files a demo imports with a relative path (./footer, ./productlistdemo and what they import),
 * as RouteFiles laid out under src/app/demo.
 */
function collectRouteFiles(docDir, specifiers, files = new Map()) {
    for (const specifier of specifiers) {
        const source = path.resolve(docDir, `${specifier}.ts`);
        const filePath = `${ROUTE_DIR}/${path.basename(specifier)}.ts`;
        if (files.has(filePath) || !fs.existsSync(source)) continue;
        const content = fs.readFileSync(source, 'utf-8');
        const sourceFile = ts.createSourceFile(source, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        files.set(filePath, { path: filePath, name: findComponentClass(sourceFile)?.name?.text ?? path.basename(specifier), content, imports: parseImports(sourceFile) });
        collectRouteFiles(
            path.dirname(source),
            parseImports(sourceFile)
                .map((i) => i.from)
                .filter((from) => from.startsWith('.')),
            files
        );
    }
    return files;
}

/**
 * @param {object} options
 * @param {string} options.content source of the doc file
 * @param {string} options.filePath path of the doc file (relative imports are resolved from it)
 * @param {string} options.className class name of the demo component
 * @param {string} options.template demo template (doc-only elements already removed, not indented)
 * @returns {{ typescript: string, services: string[], exhaustiveServices: string[], domainModules: string[], routeFiles: { path: string, name: string, content: string }[] } | null}
 */
export function buildDemoComponent({ content, filePath, className, template }) {
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const docClass = findComponentClass(sourceFile);
    if (!docClass) return null;

    const imports = parseImports(sourceFile);
    const docOnlyNames = new Set(imports.filter((i) => isDocOnlyModule(i.from)).flatMap(importedNames));
    const componentDecorator = ts.getDecorators(docClass).find((d) => decoratorName(d) === 'Component');
    const componentArgument = ts.isCallExpression(componentDecorator.expression) && ts.isObjectLiteralExpression(componentDecorator.expression.arguments[0]) ? componentDecorator.expression.arguments[0] : undefined;
    const templateCode = templateExpressions(template);
    const originalName = docClass.name?.text;
    const renameClass = (text) => (originalName ? text.replace(new RegExp(`(?<![\\w$])${originalName}(?![\\w$])`, 'g'), className) : text);

    // Constructor parameters
    const constructorNode = docClass.members.find(ts.isConstructorDeclaration);
    const changeDetectors = new Set((constructorNode?.parameters ?? []).filter((p) => p.type?.getText() === 'ChangeDetectorRef').map((p) => p.name.getText()));

    // Members, cleaned of the docs-only change detection calls (the demo is not OnPush)
    const hasNgOnInit = docClass.members.some((m) => memberName(m) === 'ngOnInit');
    const renameLoadDemoData = !hasNgOnInit && docClass.members.some((m) => memberName(m) === 'loadDemoData' && ts.isMethodDeclaration(m));
    const cleanMemberText = (text) => {
        let result = text;
        for (const cd of changeDetectors) result = result.replace(new RegExp(`^[ \\t]*this\\.${cd}\\.markForCheck\\(\\);?[ \\t]*\\n`, 'gm'), '');
        if (renameLoadDemoData) result = result.replace(/(?<![\w$])loadDemoData(?![\w$])/g, 'ngOnInit');
        return renameClass(result);
    };

    let members = docClass.members
        .filter((m) => !ts.isConstructorDeclaration(m) && !ts.isSemicolonClassElement(m))
        .map((member) => {
            const { text, blankLineBefore } = nodeText(sourceFile, member);
            return { node: member, name: memberName(member), text: cleanMemberText(text), blankLineBefore };
        });

    const constructorParams = (constructorNode?.parameters ?? []).map((param) => ({
        name: param.name.getText(),
        type: param.type?.getText(),
        modifiers: (ts.getModifiers(param) ?? []).map((m) => m.getText()),
        decorators: ts.getDecorators(param) ?? [],
        text: param.getText()
    }));
    let constructorBody = constructorNode?.body ? cleanMemberText(constructorNode.body.getText().slice(1, -1)) : '';

    // Drop what belongs to the documentation page: members that use a docs-only symbol, and what only they use
    const docOnlyMembers = new Set(constructorParams.filter((p) => p.type && docOnlyNames.has(p.type)).map((p) => p.name));
    let changed = true;
    while (changed) {
        changed = false;
        for (const member of members) {
            if (docOnlyMembers.has(member.name)) continue;
            const usesDocOnly = [...docOnlyNames].some((name) => mentions(member.text, name)) || [...docOnlyMembers].some((name) => new RegExp(`this\\.${name}(?![\\w$])`).test(member.text));
            if (usesDocOnly) {
                docOnlyMembers.add(member.name);
                changed = true;
            }
        }
    }
    members = members.filter((m) => !docOnlyMembers.has(m.name));

    // Drop documentation fields and declarations nothing uses (`code`, `@Input() title`, `table: Table;`...)
    const thisAccess = (name) => new RegExp(`this\\??\\.${name}(?![\\w$])`);
    const isReferenced = (name) => mentions(templateCode, name) || thisAccess(name).test(constructorBody) || members.some((other) => other.name !== name && thisAccess(name).test(other.text));
    const isCodeObject = (initializer) => initializer && ts.isObjectLiteralExpression(initializer) && initializer.properties.some((p) => CODE_KEYS.has(p.name?.getText()));
    members = members.filter((member) => {
        if (!member.name || isReferenced(member.name)) return true;
        if (DOC_MEMBERS.has(member.name)) return false;
        if (!ts.isPropertyDeclaration(member.node)) return true;
        const decorators = (ts.getDecorators(member.node) ?? []).map(decoratorName);
        return !(decorators.includes('Input') || isCodeObject(member.node.initializer) || (!member.node.initializer && decorators.length === 0));
    });

    // Constructor injection becomes inject(), declared before the fields that may use it
    const injectFields = [];
    const injectLocals = [];
    const keptParams = [];
    const bodyAndMembers = () => constructorBody + '\n' + members.map((m) => m.text).join('\n');
    for (const param of constructorParams) {
        if (docOnlyMembers.has(param.name)) continue;
        const isProperty = param.modifiers.some((m) => ['private', 'public', 'protected', 'readonly'].includes(m));
        const used = isProperty ? new RegExp(`this\\.${param.name}(?![\\w$])`).test(bodyAndMembers()) || mentions(templateCode, param.name) : mentions(constructorBody, param.name);
        if (!used) continue;
        const convertible = param.type && /^[A-Za-z_$][\w$]*$/.test(param.type) && param.decorators.length === 0;
        if (!convertible) keptParams.push(param.text);
        else if (isProperty) injectFields.push(`    ${param.modifiers.join(' ')} ${param.name} = inject(${param.type});`);
        else injectLocals.push(`const ${param.name} = inject(${param.type});`);
    }
    constructorBody = constructorBody.trim();
    if (injectLocals.length) constructorBody = [...injectLocals, constructorBody].filter(Boolean).join('\n        ');

    // Class body
    const blocks = [];
    if (injectFields.length) blocks.push({ text: injectFields.join('\n'), blankLineBefore: true });
    const firstMethod = members.findIndex((m) => !ts.isPropertyDeclaration(m.node));
    const constructorBlock = constructorBody || keptParams.length ? { text: `    constructor(${keptParams.join(', ')}) {${constructorBody ? `\n        ${constructorBody}\n    ` : ''}}`, blankLineBefore: true } : undefined;
    members.forEach((member, index) => {
        if (index === firstMethod && constructorBlock) blocks.push(constructorBlock);
        blocks.push(index === 0 ? { ...member, blankLineBefore: true } : member);
    });
    if (constructorBlock && firstMethod === -1) blocks.push(constructorBlock);
    const classBody = blocks.map((block, index) => (index === 0 || block.blankLineBefore ? '\n' : '') + block.text).join('\n');

    // Heritage
    const implementsNames = docClass.heritageClauses?.find((h) => h.token === ts.SyntaxKind.ImplementsKeyword)?.types.map((t) => t.getText()) ?? [];
    if (renameLoadDemoData && !implementsNames.includes('OnInit')) implementsNames.push('OnInit');
    const extendsClause = docClass.heritageClauses?.find((h) => h.token === ts.SyntaxKind.ExtendsKeyword)?.getText();

    // Decorator: the doc's own imports and providers, without the docs-only ones
    const decoratorImports = decoratorArray(componentArgument, 'imports').filter((name) => !docOnlyNames.has(name));
    const providers = decoratorArray(componentArgument, 'providers').filter((name) => !docOnlyNames.has(name));
    const importedServices = imports.filter((i) => i.from.startsWith('@/service/')).flatMap((i) => i.named.map((n) => n.name));
    const formattedTemplate = template
        .split('\n')
        .map((line) => (line.trim() ? '        ' + line : ''))
        .join('\n')
        .trimEnd();

    // Top-level declarations other than the class (interfaces, types, constants), when the demo uses them
    const declarations = sourceFile.statements
        .filter((s) => !ts.isImportDeclaration(s) && s !== docClass)
        .map((s) => ({ names: declaredNames(s), text: renameClass(nodeText(sourceFile, s).text.trim()) }))
        .filter(({ text }) => ![...docOnlyNames].some((name) => mentions(text, name)));
    let topLevel = [];

    const buildCode = (providerList) => {
        const providersLine = providerList.length ? `,\n    providers: [${providerList.join(', ')}]` : '';
        const heritage = [extendsClause, implementsNames.length ? `implements ${implementsNames.join(', ')}` : ''].filter(Boolean).join(' ');
        return `${topLevel.length ? topLevel.join('\n\n') + '\n\n' : ''}@Component({
    template: \`
${formattedTemplate}
    \`,
    standalone: true,
    imports: [${decoratorImports.join(', ')}]${providersLine}
})
export class ${className}${heritage ? ' ' + heritage : ''} {${classBody}
}`;
    };

    let code = buildCode(providers);
    const kept = new Set();
    for (let used = referencedIdentifiers(code), grew = true; grew;) {
        grew = false;
        for (const declaration of declarations) {
            if (kept.has(declaration) || !(declaration.names.length === 0 || declaration.names.some((name) => used.has(name)))) continue;
            kept.add(declaration);
            used = new Set([...used, ...referencedIdentifiers(declaration.text)]);
            grew = true;
        }
    }
    topLevel = declarations.filter((d) => kept.has(d)).map((d) => d.text);

    // The demo provides the services it uses: the docs app provides MessageService and ConfirmationService
    // globally, StackBlitz does not, and the services of the docs are not provided in root
    code = buildCode(providers);
    const used = referencedIdentifiers(code);
    const services = importedServices.filter((name) => KNOWN_SERVICES.includes(name) && used.has(name));
    const apiServices = Object.keys(UNROOTED_SERVICES).filter((name) => used.has(name) || UNROOTED_SERVICES[name].test(template));
    const allProviders = [...new Set([...providers, ...apiServices, ...services])];
    code = buildCode(allProviders);

    // Imports: the doc's own, restricted to what the demo uses
    const usedNames = referencedIdentifiers(code);
    const outputImports = imports
        .filter((entry) => !isDocOnlyModule(entry.from))
        .map((entry) => ({
            ...entry,
            from: entry.from.startsWith('.') ? `./demo/${path.basename(entry.from)}` : entry.from,
            defaultName: usedNames.has(entry.defaultName) ? entry.defaultName : undefined,
            namespace: usedNames.has(entry.namespace) ? entry.namespace : undefined,
            named: entry.named.filter((n) => usedNames.has(n.name))
        }))
        .filter((entry) => entry.sideEffect || importedNames(entry).length);
    const angularCore = ['Component', ...(injectFields.length || injectLocals.length ? ['inject'] : []), ...(renameLoadDemoData ? ['OnInit'] : [])];
    let core = outputImports.find((entry) => entry.from === '@angular/core' && !entry.typeOnly);
    if (!core) {
        core = { from: '@angular/core', named: [] };
        outputImports.unshift(core);
    }
    for (const name of angularCore) if (!core.named.some((n) => n.name === name)) core.named.push({ name });
    for (const name of apiServices) {
        if (outputImports.some((entry) => importedNames(entry).includes(name))) continue;
        const from = SERVICE_ENTRY_POINTS[name];
        const entry = outputImports.find((e) => e.from === from && !e.typeOnly && e.named.length) ?? outputImports[outputImports.push({ from, named: [] }) - 1];
        entry.named.push({ name });
    }
    const importRank = ({ from }) => (from.startsWith('@angular/') ? 0 : from.startsWith('./') ? 3 : from.startsWith('@/') ? 2 : 1);
    outputImports.sort((a, b) => importRank(a) - importRank(b));

    const routeFiles = [
        ...collectRouteFiles(
            path.dirname(filePath),
            imports.filter((i) => i.from.startsWith('.') && importedNames(i).some((n) => usedNames.has(n))).map((i) => i.from)
        ).values()
    ];
    const routeImports = routeFiles.flatMap((file) => file.imports);
    const routeServices = routeImports.filter((i) => i.from.startsWith('@/service/')).flatMap((i) => i.named.map((n) => n.name));
    const domainModules = [...new Set([...outputImports, ...routeImports].filter((i) => i.from.startsWith('@/domain/')).map((i) => i.from.slice('@/domain/'.length)))];

    return {
        typescript: `${outputImports.map(printImport).join('\n')}\n\n${code}`,
        services: [...new Set([...services, ...routeServices.filter((s) => KNOWN_SERVICES.includes(s))])],
        exhaustiveServices: allProviders.filter((p) => EXHAUSTIVE_SERVICES.includes(p)),
        domainModules,
        routeFiles: routeFiles.map(({ path: filePath, name, content }) => ({ path: filePath, name, content }))
    };
}
