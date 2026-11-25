# ExhaustiveUI 22.9.0: guide for AI coding agents

This project uses ExhaustiveUI (`@exhaustive-ui/core` 22.9.0), an Angular 22 component library forked from PrimeNG v21. Its API is close to PrimeNG but not the same: read this file, then the card of each component you use, before writing code.

## Rules

1. **Read the component card first.** Each card (index below) gives the import, the tag, the inputs, the outputs and every template with the exact context it receives, for the installed version. Do not rely on what you remember of PrimeNG.
2. **Imports come from `@exhaustive-ui/core/<entry>`**, one entry point per component: `import { Select } from '@exhaustive-ui/core/select';`. Never `primeng/...`. Components are standalone: add them to the `imports` of your component.
3. **Write the canonical kebab-case tag**: `<p-date-picker>`, `<p-toggle-switch>`, `<p-auto-complete>`. The camelCase spellings (`<p-datePicker>`) still work but are legacy. Directives are attributes: `pButton`, `pInputText`, `pTooltip`.
4. **Templates are `<ng-template #name let-…>` inside the component**, with the name exactly as the card lists it (case sensitive). `$implicit` is read with a bare `let-x`, the other keys with `let-x="key"`. `pTemplate="name"` still works but is legacy.
5. **Inputs are signals.** In templates nothing changes. In TypeScript, on a component instance, read an input with a call (`table.first()`), and write a two-way property with `.set()`.
6. **Components use OnPush** (except Table, TreeTable and DynamicDialog): give them new arrays and objects, or signals, instead of mutating the bound data.
7. **`styleClass` is gone** on most components: use `class`. Styling goes through `class`, design tokens (`dt`) or pass through (`pt`).
8. **Check your code** with `npx -y @exhaustive-ui/mcp check` (all templates under `src/`) after writing or changing templates, and fix what it reports: unknown inputs and outputs, PrimeNG tags and imports, removed v22 inputs.

## Setup

```typescript
// app.config.ts
import { provideExhaustive } from '@exhaustive-ui/core/config';
import Aura from '@exhaustive-ui/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [provideExhaustive({ theme: { preset: Aura } })]
};
```

Icons: the `pi pi-*` classes, from `@openng/icons/openng-icons.css` (not `primeicons`). Themes come from `@exhaustive-ui/themes` (not `@primeuix/themes`).

## If you know PrimeNG

| PrimeNG | ExhaustiveUI |
| --- | --- |
| `import … from 'primeng/button'` | `import … from '@exhaustive-ui/core/button'` |
| `providePrimeNG()`, `PrimeNG` service, `PrimeIcons` | `provideExhaustive()`, `Exhaustive`, `OpenngIcons` |
| `@primeuix/themes/aura` | `@exhaustive-ui/themes/aura` |
| `styleClass="…"` | `class="…"` |
| `<p-dropdown>` | `<p-select>` |
| `<p-calendar>` | `<p-date-picker>` |
| `<p-inputSwitch>` | `<p-toggle-switch>` |
| `<p-overlayPanel>` | `<p-popover>` |
| `<p-sidebar>` | `<p-drawer>` |
| `<p-chips>` | `<p-auto-complete [multiple]="true" [typeahead]="false">` |
| `<p-tabView> and <p-tabPanel header="…">` | `<p-tabs value="0"> with <p-tab-list><p-tab value="0">…</p-tab></p-tab-list> and <p-tab-panels><p-tab-panel value="0">…</p-tab-panel></p-tab-panels>` |
| `<p-accordionTab header="…">` | `<p-accordion-panel value="0"> with <p-accordion-header>…</p-accordion-header> and <p-accordion-content>…</p-accordion-content>` |
| `<p-messages>` | `<p-message>`, one per message |

## Tools

- **MCP server**: `npx -y @exhaustive-ui/mcp` (for Claude Code: `claude mcp add exhaustive-ui -- npx -y @exhaustive-ui/mcp`). Search, component cards, complete examples and `validate_usage`.
- **Full documentation** of a component, with every example: https://exhaustive-ui.com/llms/components/<name>.md. Guides and index: https://exhaustive-ui.com/llms/llms.txt.

## Components

