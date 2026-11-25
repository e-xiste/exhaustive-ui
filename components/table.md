# Angular Table Component

Table displays data in tabular format.

## Basic

DataTable requires a collection to display along with column components for the representation of the data.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [ProductService]
})
export class TableBasicDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Dynamic Columns

Columns can be defined dynamically using the *ngFor directive.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

interface Column {
    field: string;
    header: string;
}

@Component({
    template: `
        <div class="card">
            <p-table [columns]="cols" [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header let-columns>
                    <tr>
                        @for (col of columns; track col) {
                            <th>
                                {{ col.header }}
                            </th>
                        }
                    </tr>
                </ng-template>
                <ng-template #body let-rowData let-columns="columns">
                    <tr>
                        @for (col of columns; track col) {
                            <td>
                                {{ rowData[col.field] }}
                            </td>
                        }
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule],
    providers: [ProductService]
})
export class TableDynamicDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    cols!: Column[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });

        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];
    }
}
```

## Template

Custom content at header , body and footer sections are supported via templating.

```typescript
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { RatingModule } from '@exhaustive-ui/core/rating';
import { TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

interface Column {
    field: string;
    header: string;
}

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #caption>
                    <div class="flex items-center justify-between">
                        <span class="text-xl font-bold">Products</span>
                        <p-button icon="pi pi-refresh" rounded raised />
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Reviews</th>
                        <th>Status</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.name }}</td>
                        <td>
                            <img [src]="'https://exhaustive-ui.com/demo/product/' + product.image" [alt]="product.name" class="w-24 rounded-sm" />
                        </td>
                        <td>{{ product.price | currency: 'USD' }}</td>
                        <td>{{ product.category }}</td>
                        <td><p-rating [(ngModel)]="product.rating" [readonly]="true" /></td>
                        <td>
                            <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #footer>
                    <tr>
                        <td colspan="6">In total there are {{ products ? products.length : 0 }} products.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, TableModule, RatingModule, TagModule],
    providers: [ProductService]
})
export class TableTemplateDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    cols!: Column[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });

        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }
}
```

## Size

In addition to a regular table, alternatives with alternative sizes are available.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <div class="flex justify-center mb-4">
                <p-select-button [options]="sizes" [(ngModel)]="selectedSize" [multiple]="false" optionLabel="name" optionValue="value" />
            </div>
            <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }" [size]="selectedSize">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, SelectButtonModule],
    providers: [ProductService]
})
export class TableSizeDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    sizes!: any[];

    selectedSize: any = undefined;

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });

        this.sizes = [
            { name: 'Small', value: 'small' },
            { name: 'Normal', value: undefined },
            { name: 'Large', value: 'large' }
        ];
    }
}
```

## Grid Lines

Enabling showGridlines displays borders between cells.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" showGridlines [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [ProductService]
})
export class TableGridlinesDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Striped Rows

Alternating rows are displayed when stripedRows property is present.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" stripedRows [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [ProductService]
})
export class TableStripedDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Conditional Style

Certain rows or cells can easily be styled based on conditions.

## Loading: Mask

The loading property displays a mask layer to indicate busy state. Use the paginator to display the mask.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }" [loading]="true">
                <ng-template #header>
                    <tr>
                        <th style="width:25%">Code</th>
                        <th style="width:25%">Name</th>
                        <th style="width:25%">Category</th>
                        <th style="width:25%">Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [ProductService]
})
export class TableLoadingmaskDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Loading: Skeleton

Skeleton component can be used as a placeholder during the loading process.

```typescript
import { Component, OnInit } from '@angular/core';
import { SkeletonModule } from '@exhaustive-ui/core/skeleton';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td><p-skeleton /></td>
                        <td><p-skeleton /></td>
                        <td><p-skeleton /></td>
                        <td><p-skeleton /></td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule, SkeletonModule]
})
export class TableLoadingskeletonDemo implements OnInit {
    products!: Product[];

    ngOnInit() {
        this.products = Array.from({ length: 10 }).map((_, i) => ({ id: i.toString() }));
    }
}
```

## Pagination: Basic

Pagination is enabled by setting paginator property to true and defining a rows property to specify the number of rows per page.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="customers" [paginator]="true" [rows]="5" [tableStyle]="{ 'min-width': '50rem' }" [rowsPerPageOptions]="[5, 10, 20]">
                <ng-template #header>
                    <tr>
                        <th style="width:25%">Name</th>
                        <th style="width:25%">Country</th>
                        <th style="width:25%">Company</th>
                        <th style="width:25%">Representative</th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr>
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.country.name }}</td>
                        <td>{{ customer.company }}</td>
                        <td>{{ customer.representative.name }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [CustomerService]
})
export class TablePaginatorbasicDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
        });
    }
}
```

## Pagination: Programmatic

Paginator can also be controlled via model using a binding to the first property where changes trigger a pagination.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TableModule } from '@exhaustive-ui/core/table';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <div class="mb-4 flex gap-1">
                <p-button type="button" icon="pi pi-chevron-left" (click)="prev()" [disabled]="isFirstPage()" text />
                <p-button type="button" icon="pi pi-refresh" (click)="reset()" text />
                <p-button type="button" icon="pi pi-chevron-right" (click)="next()" [disabled]="isLastPage()" text />
            </div>
            <p-table
                [value]="customers"
                [paginator]="true"
                [rows]="rows"
                [showCurrentPageReport]="true"
                [first]="first"
                [tableStyle]="{ 'min-width': '50rem' }"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                (onPage)="pageChange($event)"
                [rowsPerPageOptions]="[10, 25, 50]"
            >
                <ng-template #header>
                    <tr>
                        <th style="width:25%">Name</th>
                        <th style="width:25%">Country</th>
                        <th style="width:25%">Company</th>
                        <th style="width:25%">Representative</th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr>
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.country.name }}</td>
                        <td>{{ customer.company }}</td>
                        <td>{{ customer.representative.name }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule, ButtonModule],
    providers: [CustomerService]
})
export class TablePaginatorprogrammaticDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    first = 0;

    rows = 10;

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
        });
    }

    next() {
        this.first = this.first + this.rows;
    }

    prev() {
        this.first = this.first - this.rows;
    }

    reset() {
        this.first = 0;
    }

    pageChange(event) {
        this.first = event.first;
        this.rows = event.rows;
    }

    isLastPage(): boolean {
        return this.customers ? this.first + this.rows >= this.customers.length : true;
    }

    isFirstPage(): boolean {
        return this.customers ? this.first === 0 : true;
    }
}
```

## Sort: Single Column

A column can be made sortable by adding the pSortableColumn directive whose value is the field to sort against and a sort indicator via p-sort-icon component. For dynamic columns, setting pSortableColumnDisabled property as true disables sorting for that particular column. Default sorting is executed on a single column, in order to enable multiple field sorting, set sortMode property to "multiple" and use metakey when clicking on another column.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="code" style="width:20%">
                            <div class="flex items-center gap-2">
                                Code
                                <p-sort-icon field="code" />
                            </div>
                        </th>
                        <th pSortableColumn="name" style="width:20%">
                            <div class="flex items-center gap-2">
                                Name
                                <p-sort-icon field="name" />
                            </div>
                        </th>
                        <th pSortableColumn="category" style="width:20%">
                            <div class="flex items-center gap-2">
                                Category
                                <p-sort-icon field="category" />
                            </div>
                        </th>
                        <th pSortableColumn="quantity" style="width:20%">
                            <div class="flex items-center gap-2">
                                Quantity
                                <p-sort-icon field="quantity" />
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [ProductService]
})
export class TableSinglecolumnsortDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Sort: Multiple Columns

Multiple columns can be sorted by defining sortMode as multiple . This mode requires metaKey (e.g. ⌘ ) to be pressed when clicking a header.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [tableStyle]="{ 'min-width': '60rem' }" sortMode="multiple">
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="code" style="width:20%">
                            <div class="flex items-center gap-2">
                                Code
                                <p-sort-icon field="code" />
                            </div>
                        </th>
                        <th pSortableColumn="name" style="width:20%">
                            <div class="flex items-center gap-2">
                                Name
                                <p-sort-icon field="name" />
                            </div>
                        </th>
                        <th pSortableColumn="category" style="width:20%">
                            <div class="flex items-center gap-2">
                                Category
                                <p-sort-icon field="category" />
                            </div>
                        </th>
                        <th pSortableColumn="quantity" style="width:20%">
                            <div class="flex items-center gap-2">
                                Quantity
                                <p-sort-icon field="quantity" />
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [ProductService]
})
export class TableMultiplecolumnssortDemo implements OnInit {
    private productService = inject(ProductService);

    products: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Presort

Defining a default sortField and sortOrder displays data as sorted initially in single column sorting. In multiple sort mode, multiSortMeta should be used instead by providing an array of DataTableSortMeta objects.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" sortField="price" [sortOrder]="-1" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="code" style="width:20%">
                            <div class="flex items-center gap-2">
                                Code
                                <p-sort-icon field="code" />
                            </div>
                        </th>
                        <th pSortableColumn="name" style="width:20%">
                            <div class="flex items-center gap-2">
                                Name
                                <p-sort-icon field="name" />
                            </div>
                        </th>
                        <th pSortableColumn="price" style="width:20%">
                            <div class="flex items-center gap-2">
                                Price
                                <p-sort-icon field="price" />
                            </div>
                        </th>
                        <th pSortableColumn="category" style="width:20%">
                            <div class="flex items-center gap-2">
                                Category
                                <p-sort-icon field="category" />
                            </div>
                        </th>
                        <th pSortableColumn="quantity" style="width:20%">
                            <div class="flex items-center gap-2">
                                Quantity
                                <p-sort-icon field="quantity" />
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price | currency: 'USD' }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule, CommonModule],
    providers: [ProductService]
})
export class TablePresortDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Sort: Removable

The removable sort can be implemented using the customSort property.

```typescript
import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { SortEvent } from '@exhaustive-ui/core/api';
import { Table, TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table #dt [value]="products" (sortFunction)="customSort($event)" [customSort]="true">
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="code">
                            <div class="flex items-center gap-2">
                                Code
                                <p-sort-icon field="code" />
                            </div>
                        </th>
                        <th pSortableColumn="name">
                            <div class="flex items-center gap-2">
                                Name
                                <p-sort-icon field="name" />
                            </div>
                        </th>
                        <th pSortableColumn="category">
                            <div class="flex items-center gap-2">
                                Category
                                <p-sort-icon field="category" />
                            </div>
                        </th>
                        <th pSortableColumn="quantity">
                            <div class="flex items-center gap-2">
                                Quantity
                                <p-sort-icon field="quantity" />
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [ProductService]
})
export class TableRemovablesortDemo implements OnInit {
    private productService = inject(ProductService);

    @ViewChild('dt') dt: Table;

    products: Product[];

    initialValue: Product[];

