import * as fs from 'fs';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { buildDemoComponent } from './democode/component.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '../doc');
const OUTPUT_PATH = path.resolve(__dirname, '../public/demos.json');

// Directories to skip (not component demos)
const SKIP_DIRS = ['apidoc', 'theming', 'icons', 'installation', 'configuration', 'customicons', 'playground', 'uikit', 'templates', 'primeflex', 'csslayer', 'migration', 'llms'];

// Domain type definitions for auto-generated extFiles
const DOMAIN_TYPE_DEFINITIONS = {
    customer: `export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string | Date;
    status?: string;
    activity?: number;
    representative?: Representative;
    verified?: boolean;
    balance?: number;
}`,
    product: `export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}`,
    car: `export interface Car {
    vin?: string;
    year?: number;
    brand?: string;
    color?: string;
}`,
    photo: `export interface Photo {
    title?: string;
    thumbnailUrl?: string;
}`
};

// ExhaustiveUI selector to module mapping
const SELECTOR_TO_MODULE = {
    'p-accordion': 'AccordionModule',
    'p-auto-complete': 'AutoCompleteModule',
    'p-avatar': 'AvatarModule',
    'p-avatar-group': 'AvatarGroupModule',
    'p-badge': 'BadgeModule',
    'p-block-ui': 'BlockUIModule',
    'p-breadcrumb': 'BreadcrumbModule',
    'p-button': 'ButtonModule',
    'p-card': 'CardModule',
    'p-carousel': 'CarouselModule',
    'p-cascade-select': 'CascadeSelectModule',
    'p-chart': 'ChartModule',
    'p-checkbox': 'CheckboxModule',
    'p-chip': 'ChipModule',
    'p-color-picker': 'ColorPickerModule',
    'p-confirm-dialog': 'ConfirmDialogModule',
    'p-confirm-popup': 'ConfirmPopupModule',
    'p-context-menu': 'ContextMenuModule',
    'p-data-view': 'DataViewModule',
    'p-date-picker': 'DatePickerModule',
    'p-dialog': 'DialogModule',
    'p-divider': 'DividerModule',
    'p-dock': 'DockModule',
    'p-drawer': 'DrawerModule',
    'p-dynamic-dialog': 'DynamicDialogModule',
    'p-editor': 'EditorModule',
    'p-fieldset': 'FieldsetModule',
    'p-file-input': 'FileInputModule',
    'p-file-upload': 'FileUploadModule',
    'p-float-label': 'FloatLabelModule',
    'p-galleria': 'GalleriaModule',
    'p-icon-field': 'IconFieldModule',
    'p-ifta-label': 'IftaLabelModule',
    'p-image': 'ImageModule',
    'p-image-compare': 'ImageCompareModule',
    'p-inplace': 'InplaceModule',
    'p-input-chips': 'InputChipsModule',
    'p-input-group': 'InputGroupModule',
    'p-input-icon': 'InputIconModule',
    'p-input-mask': 'InputMaskModule',
    'p-input-number': 'InputNumberModule',
    'p-input-otp': 'InputOtpModule',
    'p-inputchips': 'InputChipsModule',
    'p-inputgroupaddon': 'InputGroupAddonModule',
    'p-inputtext': 'InputTextModule',
    'p-kanban': 'KanbanModule',
    'p-knob': 'KnobModule',
    'p-listbox': 'ListboxModule',
    'p-mega-menu': 'MegaMenuModule',
    'p-mention': 'MentionModule',
    'p-menu': 'MenuModule',
    'p-menubar': 'MenubarModule',
    'p-message': 'MessageModule',
    'p-meter-group': 'MeterGroupModule',
    'p-multi-select': 'MultiSelectModule',
    'p-order-list': 'OrderListModule',
    'p-organization-chart': 'OrganizationChartModule',
    'p-overlay-badge': 'OverlayBadgeModule',
    'p-paginator': 'PaginatorModule',
    'p-panel': 'PanelModule',
    'p-panel-menu': 'PanelMenuModule',
    'p-password': 'PasswordModule',
    'p-pick-list': 'PickListModule',
    'p-popover': 'PopoverModule',
    'p-progress-bar': 'ProgressBarModule',
    'p-progress-spinner': 'ProgressSpinnerModule',
    'p-radio-button': 'RadioButtonModule',
    'p-rating': 'RatingModule',
    'p-rich-text-editor': 'RichTextEditorModule',
    'p-richtexteditor': 'RichTextEditorModule',
    'p-ripple': 'RippleModule',
    'p-scheduler': 'SchedulerModule',
    'p-scroll-panel': 'ScrollPanelModule',
    'p-scroll-top': 'ScrollTopModule',
    'p-scroller': 'ScrollerModule',
    'p-select': 'SelectModule',
    'p-select-button': 'SelectButtonModule',
    'p-skeleton': 'SkeletonModule',
    'p-slider': 'SliderModule',
    'p-speed-dial': 'SpeedDialModule',
    'p-split-button': 'SplitButtonModule',
    'p-splitter': 'SplitterModule',
    'p-stepper': 'StepperModule',
    'p-steps': 'StepsModule',
    'p-table': 'TableModule',
    'p-tabs': 'TabsModule',
    'p-tag': 'TagModule',
    'p-terminal': 'TerminalModule',
    'p-textarea': 'TextareaModule',
    'p-tiered-menu': 'TieredMenuModule',
    'p-timeline': 'TimelineModule',
    'p-toast': 'ToastModule',
    'p-tour': 'TourModule',
    'p-toggle-button': 'ToggleButtonModule',
    'p-toggle-switch': 'ToggleSwitchModule',
    'p-toolbar': 'ToolbarModule',
    'p-tooltip': 'TooltipModule',
    'p-tree': 'TreeModule',
    'p-tree-select': 'TreeSelectModule',
    'p-tree-table': 'TreeTableModule'
};

