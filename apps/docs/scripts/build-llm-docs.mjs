import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ComponentTokens from '@exhaustive-ui/themes/tokens';
import { generateAgentSkill } from './build-llm-skill.mjs';
import { renderAgentsMd, checkRenames } from './llm/agents.mjs';
import { generateCards } from './llm/cards.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '../doc');
const SITE_URL = 'https://exhaustive-ui.com';
const PAGES_DIR = path.resolve(__dirname, '../pages');
const API_DOC_PATH = path.resolve(__dirname, '../doc/apidoc/index.json');
const DEMOS_JSON_PATH = path.resolve(__dirname, '../public/demos.json');
const OUTPUT_DIR = path.resolve(__dirname, '../public/llms');
const EXHAUSTIVE_PACKAGE_JSON = path.resolve(__dirname, '../../../packages/core/package.json');

// Global demos data loaded from demos.json
let demosData = null;

// Mapping for components where route name doesn't match API component name
const COMPONENT_NAME_MAP = {
    datepicker: 'DatePicker',
    datatable: 'DataTable',
    dataview: 'DataView',
    treetable: 'TreeTable',
    treeselect: 'TreeSelect',
    multiselect: 'MultiSelect',
    selectbutton: 'SelectButton',
    togglebutton: 'ToggleButton',
    splitbutton: 'SplitButton',
    speeddial: 'SpeedDial',
    inputchips: 'InputChips',
    inputtext: 'InputText',
    inputnumber: 'InputNumber',
    inputmask: 'InputMask',
    inputotp: 'InputOtp',
    inputgroup: 'InputGroup',
    iconfield: 'IconField',
    floatlabel: 'FloatLabel',
    iftalabel: 'IftaLabel',
    colorpicker: 'ColorPicker',
    listbox: 'Listbox',
    orderlist: 'OrderList',
    picklist: 'PickList',
    contextmenu: 'ContextMenu',
    tieredmenu: 'TieredMenu',
    menubar: 'Menubar',
    megamenu: 'MegaMenu',
    panelmenu: 'PanelMenu',
    tabmenu: 'TabMenu',
    confirmdialog: 'ConfirmDialog',
    confirmpopup: 'ConfirmPopup',
    dynamicdialog: 'DynamicDialog',
    fileupload: 'FileUpload',
    progressbar: 'ProgressBar',
    progressspinner: 'ProgressSpinner',
    blockui: 'BlockUI',
    scrollpanel: 'ScrollPanel',
    scrolltop: 'ScrollTop',
    virtualscroller: 'VirtualScroller',
    animateonscroll: 'AnimateOnScroll',
    autofocus: 'AutoFocus',
    focustrap: 'FocusTrap',
    classnames: 'ClassNames',
    styleclass: 'StyleClass'
};

// Components whose documentation directory name differs from their public route.
// Keep in sync with router/app.routes.ts.
const COMPONENT_ROUTE_MAP = {
    scroller: 'virtualscroller',
    Image: 'image'
};

// Guide/documentation pages configuration
// Maps route paths to their doc directories and metadata
const GUIDE_PAGES = [
    {
        route: 'installation',
        docPath: 'installation',
        title: 'Installation',
        description: 'Setting up ExhaustiveUI in an Angular CLI project.'
    },
    {
        route: 'configuration',
        docPath: 'configuration',
        title: 'Configuration',
        description: 'Application wide configuration for ExhaustiveUI.'
    },
    {
        route: 'theming/styled',
        docPath: 'theming/styled',
        title: 'Styled Mode',
        description: 'Choose from a variety of pre-styled themes or develop your own.'
    },
    {
        route: 'theming/unstyled',
        docPath: 'theming/unstyled',
        title: 'Unstyled Mode',
        description: 'Theming ExhaustiveUI with alternative styling approaches.'
    },
    {
        route: 'icons',
        docPath: 'icons',
        title: 'Icons',
        description: 'OpenNG Icons is the default icon library of ExhaustiveUI with over 250 open source icons.'
    },
    {
        route: 'customicons',
        docPath: 'customicons',
        title: 'Custom Icons',
        description: 'Use custom icons with ExhaustiveUI components.'
    },
    {
        route: 'passthrough',
        docPath: 'guides/passthrough',
        title: 'Pass Through',
        description: 'Pass Through Props allow direct access to the underlying elements for complete customization.'
    },
    {
        route: 'tailwind',
        docPath: 'tailwind',
        title: 'Tailwind CSS',
        description: 'Integration between ExhaustiveUI and Tailwind CSS.'
    },
    {
        route: 'llms',
        docPath: 'llms',
        title: 'LLMs.txt',
        description: 'LLM-optimized documentation endpoints for ExhaustiveUI components.'
    },
    {
        route: 'guides/accessibility',
        docPath: 'guides/accessibility',
        title: 'Accessibility',
        description: 'ExhaustiveUI has WCAG 2.1 AA level compliance.'
    },
    {
        route: 'guides/animations',
        docPath: 'guides/animations',
        title: 'Animations',
        description: 'Built-in CSS animations for ExhaustiveUI components.'
    },
    {
        route: 'guides/naming',
        docPath: 'guides/naming',
        title: 'Naming Conventions',
        description: 'How ExhaustiveUI components, directives and templates are named.'
    },
    {
        route: 'guides/rtl',
        docPath: 'guides/rtl',
        title: 'RTL',
        description: 'Right-to-left support for ExhaustiveUI components.'
    },
    {
        route: 'guides/primeflex',
        docPath: 'guides/primeflex',
        title: 'PrimeFlex',
        description: 'Moving from PrimeFlex to Tailwind CSS.'
    },
    {
        route: 'philosophy',
        docPath: 'philosophy',
        title: 'Philosophy',
        description: 'Why ExhaustiveUI exists, what it commits to, and where it stops.'
    },
    {
        route: 'faq',
        docPath: 'faq',
        title: 'FAQ',
        description: 'Licensing, migration from PrimeNG, the ecosystem, and how support works.'
    },
    {
        route: 'migration/update',
        docPath: 'migration/update',
        title: 'Update ExhaustiveUI',
        description: 'Updating with ng update, Angular version compatibility, and a summary of what changes in v22.'
    },
    {
        route: 'migration/primeng',
        docPath: 'migration/primeng',
        title: 'Migrating from PrimeNG',
        description: 'Moving a PrimeNG v21 application to ExhaustiveUI: the migrate-from-primeng schematic, what it changes (packages, imports, configuration API, icons, CSS layer), the manual checks and the v22 migrations.'
    },
    {
        route: 'migration/optimus',
        docPath: 'migration/optimus',
        title: 'Migrating from Optimus UI',
        description: 'Moving an Optimus UI v2 application to ExhaustiveUI: package and configuration API renames, the CSS layer name, then the v22 migrations.'
    },
    {
        route: 'migration/v22',
        docPath: 'migration/v22',
        title: 'Migrating to v22',
        description: 'Moving an application to ExhaustiveUI v22: update steps from an ExhaustiveUI prerelease, PrimeNG v21 or Optimus UI, the automated migrations and their report, the Signals API, OnPush, removed API, behavior and type changes.'
    },
    {
        route: 'contribution',
        docPath: 'contribution',
        title: 'Contribution Guide',
        description: 'How to contribute to ExhaustiveUI.'
    }
];