    isSorted: boolean = null;

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
            this.initialValue = [...data];
        });
    }

    customSort(event: SortEvent) {
        if (this.isSorted == null || this.isSorted === undefined) {
            this.isSorted = true;
            this.sortTableData(event);
        } else if (this.isSorted == true) {
            this.isSorted = false;
            this.sortTableData(event);
        } else if (this.isSorted == false) {
            this.isSorted = null;
            this.products = [...this.initialValue];
            this.dt.reset();
        }
    }

    sortTableData(event) {
        event.data.sort((data1, data2) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;
            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return event.order * result;
        });
    }
}
```

## Filter: Basic

Data filtering is enabled by defining the filters property, an object of FilterMetadata keyed by field. Each column to filter also requires a p-column-filter element. Built-in filter element is an input field and using the filter template of p-column-filter , it is possible to customize the filtering with your own UI. The optional global filtering searches the data against a single value that is bound to the global key of the filters object. The fields to search against is defined with the globalFilterFields .

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { MultiSelectModule } from '@exhaustive-ui/core/multiselect';
import { SelectModule } from '@exhaustive-ui/core/select';
import { Customer, Representative } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table
                #dt2
                [value]="customers"
                dataKey="id"
                [rows]="10"
                [rowsPerPageOptions]="[10, 25, 50]"
                [loading]="loading"
                [paginator]="true"
                [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                [tableStyle]="{ 'min-width': '75rem' }"
            >
                <ng-template #caption>
                    <div class="flex">
                        <p-icon-field iconPosition="left" class="ml-auto">
                            <p-input-icon>
                                <i class="pi pi-search"></i>
                            </p-input-icon>
                            <input pInputText type="text" (input)="dt2.filterGlobal($event.target.value, 'contains')" placeholder="Search keyword" />
                        </p-icon-field>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th style="width:22%">Name</th>
                        <th style="width:22%">Country</th>
                        <th style="width:22%">Agent</th>
                        <th style="width:22%">Status</th>
                        <th style="width:12%">Verified</th>
                    </tr>
                    <tr>
                        <th>
                            <p-column-filter type="text" field="name" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-column-filter>
                        </th>
                        <th>
                            <p-column-filter type="text" field="country.name" placeholder="Enter key to search" ariaLabel="Filter Country"></p-column-filter>
                        </th>
                        <th>
                            <p-column-filter field="representative" matchMode="in" [showMenu]="false">
                                <ng-template #filter let-value let-filter="filterCallback">
                                    <p-multi-select [ngModel]="value" [options]="representatives" placeholder="Any" (onChange)="filter($event.value)" optionLabel="name" style="min-width: 14rem" [panelStyle]="{ minWidth: '16rem' }">
                                        <ng-template let-option #item>
                                            <div class="flex items-center gap-2">
                                                <img [alt]="option.label" src="https://exhaustive-ui.com/demo/avatar/{{ option.image }}" style="width: 32px" />
                                                <span>{{ option.name }}</span>
                                            </div>
                                        </ng-template>
                                    </p-multi-select>
                                </ng-template>
                            </p-column-filter>
                        </th>
                        <th>
                            <p-column-filter field="status" matchMode="equals" [showMenu]="false">
                                <ng-template #filter let-value let-filter="filterCallback">
                                    <p-select [ngModel]="value" [options]="statuses" (onChange)="filter($event.value)" placeholder="Select One" [showClear]="true" style="min-width: 12rem">
                                        <ng-template let-option #item>
                                            <p-tag [value]="option.value" [severity]="getSeverity(option.value)" />
                                        </ng-template>
                                    </p-select>
                                </ng-template>
                            </p-column-filter>
                        </th>
                        <th>
                            <p-column-filter type="boolean" field="verified"></p-column-filter>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr>
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img src="https://exhaustive-ui.com/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span>{{ customer.country.name }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img [alt]="customer.representative.name" src="https://exhaustive-ui.com/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                                <span>{{ customer.representative.name }}</span>
                            </div>
                        </td>
                        <td>
                            <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                        </td>
                        <td>
                            <i
                                class="pi"
                                [ngClass]="{
                                    'text-green-500 pi-check-circle': customer.verified,
                                    'text-red-500 pi-times-circle': !customer.verified
                                }"
                            ></i>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5">No customers found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, TagModule, IconFieldModule, InputIconModule, InputTextModule, MultiSelectModule, SelectModule],
    providers: [CustomerService]
})
export class TableFilterbasicDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.loading = false;

            this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));

        });

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    clear(table: Table) {
        table.clear();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}
```

## Filter: Advanced

Filters are displayed in an overlay.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { MultiSelectModule } from '@exhaustive-ui/core/multiselect';
import { ProgressBarModule } from '@exhaustive-ui/core/progressbar';
import { SelectModule } from '@exhaustive-ui/core/select';
import { SliderModule } from '@exhaustive-ui/core/slider';
import { Table, TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { Customer, Representative } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table #dt1 [value]="customers()" dataKey="id" [rows]="10" [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading()" [paginator]="true" [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']" showGridlines>
                <ng-template #caption>
                    <div class="flex">
                        <p-button label="Clear" [outlined]="true" icon="pi pi-filter-slash" (click)="clear(dt1)" />
                        <p-icon-field iconPosition="left" class="ml-auto">
                            <p-input-icon>
                                <i class="pi pi-search"></i>
                            </p-input-icon>
                            <input pInputText type="text" (input)="dt1.filterGlobal($event.target.value, 'contains')" placeholder="Search keyword" />
                        </p-icon-field>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th style="min-width:15rem">
                            <div class="flex items-center justify-between">
                                Name
                                <p-column-filter type="text" field="name" display="menu" />
                            </div>
                        </th>
                        <th style="min-width:15rem">
                            <div class="flex items-center justify-between">
                                Country
                                <p-column-filter type="text" field="country.name" display="menu" />
                            </div>
                        </th>
                        <th style="min-width:15rem">
                            <div class="flex items-center justify-between">
                                Agent
                                <p-column-filter field="representative" matchMode="in" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                                    <ng-template #filter let-value let-filter="filterCallback">
                                        <p-multi-select [ngModel]="value" [options]="representatives()" placeholder="Any" (onChange)="filter($event.value)" optionLabel="name" style="min-width: 14rem" [panelStyle]="{ minWidth: '16rem' }">
                                            <ng-template let-option #item>
                                                <div class="flex items-center gap-2">
                                                    <img [alt]="option.label" src="https://exhaustive-ui.com/demo/avatar/{{ option.image }}" style="width: 32px" />
                                                    <span>{{ option.name }}</span>
                                                </div>
                                            </ng-template>
                                        </p-multi-select>
                                    </ng-template>
                                </p-column-filter>
                            </div>
                        </th>
                        <th style="min-width:10rem">
                            <div class="flex items-center justify-between">
                                Date
                                <p-column-filter type="date" field="date" display="menu"></p-column-filter>
                            </div>
                        </th>
                        <th style="min-width:10rem">
                            <div class="flex items-center justify-between">
                                Balance
                                <p-column-filter type="numeric" field="balance" display="menu" currency="USD" />
                            </div>
                        </th>
                        <th style="min-width:10rem">
                            <div class="flex items-center justify-between">
                                Status
                                <p-column-filter field="status" matchMode="equals" display="menu">
                                    <ng-template #filter let-value let-filter="filterCallback">
                                        <p-select [ngModel]="value" [options]="statuses()" (onChange)="filter($event.value)" placeholder="Select One" class="w-full">
                                            <ng-template let-option #item>
                                                <p-tag [value]="option.value" [severity]="getSeverity(option.value)"></p-tag>
                                            </ng-template>
                                        </p-select>
                                    </ng-template>
                                </p-column-filter>
                            </div>
                        </th>
                        <th style="min-width:10rem">
                            <div class="flex items-center justify-between">
                                Activity
                                <p-column-filter field="activity" matchMode="between" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                                    <ng-template #filter let-value let-filter="filterCallback">
                                        <p-slider [ngModel]="value" [range]="true" class="m-4" (onSlideEnd)="filter($event.values)" />
                                        <div class="flex items-center px-2">
                                            <span *ngIf="!value">0</span>
                                            <span *ngIf="value">{{ value[0] }} - {{ value[1] }}</span>
                                        </div>
                                    </ng-template>
                                </p-column-filter>
                            </div>
                        </th>
                        <th style="width: 3rem">
                            <div class="flex items-center justify-between">
                                Verified
                                <p-column-filter type="boolean" field="verified" display="menu" />
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr>
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img src="https://exhaustive-ui.com/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span>{{ customer.country.name }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img [alt]="customer.representative.name" src="https://exhaustive-ui.com/demo/avatar/{{ customer.representative.image }}" width="32" />
                                <span>{{ customer.representative.name }}</span>
                            </div>
                        </td>
                        <td>
                            {{ customer.date | date: 'MM/dd/yyyy' }}
                        </td>
                        <td>
                            {{ customer.balance | currency: 'USD' : 'symbol' }}
                        </td>
                        <td>
                            <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                        </td>
                        <td>
                            <p-progress-bar [value]="customer.activity" [showValue]="false" />
                        </td>
                        <td class="text-center">
                            <i
                                class="pi"
                                [ngClass]="{
                                    'text-green-500 pi-check-circle': customer.verified,
                                    'text-red-500 pi-times-circle': !customer.verified
                                }"
                            ></i>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="7">No customers found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, IconFieldModule, InputIconModule, InputTextModule, MultiSelectModule, SelectModule, SliderModule, ProgressBarModule],
    providers: [CustomerService]
})
export class TableFilterAdvancedDemo implements OnInit {
    customerService = inject(CustomerService);

    customers = signal<Customer[]>([]);

    representatives = signal<Representative[]>([]);

    statuses = signal<any[]>([]);

    loading = signal(true);

    searchValue = signal('');

    activityValues = signal<number[]>([0, 100]);

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            customers.forEach((customer: Customer) => (customer.date = new Date(customer.date as string)));
            this.customers.set(customers);
            this.loading.set(false);
        });

        this.representatives.set([
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        ]);

        this.statuses.set([
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ]);
    }

    clear(table: Table) {
        table.clear();
        this.searchValue.set('');
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}
```

## Row Selection: Single

Single row selection is enabled by defining selectionMode as single along with a value binding using selection property. When available, it is suggested to provide a unique identifier of a row with dataKey to optimize performance. By default, metaKey press (e.g. ⌘ ) is necessary to unselect a row however this can be configured with disabling the metaKeySelection property. In touch enabled devices this option has no effect and behavior is same as setting it to false.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from '@exhaustive-ui/core/table';
import { ToggleSwitchModule } from '@exhaustive-ui/core/toggleswitch';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <div class="flex justify-center items-center mb-6 gap-2">
                <p-toggle-switch [(ngModel)]="metaKey" inputId="input-metakey" />
                <label for="input-metakey">MetaKey</label>
            </div>
            <p-table [value]="products" selectionMode="single" [(selection)]="selectedProduct" [metaKeySelection]="metaKey" dataKey="id" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr [pSelectableRow]="product">
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, TableModule, ToggleSwitchModule],
    providers: [ProductService]
})
export class TableSingleselectionDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    selectedProduct!: Product;

    metaKey: boolean = true;

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Row Selection: Multiple

More than one row is selectable by setting selectionMode to multiple . By default in multiple selection mode, metaKey press (e.g. ⌘ ) is not necessary to add to existing selections. When the optional metaKeySelection is present, behavior is changed in a way that selecting a new row requires meta key to be present. Note that in touch enabled devices, DataTable always ignores metaKey.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from '@exhaustive-ui/core/table';
import { ToggleSwitchModule } from '@exhaustive-ui/core/toggleswitch';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <div class="flex justify-center items-center mb-6 gap-2">
                <p-toggle-switch [(ngModel)]="metaKey" inputId="input-metakey" />
                <label for="input-metakey">MetaKey</label>
            </div>
            <p-table [value]="products" selectionMode="multiple" [(selection)]="selectedProducts" [metaKeySelection]="metaKey" dataKey="code" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product let-rowIndex="rowIndex">
                    <tr [pSelectableRow]="product" [pSelectableRowIndex]="rowIndex">
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToggleSwitchModule],
    providers: [ProductService]
})
export class TableMultipleselectionDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    selectedProducts!: Product;

    metaKey: boolean = true;

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Row Selection: RadioButton

Single selection can also be handled using radio buttons.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [(selection)]="selectedProduct" dataKey="code" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th style="width: 4rem"></th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>
                            <p-table-radio-button [value]="product" />
                        </td>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [ProductService]
})
export class TableRadiobuttonselectionDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    selectedProduct!: Product;

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Row Selection: Checkbox

Multiple selection can also be handled using checkboxes by enabling the selectionMode property of column as multiple .

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [(selection)]="selectedProducts" dataKey="code" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th style="width: 4rem">
                            <p-table-header-checkbox />
                        </th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>
                            <p-table-checkbox [value]="product" />
                        </td>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule],
    providers: [ProductService]
})
export class TableCheckboxselectionDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    selectedProducts!: Product;

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Row Selection: Column

Row selection with an element inside a column is implemented with templating.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TableModule } from '@exhaustive-ui/core/table';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-toast />
            <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th style="width: 5rem"></th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                        <td>
                            <p-button icon="pi pi-search" (click)="selectProduct(product)" severity="secondary" rounded />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToastModule],
    providers: [MessageService, ProductService]
})
export class TableColumnselectionDemo implements OnInit {
    private productService = inject(ProductService);
    private messageService = inject(MessageService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }

    selectProduct(product: Product) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
    }
}
```

## Row Selection: Events

Table provides onRowSelect and onRowUnselect events to listen selection events.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { TableModule } from '@exhaustive-ui/core/table';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-toast />
            <p-table [value]="products" selectionMode="single" [(selection)]="selectedProduct" dataKey="code" (onRowSelect)="onRowSelect($event)" (onRowUnselect)="onRowUnselect($event)" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr [pSelectableRow]="product">
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule, ToastModule],
    providers: [MessageService, ProductService]
})
export class TableSelectioneventsDemo implements OnInit {
    private productService = inject(ProductService);
    private messageService = inject(MessageService);

    products!: Product[];

