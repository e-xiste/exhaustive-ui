# Icons

OpenNG Icons is the default icon library of ExhaustiveUI with over 250 open source icons.

## Download

The icon library is available at npm, run the following command to download it to your project.

```bash
npm install @openng/icons
```

## Import

CSS file of the icon library needs to be imported in `styles.scss` of your application.

## Basic

OpenNG Icons use the `pi pi-{icon}` syntax such as `pi pi-check`. A standalone icon can be displayed using an element such as `i` or `span`

## Size

Size of an icon is controlled with the font-size property of the element.

## Color

Icon color is defined with the `color` property which is inherited from parent by default.

## Spin

Special `pi-spin` class applies infinite rotation to an icon.

## Constants

Constants API is available to reference icons easily when used programmatically.

```typescript
import { Component } from '@angular/core';
import { OpenngIcons, MenuItem } from '@exhaustive-ui/core/api';

@Component({
    selector: 'openng-icons-constants-demo',
    templateUrl: './openng-icons-constants-demo.html'
})
export class OpenngIconsConstantsDemo {
    items: MenuItem[];

    ngOnInit() {
        this.items = [
            {
                label: 'New',
                icon: OpenngIcons.PLUS,
            },
            {
                label: 'Delete',
                icon: OpenngIcons.TRASH
            }
        ];
    }
}
```

## List

Here is the full list of icons. More icons will be added periodically and you may also
[request new icons](https://github.com/openng-org/icons/issues) at the issue tracker.