/**
 * Get the correct component name for API lookups
 */
function getApiComponentName(componentName) {
    const lowerName = componentName.toLowerCase();
    if (COMPONENT_NAME_MAP[lowerName]) {
        return COMPONENT_NAME_MAP[lowerName];
    }
    // Default: capitalize first letter
    return componentName.charAt(0).toUpperCase() + componentName.slice(1);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Extract description text from Angular template
 */
function extractDescriptionFromTemplate(template) {
    const descriptions = [];

    // Extract content from app-docsectiontext
    const docTextMatches = template.matchAll(/<app-docsectiontext[^>]*>([\s\S]*?)<\/app-docsectiontext>/gi);
    for (const match of docTextMatches) {
        const content = match[1]
            .replace(/<[^>]+>/g, ' ')
            .replace(/&#64;/g, '@')
            .replace(/&#123;/g, '{')
            .replace(/&#125;/g, '}')
            .replace(/\s+/g, ' ')
            .trim();
        if (content) {
            descriptions.push(content);
        }
    }

    return descriptions.join(' ');
}

/**
 * Load demos.json data
 */
function loadDemosJson() {
    if (!fs.existsSync(DEMOS_JSON_PATH)) {
        console.warn('demos.json not found. Run build:democode first.');
        return null;
    }

    return JSON.parse(fs.readFileSync(DEMOS_JSON_PATH, 'utf-8'));
}

/**
 * Convert component name to hyphenated form (e.g., cascadeselect -> cascade-select)
 */
function toHyphenatedName(name) {
    // Common compound words that need hyphenation
    const compounds = {
        cascadeselect: 'cascade-select',
        treeselect: 'tree-select',
        treetable: 'tree-table',
        multiselect: 'multi-select',
        selectbutton: 'select-button',
        togglebutton: 'toggle-button',
        splitbutton: 'split-button',
        speeddial: 'speed-dial',
        inputchips: 'input-chips',
        inputtext: 'input-text',
        inputnumber: 'input-number',
        inputmask: 'input-mask',
        inputotp: 'input-otp',
        inputgroup: 'input-group',
        iconfield: 'icon-field',
        floatlabel: 'float-label',
        iftalabel: 'ifta-label',
        colorpicker: 'color-picker',
        orderlist: 'order-list',
        picklist: 'pick-list',
        contextmenu: 'context-menu',
        tieredmenu: 'tiered-menu',
        megamenu: 'mega-menu',
        panelmenu: 'panel-menu',
        tabmenu: 'tab-menu',
        confirmdialog: 'confirm-dialog',
        confirmpopup: 'confirm-popup',
        dynamicdialog: 'dynamic-dialog',
        fileinput: 'file-input',
        fileupload: 'file-upload',
        progressbar: 'progress-bar',
        progressspinner: 'progress-spinner',
        blockui: 'block-ui',
        scrollpanel: 'scroll-panel',
        scrolltop: 'scroll-top',
        virtualscroller: 'virtual-scroller',
        datepicker: 'date-picker',
        dataview: 'data-view',
        toggleswitch: 'toggle-switch',
        organizationchart: 'organization-chart',
        overlaybadge: 'overlay-badge',
        metergroup: 'meter-group',
        imagecompare: 'image-compare'
    };
    return compounds[name.toLowerCase()] || name;
}

/**
 * Get code examples from demos.json for a specific component section
 */
function getCodeExamplesFromDemos(componentName, sectionId) {
    if (!demosData || !demosData.demos) return null;

    // Try different selector patterns
    const hyphenated = toHyphenatedName(componentName);
    const selectors = [`${componentName}-${sectionId}-demo`, `${hyphenated}-${sectionId}-demo`];

    for (const selector of selectors) {
        const demo = demosData.demos[selector];
        if (demo && demo.code) {
            const examples = {};
            if (demo.code.typescript) examples.typescript = demo.code.typescript;
            if (demo.code.data) examples.data = demo.code.data;
            if (demo.code.scss) examples.scss = demo.code.scss;

            return Object.keys(examples).length > 0 ? examples : null;
        }
    }

    return null;
}

/**
 * Extract code object from file content
 */
function extractCodeFromFile(content) {
    const examples = {};

    // Look for code: Code = { ... } pattern
    const codeMatch = content.match(/code:\s*Code\s*=\s*\{/);
    if (codeMatch) {
        const startIndex = codeMatch.index + codeMatch[0].length;
        let braceDepth = 1;
        let endIndex = startIndex;

        for (let i = startIndex; i < content.length && braceDepth > 0; i++) {
            if (content[i] === '{') braceDepth++;
            else if (content[i] === '}') braceDepth--;
            endIndex = i;
        }

        const codeContent = content.substring(startIndex, endIndex);

        // Extract each code type
        const extractBetweenBackticks = (text, prefix) => {
            const regex = new RegExp(prefix + '\\s*`([\\s\\S]*?)`');
            const match = text.match(regex);
            return match ? match[1].trim() : null;
        };

        const typescript = extractBetweenBackticks(codeContent, 'typescript:');
        const command = extractBetweenBackticks(codeContent, 'command:');
        const scss = extractBetweenBackticks(codeContent, 'scss:');

        if (typescript) examples.typescript = typescript;
        if (command) examples.command = command;
        if (scss) examples.scss = scss;
    }

    return Object.keys(examples).length > 0 ? examples : null;
}

/**
 * Parse a single TypeScript documentation file
 */
function parseDocFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract template from @Component decorator
    const templateMatch = content.match(/template:\s*`([\s\S]*?)`(?=\s*(?:,|\}))/);
    const template = templateMatch ? templateMatch[1] : '';

    const description = extractDescriptionFromTemplate(template);

    // Extract app-code selector from template (for guide pages that reference other demos)
    const appCodeMatch = template.match(/<app-code\s+selector="([^"]+)"/);
    const appCodeSelector = appCodeMatch ? appCodeMatch[1] : null;

    // Extract inline code object from file (for guide pages)
    const inlineCode = extractCodeFromFile(content);

    return {
        description,
        appCodeSelector,
        inlineCode
    };
}

/**
 * Get code examples by selector directly from demos.json
 */
function getCodeExamplesBySelector(selector) {
    if (!demosData || !demosData.demos || !selector) return null;

    const demo = demosData.demos[selector];
    if (demo && demo.code) {
        const examples = {};
        if (demo.code.typescript) examples.typescript = demo.code.typescript;
        if (demo.code.data) examples.data = demo.code.data;
        if (demo.code.scss) examples.scss = demo.code.scss;

        return Object.keys(examples).length > 0 ? examples : null;
    }

    return null;
}

/**
 * Get component metadata from page file
 */
function getComponentMetadata(componentName) {
    const pagePath = path.join(PAGES_DIR, componentName, 'index.ts');

    if (!fs.existsSync(pagePath)) {
        return null;
    }

    const content = fs.readFileSync(pagePath, 'utf-8');

    // Extract from app-doc template attributes
    const docTitleMatch = content.match(/docTitle="([^"]+)"/);
    // Page titles carry a ' - ExhaustiveUI' suffix for the browser tab; the llms output
    // is already headed '# ExhaustiveUI', so drop it rather than repeat it on every line.
    const docTitle = docTitleMatch ? docTitleMatch[1].replace(/\s+-\s+ExhaustiveUI$/, '') : null;
    const headerMatch = content.match(/header="([^"]+)"/);
    const descriptionMatch = content.match(/description="([^"]+)"/);
    const apiDocsMatch = content.match(/\[apiDocs\]="(\[[^\]]+\])"/);
    const themeDocsMatch = content.match(/themeDocs="([^"]+)"/);

    // Extract docs array for sections
    const docsMatch = content.match(/docs\s*=\s*\[([\s\S]*?)\];/);
    let sections = [];

    if (docsMatch) {
        const docsContent = docsMatch[1];
        const sectionMatches = docsContent.matchAll(/{\s*id:\s*['"]([^'"]+)['"]\s*,\s*label:\s*['"]([^'"]+)['"]/g);

        for (const match of sectionMatches) {
            sections.push({
                id: match[1],
                label: match[2]
            });
        }
    }

    // Parse apiDocs array
    let apiComponents = [];
    if (apiDocsMatch) {
        try {
            apiComponents = JSON.parse(apiDocsMatch[1].replace(/'/g, '"'));
        } catch (e) {
            // Try extracting manually
            const apiMatches = apiDocsMatch[1].matchAll(/['"]([^'"]+)['"]/g);
            for (const m of apiMatches) {
                apiComponents.push(m[1]);
            }
        }
    }

    return {
        title: docTitle ?? componentName,
        header: headerMatch ? headerMatch[1] : componentName,
        description: descriptionMatch ? descriptionMatch[1] : '',
        sections,
        apiComponents,
        themeDocs: themeDocsMatch ? themeDocsMatch[1] : componentName.toLowerCase()
    };
}

/**
 * Process a component directory
 */
function processComponent(componentName, componentDir) {
    const metadata = getComponentMetadata(componentName);

    if (!metadata) {
        return null;
    }

    const component = {
        name: componentName,
        title: metadata.title,
        description: metadata.description,
        apiComponents: metadata.apiComponents,
        themeDocs: metadata.themeDocs,
        sections: []
    };

    const files = fs.readdirSync(componentDir);

    for (const file of files) {
        if (!file.endsWith('.ts') || file.endsWith('.spec.ts')) continue;

        const filePath = path.join(componentDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) continue;

        // Extract section id from filename (e.g., "basic-doc.ts" -> "basic" or "basicdoc.ts" -> "basic")
        const sectionId = file.replace(/-?doc\.ts$/i, '').toLowerCase();
        const sectionInfo = metadata.sections.find((s) => s.id === sectionId);

        const docData = parseDocFile(filePath);

        // Sections that should use inline code from doc file instead of demos.json
        const nonDemoSections = ['accessibility', 'style'];

        // Get code examples: for non-demo sections use inline code from doc file,
        // otherwise get from demos.json
        let codeExamples;
        if (nonDemoSections.includes(sectionId)) {
            // For accessibility/style docs, only use code object defined in the doc file
            codeExamples = docData.inlineCode;
        } else {
            // For regular demo sections, get code from demos.json
            codeExamples = getCodeExamplesFromDemos(componentName, sectionId);
        }

        if (docData.description || codeExamples) {
            component.sections.push({
                id: sectionId,
                label: sectionInfo ? sectionInfo.label : file.replace('.ts', ''),
                description: docData.description,
                examples: codeExamples
            });
        }
    }

    return component;
}

/**
 * Get all components from the docs directory
 */
function getAllComponents() {
    const entries = fs.readdirSync(DOCS_DIR);
    const components = [];

    // Directories to exclude (non-component documentation)
    const excludeDirs = [
        'apidoc',
        'common',
        'guides',
        'theming',
        'configuration',
        'contribution',
        'customicons',
        'faq',
        'philosophy',
        'designer',
        'icons',
        'introduction',
        'installation',
        'setup',
        'tailwind',
        'colors',
        'primeflex',
        'domain',
        'filterservice',
        'bind',
        'forms',
        'passthrough',
        'cdn',
        'nuxt',
        'accessibility',
        'templates',
        'migration'
    ];

    for (const entry of entries) {
        const componentDir = path.join(DOCS_DIR, entry);
        const stat = fs.statSync(componentDir);

        if (!stat.isDirectory() || excludeDirs.includes(entry)) continue;

        const component = processComponent(entry, componentDir);
        if (component && component.sections.length > 0) {
            components.push(component);
        }
    }

    return components;
}

/**
 * Load API documentation
 */
function loadApiDocs() {
    if (!fs.existsSync(API_DOC_PATH)) {
        console.warn('API documentation not found. Run build:apidoc first.');
        return {};
    }

    return JSON.parse(fs.readFileSync(API_DOC_PATH, 'utf-8'));
}

/**
 * Get Props from API documentation
 */
function getPropsFromApi(apiDocs, componentName) {
    const apiDoc = apiDocs[componentName.toLowerCase()];
    if (!apiDoc || !apiDoc.components) return null;

    // Get the main component (usually matches the componentName)
    const mainComponent = apiDoc.components[componentName] || Object.values(apiDoc.components)[0];

    if (!mainComponent || !mainComponent.props || !mainComponent.props.values) return null;

    return mainComponent.props.values.map((prop) => ({
        name: prop.name,
        type: prop.type || '',
        default: prop.default || '-',
        description: prop.description || '',
        deprecated: prop.deprecated || ''
    }));
}

/**
 * Get Templates (Slots) from API documentation
 */
function getTemplatesFromApi(apiDocs, componentName) {
    const apiDoc = apiDocs[componentName.toLowerCase()];
    if (!apiDoc || !apiDoc.components) return null;

    const mainComponent = apiDoc.components[componentName] || Object.values(apiDoc.components)[0];

    if (!mainComponent || !mainComponent.templates || !mainComponent.templates.values) return null;

    return mainComponent.templates.values.map((template) => ({
        name: template.name,
        type: template.type || '',
        description: template.description || ''
    }));
}

/**
 * Get Emits from API documentation
 */
function getEmitsFromApi(apiDocs, componentName) {
    const apiDoc = apiDocs[componentName.toLowerCase()];
    if (!apiDoc || !apiDoc.components) return null;

    const mainComponent = apiDoc.components[componentName] || Object.values(apiDoc.components)[0];

    if (!mainComponent || !mainComponent.emits || !mainComponent.emits.values) return null;

    return mainComponent.emits.values.map((emit) => ({
        name: emit.name,
        parameters: emit.parameters || [],
        description: emit.description || ''
    }));
}

/**
 * Get Methods from API documentation
 */
function getMethodsFromApi(apiDocs, componentName) {
    const apiDoc = apiDocs[componentName.toLowerCase()];
    if (!apiDoc || !apiDoc.components) return null;

    const mainComponent = apiDoc.components[componentName] || Object.values(apiDoc.components)[0];

    if (!mainComponent || !mainComponent.methods || !mainComponent.methods.values) return null;

    return mainComponent.methods.values.map((method) => ({
        name: method.name,
        parameters: method.parameters || [],
        returnType: method.returnType || 'void',
        description: method.description || ''
    }));
}

/**
 * Get Pass Through Options from API types
 */
function getPTOptionsFromApi(apiDocs, componentName) {
    const apiDoc = apiDocs[componentName.toLowerCase()];
    if (!apiDoc || !apiDoc.types || !apiDoc.types.interfaces || !apiDoc.types.interfaces.values) return null;

    const ptInterface = apiDoc.types.interfaces.values.find((i) => i.name && i.name.includes('PassThrough') && i.name.includes('Options'));

    if (!ptInterface || !ptInterface.props) return null;

    return ptInterface.props.map((pt) => ({
        name: pt.name,
        type: pt.type || '',
        description: pt.description || ''
    }));
}

/**
 * Get CSS Classes from API style documentation
 */
function getStyleClassesFromApi(apiDocs, componentName) {
    const apiDoc = apiDocs[componentName.toLowerCase()];
    if (!apiDoc || !apiDoc.style || !apiDoc.style.classes || !apiDoc.style.classes.values) return null;

    return apiDoc.style.classes.values
        .filter((cls) => cls.class && typeof cls.class === 'string')
        .map((cls) => ({
            class: cls.class,
            description: cls.description || ''
        }));
}

/**
 * Get Design Tokens from @exhaustive-ui/themes
 */
function getTokensFromApi(componentName) {
    const tokens = [];
    const tokenKey = componentName.toLowerCase();

    if (ComponentTokens[tokenKey]) {
        const componentTokens = ComponentTokens[tokenKey].tokens;

        if (Array.isArray(componentTokens)) {
            for (const tokenData of componentTokens) {
                tokens.push({
                    token: tokenData.token,
                    variable: tokenData.variable,
                    description: tokenData.description || ''
                });
            }
        }
    }

    return tokens.length > 0 ? tokens : null;
}

/**
 * Get all related components from API doc
 */
function getRelatedComponents(apiDocs, componentName) {
    const apiDoc = apiDocs[componentName.toLowerCase()];
    if (!apiDoc || !apiDoc.components) return [];

    return Object.keys(apiDoc.components);
}

/**
 * Generate API section for markdown (with all sub-components)
 */
function generateApiSection(apiDocs, componentName, includeRelated = true) {
    let markdown = '';

    const apiDoc = apiDocs[componentName.toLowerCase()];
    if (!apiDoc || !apiDoc.components) return markdown;

    const components = includeRelated ? Object.keys(apiDoc.components) : [componentName];

    for (const compName of components) {
        const comp = apiDoc.components[compName];
        if (!comp) continue;

        const displayName = compName.replace(/([A-Z])/g, ' $1').trim();
        markdown += `## ${displayName}\n\n`;

        if (comp.description) {
            markdown += `${comp.description}\n\n`;
        }

        // Props
        if (comp.props && comp.props.values && comp.props.values.length > 0) {
            markdown += '### Props\n\n';
            markdown += '| Name | Type | Default | Description |\n';
            markdown += '|------|------|---------|-------------|\n';

            for (const prop of comp.props.values) {
                const name = prop.name || '';
                const type = (prop.type || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
                const defaultValue = prop.default || '-';
                const description = (prop.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
                const deprecated = prop.deprecated ? ' **(Deprecated)**' : '';

                markdown += `| ${name} | ${type} | ${defaultValue} | ${description}${deprecated} |\n`;
            }

            markdown += '\n';
        }

        // Emits
        if (comp.emits && comp.emits.values && comp.emits.values.length > 0) {
            markdown += '### Emits\n\n';
            markdown += '| Name | Parameters | Description |\n';
            markdown += '|------|------------|-------------|\n';

            for (const emit of comp.emits.values) {
                const name = emit.name || '';
                const params = emit.parameters
                    ? emit.parameters
                          .map((p) => `${p.name}: ${p.type}`)
                          .join(', ')
                          .replace(/\|/g, '\\|')
                    : '';
                const description = (emit.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

                markdown += `| ${name} | ${params} | ${description} |\n`;
            }

            markdown += '\n';
        }

        // Templates (Slots)
        if (comp.templates && comp.templates.values && comp.templates.values.length > 0) {
            markdown += '### Templates\n\n';
            markdown += '| Name | Type | Description |\n';
            markdown += '|------|------|-------------|\n';

            for (const template of comp.templates.values) {
                const name = template.name || '';
                const type = (template.type || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
                const description = (template.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

                markdown += `| ${name} | ${type} | ${description} |\n`;
            }

            markdown += '\n';
        }

        // Methods
        if (comp.methods && comp.methods.values && comp.methods.values.length > 0) {
            markdown += '### Methods\n\n';
            markdown += '| Name | Parameters | Return Type | Description |\n';
            markdown += '|------|------------|-------------|-------------|\n';

            for (const method of comp.methods.values) {
                const name = method.name || '';
                const params = method.parameters
                    ? method.parameters
                          .map((p) => `${p.name}: ${p.type}`)
                          .join(', ')
                          .replace(/\|/g, '\\|')
                    : '';
                const returnType = (method.returnType || 'void').replace(/\|/g, '\\|');
                const description = (method.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

                markdown += `| ${name} | ${params} | ${returnType} | ${description} |\n`;
            }

            markdown += '\n';
        }
    }

    return markdown;
}

/**
 * Generate Pass Through section for markdown
 */
function generatePTSection(apiDocs, componentName) {
    let markdown = '';

    const ptOptions = getPTOptionsFromApi(apiDocs, componentName);
    if (ptOptions && ptOptions.length > 0) {
        markdown += '## Pass Through Options\n\n';
        markdown += '| Name | Type | Description |\n';
        markdown += '|------|------|-------------|\n';

        for (const pt of ptOptions) {
            const name = pt.name || '';
            const type = (pt.type || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
            const description = (pt.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

            markdown += `| ${name} | ${type} | ${description} |\n`;
        }

        markdown += '\n';
    }

    return markdown;
}

/**
 * Generate Theming section for markdown
 */
function generateThemingSection(apiDocs, componentName) {
    let markdown = '';

    // CSS Classes
    const styleClasses = getStyleClassesFromApi(apiDocs, componentName);
    if (styleClasses && styleClasses.length > 0) {
        markdown += '## Theming\n\n';
        markdown += '### CSS Classes\n\n';
        markdown += '| Class | Description |\n';
        markdown += '|-------|-------------|\n';

        for (const style of styleClasses) {
            const className = style.class || '';
            const description = (style.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

            markdown += `| ${className} | ${description} |\n`;
        }

        markdown += '\n';
    }

    // Design Tokens
    const tokens = getTokensFromApi(componentName);
    if (tokens && tokens.length > 0) {
        if (!markdown.includes('## Theming')) {
            markdown += '## Theming\n\n';
        }
        markdown += '### Design Tokens\n\n';
        markdown += '| Token | CSS Variable | Description |\n';
        markdown += '|-------|--------------|-------------|\n';

        for (const token of tokens) {
            markdown += `| ${token.token} | ${token.variable} | ${token.description} |\n`;
        }

        markdown += '\n';
    }

    return markdown;
}

/**
 * Generate JSON output with full API data
 */
function generateJsonOutput(components, apiDocs, guidePages = []) {
    const output = {
        version: '1.0.0',
        generatedAt: new Date().toISOString().split('T')[0],
        components: components.map((comp) => {
            const mainComponentName = getApiComponentName(comp.name);

            return {
                name: comp.name,
                title: comp.title,
                description: comp.description,
                sections: comp.sections.map((section) => ({
                    id: section.id,
                    label: section.label,
                    description: section.description,
                    examples: section.examples
                })),
                api: {
                    props: getPropsFromApi(apiDocs, mainComponentName),
                    templates: getTemplatesFromApi(apiDocs, mainComponentName),
                    emits: getEmitsFromApi(apiDocs, mainComponentName),
                    methods: getMethodsFromApi(apiDocs, mainComponentName),
                    pt: getPTOptionsFromApi(apiDocs, mainComponentName),
                    styles: getStyleClassesFromApi(apiDocs, mainComponentName),
                    tokens: getTokensFromApi(mainComponentName)
                }
            };
        }),
        pages: guidePages.map((page) => ({
            name: page.route.split('/').pop(),
            path: page.route,
            title: page.title,
            description: page.description,
            sections: page.sections.map((section) => ({
                id: section.id,
                label: section.label,
                description: section.description,
                examples: section.examples
            }))
        }))
    };

    const outputPath = path.join(OUTPUT_DIR, 'components.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`✓ Generated JSON output: ${outputPath}`);

    return output;
}

/**
 * Generate combined Markdown output for AI context
 */
function generateMarkdownOutput(components, apiDocs, guidePages = []) {
    let markdown = '# ExhaustiveUI Documentation\n\n';
    markdown += `Generated: ${new Date().toISOString().split('T')[0]}\n\n`;
    markdown += '---\n\n';

    // Guide Pages Section
    if (guidePages.length > 0) {
        markdown += '# Guide Pages\n\n';

        for (const page of guidePages) {
            markdown += `# ${page.title}\n\n`;

            if (page.description) {
                markdown += `${page.description}\n\n`;
            }

            for (const section of page.sections) {
                markdown += `## ${section.label}\n\n`;

                if (section.description) {
                    markdown += `${section.description}\n\n`;
                }

                if (section.examples) {
                    if (section.examples.typescript) {
                        markdown += '```typescript\n';
                        markdown += section.examples.typescript;
                        markdown += '\n```\n\n';
                    }
                }
            }

            markdown += '---\n\n';
        }
    }

    // Components Section
    markdown += '# Components\n\n';

    for (const comp of components) {
        const mainComponentName = getApiComponentName(comp.name);

        markdown += `# ${comp.title}\n\n`;
        markdown += `${comp.description}\n\n`;

        // Add sections with examples
        for (const section of comp.sections) {
            markdown += `## ${section.label}\n\n`;

            if (section.description) {
                markdown += `${section.description}\n\n`;
            }

            if (section.examples) {
                if (section.examples.typescript) {
                    markdown += '**Example:**\n\n';
                    markdown += '```typescript\n';
                    markdown += section.examples.typescript;
                    markdown += '\n```\n\n';
                }

                if (section.examples.data) {
                    markdown += '**Sample Data:**\n\n';
                    markdown += '```json\n';
                    markdown += section.examples.data;
                    markdown += '\n```\n\n';
                }
            }
        }

        // Add API documentation
        markdown += generateApiSection(apiDocs, mainComponentName);

        // Add Pass Through Options
        markdown += generatePTSection(apiDocs, mainComponentName);

        // Add Theming
        markdown += generateThemingSection(apiDocs, mainComponentName);

        markdown += '---\n\n';
    }

    const outputPath = path.join(OUTPUT_DIR, 'llms-full.txt');
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    console.log(`✓ Generated Markdown output: ${outputPath}`);

    return markdown;
}

/**
 * Generate llms.txt index file
 */
function generateLlmsTxt(components, pages = [], cardNames = new Set()) {
    let content = '# ExhaustiveUI\n\n';
    content += '> A community-maintained, MIT licensed suite of 80+ accessible Angular UI components.\n\n';
    content += `Before writing code with ExhaustiveUI, read the guide for AI coding agents (rules, setup, PrimeNG differences): ${SITE_URL}/llms/AGENTS.md\n\n`;
    content += 'Each component link below is a compact card (import, tag, key inputs, templates with their context, one example); the complete document is at /llms/components/<name>.md.\n\n';
    content += 'Machine-readable API (selectors, inputs, outputs, templates, types): https://exhaustive-ui.com/llms/manifest.json\n\n';

    // Add Guides section
    if (pages.length > 0) {
        content += '## Guides\n\n';

        for (const page of pages) {
            content += `- [${page.title}](https://exhaustive-ui.com/${page.route}): ${page.description}\n`;
        }

        content += '\n';
    }

    // Add Components section
    content += '## Components\n\n';

    const sorted = [...components].sort((a, b) => a.title.localeCompare(b.title));

    for (const comp of sorted) {
        const route = COMPONENT_ROUTE_MAP[comp.name] ?? comp.name;
        const link = cardNames.has(comp.name) ? `${SITE_URL}/llms/cards/${comp.name}.md` : `${SITE_URL}/${route}`;
        content += `- [${comp.title}](${link}): ${comp.description}\n`;
    }

    const outputPath = path.join(OUTPUT_DIR, 'llms.txt');
    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log(`✓ Generated llms.txt: ${outputPath}`);
}

/**
 * Generate individual component markdown files
 */
function generateIndividualMarkdownFiles(components, apiDocs) {
    const componentsDir = path.join(OUTPUT_DIR, 'components');

    if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir, { recursive: true });
    }

    for (const comp of components) {
        const mainComponentName = getApiComponentName(comp.name);

        let markdown = `# ${comp.title}\n\n`;
        markdown += `${comp.description}\n\n`;

        // Import section
        const importSection = comp.sections.find((s) => s.id === 'import');
        if (importSection && importSection.examples && importSection.examples.typescript) {
            markdown += '## Import\n\n';
            markdown += '```typescript\n';
            markdown += importSection.examples.typescript;
            markdown += '\n```\n\n';
        }

        // Other sections
        for (const section of comp.sections) {
            if (section.id === 'import') continue;

            markdown += `## ${section.label}\n\n`;

            if (section.description) {
                markdown += `${section.description}\n\n`;
            }

            if (section.examples) {
                if (section.examples.typescript) {
                    markdown += '```typescript\n';
                    markdown += section.examples.typescript;
                    markdown += '\n```\n\n';
                }
            }
        }

        // Add API documentation (without related components for individual files)
        markdown += generateApiSection(apiDocs, mainComponentName, false);

        // Add Pass Through Options
        markdown += generatePTSection(apiDocs, mainComponentName);

        // Add Theming
        markdown += generateThemingSection(apiDocs, mainComponentName);

        const outputPath = path.join(componentsDir, `${comp.name}.md`);
        fs.writeFileSync(outputPath, markdown, 'utf-8');
    }

    console.log(`✓ Generated ${components.length} individual markdown files`);
}

/**
 * Collect the Code objects of a guide doc file, by field name: `code: Code = { command: `...` }`.
 */
function extractNamedCodeBlocks(content) {
    const blocks = {};
    for (const match of content.matchAll(/(\w+):\s*Code\s*=\s*\{/g)) {
        let depth = 1;
        let i = match.index + match[0].length;
        const start = i;
        for (; i < content.length && depth > 0; i++) {
            if (content[i] === '{') depth++;
            else if (content[i] === '}') depth--;
        }
        const body = content.substring(start, i - 1);
        const fences = [];
        for (const [key, lang] of [
            ['command', 'bash'],
            ['typescript', 'typescript'],
            ['html', 'html'],
            ['scss', 'scss']
        ]) {
            const m = body.match(new RegExp(key + ':\\s*`([\\s\\S]*?)`'));
            if (m) fences.push('```' + lang + '\n' + unescapeTemplateLiteral(m[1]).trim() + '\n```');
        }
        if (fences.length) blocks[match[1]] = fences.join('\n\n');
    }
    return blocks;
}

/** The raw text of a template literal as written in the source, turned into the string it evaluates to. */
function unescapeTemplateLiteral(raw) {
    return raw.replace(/\\([\\`$])/g, '$1');
}

function decodeEntities(text) {
    return text
        .replace(/&#64;/g, '@')
        .replace(/&#123;/g, '{')
        .replace(/&#125;/g, '}')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

/**
 * Convert the text of a guide doc section (the app-docsectiontext blocks) to Markdown: headings, paragraphs,
 * lists, inline code, links and the app-code blocks it references. Returns null when the template has no
 * app-docsectiontext.
 */
function guideTemplateToMarkdown(content) {
    const templateMatch = content.match(/template:\s*`([\s\S]*?)`(?=\s*(?:,|\}))/);
    if (!templateMatch) return null;
    const codeBlocks = extractNamedCodeBlocks(content);
    const usedCode = new Set();
    const parts = [];

    for (const match of templateMatch[1].matchAll(/<app-docsectiontext[^>]*>([\s\S]*?)<\/app-docsectiontext>/gi)) {
        let html = match[1];
        html = html.replace(/<app-code[^>]*\[code\]="(\w+)"[^>]*>(?:\s*<\/app-code>)?/g, (_, name) => {
            if (!codeBlocks[name]) return '';
            usedCode.add(name);
            return `\n\n@@CODE:${name}@@\n\n`;
        });
        html = html.replace(
            /<(i|code)>([\s\S]*?)<\/\1>/g,
            (_, __, t) =>
                '`' +
                t
                    .replace(/<[^>]+>/g, '')
                    .replace(/\s+/g, ' ')
                    .trim() +
                '`'
        );
        html = html.replace(/<(b|strong)>([\s\S]*?)<\/\1>/g, (_, __, t) => '**' + t.trim() + '**');
        html = html.replace(/<a\s[^>]*?(?:href="([^"]+)"|\[routerLink\]="'([^']+)'")[^>]*>([\s\S]*?)<\/a>/g, (_, href, route, text) => {
            const url = href || (route ? SITE_URL + route : '');
            return url ? `[${text.replace(/\s+/g, ' ').trim()}](${url})` : text;
        });
        html = html.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (_, t) => `\n\n### ${t.trim()}\n\n`);
        html = html.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (_, list) => {
            let n = 0;
            return '\n\n' + list.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (__, t) => `\n${++n}. ${t.replace(/\s+/g, ' ').trim()}`) + '\n\n';
        });
        html = html.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, t) => `\n- ${t.replace(/\s+/g, ' ').trim()}`);
        html = html.replace(/<\/?(ul|p)[^>]*>/g, '\n\n');
        html = html.replace(/<[^>]+>/g, ' ');
        const text = decodeEntities(html)
            .split(/\n{2,}/)
            .map((block) =>
                block
                    .split('\n')
                    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
                    .filter(Boolean)
                    .join('\n')
            )
            .filter(Boolean)
            .join('\n\n')
            .replace(/@@CODE:(\w+)@@/g, (_, name) => codeBlocks[name]);
        if (text) parts.push(text);
    }

    return parts.length ? { markdown: parts.join('\n\n'), usedCode: usedCode.size > 0 } : null;
}

/**
 * Section order and labels of a guide page, read from its pages/<route>/index.ts `docs` array.
 * Maps the doc file path (relative to doc/, without extension) to { order, id, label }.
 */
function readGuideSectionOrder(route) {
    const indexPath = path.join(PAGES_DIR, route, 'index.ts');
    if (!fs.existsSync(indexPath)) return null;
    const content = fs.readFileSync(indexPath, 'utf-8');
    const imports = {};
    for (const m of content.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'@\/doc\/([^']+)'/g)) imports[m[1]] = m[2];
    const order = {};
    let index = 0;
    for (const m of content.matchAll(/\{\s*id:\s*'([^']+)',\s*label:\s*'([^']+)',\s*component:\s*(\w+)\s*\}/g)) {
        if (imports[m[3]]) order[imports[m[3]]] = { order: index++, id: m[1], label: m[2] };
    }
    return Object.keys(order).length ? order : null;
}

/**
 * Process a guide/documentation page
 */
function processGuidePage(pageConfig) {
    const docDir = path.join(DOCS_DIR, pageConfig.docPath);

    if (!fs.existsSync(docDir)) {
        console.warn(`   Warning: Doc directory not found for ${pageConfig.route}`);
        return null;
    }

    const page = {
        route: pageConfig.route,
        title: pageConfig.title,
        description: pageConfig.description,
        sections: []
    };

    // Process doc files recursively
    function processDocDir(dir, prefix = '') {
        const entries = fs.readdirSync(dir);

        for (const entry of entries) {
            const entryPath = path.join(dir, entry);
            const stat = fs.statSync(entryPath);

            if (stat.isDirectory()) {
                // Recurse into subdirectories
                processDocDir(entryPath, entry + '/');
            } else if (entry.endsWith('.ts') && !entry.endsWith('.spec.ts') && entry.toLowerCase().includes('doc')) {
                const sectionId = entry.replace(/-?doc\.ts$/i, '').toLowerCase();
                const docData = parseDocFile(entryPath);
                const converted = guideTemplateToMarkdown(fs.readFileSync(entryPath, 'utf-8'));
                if (converted) docData.description = converted.markdown;
                const relativePath = path.relative(DOCS_DIR, entryPath).replace(/\.ts$/, '').split(path.sep).join('/');
                const ordering = sectionOrder ? sectionOrder[relativePath] : null;

                // Get code examples - priority: inline code > app-code selector > page/section naming
                let codeExamples = converted && converted.usedCode ? null : docData.inlineCode;
                if (!codeExamples && docData.appCodeSelector) {
                    codeExamples = getCodeExamplesBySelector(docData.appCodeSelector);
                }
                if (!codeExamples && !(converted && converted.usedCode)) {
                    const pageName = pageConfig.route.split('/').pop();
                    codeExamples = getCodeExamplesFromDemos(pageName, sectionId);
                }

                if (docData.description || codeExamples) {
                    // Extract label from filename - convert camelCase to title case
                    const label = sectionId
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim();

                    page.sections.push({
                        id: ordering ? ordering.id : prefix + sectionId,
                        order: ordering ? ordering.order : Number.MAX_SAFE_INTEGER,
                        label: ordering ? ordering.label : label.charAt(0).toUpperCase() + label.slice(1),
                        description: docData.description,
                        examples: codeExamples
                    });
                }
            }
        }
    }

    const sectionOrder = readGuideSectionOrder(pageConfig.route);
    processDocDir(docDir);
    // Sections follow the page's own order; sections missing from it keep the file order, at the end.
    page.sections.sort((a, b) => a.order - b.order);
    page.sections.forEach((section) => delete section.order);

    return page;
}

/**
 * Get all guide pages
 */
function getAllGuidePages() {
    const pages = [];

    for (const pageConfig of GUIDE_PAGES) {
        const page = processGuidePage(pageConfig);
        if (page) {
            pages.push(page);
        }
    }

    return pages;
}

/**
 * Generate individual page markdown files
 */
function generatePageMarkdownFiles(pages) {
    const pagesDir = path.join(OUTPUT_DIR, 'pages');

    if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir, { recursive: true });
    }

    for (const page of pages) {
        let markdown = `# ${page.title}\n\n`;
        markdown += `${page.description}\n\n`;

        for (const section of page.sections) {
            markdown += `## ${section.label}\n\n`;

            if (section.description) {
                markdown += `${section.description}\n\n`;
            }

            if (section.examples) {
                if (section.examples.typescript) {
                    markdown += '```typescript\n';
                    markdown += section.examples.typescript;
                    markdown += '\n```\n\n';
                }

                if (section.examples.command) {
                    markdown += '```bash\n';
                    markdown += section.examples.command;
                    markdown += '\n```\n\n';
                }
            }
        }

        // Use the last segment of the route as the filename
        const filename = page.route.split('/').pop();
        const outputPath = path.join(pagesDir, `${filename}.md`);
        fs.writeFileSync(outputPath, markdown, 'utf-8');
    }

    console.log(`✓ Generated ${pages.length} page markdown files`);
}