    selectedProduct!: Product;

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }

    onRowSelect(event: any) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
    }

    onRowUnselect(event: any) {
        this.messageService.add({ severity: 'info', summary: 'Product Unselected', detail: event.data.name });
    }
}
```

## Row Expansion

Row expansion allows displaying detailed content for a particular row. To use this feature, define a dataKey , add a template named expandedrow and use the pRowToggler directive on an element as the target to toggle an expansion. This enables providing your custom UI such as buttons, links and so on. Example below uses an anchor with an icon as a toggler. Setting pRowTogglerDisabled as true disables the toggle event for the element.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { RatingModule } from '@exhaustive-ui/core/rating';
import { RippleModule } from '@exhaustive-ui/core/ripple';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-toast />
            <p-table [value]="products" dataKey="id" [tableStyle]="{ 'min-width': '60rem' }" [expandedRowKeys]="expandedRows" (onRowExpand)="onRowExpand($event)" (onRowCollapse)="onRowCollapse($event)">
                <ng-template #caption>
                    <div class="flex flex-wrap justify-end gap-2">
                        <p-button label="Expand All" icon="pi pi-plus" text (onClick)="expandAll()" />
                        <p-button label="Collapse All" icon="pi pi-minus" text (onClick)="collapseAll()" />
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th style="width: 5rem"></th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Reviews</th>
                        <th>Status</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product let-expanded="expanded">
                    <tr>
                        <td>
                            <p-button type="button" pRipple [pRowToggler]="product" [text]="true" severity="secondary" [rounded]="true" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
                        </td>
                        <td>{{ product.name }}</td>
                        <td>
                            <img [src]="'https://exhaustive-ui.com/demo/product/' + product.image" [alt]="product.name" width="50" class="shadow-lg" />
                        </td>
                        <td>{{ product.price | currency: 'USD' }}</td>
                        <td>{{ product.category }}</td>
                        <td>
                            <p-rating [(ngModel)]="product.rating" [readonly]="true" />
                        </td>
                        <td>
                            <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #expandedrow let-product>
                    <tr>
                        <td colspan="7">
                            <div class="p-4">
                                <h5>Orders for {{ product.name }}</h5>
                                <p-table [value]="product.orders" dataKey="id">
                                    <ng-template #header>
                                        <tr>
                                            <th pSortableColumn="id">
                                                <div class="flex items-center gap-2">
                                                    Id
                                                    <p-sort-icon field="price" />
                                                </div>
                                            </th>
                                            <th pSortableColumn="customer">
                                                <div class="flex items-center gap-2">
                                                    Customer
                                                    <p-sort-icon field="customer" />
                                                </div>
                                            </th>
                                            <th pSortableColumn="date">
                                                <div class="flex items-center gap-2">
                                                    Date
                                                    <p-sort-icon field="date" />
                                                </div>
                                            </th>
                                            <th pSortableColumn="amount">
                                                <div class="flex items-center gap-2">
                                                    Amount
                                                    <p-sort-icon field="amount" />
                                                </div>
                                            </th>
                                            <th pSortableColumn="status">
                                                <div class="flex items-center gap-2">
                                                    Status
                                                    <p-sort-icon field="status" />
                                                </div>
                                            </th>
                                            <th style="width: 4rem"></th>
                                        </tr>
                                    </ng-template>
                                    <ng-template #body let-order>
                                        <tr>
                                            <td>{{ order.id }}</td>
                                            <td>{{ order.customer }}</td>
                                            <td>{{ order.date }}</td>
                                            <td>{{ order.amount | currency: 'USD' }}</td>
                                            <td>
                                                <p-tag [value]="order.status" [severity]="getStatusSeverity(order.status)" />
                                            </td>
                                            <td>
                                                <p-button type="button" icon="pi pi-search" />
                                            </td>
                                        </tr>
                                    </ng-template>
                                    <ng-template #emptymessage>
                                        <tr>
                                            <td colspan="6">There are no order for this product yet.</td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule, ToastModule, ButtonModule, FormsModule, RippleModule, CommonModule, RatingModule, TagModule],
    providers: [MessageService, ProductService]
})
export class TableRowexpansionDemo implements OnInit {
    private productService = inject(ProductService);
    private messageService = inject(MessageService);

    products!: Product[];

    expandedRows = {};

    ngOnInit() {
        this.productService.getProductsWithOrdersSmall().then((data) => {
            this.products = data;
        });
    }

    expandAll() {
        this.expandedRows = this.products.reduce((acc, p) => (acc[p.id] = true) && acc, {});
    }

    collapseAll() {
        this.expandedRows = {};
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }

    getStatusSeverity(status: string) {
        switch (status) {
            case 'PENDING':
                return 'warn';
            case 'DELIVERED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
        }
    }

    onRowExpand(event: TableRowExpandEvent) {
        this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({
            severity: 'success',
            summary: 'Product Collapsed',
            detail: event.data.name,
            life: 3000
        });
    }
}
```

## Edit: Cell

In-cell editing is enabled by adding pEditableColumn directive to an editable cell that has a p-cell-editor helper component to define the input-output templates for the edit and view modes respectively.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" dataKey="id" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th style="width:25%">Code</th>
                        <th style="width:25%">Name</th>
                        <th style="width:25%">Quantity</th>
                        <th style="width:25%">Price</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product let-editing="editing">
                    <tr>
                        <td [pEditableColumn]="product.code" pEditableColumnField="code">
                            <p-cell-editor>
                                <ng-template #input>
                                    <input pInputText type="text" [(ngModel)]="product.code" fluid />
                                </ng-template>
                                <ng-template #output>
                                    {{ product.code }}
                                </ng-template>
                            </p-cell-editor>
                        </td>
                        <td [pEditableColumn]="product.name" pEditableColumnField="name">
                            <p-cell-editor>
                                <ng-template #input>
                                    <input pInputText type="text" [(ngModel)]="product.name" required fluid />
                                </ng-template>
                                <ng-template #output>
                                    {{ product.name }}
                                </ng-template>
                            </p-cell-editor>
                        </td>
                        <td [pEditableColumn]="product.quantity" pEditableColumnField="quantity">
                            <p-cell-editor>
                                <ng-template #input>
                                    <input pInputText [(ngModel)]="product.quantity" fluid />
                                </ng-template>
                                <ng-template #output>
                                    {{ product.quantity }}
                                </ng-template>
                            </p-cell-editor>
                        </td>
                        <td [pEditableColumn]="product.price" pEditableColumnField="price">
                            <p-cell-editor>
                                <ng-template #input>
                                    <input pInputText type="text" [(ngModel)]="product.price" fluid />
                                </ng-template>
                                <ng-template #output>
                                    {{ product.price | currency: 'USD' }}
                                </ng-template>
                            </p-cell-editor>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, InputTextModule],
    providers: [ProductService]
})
export class TableCelleditDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Edit: Row

Row editing toggles the visibility of all the editors in the row at once and provides additional options to save and cancel editing. Row editing functionality is enabled by setting the editMode to "row" on table, defining a dataKey to uniquely identify a row, adding pEditableRow directive to the editable rows and defining the UI Controls with pInitEditableRow , pSaveEditableRow and pCancelEditableRow directives respectively. Save and Cancel functionality implementation is left to the page author to provide more control over the editing business logic. Example below utilizes a simple implementation where a row is cloned when editing is initialized and is saved or restored depending on the result of the editing. An implicit variable called "editing" is passed to the body template so you may come up with your own UI controls that implement editing based on your own requirements such as adding validations and styling. Note that pSaveEditableRow only switches the row to back view mode when there are no validation errors. Moreover, you may use setting pEditableRowDisabled property as true to disable editing for that particular row and in case you need to display rows in edit mode by default, use the editingRowKeys property which is a map whose key is the dataKey of the record where the value is any arbitrary number greater than zero.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { RippleModule } from '@exhaustive-ui/core/ripple';
import { SelectModule } from '@exhaustive-ui/core/select';
import { TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-toast />
            <p-table [value]="products" dataKey="id" editMode="row" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th style="width:22%">Code</th>
                        <th style="width:22%">Name</th>
                        <th style="width:22%">Inventory Status</th>
                        <th style="width:22%">Price</th>
                        <th style="width:12%"></th>
                    </tr>
                </ng-template>
                <ng-template #body let-product let-editing="editing" let-ri="rowIndex">
                    <tr [pEditableRow]="product">
                        <td>
                            <p-cell-editor>
                                <ng-template #input>
                                    <input pInputText type="text" [(ngModel)]="product.code" />
                                </ng-template>
                                <ng-template #output>
                                    {{ product.code }}
                                </ng-template>
                            </p-cell-editor>
                        </td>
                        <td>
                            <p-cell-editor>
                                <ng-template #input>
                                    <input pInputText type="text" [(ngModel)]="product.name" required />
                                </ng-template>
                                <ng-template #output>
                                    {{ product.name }}
                                </ng-template>
                            </p-cell-editor>
                        </td>
                        <td>
                            <p-cell-editor>
                                <ng-template #input>
                                    <p-select [options]="statuses" appendTo="body" [(ngModel)]="product.inventoryStatus" [style]="{ width: '100%' }" />
                                </ng-template>
                                <ng-template #output>
                                    <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                                </ng-template>
                            </p-cell-editor>
                        </td>
                        <td>
                            <p-cell-editor>
                                <ng-template #input>
                                    <input pInputText type="text" [(ngModel)]="product.price" />
                                </ng-template>
                                <ng-template #output>
                                    {{ product.price | currency: 'USD' }}
                                </ng-template>
                            </p-cell-editor>
                        </td>
                        <td>
                            <div class="flex items-center justify-center gap-2">
                                <button *ngIf="!editing" pButton pRipple type="button" pInitEditableRow (click)="onRowEditInit(product)" text rounded severity="secondary">
                                    <i class="pi pi-pencil" pButtonIcon></i>
                                </button>
                                <button *ngIf="editing" pButton pRipple type="button" pSaveEditableRow (click)="onRowEditSave(product)" text rounded severity="secondary">
                                    <i class="pi pi-check" pButtonIcon></i>
                                </button>
                                <button *ngIf="editing" pButton pRipple type="button" pCancelEditableRow (click)="onRowEditCancel(product, ri)" text rounded severity="secondary">
                                    <i class="pi pi-times" pButtonIcon></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToastModule, InputTextModule, SelectModule, TagModule, ButtonModule, RippleModule],
    providers: [MessageService, ProductService]
})
export class TableRoweditDemo implements OnInit {
    private productService = inject(ProductService);
    private messageService = inject(MessageService);

    products!: Product[];

    statuses!: SelectItem[];

    clonedProducts: { [s: string]: Product } = {};

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });

        this.statuses = [
            { label: 'In Stock', value: 'INSTOCK' },
            { label: 'Low Stock', value: 'LOWSTOCK' },
            { label: 'Out of Stock', value: 'OUTOFSTOCK' }
        ];
    }

    onRowEditInit(product: Product) {
        this.clonedProducts[product.id as string] = { ...product };
    }

    onRowEditSave(product: Product) {
        if (product.price > 0) {
            delete this.clonedProducts[product.id as string];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
        }
    }

    onRowEditCancel(product: Product, index: number) {
        this.products[index] = this.clonedProducts[product.id as string];
        delete this.clonedProducts[product.id as string];
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }
}
```

## Scroll: Vertical

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <app-docsectiontext>
            <p>Adding <i>scrollable</i> property along with a <i>scrollHeight</i> for the data viewport enables vertical scrolling with fixed headers.</p></app-docsectiontext
        >
        <div class="card">
            <p-table [value]="customers" [scrollable]="true" scrollHeight="400px" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Company</th>
                        <th>Representative</th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer let-index="index">
                    <tr>
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.country.name }}</td>
                        <td>{{ customer.company }}</td>
                        <td>{{ customer.representative.name }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [CustomerService]
})
export class TableVerticalscrollDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    ngOnInit() {
        this.customerService.getCustomersMedium().then((data) => {
            this.customers = data;
        });
    }
}
```

## Scroll: Flexible

Flex scroll feature makes the scrollable viewport section dynamic instead of a fixed value so that it can grow or shrink relative to the parent size of the table. Click the button below to display a maximizable Dialog where data viewport adjusts itself according to the size changes.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { DialogModule } from '@exhaustive-ui/core/dialog';
import { TableModule } from '@exhaustive-ui/core/table';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <div class="flex justify-center">
                <button type="button" (click)="showDialog()" pButton>
                    <i class="pi pi-external-link" pButtonIcon></i>
                    <span pButtonLabel>Show</span>
                </button>
            </div>
            <p-dialog header="Header" [resizable]="false" [modal]="true" [maximizable]="true" appendTo="body" [(visible)]="dialogVisible" [style]="{ width: '75vw' }" [contentStyle]="{ height: '300px' }">
                <p-table [value]="customers" [scrollable]="true" scrollHeight="flex" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Company</th>
                            <th>Representative</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-customer>
                        <tr>
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.country.name }}</td>
                            <td>{{ customer.company }}</td>
                            <td>{{ customer.representative.name }}</td>
                        </tr>
                    </ng-template>
                </p-table>
                <ng-template #footer>
                    <p-button label="Ok" icon="pi pi-check" (onClick)="dialogVisible = false" />
                </ng-template>
            </p-dialog>
        </div>
    `,
    standalone: true,
    imports: [TableModule, ButtonModule, DialogModule],
    providers: [CustomerService]
})
export class TableFlexiblescrollDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    dialogVisible: boolean = false;

    ngOnInit() {
        this.customerService.getCustomersMedium().then((data) => {
            this.customers = data;
        });
    }

    showDialog() {
        this.dialogVisible = true;
    }
}
```