// Component name to PascalCase mapping
function toPascalCase(str) {
    return str
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

// Extract template from @Component decorator
function extractTemplate(content) {
    // Handle template: `...` (backtick template)
    const backtickMatch = content.match(/template:\s*`([\s\S]*?)`(?=\s*[,}]|\s*\/\/|\s*changeDetection)/);
    if (backtickMatch) {
        return backtickMatch[1];
    }

    // Handle template: '...' (single quote)
    const singleQuoteMatch = content.match(/template:\s*'([\s\S]*?)'(?=\s*[,}])/);
    if (singleQuoteMatch) {
        return singleQuoteMatch[1];
    }

    return null;
}

// Normalize indentation - preserve relative indentation from source
// This function strips the minimum common indentation while preserving the internal structure
function normalizeIndent(text) {
    if (!text) return text;

    const lines = text.split('\n');
    if (lines.length === 0) return text;

    // Find minimum indentation (ignoring empty lines and the first line if it has 0 indent)
    let minIndent = Infinity;
    let firstNonEmptyLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') continue;

        if (firstNonEmptyLineIndex === -1) {
            firstNonEmptyLineIndex = i;
        }

        const match = line.match(/^(\s*)/);
        if (match) {
            const indent = match[1].length;
            // If it's the first non-empty line and has 0 indent, skip it for min calculation
            // (this handles cases where .trim() removed leading whitespace from first line)
            if (i === firstNonEmptyLineIndex && indent === 0) {
                continue;
            }
            minIndent = Math.min(minIndent, indent);
        }
    }

    // If we couldn't find a meaningful min indent, just clean up
    if (minIndent === Infinity || minIndent === 0) {
        return lines
            .map((line) => (line.trim() === '' ? '' : line))
            .join('\n')
            .trim();
    }

    // Remove minimum indentation from all lines (except first line which might have 0 indent already)
    return lines
        .map((line) => {
            if (line.trim() === '') return '';
            const match = line.match(/^(\s*)/);
            const currentIndent = match ? match[1].length : 0;
            if (currentIndent >= minIndent) {
                return line.slice(minIndent);
            }
            return line;
        })
        .join('\n')
        .trim();
}

// Extract demo content from template (remove doc elements)
function extractDemoContent(template) {
    if (!template) return null;

    let html = template;

    // Remove app-docsectiontext
    html = html.replace(/<app-docsectiontext[\s\S]*?<\/app-docsectiontext>/g, '');

    // Remove app-code (self-closing and regular)
    html = html.replace(/<app-code[^>]*><\/app-code>/g, '');
    html = html.replace(/<app-code[^>]*\/>/g, '');

    // Unwrap p-deferred-demo: its content takes its place, next to the elements around it (p-toast, a #menu it refers to...)
    html = html.replace(/^([ \t]*)<p-deferred-demo[^>]*>[ \t]*\n([\s\S]*?)\n[ \t]*<\/p-deferred-demo>/gm, (_, indent, inner) => {
        const lines = inner.split('\n');
        const innerIndent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length));
        const shift = Math.max(0, innerIndent - indent.length);
        return lines.map((line) => line.slice(Math.min(shift, line.match(/^\s*/)[0].length))).join('\n');
    });

    // Trim and clean up whitespace
    html = html.trim();

    // Remove leading/trailing empty lines
    html = html.replace(/^\s*\n/gm, '');

    // Normalize indentation
    html = normalizeIndent(html);

    return html || null;
}

