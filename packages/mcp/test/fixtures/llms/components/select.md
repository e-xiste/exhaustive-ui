# Angular Select Component

Select is used to choose an item from a collection of options.

## Accessibility

Screen Reader Value to describe the component can either be provided with ariaLabelledBy or ariaLabel props. The select element has a combobox role in addition to aria-haspopup and aria-expanded attributes. If the editable option is enabled aria-autocomplete is also added. The relation between the combobox and the popup is created with aria-controls and aria-activedescendant attribute is used to instruct screen reader which option to read during keyboard navigation within the popup list. The popup list has an id that refers to the aria-controls attribute of the combobox element and uses listbox as the role. Each list item has an option role, an id to match the aria-activedescendant of the input element along with aria-label , aria-selected and aria-disabled attributes. If filtering is enabled, filterInputProps can be defined to give aria-* props to the filter input element.

## Basic

Select is used as a controlled component with ngModel property along with an options collection. Label and value of an option are defined with the optionLabel and optionValue properties respectively. Note that, when options are simple primitive values such as a string array, no optionLabel and optionValue would be necessary.

```typescript
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from '@exhaustive-ui/core/select';

interface City {
    name: string;
    code: string;
}

@Component({
    template: `
        <div class="card flex justify-center">
            <p-select [options]="cities" [(ngModel)]="selectedCity" optionLabel="name" placeholder="Select a City" class="w-full md:w-56" />
        </div>
    `,
    standalone: true,
    imports: [SelectModule, FormsModule]
})
export class SelectBasicDemo implements OnInit {
    cities: City[];
    selectedCity: City | undefined;

    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }
}
```

## Checkmark

An alternative way to highlight the selected option is displaying a checkmark instead.

```typescript
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from '@exhaustive-ui/core/select';

interface City {
    name: string;
    code: string;
}