## Scroll: Horizontal

Horizontal scrollbar is displayed when table width exceeds the parent width.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="customers" [scrollable]="true" scrollHeight="400px">
                <ng-template #header>
                    <tr>
                        <th style="min-width:100px">Id</th>
                        <th style="min-width:200px">Name</th>
                        <th style="min-width:200px">Country</th>
                        <th style="min-width:200px">Date</th>
                        <th style="min-width:200px">Balance</th>
                        <th style="min-width:200px">Company</th>
                        <th style="min-width:200px">Status</th>
                        <th style="min-width:200px">Activity</th>
                        <th style="min-width:200px">Representative</th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr>
                        <td>{{ customer.id }}</td>
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.country.name }}</td>
                        <td>{{ customer.date }}</td>
                        <td>{{ formatCurrency(customer.balance) }}</td>
                        <td>{{ customer.company }}</td>
                        <td>{{ customer.status }}</td>
                        <td>{{ customer.activity }}</td>
                        <td>{{ customer.representative.name }}</td>
                    </tr>
                </ng-template>
                <ng-template #footer>
                    <tr class="font-bold">
                        <td>Id</td>
                        <td>Name</td>
                        <td>Country</td>
                        <td>Date</td>
                        <td>Balance</td>
                        <td>Company</td>
                        <td>Status</td>
                        <td>Activity</td>
                        <td>Representative</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule],
    providers: [CustomerService]
})
export class TableHorizontalscrollDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    ngOnInit() {
        this.customerService.getCustomersMedium().then((data) => {
            this.customers = data;
        });
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
}
```

## Scroll: Frozen Rows

Frozen rows are used to fix certain rows while scrolling, this data is defined with the frozenValue property.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { RippleModule } from '@exhaustive-ui/core/ripple';
import { TableModule } from '@exhaustive-ui/core/table';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="unlockedCustomers" [frozenValue]="lockedCustomers" [scrollable]="true" scrollHeight="400px" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Company</th>
                        <th>Representative</th>
                        <th style="width:5rem"></th>
                    </tr>
                </ng-template>
                <ng-template #frozenbody let-customer let-index="rowIndex">
                    <tr class="font-bold">
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.country.name }}</td>
                        <td>{{ customer.company }}</td>
                        <td>{{ customer.representative.name }}</td>
                        <td>
                            <button pButton pRipple type="button" (click)="toggleLock(customer, true, index)" size="small" text>
                                <i class="pi pi-lock-open" pButtonIcon></i>
                            </button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #body let-customer let-index="rowIndex">
                    <tr>
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.country.name }}</td>
                        <td>{{ customer.company }}</td>
                        <td>{{ customer.representative.name }}</td>
                        <td>
                            <button pButton pRipple type="button" [disabled]="lockedCustomers.length >= 2" (click)="toggleLock(customer, false, index)" size="small" text>
                                <i class="pi pi-lock" pButtonIcon></i>
                            </button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule, ButtonModule, RippleModule],
    providers: [CustomerService]
})
export class TableFrozenrowsDemo implements OnInit {
    private customerService = inject(CustomerService);

    unlockedCustomers!: Customer[];

    lockedCustomers!: Customer[];

    ngOnInit() {
        this.customerService.getCustomersMedium().then((data) => {
            this.unlockedCustomers = data;
        });

        this.lockedCustomers = [
            {
                id: 5135,
                name: 'Geraldine Bisset',
                country: {
                    name: 'France',
                    code: 'fr'
                },
                company: 'Bisset Group',
                status: 'proposal',
                date: '2019-05-05',
                activity: 0,
                representative: {
                    name: 'Amy Elsner',
                    image: 'amyelsner.png'
                }
            }
        ];
    }

    toggleLock(data: Customer, frozen: boolean, index: number) {
        if (frozen) {
            this.lockedCustomers = this.lockedCustomers.filter((c, i) => i !== index);
            this.unlockedCustomers.push(data);
        } else {
            this.unlockedCustomers = this.unlockedCustomers.filter((c, i) => i !== index);
            this.lockedCustomers.push(data);
        }

        this.unlockedCustomers.sort((val1, val2) => {
            return val1.id < val2.id ? -1 : 1;
        });
    }
}
```

## Scroll: Frozen Columns

Certain columns can be frozen by using the pFrozenColumn directive of the table component. In addition, alignFrozen is available to define whether the column should be fixed on the left or right.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from '@exhaustive-ui/core/table';
import { ToggleButtonModule } from '@exhaustive-ui/core/togglebutton';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-toggle-button [(ngModel)]="balanceFrozen" [onIcon]="'pi pi-lock'" offIcon="pi pi-lock-open" [onLabel]="'Balance'" offLabel="Balance" />
            <p-table [value]="customers" [scrollable]="true" scrollHeight="400px" class="mt-4">
                <ng-template #header>
                    <tr>
                        <th style="min-width:200px" pFrozenColumn class="font-bold">Name</th>
                        <th style="min-width:100px">Id</th>
                        <th style="min-width:200px">Country</th>
                        <th style="min-width:200px">Date</th>
                        <th style="min-width:200px">Company</th>
                        <th style="min-width:200px">Status</th>
                        <th style="min-width:200px">Activity</th>
                        <th style="min-width:200px">Representative</th>
                        <th style="min-width:200px" alignFrozen="right" pFrozenColumn [frozen]="balanceFrozen" [ngClass]="{ 'font-bold': balanceFrozen }">Balance</th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr>
                        <td pFrozenColumn class="font-bold">{{ customer.name }}</td>
                        <td style="min-width:100px">{{ customer.id }}</td>
                        <td>{{ customer.country.name }}</td>
                        <td>{{ customer.date }}</td>
                        <td>{{ customer.company }}</td>
                        <td>{{ customer.status }}</td>
                        <td>{{ customer.activity }}</td>
                        <td>{{ customer.representative.name }}</td>
                        <td alignFrozen="right" pFrozenColumn [frozen]="balanceFrozen" [ngClass]="{ 'font-bold': balanceFrozen }">
                            {{ formatCurrency(customer.balance) }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToggleButtonModule],
    providers: [CustomerService]
})
export class TableFrozencolumnsDemo implements OnInit {
    private customerService = inject(CustomerService);

    balanceFrozen: boolean = false;

    customers!: Customer[];

    ngOnInit() {
        this.customerService.getCustomersMedium().then((data) => {
            this.customers = data;
        });
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
}
```

## Virtual Scroll: Preload

Virtual Scrolling is an efficient way to render large amount data. Usage is similar to regular scrolling with the addition of virtualScroll property and virtualScrollItemSize to define a fixed item size. Internally, VirtualScroller component is utilized and further options can be passed with virtualScrollOptions , refer to the API of VirtualScroller for more information about the available options. In this example, 10000 preloaded records are rendered by the Table.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Car } from '@/domain/car';
import { CarService } from '@/service/carservice';

interface Column {
    field: string;
    header: string;
}

@Component({
    template: `
        <div class="card">
            <p-table [columns]="cols" [value]="cars" [scrollable]="true" scrollHeight="400px" [virtualScroll]="true" [virtualScrollItemSize]="46">
                <ng-template #header let-columns>
                    <tr>
                        <th *ngFor="let col of columns" style="width: 20%;">
                            {{ col.header }}
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-rowData let-rowIndex="rowIndex" let-columns="columns">
                    <tr style="height:46px">
                        <td *ngFor="let col of columns">
                            {{ rowData[col.field] }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule],
    providers: [CarService]
})
export class TableVirtualscrollDemo implements OnInit {
    private carService = inject(CarService);

    cars!: Car[];

    virtualCars!: Car[];

    cols!: Column[];

    ngOnInit() {
        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'vin', header: 'Vin' },
            { field: 'year', header: 'Year' },
            { field: 'brand', header: 'Brand' },
            { field: 'color', header: 'Color' }
        ];

        this.cars = Array.from({ length: 10000 }).map((_, i) => this.carService.generateCar(i + 1));
        this.virtualCars = Array.from({ length: 10000 });
    }
}
```

## Virtual Scroll: Lazy

VirtualScroller is a performance-approach to handle huge data efficiently. Setting virtualScroll property as true and providing a virtualScrollItemSize in pixels would be enough to enable this functionality. It is also suggested to use the same virtualScrollItemSize value on the tr element inside the body template.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SkeletonModule } from '@exhaustive-ui/core/skeleton';
import { TableLazyLoadEvent, TableModule } from '@exhaustive-ui/core/table';
import { Car } from '@/domain/car';
import { CarService } from '@/service/carservice';

interface Column {
    field: string;
    header: string;
}

@Component({
    template: `
        <div class="card">
            <p-table [columns]="cols" [value]="virtualCars" [scrollable]="true" scrollHeight="400px" [rows]="100" [virtualScroll]="true" [virtualScrollItemSize]="46" [lazy]="true" (onLazyLoad)="loadCarsLazy($event)">
                <ng-template #header let-columns>
                    <tr>
                        <th *ngFor="let col of columns" style="width: 20%;">
                            {{ col.header }}
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-rowData let-columns="columns">
                    <tr style="height:46px">
                        <td *ngFor="let col of columns">
                            {{ rowData[col.field] }}
                        </td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody let-columns="columns">
                    <tr style="height:46px">
                        <td *ngFor="let col of columns; let even = even">
                            <p-skeleton [ngStyle]="{ width: even ? (col.field === 'year' ? '30%' : '40%') : '60%' }" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule, SkeletonModule],
    providers: [CarService]
})
export class TableVirtualscrolllazyDemo implements OnInit {
    private carService = inject(CarService);

    cars!: Car[];

    virtualCars!: Car[];

    cols!: Column[];

    ngOnInit() {
        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'vin', header: 'Vin' },
            { field: 'year', header: 'Year' },
            { field: 'brand', header: 'Brand' },
            { field: 'color', header: 'Color' }
        ];

        this.cars = Array.from({ length: 10000 }).map((_, i) => this.carService.generateCar(i + 1));
        this.virtualCars = Array.from({ length: 10000 });
    }

    loadCarsLazy(event: TableLazyLoadEvent) {
        //simulate remote connection with a timeout
        setTimeout(
            () => {
                //load data of required page
                let loadedCars = this.cars.slice(event.first, event.first + event.rows);

                //populate page of virtual cars
                Array.prototype.splice.apply(this.virtualCars, [...[event.first, event.rows], ...loadedCars]);

                //trigger change detection
                event.forceUpdate();
            },
            Math.random() * 1000 + 250
        );
    }
}
```

## Column Group

Columns can be grouped using rowspan and colspan properties.

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from '@exhaustive-ui/core/table';

@Component({
    template: `
        <div class="card">
            <p-table [value]="sales" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th rowspan="3">Product</th>
                        <th colspan="4">Sale Rate</th>
                    </tr>
                    <tr>
                        <th colspan="2">Sales</th>
                        <th colspan="2">Profits</th>
                    </tr>
                    <tr>
                        <th>Last Year</th>
                        <th>This Year</th>
                        <th>Last Year</th>
                        <th>This Year</th>
                    </tr>
                </ng-template>
                <ng-template #body let-sale>
                    <tr>
                        <td>{{ sale.product }}</td>
                        <td>{{ sale.lastYearSale }}%</td>
                        <td>{{ sale.thisYearSale }}%</td>
                        <td>{{ sale.lastYearProfit | currency: 'USD' }}</td>
                        <td>{{ sale.thisYearProfit | currency: 'USD' }}</td>
                    </tr>
                </ng-template>
                <ng-template #footer>
                    <tr>
                        <td colspan="3" class="text-right font-bold p-3 pb-0">Totals</td>
                        <td class="font-bold p-3 pb-0">{{ lastYearTotal | currency: 'USD' }}</td>
                        <td class="font-bold p-3 pb-0">{{ thisYearTotal | currency: 'USD' }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule]
})
export class TableColumngroupDemo implements OnInit {
    sales!: any[];

    lastYearTotal!: number;

    thisYearTotal!: number;

    calculateLastYearTotal() {
        let total = 0;
        for (let sale of this.sales) {
            total += sale.lastYearProfit;
        }

        this.lastYearTotal = total;
    }

    calculateThisYearTotal() {
        let total = 0;
        for (let sale of this.sales) {
            total += sale.thisYearProfit;
        }

        this.thisYearTotal = total;
    }