/**
 * AGENTS.md on the site, with absolute links. The copy shipped in @exhaustive-ui/core is rendered by its build
 * (packages/core/scripts/build-llms.mjs) from cards/index.json, with links to the cards packaged next to it.
 */
function generateAgentsMd(cards) {
    const manifest = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'manifest.json'), 'utf-8'));
    checkRenames(manifest);
    const version = JSON.parse(fs.readFileSync(EXHAUSTIVE_PACKAGE_JSON, 'utf-8')).version;
    const docsLink = (route) => `${SITE_URL}/${route}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'AGENTS.md'), renderAgentsMd({ version, cards, cardLink: (name) => docsLink(`llms/cards/${name}.md`), docsLink }), 'utf-8');
    console.log('✓ Generated AGENTS.md');
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Building ExhaustiveUI LLM Documentation...\n');

    console.log('📦 Loading demos.json...');
    demosData = loadDemosJson();
    if (demosData) {
        console.log(`   Loaded ${Object.keys(demosData.demos || {}).length} demos\n`);
    } else {
        console.log('   Warning: demos.json not available, code examples will be missing\n');
    }

    console.log('📁 Parsing component documentation...');
    const components = getAllComponents();
    console.log(`   Found ${components.length} components\n`);

    console.log('📄 Parsing guide pages...');
    const pages = getAllGuidePages();
    console.log(`   Found ${pages.length} guide pages\n`);

    console.log('📖 Loading API documentation...');
    const apiDocs = loadApiDocs();
    console.log(`   Loaded API docs for ${Object.keys(apiDocs).length} modules\n`);

    console.log('✨ Generating outputs...\n');
    generateJsonOutput(components, apiDocs, pages);
    const cards = generateCards({ manifestPath: path.join(OUTPUT_DIR, 'manifest.json'), componentsPath: path.join(OUTPUT_DIR, 'components.json'), outputDir: OUTPUT_DIR });
    console.log(`✓ Generated ${cards.length} component cards`);
    generateAgentsMd(cards);
    generateMarkdownOutput(components, apiDocs, pages);
    generateLlmsTxt(components, pages, new Set(cards.map((card) => card.name)));
    generateIndividualMarkdownFiles(components, apiDocs);
    generatePageMarkdownFiles(pages);
    generateAgentSkill({ outputDir: OUTPUT_DIR, wellKnownDir: path.resolve(__dirname, '../public/.well-known'), components, pages, version: JSON.parse(fs.readFileSync(EXHAUSTIVE_PACKAGE_JSON, 'utf-8')).version });

    console.log('\n✅ LLM documentation generation complete!');
    console.log(`\nOutput directory: ${OUTPUT_DIR}`);
    console.log('   - components.json (full API data)');
    console.log('   - llms-full.txt (full documentation with Props, Templates, Emits, PT, Theming)');
    console.log('   - llms.txt (index file)');
    console.log('   - components/*.md (individual component files with complete API)');
    console.log('   - pages/*.md (guide/documentation page files)');
    console.log('   - cards/*.md (compact component cards: import, selectors, key inputs, templates with their context, one example)');
    console.log('   - exhaustive-ui-skill.zip (Agent Skill bundling the markdown files)');
    console.log('   - ../.well-known/agent-skills/index.json (skills discovery index for `npx skills add`)');
}

main();