// Extract existing code object from doc file using balanced brace matching
function extractExistingCodeObject(content) {
    // Find the start of code: Code = {
    const codeStart = content.match(/code:\s*Code\s*=\s*\{/);
    if (!codeStart) return null;

    const startIndex = codeStart.index + codeStart[0].length;

    // Find matching closing brace using balanced brace counting
    let braceCount = 1;
    let endIndex = startIndex;
    let inString = false;
    let stringChar = '';

    for (let i = startIndex; i < content.length && braceCount > 0; i++) {
        const char = content[i];
        const prevChar = i > 0 ? content[i - 1] : '';

        // Handle string literals (skip braces inside strings)
        if ((char === '`' || char === '"' || char === "'") && prevChar !== '\\') {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar) {
                inString = false;
                stringChar = '';
            }
        }

        if (!inString) {
            if (char === '{') braceCount++;
            else if (char === '}') braceCount--;
        }

        endIndex = i;
    }

    const codeBlock = content.substring(startIndex, endIndex);
    const code = {};

    // Extract typescript
    const tsMatch = codeBlock.match(/typescript:\s*`([\s\S]*?)`/);
    if (tsMatch) code.typescript = tsMatch[1];

    // Extract data
    const dataMatch = codeBlock.match(/data:\s*`([\s\S]*?)`/);
    if (dataMatch) code.data = dataMatch[1];

    // Extract scss
    const scssMatch = codeBlock.match(/scss:\s*`([\s\S]*?)`/);
    if (scssMatch) code.scss = scssMatch[1];

    // Extract service
    const serviceMatch = codeBlock.match(/service:\s*\[([\s\S]*?)\]/);
    if (serviceMatch) {
        const services = serviceMatch[1].match(/'([^']+)'/g);
        if (services) {
            code.service = services.map((s) => s.replace(/'/g, ''));
        }
    }

    return code;
}

// Detect ExhaustiveUI modules used in template
function detectExhaustiveModules(template) {
    const modules = new Set();

    // Check for p-* selectors
    for (const [selector, module] of Object.entries(SELECTOR_TO_MODULE)) {
        const regex = new RegExp(`<${selector}[\\s>]`, 'i');
        if (regex.test(template)) {
            modules.add(module);
        }
    }

    // Check for pButton directive
    if (/pButton/.test(template)) {
        modules.add('ButtonModule');
    }

    // Check for pInputText directive
    if (/pInputText/.test(template)) {
        modules.add('InputTextModule');
    }

    // Check for pRipple directive
    if (/pRipple/.test(template)) {
        modules.add('RippleModule');
    }

    // Check for pTooltip directive
    if (/pTooltip/.test(template)) {
        modules.add('TooltipModule');
    }

    // Check for pInputMask directive
    if (/pInputMask/.test(template)) {
        modules.add('InputMaskModule');
    }

    // Check for ngModel (needs FormsModule)
    if (/\[\(ngModel\)\]/.test(template) || /ngModel/.test(template)) {
        modules.add('FormsModule');
    }

    // Check for formControl (needs ReactiveFormsModule)
    if (/formControl/.test(template) || /formGroup/.test(template)) {
        modules.add('ReactiveFormsModule');
    }

    // Check for formField (Angular Signal Forms, needs FormField)
    if (/\[formField\]/.test(template)) {
        modules.add('FormField');
    }

    // Check for *ngFor, *ngIf (needs CommonModule)
    if (/\*ngFor|\*ngIf|ngClass|ngStyle|\[ngClass\]|\[ngStyle\]/.test(template)) {
        modules.add('CommonModule');
    }

    return Array.from(modules);
}

// Derive selector from filename
// e.g., "table/filter-advanced-doc.ts" -> "table-filter-advanced-demo"
// Directory name to route path mapping (when they differ)
const DIR_TO_ROUTE = {
    scroller: 'virtualscroller'
};

function deriveSelectorFromFilename(fileName, componentDir) {
    // Remove doc suffix (handles both "basicdoc" and "basic-doc" patterns)
    let section = fileName.replace(/-?doc$/, '');
    const routeName = DIR_TO_ROUTE[componentDir] || componentDir;
    return `${routeName}-${section}-demo`;
}

// Parse a single doc file
function parseDocFile(filePath, componentDir) {
    const content = fs.readFileSync(filePath, 'utf-8');

    const template = extractTemplate(content);
    if (!template) return null;

    const demoContent = extractDemoContent(template);
    if (!demoContent) return null;

    // Try to get existing code object (for data, scss that can't be auto-generated)
    const existingCode = extractExistingCodeObject(content);

    // Extract section name from filename
    const fileName = path.basename(filePath, '.ts');
    // Remove doc suffix (handles both "basicdoc" and "basic-doc" patterns)
    const section = fileName.replace(/-?doc$/, '');

    // Derive selector from filename - no need for app-code selector attribute
    const uniqueKey = deriveSelectorFromFilename(fileName, componentDir);

    // Get component name from selector (properly hyphenated) for correct PascalCase
    // e.g., "tree-table-sort-multiple-columns-demo" -> "TreeTableSortMultipleColumns"
    const componentName = toPascalCase(uniqueKey.replace(/-demo$/, ''));

    // Build the standalone component from the doc component's own TypeScript AST
    const demo = buildDemoComponent({ content, filePath, className: componentName + 'Demo', template: normalizeIndent(demoContent) });
    if (!demo) return null;
    const { services, exhaustiveServices, routeFiles } = demo;

    // extFiles: the domain interfaces that the demo and its route files import from @/domain/*
    const extFiles = demo.domainModules.filter((name) => DOMAIN_TYPE_DEFINITIONS[name]).map((name) => ({ path: `src/domain/${name}.ts`, content: DOMAIN_TYPE_DEFINITIONS[name] }));

    return {
        key: uniqueKey,
        selector: uniqueKey,
        component: componentDir,
        section,
        code: {
            typescript: demo.typescript,
            data: existingCode?.data,
            scss: existingCode?.scss
        },
        metadata: {
            services,
            exhaustiveServices, // ExhaustiveUI API services the demo provides
            extFiles,
            ...(routeFiles.length ? { routeFiles } : {}), // components the demo imports with a relative path
            imports: detectExhaustiveModules(demoContent)
        }
    };
}

// Main function
async function main() {
    console.log('Building demo code JSON...');

    const demos = {};
    let processedCount = 0;
    let errorCount = 0;

    // Get all component directories
    const componentDirs = fs.readdirSync(DOCS_DIR).filter((dir) => {
        const fullPath = path.join(DOCS_DIR, dir);
        return fs.statSync(fullPath).isDirectory() && !SKIP_DIRS.includes(dir.toLowerCase());
    });

    for (const componentDir of componentDirs) {
        const componentPath = path.join(DOCS_DIR, componentDir);

        // Get all *doc.ts files in this component directory
        const docFiles = glob.sync('**/*doc.ts', { cwd: componentPath });

        // Files that are documentation, not demos
        const SKIP_FILES = ['accessibilitydoc', 'styledoc', 'methodsdoc', 'eventsdoc', 'themedoc', 'propsdoc', 'importdoc'];

        for (const docFile of docFiles) {
            const fileName = path.basename(docFile, '.ts').toLowerCase();

            // Skip non-demo documentation files
            if (SKIP_FILES.some((skip) => fileName.includes(skip))) {
                continue;
            }

            const filePath = path.join(componentPath, docFile);

            try {
                const demo = parseDocFile(filePath, componentDir);
                if (demo && demo.key) {
                    demos[demo.key] = demo;
                    processedCount++;
                }
            } catch (error) {
                console.error(`Error processing ${filePath}:`, error.message);
                errorCount++;
            }
        }
    }

    // Generate output
    const output = {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        totalDemos: processedCount,
        demos
    };

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

    console.log(`\nBuild complete!`);
    console.log(`  Processed: ${processedCount} demos`);
    console.log(`  Errors: ${errorCount}`);
    console.log(`  Output: ${OUTPUT_PATH}`);
}

main().catch(console.error);