    ngOnInit() {
        this.sales = [
            {
                product: 'Bamboo Watch',
                lastYearSale: 51,
                thisYearSale: 40,
                lastYearProfit: 54406,
                thisYearProfit: 43342
            },
            {
                product: 'Black Watch',
                lastYearSale: 83,
                thisYearSale: 9,
                lastYearProfit: 423132,
                thisYearProfit: 312122
            },
            { product: 'Blue Band', lastYearSale: 38, thisYearSale: 5, lastYearProfit: 12321, thisYearProfit: 8500 },
            {
                product: 'Blue T-Shirt',
                lastYearSale: 49,
                thisYearSale: 22,
                lastYearProfit: 745232,
                thisYearProfit: 65323
            },
            {
                product: 'Brown Purse',
                lastYearSale: 17,
                thisYearSale: 79,
                lastYearProfit: 643242,
                thisYearProfit: 500332
            },
            {
                product: 'Chakra Bracelet',
                lastYearSale: 52,
                thisYearSale: 65,
                lastYearProfit: 421132,
                thisYearProfit: 150005
            },
            {
                product: 'Galaxy Earrings',
                lastYearSale: 82,
                thisYearSale: 12,
                lastYearProfit: 131211,
                thisYearProfit: 100214
            },
            {
                product: 'Game Controller',
                lastYearSale: 44,
                thisYearSale: 45,
                lastYearProfit: 66442,
                thisYearProfit: 53322
            },
            {
                product: 'Gaming Set',
                lastYearSale: 90,
                thisYearSale: 56,
                lastYearProfit: 765442,
                thisYearProfit: 296232
            },
            {
                product: 'Gold Phone Case',
                lastYearSale: 75,
                thisYearSale: 54,
                lastYearProfit: 21212,
                thisYearProfit: 12533
            }
        ];

        this.calculateLastYearTotal();
        this.calculateThisYearTotal();

    }
}
```

## Row Group: Subheader

Rows are grouped with the groupRowsBy property. When rowGroupMode is set as subheader , a header and footer can be displayed for each group. The content of a group header is provided with groupheader and footer with groupfooter templates.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="customers" sortField="representative.name" sortMode="single" [scrollable]="true" scrollHeight="400px" rowGroupMode="subheader" groupRowsBy="representative.name" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </ng-template>
                <ng-template #groupheader let-customer>
                    <tr pRowGroupHeader>
                        <td colspan="5">
                            <div class="flex items-center gap-2">
                                <img [alt]="customer.representative.name" src="https://exhaustive-ui.com/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                                <span class="font-bold">{{ customer.representative.name }}</span>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #groupfooter let-customer>
                    <tr>
                        <td colspan="5">
                            <div class="text-right font-bold pe-12">Total Customers: {{ calculateCustomerTotal(customer.representative.name) }}</div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #body let-customer let-rowIndex="rowIndex">
                    <tr>
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img src="https://exhaustive-ui.com/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span>{{ customer.country.name }}</span>
                            </div>
                        </td>
                        <td>
                            {{ customer.company }}
                        </td>
                        <td>
                            <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                        </td>
                        <td>
                            {{ customer.date }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule, TagModule],
    providers: [CustomerService]
})
export class TableSubheadergroupingDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    ngOnInit() {
        this.customerService.getCustomersMedium().then((data) => {
            this.customers = data;
        });
    }

    calculateCustomerTotal(name: string) {
        let total = 0;

        if (this.customers) {
            for (let customer of this.customers) {
                if (customer.representative?.name === name) {
                    total++;
                }
            }
        }

        return total;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}
```

## Row Group: Expandable

In subheader based row grouping, groups can be expanded and collapsed by placing a pRowToggler in the groupheader template and rendering the rows in the expandedrow template, with dataKey set to the groupRowsBy field. State of the expansions is held in expandedRowKeys , changes are reported with the onRowExpand and onRowCollapse events.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { RippleModule } from '@exhaustive-ui/core/ripple';
import { TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="customers" sortField="representative.name" sortMode="single" dataKey="representative.name" rowGroupMode="subheader" groupRowsBy="representative.name" [tableStyle]="{ 'min-width': '70rem' }">
                <ng-template #header>
                    <tr>
                        <th style="width:20%">Name</th>
                        <th style="width:20%">Country</th>
                        <th style="width:20%">Company</th>
                        <th style="width:20%">Status</th>
                        <th style="width:20%">Date</th>
                    </tr>
                </ng-template>
                <ng-template #groupheader let-customer let-rowIndex="rowIndex" let-expanded="expanded">
                    <tr>
                        <td colspan="5">
                            <button type="button" pButton pRipple [pRowToggler]="customer" text rounded plain class="mr-2">
                                <i [class]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" pButtonIcon></i>
                            </button>
                            <img [alt]="customer.representative.name" src="https://exhaustive-ui.com/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle; display: inline-block" />
                            <span class="font-bold ml-2">{{ customer.representative.name }}</span>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #groupfooter let-customer>
                    <tr class="p-rowgroup-footer">
                        <td colspan="4" style="text-align: right">Total Customers</td>
                        <td>{{ calculateCustomerTotal(customer.representative.name) }}</td>
                    </tr>
                </ng-template>
                <ng-template #expandedrow let-customer>
                    <tr>
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img src="https://exhaustive-ui.com/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span>{{ customer.country.name }}</span>
                            </div>
                        </td>
                        <td>
                            {{ customer.company }}
                        </td>
                        <td>
                            <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                        </td>
                        <td>
                            {{ customer.date }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, TagModule],
    providers: [CustomerService]
})
export class TableExpandablerowgroupDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    ngOnInit() {
        this.customerService.getCustomersMedium().then((data) => {
            this.customers = data;
        });
    }

    calculateCustomerTotal(name: string) {
        let total = 0;

        if (this.customers) {
            for (let customer of this.customers) {
                if (customer.representative?.name === name) {
                    total++;
                }
            }
        }

        return total;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}
```

## Row Group: RowSpan

When rowGroupMode is configured to be rowspan , the grouping column spans multiple rows.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="customers" rowGroupMode="rowspan" groupRowsBy="representative.name" sortField="representative.name" sortMode="single" [tableStyle]="{ 'min-width': '75rem' }">
                <ng-template #header>
                    <tr>
                        <th style="width:3rem">#</th>
                        <th>Representative</th>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Company</th>
                        <th>Status</th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer let-rowIndex="rowIndex" let-rowgroup="rowgroup" let-rowspan="rowspan">
                    <tr>
                        <td>{{ rowIndex }}</td>
                        <td *ngIf="rowgroup" [attr.rowspan]="rowspan">
                            <div class="flex items-center gap-2">
                                <img [alt]="customer.representative.name" src="https://exhaustive-ui.com/demo/avatar/{{ customer.representative.image }}" width="32" />
                                <span>{{ customer.representative.name }}</span>
                            </div>
                        </td>
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img src="https://exhaustive-ui.com/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span>{{ customer.country.name }}</span>
                            </div>
                        </td>
                        <td>
                            {{ customer.company }}
                        </td>
                        <td>
                            <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule, TagModule],
    providers: [CustomerService]
})
export class TableRowspangroupingDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    ngOnInit() {
        this.customerService.getCustomersMedium().then((data) => {
            this.customers = data;
        });
    }

    calculateCustomerTotal(name: string) {
        let total = 0;

        if (this.customers) {
            for (let customer of this.customers) {
                if (customer.representative?.name === name) {
                    total++;
                }
            }
        }

        return total;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}
```

## Column Resize: Fit Mode

Columns can be resized using drag drop by setting the resizableColumns to true . Fit mode is the default one and the overall table width does not change when a column is resized.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" showGridlines [resizableColumns]="true" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th pResizableColumn>Code</th>
                        <th pResizableColumn>Name</th>
                        <th pResizableColumn>Category</th>
                        <th pResizableColumn>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule],
    providers: [ProductService]
})
export class TableColumnresizefitmodeDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Column Resize: Expand Mode

Setting columnResizeMode as expand changes the table width as well.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" showGridlines [resizableColumns]="true" columnResizeMode="expand" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th pResizableColumn>Code</th>
                        <th pResizableColumn>Name</th>
                        <th pResizableColumn>Category</th>
                        <th pResizableColumn>Quantity</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.quantity }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule],
    providers: [ProductService]
})
export class TableColumnresizeexpandmodeDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
```

## Column Resize: Scrollable

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table [value]="customers" showGridlines [scrollable]="true" scrollHeight="400px" [resizableColumns]="true" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th pResizableColumn>Name</th>
                        <th pResizableColumn>Country</th>
                        <th pResizableColumn>Company</th>
                        <th pResizableColumn>Representative</th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr>
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.country.name }}</td>
                        <td>{{ customer.company }}</td>
                        <td>{{ customer.representative.name }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule],
    providers: [CustomerService]
})
export class TableColumnresizescrollablemodeDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
        });
    }
}
```

## Reorder

Order of the columns and rows can be changed using drag and drop. Column reordering is configured by adding reorderableColumns property. Similarly, rows become draggable by adding the pReorderableRow directive with the row index to the row element. For the drag handle an element needs the pReorderableRowHandle directive and onRowReorder is emitted after reorder completes.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

interface Column {
    field: string;
    header: string;
}

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [columns]="cols" [reorderableColumns]="true" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header let-columns>
                    <tr>
                        <th style="width:3rem"></th>
                        <th *ngFor="let col of columns" pReorderableColumn>
                            {{ col.header }}
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-rowData let-columns="columns" let-index="rowIndex">
                    <tr [pReorderableRow]="index">
                        <td>
                            <span class="pi pi-bars" pReorderableRowHandle></span>
                        </td>
                        <td *ngFor="let col of columns">
                            {{ rowData[col.field] }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule],
    providers: [ProductService]
})
export class TableReorderDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    cols!: Column[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });

        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];
    }
}
```

## Column Toggle

This demo uses a multiselect component to implement toggleable columns.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from '@exhaustive-ui/core/multiselect';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

interface Column {
    field: string;
    header: string;
}

@Component({
    template: `
        <div class="card">
            <p-table [columns]="selectedColumns" [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #caption>
                    <p-multi-select display="chip" [options]="cols" [(ngModel)]="selectedColumns" optionLabel="header" selectedItemsLabel="{0} columns selected" [style]="{ 'min-width': '200px' }" placeholder="Choose Columns" />
                </ng-template>
                <ng-template #header let-columns>
                    <tr>
                        <th>Code</th>
                        <th *ngFor="let col of columns">
                            {{ col.header }}
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-product let-columns="columns">
                    <tr>
                        <td>{{ product.code }}</td>
                        <td *ngFor="let col of columns">
                            {{ product[col.field] }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, MultiSelectModule],
    providers: [ProductService]
})
export class TableColumntoggleDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    cols!: Column[];

    selectedColumns!: Column[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];

        this.selectedColumns = this.cols;
    }
}
```

## Export

Table can export its data to CSV format.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    template: `
        <div class="card">
            <p-table #dt [columns]="cols" [value]="products" [exportHeader]="'customExportHeader'" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #caption>
                    <div class="text-end pb-4">
                        <p-button icon="pi pi-external-link" label="Export" (click)="dt.exportCSV()" />
                    </div>
                </ng-template>
                <ng-template #header let-columns>
                    <tr>
                        <th *ngFor="let col of columns">
                            {{ col.header }}
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-rowData let-columns="columns">
                    <tr>
                        <td *ngFor="let col of columns">
                            {{ rowData[col.field] }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule],
    providers: [ProductService]
})
export class TableExportDemo implements OnInit {
    private productService = inject(ProductService);

    products!: Product[];

    cols!: Column[];

    exportColumns!: ExportColumn[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }
}
```

## Context Menu

Table has exclusive integration with contextmenu component. In order to attach a menu to a table, add pContextMenuRow directive to the rows that can be selected with context menu, define a local template variable for the menu and bind it to the contextMenu property of the table. This enables displaying the menu whenever a row is right clicked. Optional pContextMenuRowIndex property is available to access the row index. A separate contextMenuSelection property is used to get a hold of the right clicked row. For dynamic columns, setting pContextMenuRowDisabled property as true disables context menu for that particular row.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from '@exhaustive-ui/core/api';
import { ContextMenuModule } from '@exhaustive-ui/core/contextmenu';
import { TableModule } from '@exhaustive-ui/core/table';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-context-menu #cm [model]="items" (onHide)="selectedProduct = null" />
            <p-table [value]="products" [(contextMenuSelection)]="selectedProduct" [contextMenu]="cm" dataKey="code" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr [pContextMenuRow]="product">
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.price | currency: 'USD' }}</td>
                    </tr>
                </ng-template>
            </p-table>
            <p-toast />
        </div>
    `,
    standalone: true,
    imports: [CommonModule, TableModule, ContextMenuModule, ToastModule],
    providers: [MessageService, ProductService]
})
export class TableContextmenuDemo implements OnInit {
    private productService = inject(ProductService);
    private messageService = inject(MessageService);

    products!: Product[];

    selectedProduct!: Product;