- [Accordion](https://exhaustive-ui.com/llms/cards/accordion.md): Accordion groups a collection of contents in tabs.
- [Animate On Scroll](https://exhaustive-ui.com/llms/cards/animateonscroll.md): AnimateOnScroll is used to apply animations to elements when entering or leaving the viewport during scrolling.
- [AutoComplete](https://exhaustive-ui.com/llms/cards/autocomplete.md): AutoComplete is an input component that provides real-time suggestions when being typed.
- [AutoFocus](https://exhaustive-ui.com/llms/cards/autofocus.md): AutoFocus manages focus on focusable element on load.
- [Avatar](https://exhaustive-ui.com/llms/cards/avatar.md): Avatar represents people using icons, labels and images.
- [Badge](https://exhaustive-ui.com/llms/cards/badge.md): Badge is a small status indicator for another element.
- [BlockUI](https://exhaustive-ui.com/llms/cards/blockui.md): BlockUI can either block other components or the whole page.
- [Breadcrumb](https://exhaustive-ui.com/llms/cards/breadcrumb.md): Breadcrumb provides contextual information about page hierarchy.
- [Button](https://exhaustive-ui.com/llms/cards/button.md): Button is an extension to standard button element with icons and theming.
- [Card](https://exhaustive-ui.com/llms/cards/card.md): Card is a flexible container component.
- [Carousel](https://exhaustive-ui.com/llms/cards/carousel.md): Carousel is a content slider featuring various customization options.
- [CascadeSelect](https://exhaustive-ui.com/llms/cards/cascadeselect.md): CascadeSelect displays a nested structure of options.
- [Chart](https://exhaustive-ui.com/llms/cards/chart.md): Chart components are based on Charts.js 3.3.2+, an open source HTML5 based charting library.
- [Checkbox](https://exhaustive-ui.com/llms/cards/checkbox.md): Checkbox is an extension to standard checkbox element with theming.
- [Chip](https://exhaustive-ui.com/llms/cards/chip.md): Chip represents entities using icons, labels and images.
- [ClassNames](https://exhaustive-ui.com/llms/cards/classnames.md): ClassNames provides extended class binding functionality that is not possible with the native Angular directives.
- [ColorPicker](https://exhaustive-ui.com/llms/cards/colorpicker.md): ColorPicker is an input component to select a color.
- [ConfirmDialog](https://exhaustive-ui.com/llms/cards/confirmdialog.md): ConfirmDialog is backed by a service utilizing Observables to display confirmation windows easily that can be shared by multiple actions on the same component.
- [ConfirmPopup](https://exhaustive-ui.com/llms/cards/confirmpopup.md): ConfirmPopup displays a confirmation overlay displayed relatively to its target.
- [ContextMenu](https://exhaustive-ui.com/llms/cards/contextmenu.md): ContextMenu displays an overlay menu on right click of its target.
- [DataView](https://exhaustive-ui.com/llms/cards/dataview.md): DataView displays data in grid grid-cols-12 gap-4 or list layout with pagination and sorting features.
- [DatePicker](https://exhaustive-ui.com/llms/cards/datepicker.md): DatePicker is an input component to select a date.
- [Dialog](https://exhaustive-ui.com/llms/cards/dialog.md): Dialog is a container to display content in an overlay window.
- [Divider](https://exhaustive-ui.com/llms/cards/divider.md): Divider is used to separate contents.
- [Dock](https://exhaustive-ui.com/llms/cards/dock.md): Dock is a navigation component consisting of menuitems.
- [Drag and Drop](https://exhaustive-ui.com/llms/cards/dragdrop.md): pDraggable and pDroppable directives apply drag-drop behaviors to any element.
- [Drawer](https://exhaustive-ui.com/llms/cards/drawer.md): Drawer is a container component displayed as an overlay.
- [Dynamic Dialog](https://exhaustive-ui.com/llms/cards/dynamicdialog.md): Dialogs can be created dynamically with any component as the content using a DialogService.
- [Editor](https://exhaustive-ui.com/llms/cards/editor.md): Editor is rich text editor component based on Quill.
- [Fieldset](https://exhaustive-ui.com/llms/cards/fieldset.md): Fieldset is a grouping component with a content toggle feature.
- [FileInput](https://exhaustive-ui.com/llms/cards/fileinput.md): FileInput selects files by drag and drop, paste or the file picker, validates each file and uploads it with its own progress.
- [FileUpload](https://exhaustive-ui.com/llms/cards/fileupload.md): FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations.
- [Float Label](https://exhaustive-ui.com/llms/cards/floatlabel.md): FloatLabel appears on top of the input field when focused.
- [Fluid](https://exhaustive-ui.com/llms/cards/fluid.md): Fluid is a layout component to make descendant components span full width of their container.
- [Focus Trap](https://exhaustive-ui.com/llms/cards/focustrap.md): Focus Trap keeps focus within a certain DOM element while tabbing.
- [Gallery](https://exhaustive-ui.com/llms/cards/galleria.md): Galleria is an advanced content gallery component.
- [IconField](https://exhaustive-ui.com/llms/cards/iconfield.md): IconField wraps an input and an icon.
- [Ifta Label](https://exhaustive-ui.com/llms/cards/iftalabel.md): IftaLabel is used to create infield top aligned labels.
- [Image](https://exhaustive-ui.com/llms/cards/image.md): Displays an image with preview and tranformation options.
- [ImageCompare](https://exhaustive-ui.com/llms/cards/imagecompare.md): Compare two images side by side with a slider.
- [Inplace](https://exhaustive-ui.com/llms/cards/inplace.md): Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.
- [InputChips](https://exhaustive-ui.com/llms/cards/inputchips.md): InputChips enters several free-text values, such as tags, keywords or email addresses, each shown as a removable chip.
- [InputGroup](https://exhaustive-ui.com/llms/cards/inputgroup.md): Text, icon, buttons and other content can be grouped next to an input.
- [InputMask](https://exhaustive-ui.com/llms/cards/inputmask.md): InputMask component is used to enter input in a certain format such as numeric, date, currency and phone.
- [InputNumber](https://exhaustive-ui.com/llms/cards/inputnumber.md): InputNumber is an input component to provide numerical input.
- [Otp Input](https://exhaustive-ui.com/llms/cards/inputotp.md): Input Otp is used to enter one time passwords.
- [InputText](https://exhaustive-ui.com/llms/cards/inputtext.md): InputText is an extension to standard input element with theming and keyfiltering.
- [Kanban](https://exhaustive-ui.com/llms/cards/kanban.md): Kanban is a task board.
- [KeyFilter](https://exhaustive-ui.com/llms/cards/keyfilter.md): KeyFilter is a directive to restrict individual key strokes.
- [Knob](https://exhaustive-ui.com/llms/cards/knob.md): Knob is a form component to define number inputs with a dial.
- [Listbox](https://exhaustive-ui.com/llms/cards/listbox.md): Listbox is used to select one or more values from a list of items.
- [MegaMenu](https://exhaustive-ui.com/llms/cards/megamenu.md): MegaMenu is navigation component that displays submenus together.
- [Mention](https://exhaustive-ui.com/llms/cards/mention.md): Mention suggests users, tags or commands while a trigger such as @ or # is typed in a textarea or an input, and inserts the chosen suggestion in the text.
- [Menu](https://exhaustive-ui.com/llms/cards/menu.md): Menu is a navigation / command component that supports dynamic and static positioning.
- [Menubar](https://exhaustive-ui.com/llms/cards/menubar.md): Menubar is a horizontal menu component.
- [Message](https://exhaustive-ui.com/llms/cards/message.md): Message component is used to display inline messages.
- [MeterGroup](https://exhaustive-ui.com/llms/cards/metergroup.md): MeterGroup displays scalar measurements within a known range.
- [MultiSelect](https://exhaustive-ui.com/llms/cards/multiselect.md): MultiSelect is used to select multiple items from a collection.
- [OrderList](https://exhaustive-ui.com/llms/cards/orderlist.md): OrderList is used to sort a collection.
- [Organization Chart](https://exhaustive-ui.com/llms/cards/organizationchart.md): OrganizationChart visualizes hierarchical organization data.
- [Overlay API](https://exhaustive-ui.com/llms/cards/overlay.md): This API allows overlay components to be controlled from the ExhaustiveUI.
- [Paginator](https://exhaustive-ui.com/llms/cards/paginator.md): Paginator displays data in paged format and provides navigation between pages.
- [Panel](https://exhaustive-ui.com/llms/cards/panel.md): Panel is a container component with an optional content toggle feature.
- [PanelMenu](https://exhaustive-ui.com/llms/cards/panelmenu.md): PanelMenu is a hybrid of Accordion and Tree components.
- [Password](https://exhaustive-ui.com/llms/cards/password.md): Password displays strength indicator for password fields.
- [PickList](https://exhaustive-ui.com/llms/cards/picklist.md): PickList is used to reorder items between different lists.
- [Popover](https://exhaustive-ui.com/llms/cards/popover.md): Popover is a container component that can overlay other components on page.
- [ProgressBar](https://exhaustive-ui.com/llms/cards/progressbar.md): ProgressBar is a process status indicator.
- [ProgressSpinner](https://exhaustive-ui.com/llms/cards/progressspinner.md): ProgressSpinner is a process status indicator.
- [RadioButton](https://exhaustive-ui.com/llms/cards/radiobutton.md): RadioButton is an extension to standard radio button element with theming.
- [Rating](https://exhaustive-ui.com/llms/cards/rating.md): Rating component is a star based selection input.
- [RichTextEditor](https://exhaustive-ui.com/llms/cards/richtexteditor.md): RichTextEditor is a rich text editor built on Tiptap and ProseMirror, with a themed toolbar that follows the WAI-ARIA toolbar pattern, inline link editing, HTML or JSON values and a character limit.
- [Ripple](https://exhaustive-ui.com/llms/cards/ripple.md): Ripple directive adds ripple effect to the host element.
- [Scheduler](https://exhaustive-ui.com/llms/cards/scheduler.md): Scheduler is a free event calendar with month, week, day and agenda views.
- [Virtual Scroller](https://exhaustive-ui.com/llms/cards/scroller.md): VirtualScroller is a performance-approach to handle huge data efficiently.
- [Scroll Panel](https://exhaustive-ui.com/llms/cards/scrollpanel.md): ScrollPanel is a cross browser, lightweight and skinnable alternative to native browser scrollbar.
- [Scroll Top](https://exhaustive-ui.com/llms/cards/scrolltop.md): ScrollTop gets displayed after a certain scroll position and used to navigates to the top of the page quickly.
- [Select](https://exhaustive-ui.com/llms/cards/select.md): Select is used to choose an item from a collection of options.
- [SelectButton](https://exhaustive-ui.com/llms/cards/selectbutton.md): SelectButton is used to choose single or multiple items from a list using buttons.
- [Skeleton](https://exhaustive-ui.com/llms/cards/skeleton.md): Skeleton is a placeholder to display instead of the actual content.
- [Slider](https://exhaustive-ui.com/llms/cards/slider.md): Slider is a component to provide input with a drag handle.
- [Speed Dial](https://exhaustive-ui.com/llms/cards/speeddial.md): SpeedDial is a floating button with a popup menu.
- [SplitButton](https://exhaustive-ui.com/llms/cards/splitbutton.md): SplitButton groups a set of commands in an overlay with a default action item.
- [Splitter](https://exhaustive-ui.com/llms/cards/splitter.md): Splitter is utilized to separate and resize panels.
- [Stepper](https://exhaustive-ui.com/llms/cards/stepper.md): The Stepper component displays a wizard-like workflow by guiding users through the multi-step progression.
- [StyleClass](https://exhaustive-ui.com/llms/cards/styleclass.md): StyleClass manages css classes declaratively to during enter/leave animations or just to toggle classes on an element.
- [Table](https://exhaustive-ui.com/llms/cards/table.md): Table displays data in tabular format.
- [Tabs](https://exhaustive-ui.com/llms/cards/tabs.md): Tabs is a container component to group content with tabs.
- [Tag](https://exhaustive-ui.com/llms/cards/tag.md): Tag component is used to categorize content.
- [Terminal](https://exhaustive-ui.com/llms/cards/terminal.md): 
- [Textarea](https://exhaustive-ui.com/llms/cards/textarea.md): Textarea adds styling and autoResize functionality to standard textarea element.
- [TieredMenu](https://exhaustive-ui.com/llms/cards/tieredmenu.md): TieredMenu displays submenus in nested overlays.
- [Timeline](https://exhaustive-ui.com/llms/cards/timeline.md): Timeline visualizes a series of chained events.
- [Toast](https://exhaustive-ui.com/llms/cards/toast.md): Toast is used to display messages in an overlay.
- [ToggleButton](https://exhaustive-ui.com/llms/cards/togglebutton.md): ToggleButton is used to select a boolean value using a button.
- [ToggleSwitch](https://exhaustive-ui.com/llms/cards/toggleswitch.md): ToggleSwitch is used to select a boolean value.
- [Toolbar](https://exhaustive-ui.com/llms/cards/toolbar.md): Toolbar is a grouping component for buttons and other content.
- [Tooltip](https://exhaustive-ui.com/llms/cards/tooltip.md): Tooltip directive provides advisory information for a component.
- [Tour](https://exhaustive-ui.com/llms/cards/tour.md): Tour guides the user through the interface, one step at a time: a spotlight highlights an element and a card next to it explains it, with a step counter and back and next buttons.
- [Tree](https://exhaustive-ui.com/llms/cards/tree.md): Tree is used to display hierarchical data.
- [TreeSelect](https://exhaustive-ui.com/llms/cards/treeselect.md): TreeSelect is a form component to choose from hierarchical data.
- [TreeTable](https://exhaustive-ui.com/llms/cards/treetable.md): TreeTable is used to display hierarchical data in tabular format.