    items!: MenuItem[];

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });

        this.items = [
            { label: 'View', icon: 'pi pi-fw pi-search', command: () => this.viewProduct(this.selectedProduct) },
            { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteProduct(this.selectedProduct) }
        ];
    }

    viewProduct(product: Product) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
    }

    deleteProduct(product: Product) {
        this.products = this.products.filter((p) => p.id !== product.id);
        this.messageService.add({ severity: 'error', summary: 'Product Deleted', detail: product.name });
        this.selectedProduct = null;
    }
}
```

## Stateful

Stateful table allows keeping the state such as page, sort and filtering either at local storage or session storage so that when the page is visited again, table would render the data using the last settings. Change the state of the table e.g paginate, navigate away and then return to this table again to test this feature, the setting is set as session with the stateStorage property so that Table retains the state until the browser is closed. Other alternative is local referring to localStorage for an extended lifetime.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table
                #dt1
                [value]="customers"
                [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                selectionMode="single"
                [(selection)]="selectedCustomers"
                dataKey="id"
                [tableStyle]="{ 'min-width': '50rem' }"
                [rows]="5"
                [paginator]="true"
                stateStorage="session"
                stateKey="statedemo-session"
            >
                <ng-template #caption>
                    <p-icon-field iconPosition="left">
                        <p-input-icon>
                            <i class="pi pi-search"></i>
                        </p-input-icon>
                        <input pInputText type="text" [value]="dt1._filters()['global']?.value" (input)="dt1.filterGlobal($event.target.value, 'contains')" placeholder="Global Search" />
                    </p-icon-field>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="name" style="width:25%">
                            <div class="flex items-center gap-2">
                                Name
                                <p-sort-icon field="name" />
                            </div>
                        </th>
                        <th pSortableColumn="country.name" style="width:25%">
                            <div class="flex items-center gap-2">
                                Country
                                <p-sort-icon field="country.name" />
                            </div>
                        </th>
                        <th pSortableColumn="representative.name" style="width:25%">
                            <div class="flex items-center gap-2">
                                Representative
                                <p-sort-icon field="representative.name" />
                            </div>
                        </th>
                        <th pSortableColumn="status" style="width:25%">
                            <div class="flex items-center gap-2">
                                Status
                                <p-sort-icon field="status" />
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr [pSelectableRow]="customer">
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img src="https://exhaustive-ui.com/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img [alt]="customer.representative.name" src="https://exhaustive-ui.com/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                                <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                            </div>
                        </td>
                        <td>
                            <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr [pSelectableRow]="customer">
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <img src="https://exhaustive-ui.com/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                            <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                        </td>
                        <td>
                            <img [alt]="customer.representative.name" src="https://exhaustive-ui.com/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                            <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                        </td>
                        <td>
                            <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="4">No customers found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [TableModule, InputTextModule, TagModule, IconFieldModule, InputIconModule],
    providers: [CustomerService]
})
export class TableStatefulDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    selectedCustomers!: Customer;

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }

    ngOnInit() {
        this.customerService.getCustomersSmall().then((data) => {
            this.customers = data;
        });
    }
}
```

## Samples: Customers

DataTable with selection, pagination, filtering, sorting and templating.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { MultiSelectModule } from '@exhaustive-ui/core/multiselect';
import { ProgressBarModule } from '@exhaustive-ui/core/progressbar';
import { SelectModule } from '@exhaustive-ui/core/select';
import { SliderModule } from '@exhaustive-ui/core/slider';
import { Table, TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { Customer, Representative } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';

@Component({
    template: `
        <div class="card">
            <p-table
                #dt
                [value]="customers"
                [(selection)]="selectedCustomers"
                dataKey="id"
                [rowHover]="true"
                [rows]="10"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 25, 50]"
                [loading]="loading"
                [paginator]="true"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                [filterDelay]="0"
                [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
            >
                <ng-template #caption>
                    <div class="flex justify-between">
                        <p-button [outlined]="true" icon="pi pi-filter-slash" label="Clear" (click)="clear(dt)" />
                        <p-icon-field iconPosition="left">
                            <p-input-icon>
                                <i class="pi pi-search"></i>
                            </p-input-icon>
                            <input pInputText type="text" [(ngModel)]="searchValue" (input)="dt.filterGlobal($event.target.value, 'contains')" placeholder="Keyboard Search" />
                        </p-icon-field>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th style="width: 4rem">
                            <p-table-header-checkbox />
                        </th>
                        <th pSortableColumn="name" style="min-width: 14rem">
                            <div class="flex justify-between items-center gap-2">
                                Name
                                <p-sort-icon field="name" />
                                <p-column-filter type="text" field="name" display="menu" class="ml-auto" />
                            </div>
                        </th>
                        <th pSortableColumn="country.name" style="min-width: 14rem">
                            <div class="flex justify-between items-center gap-2">
                                Country
                                <p-sort-icon field="country.name" />
                                <p-column-filter type="text" field="country.name" display="menu" class="ml-auto" />
                            </div>
                        </th>
                        <th pSortableColumn="representative.name" style="min-width: 14rem">
                            <div class="flex justify-between items-center gap-2">
                                Agent
                                <p-sort-icon field="representative.name" />
                                <p-column-filter field="representative" matchMode="in" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                                    <ng-template #filter let-value let-filter="filterCallback">
                                        <p-multi-select [filter]="false" [ngModel]="value" [options]="representatives" placeholder="Any" (onChange)="filter($event.value)" optionLabel="name" class="w-full">
                                            <ng-template let-option #item>
                                                <div class="flex items-center gap-2">
                                                    <img [alt]="option.label" src="https://exhaustive-ui.com/demo/avatar/{{ option.image }}" style="width: 32px" />
                                                    <span>{{ option.name }}</span>
                                                </div>
                                            </ng-template>
                                        </p-multi-select>
                                    </ng-template>
                                </p-column-filter>
                            </div>
                        </th>
                        <th pSortableColumn="date" style="min-width: 14rem">
                            <div class="flex justify-between items-center gap-2">
                                Date
                                <p-sort-icon field="date" />
                                <p-column-filter type="date" field="date" display="menu" class="ml-auto" />
                            </div>
                        </th>
                        <th pSortableColumn="balance" style="min-width: 14rem">
                            <div class="flex justify-between items-center gap-2">
                                Balance
                                <p-sort-icon field="balance" />
                                <p-column-filter type="numeric" field="balance" display="menu" currency="USD" class="ml-auto" />
                            </div>
                        </th>
                        <th pSortableColumn="status" style="min-width: 14rem">
                            <div class="flex justify-between items-center gap-2">
                                Status
                                <p-sort-icon field="status" />
                                <p-column-filter field="status" matchMode="equals" display="menu" class="ml-auto">
                                    <ng-template #filter let-value let-filter="filterCallback">
                                        <p-select [ngModel]="value" [options]="statuses" (onChange)="filter($event.value)" placeholder="Any">
                                            <ng-template let-option #item>
                                                <p-tag [value]="option.label" [severity]="getSeverity(option.label)" />
                                            </ng-template>
                                        </p-select>
                                    </ng-template>
                                </p-column-filter>
                            </div>
                        </th>
                        <th pSortableColumn="activity" style="min-width: 14rem">
                            <div class="flex justify-between items-center gap-2">
                                Activity
                                <p-sort-icon field="activity" />
                                <p-column-filter field="activity" matchMode="between" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                                    <ng-template #filter let-filter="filterCallback">
                                        <p-slider [(ngModel)]="activityValues" [range]="true" (onSlideEnd)="filter($event.values)" class="m-4"></p-slider>
                                        <div class="flex items-center justify-between px-2">
                                            <span>{{ activityValues[0] }}</span>
                                            <span>{{ activityValues[1] }}</span>
                                        </div>
                                    </ng-template>
                                </p-column-filter>
                            </div>
                        </th>
                        <th style="width: 5rem"></th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr class="p-selectable-row">
                        <td>
                            <p-table-checkbox [value]="customer" />
                        </td>
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img src="https://exhaustive-ui.com/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img [alt]="customer.representative.name" src="https://exhaustive-ui.com/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                                <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                            </div>
                        </td>
                        <td>
                            {{ customer.date | date: 'MM/dd/yyyy' }}
                        </td>
                        <td>
                            {{ customer.balance | currency: 'USD' : 'symbol' }}
                        </td>
                        <td>
                            <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                        </td>
                        <td>
                            <p-progress-bar [value]="customer.activity" [showValue]="false" />
                        </td>
                        <td style="text-align: center">
                            <p-button rounded icon="pi pi-cog" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="8">No customers found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, MultiSelectModule, SelectModule, TagModule, SliderModule, ProgressBarModule],
    providers: [CustomerService]
})
export class TableCustomersDemo implements OnInit {
    private customerService = inject(CustomerService);

    customers!: Customer[];

    selectedCustomers!: Customer[];

    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.loading = false;

            this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
        });

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    clear(dt: Table) {
        this.searchValue = '';
        dt.reset();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}
```

## Samples: Products

CRUD implementation example with a Dialog.

```typescript
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ConfirmDialogModule } from '@exhaustive-ui/core/confirmdialog';
import { DialogModule } from '@exhaustive-ui/core/dialog';
import { FileUploadModule } from '@exhaustive-ui/core/fileupload';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputNumberModule } from '@exhaustive-ui/core/inputnumber';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';
import { RatingModule } from '@exhaustive-ui/core/rating';
import { SelectModule } from '@exhaustive-ui/core/select';
import { Table, TableModule } from '@exhaustive-ui/core/table';
import { TagModule } from '@exhaustive-ui/core/tag';
import { TextareaModule } from '@exhaustive-ui/core/textarea';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { ToolbarModule } from '@exhaustive-ui/core/toolbar';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    template: `
        <div class="card">
            <p-toast />
            <p-toolbar class="mb-6">
                <ng-template #start>
                    <p-button label="New" icon="pi pi-plus" class="mr-2" (onClick)="openNew()" />
                    <p-button severity="danger" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProducts || !selectedProducts.length" />
                </ng-template>
                <ng-template #end>
                    <p-file-upload mode="basic" accept="image/*" [maxFileSize]="1000000" chooseLabel="Import" auto customUpload class="mr-2 inline-block" [chooseButtonProps]="{ severity: 'secondary' }" />
                    <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV($event)" />
                </ng-template>
            </p-toolbar>
            <p-table
                #dt
                [value]="products"
                [rows]="10"
                [columns]="cols"
                [paginator]="true"
                [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                [tableStyle]="{ 'min-width': '75rem' }"
                [(selection)]="selectedProducts"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                [showCurrentPageReport]="true"
            >
                <ng-template #caption>
                    <div class="flex items-center justify-between">
                        <h5 class="m-0">Manage Products</h5>
                        <p-icon-field>
                            <p-input-icon class="pi pi-search" />
                            <input pInputText type="text" (input)="dt.filterGlobal($event.target.value, 'contains')" placeholder="Search..." />
                        </p-icon-field>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th style="width: 3rem">
                            <p-table-header-checkbox />
                        </th>
                        <th style="min-width: 16rem">Code</th>
                        <th pSortableColumn="name" style="min-width:16rem">
                            <div class="flex items-center gap-2">
                                Name
                                <p-sort-icon field="name" />
                            </div>
                        </th>
                        <th>Image</th>
                        <th pSortableColumn="price" style="min-width: 8rem">
                            <div class="flex items-center gap-2">
                                Price
                                <p-sort-icon field="price" />
                            </div>
                        </th>
                        <th pSortableColumn="category" style="min-width:10rem">
                            <div class="flex items-center gap-2">
                                Category
                                <p-sort-icon field="category" />
                            </div>
                        </th>
                        <th pSortableColumn="rating" style="min-width: 12rem">
                            <div class="flex items-center gap-2">
                                Reviews
                                <p-sort-icon field="rating" />
                            </div>
                        </th>
                        <th pSortableColumn="inventoryStatus" style="min-width: 12rem">
                            <div class="flex items-center gap-2">
                                Status
                                <p-sort-icon field="inventoryStatus" />
                            </div>
                        </th>
                        <th style="min-width: 12rem"></th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td style="width: 3rem">
                            <p-table-checkbox [value]="product" />
                        </td>
                        <td style="min-width: 12rem">{{ product.code }}</td>
                        <td style="min-width: 16rem">{{ product.name }}</td>
                        <td>
                            <img [src]="'https://exhaustive-ui.com/demo/product/' + product.image" [alt]="product.name" style="width: 64px" class="rounded-sm" />
                        </td>
                        <td>{{ product.price | currency: 'USD' }}</td>
                        <td>{{ product.category }}</td>
                        <td>
                            <p-rating [(ngModel)]="product.rating" [readonly]="true" />
                        </td>
                        <td>
                            <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                        </td>
                        <td>
                            <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct(product)" />
                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteProduct(product)" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
            <p-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Product Details" [modal]="true">
                <ng-template #content>
                    <div class="flex flex-col gap-6">
                        <img [src]="'https://exhaustive-ui.com/demo/product/' + product.image" [alt]="product.image" class="block m-auto pb-4" *ngIf="product.image" />
                        <div>
                            <label for="name" class="block font-bold mb-3">Name</label>
                            <input type="text" pInputText id="name" [(ngModel)]="product.name" required autofocus fluid />
                            <small class="text-red-500" *ngIf="submitted && !product.name">Name is required.</small>
                        </div>
                        <div>
                            <label for="description" class="block font-bold mb-3">Description</label>
                            <textarea id="description" pTextarea [(ngModel)]="product.description" required rows="3" cols="20" fluid></textarea>
                        </div>
                        <div>
                            <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
                            <p-select [(ngModel)]="product.inventoryStatus" inputId="inventoryStatus" [options]="statuses" optionLabel="label" optionValue="label" placeholder="Select a Status" fluid />
                        </div>
                        <div>
                            <span class="block font-bold mb-4">Category</span>
                            <div class="grid grid-cols-12 gap-4">
                                <div class="flex items-center gap-2 col-span-6">
                                    <p-radio-button id="category1" name="category" value="Accessories" [(ngModel)]="product.category" />
                                    <label for="category1">Accessories</label>
                                </div>
                                <div class="flex items-center gap-2 col-span-6">
                                    <p-radio-button id="category2" name="category" value="Clothing" [(ngModel)]="product.category" />
                                    <label for="category2">Clothing</label>
                                </div>
                                <div class="flex items-center gap-2 col-span-6">
                                    <p-radio-button id="category3" name="category" value="Electronics" [(ngModel)]="product.category" />
                                    <label for="category3">Electronics</label>
                                </div>
                                <div class="flex items-center gap-2 col-span-6">
                                    <p-radio-button id="category4" name="category" value="Fitness" [(ngModel)]="product.category" />
                                    <label for="category4">Fitness</label>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-6">
                                <label for="price" class="block font-bold mb-3">Price</label>
                                <p-input-number id="price" [(ngModel)]="product.price" mode="currency" currency="USD" locale="en-US" fluid />
                            </div>
                            <div class="col-span-6">
                                <label for="quantity" class="block font-bold mb-3">Quantity</label>
                                <p-input-number id="quantity" [(ngModel)]="product.quantity" fluid />
                            </div>
                        </div>
                    </div>
                </ng-template>
                <ng-template #footer>
                    <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                    <p-button label="Save" icon="pi pi-check" (click)="saveProduct()" />
                </ng-template>
            </p-dialog>
            <p-confirm-dialog [style]="{ width: '450px' }" />
        </div>
    `,
    standalone: true,
    imports: [CommonModule, IconFieldModule, InputIconModule, FormsModule, TableModule, ToastModule, ToolbarModule, ButtonModule, FileUploadModule, RatingModule, DialogModule, InputTextModule, InputNumberModule, SelectModule, RadioButtonModule, TagModule, ConfirmDialogModule, TextareaModule],
    providers: [MessageService, ConfirmationService, ProductService]
})
export class TableProductsDemo implements OnInit {
    private productService = inject(ProductService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    productDialog: boolean = false;

    products!: Product[];

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    exportColumns!: ExportColumn[];

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.productService.getProducts().then((data) => {
            this.products = data;
        });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'No',
                severity: 'secondary',
                variant: 'text'
            },
            acceptButtonProps: {
                severity: 'danger',
                label: 'Yes'
            },
            accept: () => {
                this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'No',
                severity: 'secondary',
                variant: 'text'
            },
            acceptButtonProps: {
                severity: 'danger',
                label: 'Yes'
            },
            accept: () => {
                this.products = this.products.filter((val) => val.id !== product.id);
                this.product = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }
}
```

## Accessibility

Screen Reader Default role of the table is table . Header, body and footer elements use rowgroup , rows use row role, header cells have columnheader and body cells use cell roles. Sortable headers utilizer aria-sort attribute either set to "ascending" or "descending". Table rows and table cells should be specified by users using the aria-posinset , aria-setsize , aria-label , and aria-describedby attributes, as they are determined through templating. Built-in checkbox and radiobutton components for row selection use checkbox and radiobutton . The label to describe them is retrieved from the aria.selectRow and aria.unselectRow properties of the locale API. Similarly header checkbox uses selectAll and unselectAll keys. When a row is selected, aria-selected is set to true on a row. The element to expand or collapse a row is a button with aria-expanded and aria-controls properties. Value to describe the buttons is derived from aria.expandRow and aria.collapseRow properties of the locale API. The filter menu button use aria.showFilterMenu and aria.hideFilterMenu properties as aria-label in addition to the aria-haspopup , aria-expanded and aria-controls to define the relation between the button and the overlay. Popop menu has dialog role with aria-modal as focus is kept within the overlay. The operator dropdown use aria.filterOperator and filter constraints dropdown use aria.filterConstraint properties. Buttons to add rules on the other hand utilize aria.addRule and aria.removeRule properties. The footer buttons similarly use aria.clear and aria.apply properties. ariaLabel of the ColumnFilter component can be used to define the aria label of the built-in filter element, if a custom component is used with templating you also may define your own aria labels as well. Editable cells use custom templating so you need to manage aria roles and attributes manually if required. The row editor controls are button elements with aria.editRow , aria.cancelEdit and aria.saveEdit used for the aria-label . When a caption is defined, the table element refers to it with aria-labelledby so that screen readers announce it as the name of the table. Paginator is a standalone component used inside the Table, refer to the paginator for more information about the accessibility features. Keyboard Support Any button element inside the Table used for cases like filter, row expansion, edit are tabbable and can be used with space and enter keys. Sortable Headers Keyboard Support Key Function tab Moves through the headers. enter Sorts the column. space Sorts the column. Filter Menu Keyboard Support Key Function tab Moves through the elements inside the popup. escape Hides the popup. enter Opens the popup. Selection Keyboard Support Key Function tab Moves focus to the first selected row, if there is none then first row receives the focus. up arrow Moves focus to the previous row. down arrow Moves focus to the next row. enter Toggles the selected state of the focused row depending on the metaKeySelection setting. space Toggles the selected state of the focused row depending on the metaKeySelection setting. home Moves focus to the first row. end Moves focus to the last row. shift + down arrow Moves focus to the next row and toggles the selection state. shift + up arrow Moves focus to the previous row and toggles the selection state. shift + space Selects the rows between the most recently selected row and the focused row. control + shift + home Selects the focused rows and all the options up to the first one. control + shift + end Selects the focused rows and all the options down to the last one. control + a Selects all rows. Reorder Keyboard Support Key Function control + left arrow Moves the focused reorderable column one place towards the start (towards the end in right-to-left layouts). control + right arrow Moves the focused reorderable column one place towards the end (towards the start in right-to-left layouts). control + up arrow Moves the row of the focused reorder handle one place up. control + down arrow Moves the row of the focused reorder handle one place down. On macOS, command can be used instead of control . Rows can also be reordered with a touch or a pen on the reorder handle. After a move with the keyboard, a polite live region announces the new position, using the aria.columnMoved and aria.rowMoved properties of the locale API, where {{ '{' }}position{{ '}' }} and {{ '{' }}total{{ '}' }} are replaced by the numbers.

## Table

Table displays data in tabular format.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | TablePassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| frozenValue | any[] | - | An array of objects to display as frozen. |
| tableStyle | { [klass: string]: any } | - | Inline style of the table. |
| tableStyleClass | string | - | Style class of the table. |
| paginator | boolean | - | When specified as true, enables the pagination. |
| pageLinks | number | 5 | Number of page links to display in paginator. |
| rowsPerPageOptions | any[] | - | Array of integer/object values to display inside rows per page dropdown of paginator |
| alwaysShowPaginator | boolean | true | Whether to show it even there is only one page. |
| paginatorPosition | "top" \| "bottom" \| "both" | 'bottom' | Position of the paginator, options are "top", "bottom" or "both". |
| paginatorStyleClass | string | - | Custom style class for paginator |
| paginatorDropdownAppendTo | any | - | Target element to attach the paginator dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| paginatorDropdownScrollHeight | string | '200px' | Paginator dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value. |
| currentPageReportTemplate | string | '{currentPage} of {totalPages}' | Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} |
| showCurrentPageReport | boolean | - | Whether to display current page report. |
| showJumpToPageDropdown | boolean | - | Whether to display a dropdown to navigate to any page. |
| showJumpToPageInput | boolean | - | Whether to display a input to navigate to any page. |
| showFirstLastIcon | boolean | true | When enabled, icons are displayed on paginator to go first and last page. |
| showPageLinks | boolean | true | Whether to show page links. |
| defaultSortOrder | number | 1 | Sort order to use when an unsorted column gets sorted by user interaction. |
| sortMode | "multiple" \| "single" | 'single' | Defines whether sorting works on single column or on multiple columns. |
| resetPageOnSort | boolean | true | When true, resets paginator to first page after sorting. Available only when sortMode is set to single. |
| selectionMode | "multiple" \| "single" | - | Specifies the selection mode, valid values are "single" and "multiple". |
| selectionPageOnly | boolean | - | When enabled with paginator and checkbox selection mode, the select all checkbox in the header will select all rows on the current page. |
| contextMenuSelection | any | - | Selected row with a context menu, supports one or two-way binding. Emits  `contextMenuSelectionChange`  with the row data on context menu selection change. |
| contextMenuSelectionMode | string | 'separate' | Defines the behavior of context menu selection, in "separate" mode context menu updates contextMenuSelection property whereas in joint mode selection property is used instead so that when row selection is enabled, both row selection and context menu selection use the same property. |
| dataKey | string | - | A property to uniquely identify a record in data. |
| metaKeySelection | boolean | false | Defines whether metaKey should be considered for the selection. On touch enabled devices, metaKeySelection is turned off automatically. |
| rowSelectable | (row: { data: any; index: number }) => boolean | - | Defines if the row is selectable. |
| rowTrackBy | Function | (index: number, item: any) => item | Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. |
| lazy | boolean | false | Defines if data is loaded and interacted with in lazy manner. |
| lazyLoadOnInit | boolean | true | Whether to call lazy loading on initialization. |
| compareSelectionBy | "equals" \| "deepEquals" | 'deepEquals' | Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields. |
| csvSeparator | string | ',' | Character to use as the csv separator. |
| exportFilename | string | 'download' | Name of the exported file. |
| filters | { [s: string]: FilterMetadata \| FilterMetadata[] } | {} | An array of FilterMetadata objects to provide external filters. |
| globalFilterFields | string[] | - | An array of fields as string to use in global filtering. |
| filterDelay | number | 300 | Delay in milliseconds before filtering the data. |
| filterLocale | string | - | Locale to use in filtering. The default locale is the host environment's current locale. |
| expandedRowKeys | { [s: string]: boolean } | {} | Map instance to keep the expanded rows where key of the map is the data key of the row. |
| editingRowKeys | { [s: string]: boolean } | {} | Map instance to keep the rows being edited where key of the map is the data key of the row. |
| rowExpandMode | "multiple" \| "single" | 'multiple' | Whether multiple rows can be expanded at any time. Valid values are "multiple" and "single". |
| scrollable | boolean | - | Enables scrollable tables. |
| rowGroupMode | "subheader" \| "rowspan" | - | Type of the row grouping, valid values are "subheader" and "rowspan". |
| scrollHeight | string | - | Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size. |
| virtualScroll | boolean | - | Whether the data should be loaded on demand during scroll. |
| virtualScrollItemSize | number | - | Height of a row to use in calculations of virtual scrolling. |
| virtualScrollOptions | ScrollerOptions | - | Whether to use the scroller feature. The properties of scroller component can be used like an object in it. |
| virtualScrollDelay | number | 250 | Threshold in milliseconds to delay lazy loading during scrolling. |
| contextMenu | any | - | Local ng-template varilable of a ContextMenu. |
| resizableColumns | boolean | - | When enabled, columns can be resized using drag and drop. |
| columnResizeMode | string | 'fit' | Defines whether the overall table width should change on column resize, valid values are "fit" and "expand". |
| reorderableColumns | boolean | - | When enabled, columns can be reordered using drag and drop. |
| loading | boolean | - | Displays a loader to indicate data load is in progress. |
| loadingIcon | string | - | The icon to show while indicating data load is in progress. |
| showLoader | boolean | true | Whether to show the loading mask when loading property is true. |
| rowHover | boolean | - | Adds hover effect to rows without the need for selectionMode. Note that tr elements that can be hovered need to have "p-selectable-row" class for rowHover to work. |
| customSort | boolean | - | Whether to use the default sorting or a custom one using sortFunction. |
| showInitialSortBadge | boolean | true | Whether to use the initial sort badge or not. |
| exportFunction | Function | - | Export function. |
| exportHeader | string | - | Custom export header of the column to be exported as CSV. |
| stateKey | string | - | Unique identifier of a stateful table to use in state storage. |
| stateStorage | "session" \| "local" | 'session' | Defines where a stateful table keeps its state, valid values are "session" for sessionStorage and "local" for localStorage. |
| editMode | "row" \| "cell" | 'cell' | Defines the editing mode, valid values are "cell" and "row". |
| groupRowsBy | any | - | Field name to use in row grouping. |
| size | "small" \| "large" | - | Defines the size of the table. |
| showGridlines | boolean | - | Whether to show grid lines between cells. |
| stripedRows | boolean | - | Whether to display rows with alternating colors. |
| groupRowsByOrder | number | 1 | Order to sort when default row grouping is enabled. |
| responsiveLayout | string | 'scroll' | Defines the responsive mode, valid options are "stack" and "scroll". **(Deprecated)** |
| breakpoint | string | '960px' | The breakpoint to define the maximum width boundary when using stack responsive layout. |
| paginatorLocale | string | - | Locale to be used in paginator formatting. |
| value | RowData[] | [] | An array of objects to display. |
| columns | any[] | - | An array of objects to represent dynamic columns. |
| first | number | 0 | Index of the first row to be displayed, supports one or two-way binding. Emits  `firstChange`  with the first element on pagination. |
| rows | number | - | Number of rows to display per page, supports one or two-way binding. Emits  `rowsChange`  with the row count on rows change. |
| totalRecords | number | 0 | Number of total records, defaults to length of value when not defined. |
| sortField | string | - | Name of the field to sort data by default. |
| sortOrder | number | 1 | Order to sort when default sorting is enabled. |
| multiSortMeta | SortMeta[] | - | An array of SortMeta objects to sort the data by default in multiple sort mode. |
| selection | any | - | Selected row in single mode or an array of values in multiple mode, supports one or two-way binding. Emits  `selectionChange`  with the selected data on selection change. |
| selectAll | boolean | - | Whether all data is selected. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onSelectAllChange | event: TableSelectAllChangeEvent | Emits when the all of the items selected or unselected. |
| onRowSelect | event: TableRowSelectEvent<RowData | Callback to invoke when a row is selected. |
| onRowUnselect | event: TableRowUnSelectEvent<RowData | Callback to invoke when a row is unselected. |
| onPage | event: TablePageEvent | Callback to invoke when pagination occurs. |
| onSort | value: any | Callback to invoke when a column gets sorted. |
| onFilter | event: TableFilterEvent | Callback to invoke when data is filtered. |
| onLazyLoad | event: TableLazyLoadEvent | Callback to invoke when paging, sorting or filtering happens in lazy mode. |
| onRowExpand | event: TableRowExpandEvent<RowData | Callback to invoke when a row is expanded. |
| onRowCollapse | event: TableRowCollapseEvent | Callback to invoke when a row is collapsed. |
| onContextMenuSelect | event: TableContextMenuSelectEvent<RowData | Callback to invoke when a row is selected with right click. |
| onColResize | event: TableColResizeEvent | Callback to invoke when a column is resized. |
| onColReorder | event: TableColumnReorderEvent | Callback to invoke when a column is reordered. |
| onRowReorder | event: TableRowReorderEvent | Callback to invoke when a row is reordered. |
| onEditInit | event: TableEditInitEvent | Callback to invoke when a cell switches to edit mode. |
| onEditComplete | event: TableEditCompleteEvent | Callback to invoke when cell edit is completed. |
| onEditCancel | event: TableEditCancelEvent | Callback to invoke when cell edit is cancelled with escape key. |
| onHeaderCheckboxToggle | event: TableHeaderCheckboxToggleEvent | Callback to invoke when state of header checkbox changes. |
| sortFunction | value: any | A function to implement custom sorting, refer to sorting section for details. |
| onStateSave | value: TableState | Callback to invoke table state is saved. |
| onStateRestore | value: TableState | Callback to invoke table state is restored. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| header | TemplateRef<TableColumnsTemplateContext> | Custom header rows, rendered in the thead. |
| headergrouped | TemplateRef<TableColumnsTemplateContext> | Custom grouped header rows, used in place of the header template. |
| body | TemplateRef<TableBodyTemplateContext<any>> | Custom row, rendered for each row of data. |
| loadingbody | TemplateRef<TableLoadingBodyTemplateContext> | Custom content while the table is loading, and for each row not loaded yet with lazy virtual scrolling. |
| caption | TemplateRef<void> | Custom caption, rendered above the table. |
| footer | TemplateRef<TableColumnsTemplateContext> | Custom footer rows, rendered in the tfoot. |
| footergrouped | TemplateRef<TableColumnsTemplateContext> | Custom grouped footer rows, used in place of the footer template. |
| summary | TemplateRef<void> | Custom summary, rendered below the table. |
| colgroup | TemplateRef<TableColumnsTemplateContext> | Custom colgroup element. |
| expandedrow | TemplateRef<TableExpandedRowTemplateContext<any>> | Custom content of an expanded row. |
| groupheader | TemplateRef<TableRowGroupTemplateContext<any>> | Custom row group header, with rowGroupMode set to subheader. |
| groupfooter | TemplateRef<TableRowGroupTemplateContext<any>> | Custom row group footer, with rowGroupMode set to subheader. |
| frozenexpandedrow | TemplateRef<TableExpandedRowTemplateContext<any>> | Custom content of an expanded frozen row. |
| frozenbody | TemplateRef<TableBodyTemplateContext<any>> | Custom row of the frozen rows. |
| emptymessage | TemplateRef<TableEmptyMessageTemplateContext> | Custom content when there is no data. |
| paginatorleft | TemplateRef<PaginatorTemplateContext> | Custom content on the left of the paginator. |
| paginatorright | TemplateRef<PaginatorTemplateContext> | Custom content on the right of the paginator. |
| paginatordropdownitem | TemplateRef<PaginatorDropdownItemTemplateContext> | Custom item of the rows per page dropdown of the paginator. |
| loadingicon | TemplateRef<void> | Custom loading icon. |
| reorderindicatorupicon | TemplateRef<void> | Custom icon of the upper column reorder indicator. |
| reorderindicatordownicon | TemplateRef<void> | Custom icon of the lower column reorder indicator. |
| sorticon | TemplateRef<TableSortIconTemplateContext> | Custom sort icon of a sortable column. |
| checkboxicon | TemplateRef<TableCheckboxIconTemplateContext> | Custom icon of the row checkboxes. |
| headercheckboxicon | TemplateRef<TableCheckboxIconTemplateContext> | Custom icon of the header checkbox. |
| paginatordropdownicon | TemplateRef<void> | Custom dropdown icon of the paginator. |
| paginatorfirstpagelinkicon | TemplateRef<void> | Custom icon of the first page button of the paginator. |
| paginatorlastpagelinkicon | TemplateRef<void> | Custom icon of the last page button of the paginator. |
| paginatorpreviouspagelinkicon | TemplateRef<void> | Custom icon of the previous page button of the paginator. |
| paginatornextpagelinkicon | TemplateRef<void> | Custom icon of the next page button of the paginator. |

### Methods

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| exportCSV | options: ExportCSVOptions | void | Data export method. |
| resetScrollTop |  | void | Resets scroll to top. |
| scrollToVirtualIndex | index: number | void | Scrolls to given index when using virtual scroll. |
| scrollTo | options: any | void | Scrolls to given index. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| filter | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the filter container element. |
| pcColumnFilterButton | ButtonPassThrough | Used to pass attributes to the column filter button component. |
| filterOverlay | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the filter overlay element. |
| filterConstraintList | PassThroughOption<HTMLUListElement, I> | Used to pass attributes to the filter constraint list element. |
| filterConstraint | PassThroughOption<HTMLLIElement, I> | Used to pass attributes to the filter constraint element. |
| filterConstraintSeparator | PassThroughOption<HTMLLIElement, I> | Used to pass attributes to the filter constraint separator element. |
| emtpyFilterLabel | PassThroughOption<HTMLLIElement, I> | Used to pass attributes to the empty filter label element. |
| filterOperator | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the filter operator element. |
| pcFilterOperatorDropdown | SelectPassThrough | Used to pass attributes to the filter operator dropdown component. |
| filterRuleList | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the filter rule list element. |
| filterRule | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the filter rule element. |
| pcFilterConstraintDropdown | SelectPassThrough | Used to pass attributes to the filter constraint dropdown component. |
| pcFilterRemoveRuleButton | ButtonPassThrough | Used to pass attributes to the filter remove rule button component. |
| pcAddRuleButtonLabel | ButtonPassThrough | Used to pass attributes to the add rule button label. |
| filterButtonBar | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the filter button bar element. |
| pcFilterClearButton | ButtonPassThrough | Used to pass attributes to the filter clear button component. |
| pcFilterApplyButton | ButtonPassThrough | Used to pass attributes to the filter apply button component. |
| pcFilterInputText | InputTextPassThrough | Used to pass attributes to the filter input text component. |
| pcFilterInputNumber | InputNumberPassThrough | Used to pass attributes to the filter input number component. |
| pcFilterCheckbox | CheckboxPassThrough | Used to pass attributes to the filter checkbox component. |
| pcFilterDatePicker | DatePickerPassThrough | Used to pass attributes to the filter datepicker component. |
| motion | MotionOptions | Used to pass options to the motion component/directive. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-datatable | Class name of the root element |
| p-datatable-mask | Class name of the mask element |
| p-datatable-loading-icon | Class name of the loading icon element |
| p-datatable-header | Class name of the header element |
| p-datatable-paginator-[position] | Class name of the paginator element |
| p-datatable-table-container | Class name of the table container element |
| p-datatable-table | Class name of the table element |
| p-datatable-thead | Class name of the thead element |
| p-datatable-column-resizer | Class name of the column resizer element |
| p-datatable-column-header-content | Class name of the column header content element |
| p-datatable-column-title | Class name of the column title element |
| p-datatable-sort-icon | Class name of the sort icon element |
| p-datatable-sort-badge | Class name of the sort badge element |
| p-datatable-filter | Class name of the filter element |
| p-datatable-filter-element-container | Class name of the filter element container element |
| p-datatable-column-filter-button | Class name of the column filter button element |
| p-datatable-column-filter-clear-button | Class name of the column filter clear button element |
| p-datatable-filter-overlay | Class name of the filter overlay element |
| p-datatable-filter-constraint-list | Class name of the filter constraint list element |
| p-datatable-filter-constraint | Class name of the filter constraint element |
| p-datatable-filter-constraint-separator | Class name of the filter constraint separator element |
| p-datatable-filter-operator | Class name of the filter operator element |
| p-datatable-filter-operator-dropdown | Class name of the filter operator dropdown element |
| p-datatable-filter-rule-list | Class name of the filter rule list element |
| p-datatable-filter-rule | Class name of the filter rule element |
| p-datatable-filter-constraint-dropdown | Class name of the filter constraint dropdown element |
| p-datatable-filter-remove-rule-button | Class name of the filter remove rule button element |
| p-datatable-filter-add-rule-button | Class name of the filter add rule button element |
| p-datatable-filter-buttonbar | Class name of the filter buttonbar element |
| p-datatable-filter-clear-button | Class name of the filter clear button element |
| p-datatable-filter-apply-button | Class name of the filter apply button element |
| p-datatable-tbody | Class name of the tbody element |
| p-datatable-row-group-header | Class name of the row group header element |
| p-datatable-row-toggle-button | Class name of the row toggle button element |
| p-datatable-row-toggle-icon | Class name of the row toggle icon element |
| p-datatable-row-expansion | Class name of the row expansion element |
| p-datatable-row-group-footer | Class name of the row group footer element |
| p-datatable-empty-message | Class name of the empty message element |
| p-datatable-reorderable-row-handle | Class name of the reorderable row handle element |
| p-datatable-row-editor-init | Class name of the row editor init element |
| p-datatable-row-editor-save | Class name of the row editor save element |
| p-datatable-row-editor-cancel | Class name of the row editor cancel element |
| p-datatable-tfoot | Class name of the tfoot element |
| p-datatable-virtualscroller-spacer | Class name of the virtual scroller spacer element |
| p-datatable-footer | Class name of the footer element |
| p-datatable-column-resize-indicator | Class name of the column resize indicator element |
| p-datatable-row-reorder-indicator-up | Class name of the row reorder indicator up element |
| p-datatable-row-reorder-indicator-down | Class name of the row reorder indicator down element |
| p-datatable-sortable-column | Class name of the sortable column element |
| p-sortable-column-icon | Class name of the sortable column icon element |
| p-sortable-column-badge | Class name of the sortable column badge element |
| p-datatable-selectable-row | Class name of the selectable row element |
| p-datatable-resizable-column | Class name of the resizable column element |
| p-datatable-row-editor-cancel | Class name of the row editor cancel element |
| p-datatable-frozen-column | Class name of the frozen column element |
| p-datatable-contextmenu-row-selected | Class name of the contextmenu row selected element |

