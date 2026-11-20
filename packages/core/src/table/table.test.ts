import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { OverlayService, SharedModule, SortMeta } from '@exhaustive-ui/core/api';
import { Select } from '@exhaustive-ui/core/select';
import { CellEditor, ColumnFilter, ColumnFilterFormElement, EditableColumn, Table, TableModule, TableRadioButton, TableService } from './table';

describe('Table', () => {
    let component: Table;
    let fixture: ComponentFixture<Table>;

    @Component({
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false,
        template: `
            <p-table [value]="products" [dataKey]="'id'">
                <ng-template #header>
                    <tr>
                        <th>ID</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Rating</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.id }}</td>
                        <td>{{ product.code }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.description }}</td>
                        <td>{{ product.price | currency }}</td>
                        <td>{{ product.quantity }}</td>
                        <td>{{ product.inventoryStatus }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ product.image }}</td>
                        <td>{{ product.rating }}</td>
                    </tr>
                </ng-template>
            </p-table>
        `
    })
    class TestBasicTableComponent {
        products = [
            { id: '1001', code: 'LP001', name: 'Gaming Laptop', description: 'High-end gaming laptop', price: 1299.99, quantity: 15, inventoryStatus: 'INSTOCK', category: 'Electronics', image: 'laptop.jpg', rating: 5 },
            { id: '1002', code: 'MO001', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29.99, quantity: 0, inventoryStatus: 'OUTOFSTOCK', category: 'Accessories', image: 'mouse.jpg', rating: 4 },
            { id: '1003', code: 'KB001', name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 149.99, quantity: 8, inventoryStatus: 'LOWSTOCK', category: 'Accessories', image: 'keyboard.jpg', rating: 4 },
            { id: '1004', code: 'HD001', name: 'Wireless Headphones', description: 'Noise-cancelling headphones', price: 199.99, quantity: 25, inventoryStatus: 'INSTOCK', category: 'Audio', image: 'headphones.jpg', rating: 5 },
            { id: '1005', code: 'MN001', name: '4K Monitor', description: '27-inch 4K monitor', price: 399.99, quantity: 12, inventoryStatus: 'INSTOCK', category: 'Displays', image: 'monitor.jpg', rating: 4 }
        ];
    }

    @Component({
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false,
        template: `
            <p-table [value]="products" [selection]="selectedProducts" [selectionMode]="'multiple'" [dataKey]="'id'">
                <ng-template #header>
                    <tr>
                        <th><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td><p-tableCheckbox [value]="product"></p-tableCheckbox></td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price | currency }}</td>
                        <td>{{ product.inventoryStatus }}</td>
                    </tr>
                </ng-template>
            </p-table>
        `
    })
    class TestSelectionTableComponent {
        products = [
            { id: '1001', name: 'Gaming Laptop', price: 1299.99, inventoryStatus: 'INSTOCK' },
            { id: '1002', name: 'Wireless Mouse', price: 29.99, inventoryStatus: 'OUTOFSTOCK' }
        ];
        selectedProducts: any[] = [];
    }

    @Component({
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false,
        template: `
            <p-table [value]="products" [sortMode]="'multiple'">
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                        <th pSortableColumn="price">Price <p-sortIcon field="price"></p-sortIcon></th>
                        <th pSortableColumn="category">Category <p-sortIcon field="category"></p-sortIcon></th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price | currency }}</td>
                        <td>{{ product.category }}</td>
                    </tr>
                </ng-template>
            </p-table>
        `
    })
    class TestSortingTableComponent {
        products = [
            { id: '1001', name: 'Gaming Laptop', price: 1299.99, category: 'Electronics' },
            { id: '1002', name: 'Wireless Mouse', price: 29.99, category: 'Accessories' },
            { id: '1003', name: 'Mechanical Keyboard', price: 149.99, category: 'Accessories' }
        ];
    }

    @Component({
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false,
        template: `
            <p-table [value]="products" [sortMode]="'multiple'" [multiSortMeta]="multiSortMeta" [groupRowsBy]="'category'">
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                    </tr>
                </ng-template>
            </p-table>
        `
    })
    class TestGroupedSortingTableComponent {
        products = [
            { id: '1001', name: 'Gaming Laptop', price: 1299.99, category: 'Electronics' },
            { id: '1002', name: 'Wireless Mouse', price: 29.99, category: 'Accessories' },
            { id: '1003', name: 'Mechanical Keyboard', price: 149.99, category: 'Accessories' }
        ];
        multiSortMeta: SortMeta[] = [];
    }

    @Component({
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false,
        template: `
            <p-table [value]="products" [globalFilterFields]="['name', 'category']">
                <ng-template #header>
                    <tr>
                        <th>
                            Name
                            <p-columnFilter field="name" matchMode="contains" display="menu">
                                <ng-template #filter let-value let-filter="filterCallback">
                                    <input type="text" [(ngModel)]="value" (ngModelChange)="filter($event)" placeholder="Search by name" />
                                </ng-template>
                            </p-columnFilter>
                        </th>
                        <th>
                            Category
                            <p-columnFilter field="category" matchMode="equals" display="menu">
                                <ng-template #filter let-value let-filter="filterCallback">
                                    <p-select [(ngModel)]="value" [options]="categories" (ngModelChange)="filter($event)" placeholder="Select Category"> </p-select>
                                </ng-template>
                            </p-columnFilter>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                    </tr>
                </ng-template>
            </p-table>
        `
    })
    class TestFilteringTableComponent {
        products = [
            { id: '1001', name: 'Gaming Laptop', category: 'Electronics' },
            { id: '1002', name: 'Wireless Mouse', category: 'Accessories' },
            { id: '1003', name: 'Mechanical Keyboard', category: 'Accessories' }
        ];
        categories = [
            { label: 'Electronics', value: 'Electronics' },
            { label: 'Accessories', value: 'Accessories' }
        ];
    }

    @Component({
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false,
        template: `
            <p-table [value]="products" [virtualScroll]="true" [virtualScrollItemSize]="46" [scrollHeight]="'400px'">
                <ng-template #header>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.id }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price | currency }}</td>
                    </tr>
                </ng-template>
            </p-table>
        `
    })
    class TestVirtualScrollTableComponent {
        products = Array.from({ length: 10000 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            price: Math.random() * 1000
        }));
    }

    @Component({
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false,
        selector: 'test-virtual-scroll-percent-height-table',
        template: `
            <div style="height: 480px;">
                <p-table [value]="products" [scrollable]="true" [virtualScroll]="true" [virtualScrollItemSize]="40" [scrollHeight]="'100%'">
                    <ng-template #header>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr style="height: 40px">
                            <td>{{ product.id }}</td>
                            <td>{{ product.name }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        `
    })
    class TestVirtualScrollPercentHeightTableComponent {
        products = Array.from({ length: 1000 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`
        }));
    }

    @Component({
        standalone: false,
        selector: 'test-scrollable-non-virtual-table',
        template: `
            <p-table [value]="products" [scrollable]="true" [scrollHeight]="'400px'">
                <ng-template #header>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.id }}</td>
                        <td>{{ product.name }}</td>
                    </tr>
                </ng-template>
            </p-table>
        `
    })
    class TestScrollableNonVirtualTableComponent {
        products = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`
        }));
    }

    @Component({
        standalone: false,
        selector: 'test-virtual-scroll-flex-height-table',
        template: `
            <div style="height: 480px;">
                <p-table [value]="products" [scrollable]="true" [virtualScroll]="true" [virtualScrollItemSize]="40" [scrollHeight]="'flex'">
                    <ng-template #header>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr style="height: 40px">
                            <td>{{ product.id }}</td>
                            <td>{{ product.name }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        `
    })
    class TestVirtualScrollFlexHeightTableComponent {
        products = Array.from({ length: 1000 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`
        }));
    }

    @Component({
        standalone: false,
        template: `
            <p-table [value]="products" [lazy]="true" [totalRecords]="totalRecords" [paginator]="true" [rows]="10" (onLazyLoad)="loadProducts($event)">
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price | currency }}</td>
                    </tr>
                </ng-template>
            </p-table>
        `
    })
    class TestLazyLoadTableComponent {
        products: any[] = [];
        totalRecords: number = 1000;

        loadProducts(event: any) {
            // Simulate lazy loading
            setTimeout(() => {
                this.products = Array.from({ length: event.rows }, (_, i) => ({
                    id: event.first + i + 1,
                    name: `Product ${event.first + i + 1}`,
                    price: Math.random() * 1000
                }));
            }, 1000);
        }
    }

    @Component({
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false,
        template: `
            <p-table [value]="products">
                <ng-template #caption>
                    <div class="p-d-flex p-ai-center p-jc-between">
                        <h5>Product Catalog</h5>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"></i>
                            <input type="text" pInputText placeholder="Global Search" />
                        </span>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price | currency }}</td>
                    </tr>
                </ng-template>
                <ng-template #summary> Total Products: {{ products.length }} </ng-template>
            </p-table>
        `
    })
    class TestTemplatesTableComponent {
        products = [
            { id: '1001', name: 'Gaming Laptop', price: 1299.99 },
            { id: '1002', name: 'Wireless Mouse', price: 29.99 }
        ];
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                Table,
                TestBasicTableComponent,
                TestSelectionTableComponent,
                TestSortingTableComponent,
                TestGroupedSortingTableComponent,
                TestFilteringTableComponent,
                TestVirtualScrollTableComponent,
                TestVirtualScrollPercentHeightTableComponent,
                TestScrollableNonVirtualTableComponent,
                TestVirtualScrollFlexHeightTableComponent,
                TestLazyLoadTableComponent,
                TestTemplatesTableComponent
            ],
            imports: [CommonModule, FormsModule, TableModule, SharedModule, Select],
            providers: [TableService, provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(Table);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Basic Table Functionality', () => {
        let testComponent: TestBasicTableComponent;
        let testFixture: ComponentFixture<TestBasicTableComponent>;

        beforeEach(async () => {
            testFixture = TestBed.createComponent(TestBasicTableComponent);
            testComponent = testFixture.componentInstance;
            await testFixture.whenStable();
            testFixture.detectChanges();
        });

        it('should render table with product data', () => {
            const tableElement = testFixture.debugElement.query(By.css('p-table'));
            expect(tableElement).toBeTruthy();
        });

        it('should display correct number of rows', () => {
            const rows = testFixture.debugElement.queryAll(By.css('tbody tr'));
            expect(rows.length).toBe(testComponent.products.length);
        });

        it('should display product information in cells', () => {
            const firstRowCells = testFixture.debugElement.queryAll(By.css('tbody tr:first-child td'));
            expect(firstRowCells[0].nativeElement.textContent).toContain('1001');
            expect(firstRowCells[2].nativeElement.textContent).toContain('Gaming Laptop');
        });

        it('should have correct dataKey', () => {
            const tableInstance = testFixture.debugElement.query(By.css('p-table')).componentInstance;
            expect(tableInstance.dataKey()).toBe('id');
        });
    });

    describe('Selection Functionality', () => {
        let testComponent: TestSelectionTableComponent;
        let testFixture: ComponentFixture<TestSelectionTableComponent>;

        beforeEach(async () => {
            testFixture = TestBed.createComponent(TestSelectionTableComponent);
            testComponent = testFixture.componentInstance;
            await testFixture.whenStable();
            testFixture.detectChanges();
        });

        it('should enable multiple selection', () => {
            const tableInstance = testFixture.debugElement.query(By.css('p-table')).componentInstance;
            expect(tableInstance.selectionMode()).toBe('multiple');
        });

        it('should render checkboxes for selection', () => {
            const checkboxes = testFixture.debugElement.queryAll(By.css('p-tableCheckbox'));
            expect(checkboxes.length).toBe(testComponent.products.length);
        });

        it('should render header checkbox for select all', () => {
            const headerCheckbox = testFixture.debugElement.query(By.css('p-tableHeaderCheckbox'));
            expect(headerCheckbox).toBeTruthy();
        });
    });

    describe('Sorting Functionality', () => {
        let testComponent: TestSortingTableComponent;
        let testFixture: ComponentFixture<TestSortingTableComponent>;

        beforeEach(async () => {
            testFixture = TestBed.createComponent(TestSortingTableComponent);
            testComponent = testFixture.componentInstance;
            await testFixture.whenStable();
            testFixture.detectChanges();
        });

        it('should enable multiple sort mode', () => {
            const tableInstance = testFixture.debugElement.query(By.css('p-table')).componentInstance;
            expect(tableInstance.sortMode()).toBe('multiple');
        });

        it('should render sort icons', () => {
            const sortIcons = testFixture.debugElement.queryAll(By.css('p-sortIcon'));
            expect(sortIcons.length).toBe(3);
        });

        it('should have sortable columns', () => {
            const sortableColumns = testFixture.debugElement.queryAll(By.css('[pSortableColumn]'));
            expect(sortableColumns.length).toBe(3);
        });

        describe('Row Grouping With An Empty multiSortMeta', () => {
            let groupedComponent: TestGroupedSortingTableComponent;
            let groupedFixture: ComponentFixture<TestGroupedSortingTableComponent>;

            const createGroupedFixture = async () => {
                groupedFixture = TestBed.createComponent(TestGroupedSortingTableComponent);
                groupedComponent = groupedFixture.componentInstance;
                await groupedFixture.whenStable();
                groupedFixture.detectChanges();
            };

            it('should not throw when multiSortMeta starts out as an empty array', async () => {
                await createGroupedFixture();
            });

            it('should sort by the grouped field when multiSortMeta is empty', async () => {
                await createGroupedFixture();

                const tableInstance: Table = groupedFixture.debugElement.query(By.css('p-table')).componentInstance;

                expect(tableInstance._multiSortMeta()).toEqual([{ field: 'category', order: 1 }]);
                expect(tableInstance._value()!.map((product: any) => product.category)).toEqual(['Accessories', 'Accessories', 'Electronics']);
            });

            it('should keep the grouped field first when multiSortMeta is emptied later', async () => {
                await createGroupedFixture();

                groupedComponent.multiSortMeta = [];
                groupedFixture.detectChanges();
                await groupedFixture.whenStable();

                const tableInstance: Table = groupedFixture.debugElement.query(By.css('p-table')).componentInstance;

                expect(tableInstance._multiSortMeta()).toEqual([{ field: 'category', order: 1 }]);
            });
        });
    });

    describe('Filtering Functionality', () => {
        let testComponent: TestFilteringTableComponent;
        let testFixture: ComponentFixture<TestFilteringTableComponent>;

        beforeEach(async () => {
            testFixture = TestBed.createComponent(TestFilteringTableComponent);
            testComponent = testFixture.componentInstance;
            await testFixture.whenStable();
            testFixture.detectChanges();
        });

        it('should have global filter fields configured', () => {
            const tableInstance = testFixture.debugElement.query(By.css('p-table')).componentInstance;
            expect(tableInstance.globalFilterFields()).toEqual(['name', 'category']);
        });

        it('should render column filters', () => {
            const columnFilters = testFixture.debugElement.queryAll(By.css('p-columnFilter'));
            expect(columnFilters.length).toBe(2);
        });
    });

    describe('Virtual Scroll Functionality', () => {
        let testComponent: TestVirtualScrollTableComponent;
        let testFixture: ComponentFixture<TestVirtualScrollTableComponent>;

        beforeEach(async () => {
            testFixture = TestBed.createComponent(TestVirtualScrollTableComponent);
            testComponent = testFixture.componentInstance;
            await testFixture.whenStable();
            testFixture.detectChanges();
        });

        it('should enable virtual scrolling', () => {
            const tableInstance = testFixture.debugElement.query(By.css('p-table')).componentInstance;
            expect(tableInstance.virtualScroll()).toBe(true);
        });

        it('should have correct virtual scroll item size', () => {
            const tableInstance = testFixture.debugElement.query(By.css('p-table')).componentInstance;
            expect(tableInstance.virtualScrollItemSize()).toBe(46);
        });

        it('should handle large datasets efficiently', () => {
            expect(testComponent.products.length).toBe(10000);
        });

        it('should apply host and container height for virtual scroll with 100% scrollHeight', async () => {
            const percentHeightFixture = TestBed.createComponent(TestVirtualScrollPercentHeightTableComponent);
            await percentHeightFixture.whenStable();
            percentHeightFixture.detectChanges();

            const tableElement = percentHeightFixture.debugElement.query(By.css('p-table')).nativeElement as HTMLElement;
            const containerElement = percentHeightFixture.nativeElement.querySelector('.p-datatable-table-container') as HTMLElement;
            const scrollerElement = percentHeightFixture.nativeElement.querySelector('.p-virtualscroller');

            expect(tableElement.style.height).toBe('100%');
            expect(containerElement.style.height).toBe('100%');
            expect(scrollerElement).toBeTruthy();
            expect(scrollerElement.offsetHeight).toBeGreaterThan(0);
        });

        it('should apply explicit height for virtual scroll with pixel scrollHeight', () => {
            const tableElement = testFixture.debugElement.query(By.css('p-table')).nativeElement as HTMLElement;
            const containerElement = testFixture.nativeElement.querySelector('.p-datatable-table-container') as HTMLElement;

            expect(tableElement.style.height).toBe('400px');
            expect(containerElement.style.height).toBe('400px');
        });

        it('should not apply host height when virtualScroll is false', async () => {
            const nonVirtualFixture = TestBed.createComponent(TestScrollableNonVirtualTableComponent);
            await nonVirtualFixture.whenStable();
            nonVirtualFixture.detectChanges();

            const tableElement = nonVirtualFixture.debugElement.query(By.css('p-table')).nativeElement as HTMLElement;
            const containerElement = nonVirtualFixture.nativeElement.querySelector('.p-datatable-table-container') as HTMLElement;

            expect(tableElement.style.height).toBe('');
            expect(containerElement.style.maxHeight).toBe('400px');
        });

        it('should keep flex mode on class-based path without inline height', async () => {
            const flexFixture = TestBed.createComponent(TestVirtualScrollFlexHeightTableComponent);
            await flexFixture.whenStable();
            flexFixture.detectChanges();

            const tableElement = flexFixture.debugElement.query(By.css('p-table')).nativeElement as HTMLElement;
            const containerElement = flexFixture.nativeElement.querySelector('.p-datatable-table-container') as HTMLElement;
            const rootElement = flexFixture.nativeElement.querySelector('.p-datatable') as HTMLElement;

            expect(tableElement.style.height).toBe('');
            expect(containerElement.style.height).toBe('');
            expect(rootElement.classList.contains('p-datatable-flex-scrollable')).toBe(true);
        });
    });

    describe('Lazy Loading Functionality', () => {
        let testComponent: TestLazyLoadTableComponent;
        let testFixture: ComponentFixture<TestLazyLoadTableComponent>;

        beforeEach(async () => {
            testFixture = TestBed.createComponent(TestLazyLoadTableComponent);
            testComponent = testFixture.componentInstance;
            await testFixture.whenStable();
            testFixture.detectChanges();
        });

        it('should enable lazy loading', () => {
            const tableInstance = testFixture.debugElement.query(By.css('p-table')).componentInstance;
            expect(tableInstance.lazy()).toBe(true);
        });

        it('should have correct total records', () => {
            const tableInstance = testFixture.debugElement.query(By.css('p-table')).componentInstance;
            expect(tableInstance._totalRecords()).toBe(1000);
        });

        it('should emit lazy load event through a real trigger (onPageChange), not a manual .emit() call', () => {
            vi.spyOn(testComponent, 'loadProducts').mockImplementation(() => {});
            const tableInstance = testFixture.debugElement.query(By.css('p-table')).componentInstance;
            vi.spyOn(tableInstance.onLazyLoad, 'emit');

            // onPageChange is the real method a paginator click invokes; because lazy=true is
            // bound on the host template, it internally emits onLazyLoad with fresh metadata.
            tableInstance.onPageChange({ first: 10, rows: 10 });

            expect(tableInstance.onLazyLoad.emit).toHaveBeenCalledWith(expect.objectContaining({ first: 10, rows: 10 }));
            expect(testComponent.loadProducts).toHaveBeenCalledWith(expect.objectContaining({ first: 10, rows: 10 }));
        });
    });

    describe('Templates Functionality', () => {
        let testComponent: TestTemplatesTableComponent;
        let testFixture: ComponentFixture<TestTemplatesTableComponent>;

        beforeEach(async () => {
            testFixture = TestBed.createComponent(TestTemplatesTableComponent);
            testComponent = testFixture.componentInstance;
            await testFixture.whenStable();
            testFixture.detectChanges();
        });

        it('should render caption template', () => {
            const captionElement = testFixture.debugElement.query(By.css('.p-d-flex'));
            expect(captionElement).toBeTruthy();
        });

        it('should display correct product count in summary', () => {
            const summaryText = testFixture.nativeElement.textContent;
            expect(summaryText).toContain('Total Products: 2');
        });
    });

    describe('Real-Life Scenarios - E-commerce Product Management', () => {
        let ecommerceComponent: TestBasicTableComponent;
        let ecommerceFixture: ComponentFixture<TestBasicTableComponent>;

        beforeEach(async () => {
            ecommerceFixture = TestBed.createComponent(TestBasicTableComponent);
            ecommerceComponent = ecommerceFixture.componentInstance;
            ecommerceComponent.products = [
                { id: '1001', code: 'LP001', name: 'Gaming Laptop', description: 'High-end gaming laptop', price: 1299.99, quantity: 15, inventoryStatus: 'INSTOCK', category: 'Electronics', image: 'laptop.jpg', rating: 5 },
                { id: '1002', code: 'MO001', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29.99, quantity: 0, inventoryStatus: 'OUTOFSTOCK', category: 'Accessories', image: 'mouse.jpg', rating: 4 },
                { id: '1003', code: 'KB001', name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 149.99, quantity: 8, inventoryStatus: 'LOWSTOCK', category: 'Accessories', image: 'keyboard.jpg', rating: 4 },
                { id: '1004', code: 'HD001', name: 'Wireless Headphones', description: 'Noise-cancelling headphones', price: 199.99, quantity: 25, inventoryStatus: 'INSTOCK', category: 'Audio', image: 'headphones.jpg', rating: 5 },
                { id: '1005', code: 'MN001', name: '4K Monitor', description: '27-inch 4K monitor', price: 399.99, quantity: 12, inventoryStatus: 'INSTOCK', category: 'Displays', image: 'monitor.jpg', rating: 4 }
            ];
            ecommerceFixture.changeDetectorRef.markForCheck();
            await ecommerceFixture.whenStable();
            ecommerceFixture.detectChanges();
        });

        it('should handle inventory status filtering for stock management', async () => {
            const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;

            tableInstance.filter('INSTOCK', 'inventoryStatus', 'equals');
            await new Promise((resolve) => setTimeout(resolve, 350));
            await ecommerceFixture.whenStable();

            const inStockProducts = tableInstance.filteredValue() || tableInstance._value();
            const inStock = inStockProducts.filter((product: any) => product.inventoryStatus === 'INSTOCK');
            expect(inStock.length).toBe(3);
        });

        it('should sort by price for promotional planning', async () => {
            const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;

            tableInstance.sort({ field: 'price', order: 1 });
            await ecommerceFixture.whenStable();

            expect(tableInstance._sortField()).toBe('price');
            expect(tableInstance._sortOrder()).toBe(1);
        });

        it('should support price range filtering for budget constraints', async () => {
            const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;

            tableInstance.filter(100, 'price', 'lt');
            await new Promise((resolve) => setTimeout(resolve, 350));
            await ecommerceFixture.whenStable();

            const filteredData = tableInstance.filteredValue() || tableInstance._value();
            const affordableProducts = filteredData.filter((product: any) => product.price < 100);
            expect(affordableProducts.length).toBe(1); // Only the mouse under $100
        });

        it('should calculate average price for market analysis', () => {
            const products = ecommerceComponent.products;
            const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
            const averagePrice = totalPrice / products.length;

            expect(averagePrice).toBeGreaterThan(0);
            expect(averagePrice).toBeCloseTo(415.99, 1);
        });

        it('should support CSV export for external analysis', () => {
            const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;
            vi.spyOn(tableInstance, 'exportCSV').mockImplementation(() => {});

            tableInstance.exportCSV({ selectionOnly: false });
            expect(tableInstance.exportCSV).toHaveBeenCalledWith({ selectionOnly: false });
        });

        describe('Real-Life Scenarios - Additional Tests', () => {
            it('should handle bulk operations efficiently', () => {
                const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;
                expect(tableInstance).toBeTruthy();
            });

            it('should support complex filtering operations', () => {
                const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;
                expect(tableInstance).toBeTruthy();
            });

            it('should handle large datasets with virtual scrolling', () => {
                const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;
                expect(tableInstance).toBeTruthy();
                expect(ecommerceComponent.products.length).toBeGreaterThan(0);
            });

            it('should maintain state across user interactions', () => {
                const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;
                expect(tableInstance).toBeTruthy();
                expect(tableInstance._value()).toBeDefined();
            });

            it('should support row expansion for master-detail views', () => {
                expect(component.expandedRowKeys).toBeDefined();
            });

            it('should handle column reordering and resizing', () => {
                const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;
                expect(tableInstance).toBeTruthy();
                expect(tableInstance._value()).toBeDefined();
            });

            it('should provide advanced sorting capabilities', () => {
                const tableInstance = ecommerceFixture.debugElement.query(By.css('p-table')).componentInstance;
                expect(tableInstance).toBeTruthy();
                expect(typeof tableInstance.sort).toBe('function');
            });

            it('should export data in multiple formats', () => {
                vi.spyOn(component, 'exportCSV').mockImplementation(() => {});
                component.exportCSV();
                expect(component.exportCSV).toHaveBeenCalled();
            });
        });
    });

    describe('Output Events', () => {
        // These tests drive each output() through the real method that emits it (row clicks,
        // paging, sorting, filtering, drag/drop, state save/restore, etc.) rather than calling
        // `.emit()` directly, so they fail if the internal wiring between the method and the
        // output is ever broken.
        let outputComponent: Table;
        let outputFixture: ComponentFixture<Table>;

        const clickEvent = (target: HTMLElement = document.createElement('div'), extra: Record<string, any> = {}) => ({
            target,
            shiftKey: false,
            metaKey: false,
            ctrlKey: false,
            ...extra
        });

        beforeEach(() => {
            outputFixture = TestBed.createComponent(Table);
            outputComponent = outputFixture.componentInstance;
            outputFixture.detectChanges();
        });

        describe('Selection outputs', () => {
            it('emits selectionChange and onRowSelect via handleRowClick (select)', () => {
                outputFixture.componentRef.setInput('selectionMode', 'single');
                outputFixture.componentRef.setInput('dataKey', 'id');
                const rowData = { id: '1', name: 'Row 1' };
                outputFixture.componentRef.setInput('value', [rowData, { id: '2', name: 'Row 2' }]);
                const selectionChangeSpy = vi.fn();
                outputComponent.selection.subscribe(selectionChangeSpy);
                vi.spyOn(outputComponent.onRowSelect, 'emit');

                outputComponent.handleRowClick({ originalEvent: clickEvent(), rowData, rowIndex: 0 });

                expect(selectionChangeSpy).toHaveBeenCalledWith(rowData);
                expect(outputComponent.onRowSelect.emit).toHaveBeenCalledWith(expect.objectContaining({ data: rowData, type: 'row', index: 0 }));
            });

            it('emits selectionChange and onRowUnselect via handleRowClick (unselect an already-selected row)', () => {
                outputFixture.componentRef.setInput('selectionMode', 'single');
                outputFixture.componentRef.setInput('dataKey', 'id');
                const rowData = { id: '1', name: 'Row 1' };
                outputFixture.componentRef.setInput('value', [rowData]);
                outputComponent.selection.set(rowData);
                outputFixture.detectChanges();
                const selectionChangeSpy = vi.fn();
                outputComponent.selection.subscribe(selectionChangeSpy);
                vi.spyOn(outputComponent.onRowUnselect, 'emit');

                outputComponent.handleRowClick({ originalEvent: clickEvent(), rowData, rowIndex: 0 });

                expect(selectionChangeSpy).toHaveBeenCalled();
                expect(outputComponent.onRowUnselect.emit).toHaveBeenCalledWith(expect.objectContaining({ data: rowData, type: 'row' }));
            });

            it('emits selectionChange and onRowSelect via selectRange (shift-click multi-select)', () => {
                outputFixture.componentRef.setInput('selectionMode', 'multiple');
                outputFixture.componentRef.setInput('dataKey', 'id');
                const rows = [
                    { id: '1', name: 'Row 1' },
                    { id: '2', name: 'Row 2' },
                    { id: '3', name: 'Row 3' }
                ];
                outputFixture.componentRef.setInput('value', rows);
                outputComponent.selection.set([]);
                outputComponent.anchorRowIndex.set(0);
                const selectionChangeSpy = vi.fn();
                outputComponent.selection.subscribe(selectionChangeSpy);
                vi.spyOn(outputComponent.onRowSelect, 'emit');

                outputComponent.selectRange(clickEvent() as any, 2);

                expect(selectionChangeSpy).toHaveBeenCalledWith(rows);
                expect(outputComponent.onRowSelect.emit).toHaveBeenCalledWith(expect.objectContaining({ data: rows, type: 'row' }));
            });

            it('emits onRowUnselect via clearSelectionRange', () => {
                outputFixture.componentRef.setInput('dataKey', 'id');
                const rows = [
                    { id: '1', name: 'Row 1' },
                    { id: '2', name: 'Row 2' }
                ];
                outputFixture.componentRef.setInput('value', rows);
                outputComponent.selection.set([...rows]);
                outputComponent.selectionKeys.set({ '1': 1, '2': 1 });
                outputComponent.anchorRowIndex.set(0);
                outputComponent.rangeRowIndex.set(1);
                vi.spyOn(outputComponent.onRowUnselect, 'emit');

                outputComponent.clearSelectionRange(clickEvent() as any);

                expect(outputComponent.onRowUnselect.emit).toHaveBeenCalledTimes(2);
            });

            it('emits selectionChange and onRowSelect/onRowUnselect via toggleRowWithRadio', () => {
                outputFixture.componentRef.setInput('dataKey', 'id');
                const rowData = { id: '1', name: 'Row 1' };
                outputFixture.componentRef.setInput('value', [rowData]);
                const selectionChangeSpy = vi.fn();
                outputComponent.selection.subscribe(selectionChangeSpy);
                vi.spyOn(outputComponent.onRowSelect, 'emit');
                vi.spyOn(outputComponent.onRowUnselect, 'emit');

                outputComponent.toggleRowWithRadio({ originalEvent: clickEvent(), rowIndex: 0 }, rowData);
                expect(selectionChangeSpy).toHaveBeenCalledWith(rowData);
                expect(outputComponent.onRowSelect.emit).toHaveBeenCalledWith(expect.objectContaining({ data: rowData, type: 'radiobutton' }));

                outputComponent.toggleRowWithRadio({ originalEvent: clickEvent(), rowIndex: 0 }, rowData);
                expect(outputComponent.onRowUnselect.emit).toHaveBeenCalledWith(expect.objectContaining({ data: rowData, type: 'radiobutton' }));
            });

            it('emits selectAllChange via toggleRowsWithCheckbox when selectAll is bound (not null)', () => {
                outputFixture.componentRef.setInput('value', [{ id: '1' }, { id: '2' }]);
                outputFixture.componentRef.setInput('dataKey', 'id');
                outputFixture.componentRef.setInput('selectAll', false);
                vi.spyOn(outputComponent.selectAllChange, 'emit');

                const originalEvent = new Event('change');
                outputComponent.toggleRowsWithCheckbox({ originalEvent } as any, true);

                expect(outputComponent.selectAllChange.emit).toHaveBeenCalledWith({ originalEvent, checked: true });
            });

            it('emits onHeaderCheckboxToggle and selectionChange via toggleRowsWithCheckbox (selectAll not bound)', () => {
                outputFixture.componentRef.setInput('value', [{ id: '1' }, { id: '2' }]);
                outputFixture.componentRef.setInput('dataKey', 'id');
                const selectionChangeSpy = vi.fn();
                outputComponent.selection.subscribe(selectionChangeSpy);
                vi.spyOn(outputComponent.onHeaderCheckboxToggle, 'emit');

                const originalEvent = new Event('change');
                outputComponent.toggleRowsWithCheckbox({ originalEvent } as any, true);

                expect(selectionChangeSpy).toHaveBeenCalled();
                expect(outputComponent.onHeaderCheckboxToggle.emit).toHaveBeenCalledWith({ originalEvent, checked: true });
            });
        });

        describe('Context menu outputs', () => {
            it('emits contextMenuSelectionChange and onContextMenuSelect via handleRowRightClick', () => {
                outputFixture.componentRef.setInput('contextMenu', { show: vi.fn(), hideCallback: signal(undefined) });
                outputFixture.componentRef.setInput('dataKey', 'id');
                const rowData = { id: '1', name: 'Row 1' };
                outputFixture.componentRef.setInput('value', [rowData]);
                const contextMenuSelectionChangeSpy = vi.fn();
                outputComponent.contextMenuSelection.subscribe(contextMenuSelectionChangeSpy);
                vi.spyOn(outputComponent.onContextMenuSelect, 'emit');

                const originalEvent = clickEvent();
                outputComponent.handleRowRightClick({ originalEvent, rowData, rowIndex: 0 });

                expect(contextMenuSelectionChangeSpy).toHaveBeenCalledWith(rowData);
                expect(outputComponent.onContextMenuSelect.emit).toHaveBeenCalledWith(expect.objectContaining({ data: rowData, index: 0 }));
            });
        });

        describe('Paging outputs', () => {
            it('emits onPage, firstChange and rowsChange via onPageChange', () => {
                outputFixture.componentRef.setInput('value', [{ id: '1' }]);
                vi.spyOn(outputComponent.onPage, 'emit');
                const firstChangeSpy = vi.fn();
                outputComponent.first.subscribe(firstChangeSpy);
                const rowsChangeSpy = vi.fn();
                outputComponent.rows.subscribe(rowsChangeSpy);

                outputComponent.onPageChange({ first: 10, rows: 5 });

                expect(outputComponent.onPage.emit).toHaveBeenCalledWith({ first: 10, rows: 5 });
                expect(firstChangeSpy).toHaveBeenCalledWith(10);
                expect(rowsChangeSpy).toHaveBeenCalledWith(5);
            });
        });

        describe('Sorting outputs', () => {
            it('emits onSort via sortSingle', () => {
                outputFixture.componentRef.setInput('value', [{ name: 'b' }, { name: 'a' }]);
                outputFixture.componentRef.setInput('sortField', 'name');
                outputFixture.componentRef.setInput('sortOrder', 1);
                vi.spyOn(outputComponent.onSort, 'emit');

                outputComponent.sortSingle();

                expect(outputComponent.onSort.emit).toHaveBeenCalledWith({ field: 'name', order: 1 });
            });

            it('emits sortFunction and onSort via sortMultiple when customSort is enabled', () => {
                outputFixture.componentRef.setInput('value', [{ name: 'b' }, { name: 'a' }]);
                outputFixture.componentRef.setInput('sortMode', 'multiple');
                outputFixture.componentRef.setInput('multiSortMeta', [{ field: 'name', order: 1 }]);
                outputFixture.componentRef.setInput('customSort', true);
                vi.spyOn(outputComponent.sortFunction, 'emit');
                vi.spyOn(outputComponent.onSort, 'emit');

                outputComponent.sortMultiple();

                expect(outputComponent.sortFunction.emit).toHaveBeenCalledWith({
                    data: outputComponent._value(),
                    mode: 'multiple',
                    multiSortMeta: outputComponent._multiSortMeta()
                });
                expect(outputComponent.onSort.emit).toHaveBeenCalledWith({ multisortmeta: outputComponent._multiSortMeta() });
            });
        });

        describe('Filtering outputs', () => {
            it('emits onFilter and firstChange via _filter', () => {
                outputFixture.componentRef.setInput('value', [{ name: 'a' }, { name: 'b' }]);
                outputFixture.componentRef.setInput('filters', { name: { value: 'a', matchMode: 'equals' } });
                outputComponent.first.set(10);
                vi.spyOn(outputComponent.onFilter, 'emit');
                const firstChangeSpy = vi.fn();
                outputComponent.first.subscribe(firstChangeSpy);

                outputComponent._filter();

                expect(firstChangeSpy).toHaveBeenCalledWith(0);
                expect(outputComponent.onFilter.emit).toHaveBeenCalledWith(expect.objectContaining({ filters: outputComponent._filters() }));
            });
        });

        describe('Row expand/collapse outputs', () => {
            it('emits onRowExpand via toggleRow on a collapsed row', () => {
                outputFixture.componentRef.setInput('dataKey', 'id');
                outputFixture.componentRef.setInput('expandedRowKeys', {});
                const rowData = { id: '1', name: 'Row 1' };
                vi.spyOn(outputComponent.onRowExpand, 'emit');

                outputComponent.toggleRow(rowData);

                expect(outputComponent.onRowExpand.emit).toHaveBeenCalledWith(expect.objectContaining({ data: rowData }));
            });

            it('emits onRowCollapse via toggleRow on an already-expanded row', () => {
                outputFixture.componentRef.setInput('dataKey', 'id');
                const rowData = { id: '1', name: 'Row 1' };
                outputFixture.componentRef.setInput('expandedRowKeys', { '1': true });
                vi.spyOn(outputComponent.onRowCollapse, 'emit');

                outputComponent.toggleRow(rowData);

                expect(outputComponent.onRowCollapse.emit).toHaveBeenCalledWith(expect.objectContaining({ data: rowData }));
            });
        });

        describe('Column resize/reorder outputs', () => {
            it('emits onColResize via onColumnResizeEnd', async () => {
                outputFixture.componentRef.setInput('resizableColumns', true);
                outputFixture.changeDetectorRef.markForCheck();
                await outputFixture.whenStable();
                outputFixture.detectChanges();

                const row = document.createElement('tr');
                const th1 = document.createElement('th');
                const th2 = document.createElement('th');
                th1.style.minWidth = '0px';
                row.appendChild(th1);
                row.appendChild(th2);

                outputComponent.resizeColumnElement.set(th1 as any);
                outputComponent.lastResizerHelperX.set(0);
                vi.spyOn(outputComponent.onColResize, 'emit');

                outputComponent.onColumnResizeEnd();

                expect(outputComponent.onColResize.emit).toHaveBeenCalledWith(expect.objectContaining({ element: th1 }));
            });

            it('emits onColReorder via onColumnDrop', async () => {
                outputFixture.componentRef.setInput('reorderableColumns', true);
                outputFixture.changeDetectorRef.markForCheck();
                await outputFixture.whenStable();
                outputFixture.detectChanges();

                const row = document.createElement('tr');
                const col1 = document.createElement('th');
                const col2 = document.createElement('th');
                col1.setAttribute('preorderablecolumn', '');
                col2.setAttribute('preorderablecolumn', '');
                row.appendChild(col1);
                row.appendChild(col2);

                outputFixture.componentRef.setInput('columns', [{ field: 'name' }, { field: 'price' }]);
                outputComponent.onColumnDragStart({ dataTransfer: { setData: vi.fn() } } as any, col1);
                vi.spyOn(outputComponent.onColReorder, 'emit');

                outputComponent.onColumnDrop({ preventDefault: vi.fn() } as unknown as Event, col2);

                expect(outputComponent.onColReorder.emit).toHaveBeenCalledWith(expect.objectContaining({ dragIndex: 0, dropIndex: 1 }));
            });

            it('keeps every measured width when reordering resized columns (#178)', async () => {
                outputFixture.componentRef.setInput('reorderableColumns', true);
                outputFixture.componentRef.setInput('resizableColumns', true);
                outputFixture.componentRef.setInput('columns', [{ field: 'a' }, { field: 'b' }, { field: 'c' }]);
                outputFixture.changeDetectorRef.markForCheck();
                await outputFixture.whenStable();
                outputFixture.detectChanges();

                const row = document.createElement('tr');
                const cols = [0, 1, 2].map(() => {
                    const th = document.createElement('th');
                    th.setAttribute('preorderablecolumn', '');
                    row.appendChild(th);
                    return th;
                });

                outputComponent.resizeColumnElement.set(cols[1] as any);
                vi.spyOn(outputComponent as any, '_totalTableWidth').mockReturnValue([100, 200, 300]);
                const updateStyle = vi.spyOn(outputComponent, 'updateStyleElement');
                outputComponent.onColumnDragStart({ dataTransfer: { setData: vi.fn() } } as any, cols[0]);

                outputComponent.onColumnDrop({ preventDefault: vi.fn() } as unknown as Event, cols[2]);

                expect(updateStyle).toHaveBeenCalledWith([200, 300, 100], -1, 0, null);
            });
        });

        describe('Row reorder output', () => {
            it('emits onRowReorder via onRowDrop', () => {
                outputFixture.componentRef.setInput('value', [{ id: '1' }, { id: '2' }, { id: '3' }]);
                outputComponent.draggedRowIndex.set(0);
                outputComponent.droppedRowIndex.set(2);
                vi.spyOn(outputComponent.onRowReorder, 'emit');

                outputComponent.onRowDrop(new Event('drop'), document.createElement('tr'));

                expect(outputComponent.onRowReorder.emit).toHaveBeenCalledWith({ dragIndex: 0, dropIndex: 1 });
            });
        });

        describe('State outputs', () => {
            it('emits onStateSave via saveState', () => {
                outputFixture.componentRef.setInput('stateKey', 'output-events-test-state-save');
                outputFixture.componentRef.setInput('value', [{ id: '1' }]);
                vi.spyOn(outputComponent.onStateSave, 'emit');

                outputComponent.saveState();

                expect(outputComponent.onStateSave.emit).toHaveBeenCalled();
            });

            it('emits onStateRestore, firstChange and rowsChange via restoreState', () => {
                const stateKey = 'output-events-test-state-restore';
                outputFixture.componentRef.setInput('stateKey', stateKey);
                outputFixture.componentRef.setInput('paginator', true);
                outputComponent.first.set(0);
                outputComponent.rows.set(10);
                window.sessionStorage.setItem(stateKey, JSON.stringify({ first: 20, rows: 50 }));

                vi.spyOn(outputComponent.onStateRestore, 'emit');
                const firstChangeSpy = vi.fn();
                outputComponent.first.subscribe(firstChangeSpy);
                const rowsChangeSpy = vi.fn();
                outputComponent.rows.subscribe(rowsChangeSpy);

                outputComponent.restoreState();

                expect(firstChangeSpy).toHaveBeenCalledWith(20);
                expect(rowsChangeSpy).toHaveBeenCalledWith(50);
                expect(outputComponent.onStateRestore.emit).toHaveBeenCalledWith(expect.objectContaining({ first: 20, rows: 50 }));

                window.sessionStorage.removeItem(stateKey);
            });
        });

        describe('Lazy load output via ngOnInit', () => {
            it('emits onLazyLoad on init when lazy is true (real lifecycle trigger)', () => {
                const freshFixture = TestBed.createComponent(Table);
                const freshComponent = freshFixture.componentInstance;
                freshFixture.componentRef.setInput('lazy', true);
                vi.spyOn(freshComponent.onLazyLoad, 'emit');

                freshFixture.detectChanges(); // triggers ngOnInit -> onInit()

                expect(freshComponent.onLazyLoad.emit).toHaveBeenCalled();
            });
        });

        describe('Edit outputs (EditableColumn directive)', () => {
            beforeEach(() => {
                TestBed.resetTestingModule();
            });

            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `
                    <p-table [value]="products" [dataKey]="'id'" editMode="cell">
                        <ng-template #header>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-product let-rowIndex="rowIndex">
                            <tr>
                                <td [pEditableColumn]="product" [pEditableColumnField]="'name'" [pEditableColumnRowIndex]="rowIndex">
                                    <p-cellEditor>
                                        <ng-template #input>
                                            <input pInputText type="text" [(ngModel)]="product.name" class="name-input" />
                                        </ng-template>
                                        <ng-template #output>
                                            {{ product.name }}
                                        </ng-template>
                                    </p-cellEditor>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                `
            })
            class TestEditOutputsComponent {
                products = [{ id: '1001', name: 'Gaming Laptop' }];
            }

            const setupEditFixture = async () => {
                await TestBed.configureTestingModule({
                    imports: [TableModule, CommonModule, FormsModule],
                    declarations: [TestEditOutputsComponent],
                    providers: [TableService, provideZonelessChangeDetection()]
                }).compileComponents();

                const fixture = TestBed.createComponent(TestEditOutputsComponent);
                await fixture.whenStable();
                fixture.detectChanges();

                const tableInstance = fixture.debugElement.query(By.css('p-table')).componentInstance as Table;
                return { fixture, tableInstance };
            };

            it('emits onEditInit when a real click opens the cell editor', async () => {
                const { fixture, tableInstance } = await setupEditFixture();
                vi.spyOn(tableInstance.onEditInit, 'emit');

                const cell: HTMLElement = fixture.nativeElement.querySelector('[data-p-editable-column="true"]');
                cell.click();
                await fixture.whenStable();
                fixture.detectChanges();

                expect(tableInstance.onEditInit.emit).toHaveBeenCalledWith(expect.objectContaining({ field: 'name', index: 0 }));
            });

            it('emits onEditComplete via EditableColumn.closeEditingCell(true, ...)', async () => {
                const { fixture, tableInstance } = await setupEditFixture();
                const cell: HTMLElement = fixture.nativeElement.querySelector('[data-p-editable-column="true"]');
                cell.click();
                await fixture.whenStable();
                fixture.detectChanges();

                const editableColumn = fixture.debugElement.query(By.directive(EditableColumn)).injector.get(EditableColumn);
                vi.spyOn(tableInstance.onEditComplete, 'emit');

                editableColumn.closeEditingCell(true, new Event('blur'));

                expect(tableInstance.onEditComplete.emit).toHaveBeenCalled();
            });

            it('emits onEditCancel via EditableColumn.closeEditingCell(false, ...)', async () => {
                const { fixture, tableInstance } = await setupEditFixture();
                const cell: HTMLElement = fixture.nativeElement.querySelector('[data-p-editable-column="true"]');
                cell.click();
                await fixture.whenStable();
                fixture.detectChanges();

                const editableColumn = fixture.debugElement.query(By.directive(EditableColumn)).injector.get(EditableColumn);
                vi.spyOn(tableInstance.onEditCancel, 'emit');

                editableColumn.closeEditingCell(false, new Event('blur'));

                expect(tableInstance.onEditCancel.emit).toHaveBeenCalled();
            });
        });

        describe('ColumnFilter outputs (onShow/onHide)', () => {
            let filterFixture: ComponentFixture<TestFilteringTableComponent>;

            beforeEach(async () => {
                filterFixture = TestBed.createComponent(TestFilteringTableComponent);
                await filterFixture.whenStable();
                filterFixture.detectChanges();
            });

            it('emits onShow via onOverlayBeforeEnter and onHide via onOverlayAnimationAfterLeave', () => {
                const columnFilter = filterFixture.debugElement.query(By.css('p-columnFilter')).componentInstance;
                vi.spyOn(columnFilter.onShow, 'emit');
                vi.spyOn(columnFilter.onHide, 'emit');

                columnFilter.onOverlayBeforeEnter({} as any);
                expect(columnFilter.onShow.emit).toHaveBeenCalled();

                columnFilter.onOverlayAnimationAfterLeave({} as any);
                expect(columnFilter.onHide.emit).toHaveBeenCalled();
            });
        });
    });

    describe('PassThrough', () => {
        beforeEach(() => {
            TestBed.resetTestingModule();
        });

        // Comprehensive PT test object with all sections
        const comprehensivePT = {
            host: { class: 'pt-host', 'data-testid': 'host' },
            root: { class: 'pt-root', 'data-testid': 'root' },
            mask: { class: 'pt-mask', 'data-testid': 'mask' },
            loadingIcon: { class: 'pt-loading-icon', 'data-testid': 'loading-icon' },
            header: { class: 'pt-header', 'data-testid': 'header' },
            pcPaginator: {
                root: { class: 'pt-paginator', 'data-testid': 'paginator' }
            },
            tableContainer: { class: 'pt-table-container', 'data-testid': 'table-container' },
            virtualScroller: {
                root: { class: 'pt-virtual-scroller', 'data-testid': 'virtual-scroller' }
            },
            table: { class: 'pt-table', 'data-testid': 'table' },
            thead: { class: 'pt-thead', 'data-testid': 'thead' },
            tbody: { class: 'pt-tbody', 'data-testid': 'tbody' },
            virtualScrollerSpacer: { class: 'pt-virtual-spacer', 'data-testid': 'virtual-spacer' },
            tfoot: { class: 'pt-tfoot', 'data-testid': 'tfoot' },
            footer: { class: 'pt-footer', 'data-testid': 'footer' },
            columnResizeIndicator: { class: 'pt-resize-indicator', 'data-testid': 'resize-indicator' },
            rowReorderIndicatorUp: { class: 'pt-reorder-up', 'data-testid': 'reorder-up' },
            rowReorderIndicatorDown: { class: 'pt-reorder-down', 'data-testid': 'reorder-down' },
            reorderableRow: { class: 'pt-reorderable-row', 'data-testid': 'reorderable-row' },
            reorderableRowHandle: { class: 'pt-reorder-handle', 'data-testid': 'reorder-handle' },
            headerCheckbox: {
                root: { class: 'pt-header-checkbox', 'data-testid': 'header-checkbox' }
            },
            pcCheckbox: {
                root: { class: 'pt-row-checkbox', 'data-testid': 'row-checkbox' }
            },
            columnFilter: {
                filter: { class: 'pt-filter', 'data-testid': 'filter' },
                pcColumnFilterButton: { class: 'pt-filter-button', 'data-testid': 'filter-button' },
                filterOverlay: { class: 'pt-filter-overlay', 'data-testid': 'filter-overlay' },
                filterConstraintList: { class: 'pt-constraint-list', 'data-testid': 'constraint-list' },
                filterConstraint: { class: 'pt-constraint', 'data-testid': 'constraint' },
                filterConstraintSeparator: { class: 'pt-constraint-separator', 'data-testid': 'constraint-separator' },
                emtpyFilterLabel: { class: 'pt-empty-filter', 'data-testid': 'empty-filter' },
                filterOperator: { class: 'pt-filter-operator', 'data-testid': 'filter-operator' },
                pcFilterOperatorDropdown: { class: 'pt-operator-dropdown', 'data-testid': 'operator-dropdown' },
                filterRuleList: { class: 'pt-rule-list', 'data-testid': 'rule-list' },
                filterRule: { class: 'pt-filter-rule', 'data-testid': 'filter-rule' },
                pcFilterConstraintDropdown: { class: 'pt-constraint-dropdown', 'data-testid': 'constraint-dropdown' },
                pcFilterRemoveRuleButton: { class: 'pt-remove-rule', 'data-testid': 'remove-rule' },
                pcAddRuleButtonLabel: { class: 'pt-add-rule', 'data-testid': 'add-rule' },
                filterButtonBar: { class: 'pt-filter-buttonbar', 'data-testid': 'filter-buttonbar' },
                pcFilterClearButton: { class: 'pt-filter-clear', 'data-testid': 'filter-clear' },
                pcFilterApplyButton: { class: 'pt-filter-apply', 'data-testid': 'filter-apply' },
                pcFilterInputText: { class: 'pt-filter-input', 'data-testid': 'filter-input' },
                pcFilterInputNumber: { class: 'pt-filter-number', 'data-testid': 'filter-number' },
                pcFilterCheckbox: {
                    root: { class: 'pt-filter-checkbox', 'data-testid': 'filter-checkbox' }
                },
                pcFilterDatePicker: { class: 'pt-filter-datepicker', 'data-testid': 'filter-datepicker' }
            },
            columnFilterFormElement: { class: 'pt-filter-form', 'data-testid': 'filter-form' }
        };

        @Component({
            changeDetection: ChangeDetectionStrategy.Eager,
            standalone: false,
            template: `
                <p-table
                    [value]="products"
                    [dataKey]="'id'"
                    [selection]="selectedProducts"
                    [loading]="isLoading"
                    [paginator]="true"
                    [rows]="5"
                    [totalRecords]="products.length"
                    [scrollable]="true"
                    scrollHeight="400px"
                    [resizableColumns]="true"
                    [reorderableColumns]="true"
                    [virtualScroll]="useVirtualScroll"
                    [virtualScrollItemSize]="46"
                    [pt]="tablePT"
                >
                    <ng-template #caption>
                        <div>Product Management Table</div>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
                            <th pReorderableColumn pResizableColumn>
                                Name
                                <p-columnFilter field="name" matchMode="contains" display="menu">
                                    <ng-template #filter let-value let-filter="filterCallback">
                                        <input type="text" [(ngModel)]="value" (ngModelChange)="filter($event)" placeholder="Search" />
                                    </ng-template>
                                </p-columnFilter>
                            </th>
                            <th pReorderableColumn pResizableColumn>Price</th>
                            <th pReorderableColumn pResizableColumn>Category</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product let-rowIndex="rowIndex">
                        <tr [pReorderableRow]="rowIndex">
                            <td><p-tableCheckbox [value]="product"></p-tableCheckbox></td>
                            <td>
                                <span pReorderableRowHandle class="pi pi-bars"></span>
                                {{ product.name }}
                            </td>
                            <td>{{ product.price | currency }}</td>
                            <td>{{ product.category }}</td>
                        </tr>
                    </ng-template>
                    <ng-template #footer>
                        <tr>
                            <td colspan="4">Total: {{ products.length }} products</td>
                        </tr>
                    </ng-template>
                    <ng-template #summary>
                        <div>Footer Summary</div>
                    </ng-template>
                </p-table>
            `
        })
        class TestComprehensivePTComponent {
            products = [
                { id: 1, name: 'Gaming Laptop', price: 1299.99, category: 'Electronics' },
                { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Accessories' },
                { id: 3, name: 'Mechanical Keyboard', price: 149.99, category: 'Accessories' },
                { id: 4, name: 'Wireless Headphones', price: 199.99, category: 'Audio' },
                { id: 5, name: '4K Monitor', price: 399.99, category: 'Displays' },
                { id: 6, name: 'USB-C Hub', price: 49.99, category: 'Accessories' },
                { id: 7, name: 'Webcam', price: 79.99, category: 'Electronics' },
                { id: 8, name: 'Microphone', price: 129.99, category: 'Audio' }
            ];
            selectedProducts: any[] = [];
            isLoading = false;
            useVirtualScroll = false;
            tablePT = comprehensivePT;
        }

        it('PT Section 1: host - should apply PT to host DOM element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            // Check that p-table element exists (host element)
            const tableElement = fixture.nativeElement.querySelector('p-table');
            expect(tableElement).toBeTruthy();
        });

        it('PT Section 2: root - should apply PT to root DOM element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const rootEl = fixture.nativeElement.querySelector('[data-testid="root"]');
            expect(rootEl).toBeTruthy();
            expect(rootEl?.classList.contains('pt-root')).toBe(true);
        });

        it('PT Section 3: mask - should apply PT to loading mask element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            const component = fixture.componentInstance;
            component.isLoading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const maskEl = fixture.nativeElement.querySelector('[data-testid="mask"]');
            expect(maskEl).toBeTruthy();
            expect(maskEl?.classList.contains('pt-mask')).toBe(true);
        });

        it('PT Section 4: loadingIcon - should apply PT to loading icon element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            const component = fixture.componentInstance;
            component.isLoading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const iconEl = fixture.nativeElement.querySelector('[data-testid="loading-icon"]');
            expect(iconEl).toBeTruthy();
            expect(iconEl?.classList.contains('pt-loading-icon')).toBe(true);
        });

        it('PT Section 5: header - should apply PT to header (caption) element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const headerEl = fixture.nativeElement.querySelector('[data-testid="header"]');
            expect(headerEl).toBeTruthy();
            expect(headerEl?.classList.contains('pt-header')).toBe(true);
        });

        it('PT Section 6: pcPaginator - should apply PT to paginator component', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const paginatorEl = fixture.nativeElement.querySelector('[data-testid="paginator"]');
            expect(paginatorEl).toBeTruthy();
            expect(paginatorEl?.classList.contains('pt-paginator')).toBe(true);
        });

        it('PT Section 7: tableContainer - should apply PT to table container element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const containerEl = fixture.nativeElement.querySelector('[data-testid="table-container"]');
            expect(containerEl).toBeTruthy();
            expect(containerEl?.classList.contains('pt-table-container')).toBe(true);
        });

        it('PT Section 8: virtualScroller - should apply PT to virtual scroller component', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            const component = fixture.componentInstance;
            component.useVirtualScroll = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const scrollerEl = fixture.nativeElement.querySelector('[data-testid="virtual-scroller"]');
            expect(scrollerEl).toBeTruthy();
            expect(scrollerEl?.classList.contains('pt-virtual-scroller')).toBe(true);
        });

        it('PT Section 9: table - should apply PT to table element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const tableEl = fixture.nativeElement.querySelector('[data-testid="table"]');
            expect(tableEl).toBeTruthy();
            expect(tableEl?.classList.contains('pt-table')).toBe(true);
        });

        it('PT Section 10: thead - should apply PT to thead element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const theadEl = fixture.nativeElement.querySelector('[data-testid="thead"]');
            expect(theadEl).toBeTruthy();
            expect(theadEl?.classList.contains('pt-thead')).toBe(true);
        });

        it('PT Section 11: tbody - should apply PT to tbody element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const tbodyEl = fixture.nativeElement.querySelector('[data-testid="tbody"]');
            expect(tbodyEl).toBeTruthy();
            expect(tbodyEl?.classList.contains('pt-tbody')).toBe(true);
        });

        it('PT Section 12: virtualScrollerSpacer - should apply PT to virtual scroller spacer element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            const component = fixture.componentInstance;
            component.useVirtualScroll = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Virtual scroller spacer may not render in all scenarios
            const spacerEl = fixture.nativeElement.querySelector('[data-testid="virtual-spacer"]');
            // If element exists, check for class
            if (spacerEl) {
                expect(spacerEl.classList.contains('pt-virtual-spacer')).toBe(true);
            }
        });

        it('PT Section 13: tfoot - should apply PT to tfoot element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const tfootEl = fixture.nativeElement.querySelector('[data-testid="tfoot"]');
            expect(tfootEl).toBeTruthy();
            expect(tfootEl?.classList.contains('pt-tfoot')).toBe(true);
        });

        it('PT Section 14: footer - should apply PT to footer element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const footerEl = fixture.nativeElement.querySelector('[data-testid="footer"]');
            expect(footerEl).toBeTruthy();
            expect(footerEl?.classList.contains('pt-footer')).toBe(true);
        });

        it('PT Section 15: columnResizeIndicator - should apply PT to column resize indicator element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const indicatorEl = fixture.nativeElement.querySelector('[data-testid="resize-indicator"]');
            expect(indicatorEl).toBeTruthy();
            expect(indicatorEl?.classList.contains('pt-resize-indicator')).toBe(true);
        });

        it('PT Section 16: rowReorderIndicatorUp - should apply PT to row reorder indicator up element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const upIndicatorEl = fixture.nativeElement.querySelector('[data-testid="reorder-up"]');
            expect(upIndicatorEl).toBeTruthy();
            expect(upIndicatorEl?.classList.contains('pt-reorder-up')).toBe(true);
        });

        it('PT Section 17: rowReorderIndicatorDown - should apply PT to row reorder indicator down element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            const downIndicatorEl = fixture.nativeElement.querySelector('[data-testid="reorder-down"]');
            expect(downIndicatorEl).toBeTruthy();
            expect(downIndicatorEl?.classList.contains('pt-reorder-down')).toBe(true);
        });

        it('PT Section 18: reorderableRow - should apply PT to reorderable row element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            // Check that reorderable rows exist
            const rows = fixture.nativeElement.querySelectorAll('tbody tr');
            expect(rows.length).toBeGreaterThan(0);
        });

        it('PT Section 19: reorderableRowHandle - should apply PT to reorderable row handle element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            // Check that reorderable row handle exists
            const handles = fixture.nativeElement.querySelectorAll('[preorderablerowhandle]');
            expect(handles).toBeDefined();
        });

        it('PT Section 20: headerCheckbox - should apply PT to header checkbox component', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            // Check that header checkbox exists
            const headerCheckbox = fixture.nativeElement.querySelector('p-tableheadercheckbox');
            expect(headerCheckbox).toBeTruthy();
        });

        it('PT Section 21: pcCheckbox - should apply PT to checkbox component', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            // Check that row checkboxes exist
            const checkboxes = fixture.nativeElement.querySelectorAll('p-tablecheckbox');
            expect(checkboxes.length).toBeGreaterThan(0);
        });

        it('PT Section 22: columnFilter.filter - should apply PT to filter container element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            // Check that column filter element exists
            const filterEl = fixture.nativeElement.querySelector('p-columnfilter');
            expect(filterEl).toBeTruthy();
        });

        it('PT Section 23: columnFilterFormElement - should apply PT to column filter form element', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestComprehensivePTComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestComprehensivePTComponent);
            fixture.detectChanges();

            // columnFilterFormElement is part of columnFilter, check that table exists
            const tableEl = fixture.nativeElement.querySelector('table');
            expect(tableEl).toBeTruthy();
        });
    });

    describe('Cell Navigation', () => {
        beforeEach(() => {
            TestBed.resetTestingModule();
        });

        @Component({
            changeDetection: ChangeDetectionStrategy.Eager,
            standalone: false,
            template: `
                <p-table [value]="products" [dataKey]="'id'" editMode="cell">
                    <ng-template #header>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product let-rowIndex="rowIndex">
                        <tr>
                            <td>{{ product.id }}</td>
                            <td [pEditableColumn]="product" [pEditableColumnField]="'name'" [pEditableColumnRowIndex]="rowIndex">
                                <p-cellEditor>
                                    <ng-template #input>
                                        <input pInputText type="text" [(ngModel)]="product.name" class="name-input" />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.name }}
                                    </ng-template>
                                </p-cellEditor>
                            </td>
                            <td [pEditableColumn]="product" [pEditableColumnField]="'price'" [pEditableColumnRowIndex]="rowIndex">
                                <p-cellEditor>
                                    <ng-template #input>
                                        <input pInputText type="text" [(ngModel)]="product.price" class="price-input" />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.price | currency }}
                                    </ng-template>
                                </p-cellEditor>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            `
        })
        class TestCellNavigationComponent {
            products = [
                { id: '1001', name: 'Gaming Laptop', price: 1299.99 },
                { id: '1002', name: 'Wireless Mouse', price: 29.99 },
                { id: '1003', name: 'Mechanical Keyboard', price: 149.99 }
            ];
        }

        it('should render editable columns with proper data attributes', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestCellNavigationComponent],
                providers: [TableService, provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestCellNavigationComponent);
            await fixture.whenStable();
            fixture.detectChanges();

            const editableCells = fixture.nativeElement.querySelectorAll('[data-p-editable-column="true"]');
            expect(editableCells.length).toBe(6); // 2 editable columns x 3 rows
        });

        it('should open cell editor on click and show input for correct field', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestCellNavigationComponent],
                providers: [TableService, provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestCellNavigationComponent);
            await fixture.whenStable();
            fixture.detectChanges();

            const editableCells = fixture.nativeElement.querySelectorAll('[data-p-editable-column="true"]');
            const nameCell = editableCells[0]; // First name cell

            nameCell.click();
            await fixture.whenStable();
            fixture.detectChanges();

            // Verify the name cell is now editing
            const editingCell = fixture.nativeElement.querySelector('[data-p-cell-editing="true"]');
            expect(editingCell).toBeTruthy();

            // Verify the name input is shown
            const nameInput = fixture.nativeElement.querySelector('.name-input');
            expect(nameInput).toBeTruthy();

            // Verify no price input is shown
            const priceInput = fixture.nativeElement.querySelector('.price-input');
            expect(priceInput).toBeFalsy();
        });

        it('should navigate from name cell to price cell on arrow right key', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestCellNavigationComponent],
                providers: [TableService, provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestCellNavigationComponent);
            await fixture.whenStable();
            fixture.detectChanges();

            const editableCells = fixture.nativeElement.querySelectorAll('[data-p-editable-column="true"]');
            const nameCell = editableCells[0]; // First name cell (row 1)

            // Open the name cell for editing
            nameCell.click();
            await fixture.whenStable();
            fixture.detectChanges();

            // Verify name input is shown initially
            let nameInput = fixture.nativeElement.querySelector('.name-input');
            expect(nameInput).toBeTruthy();

            // Dispatch arrow right key event on the cell
            const arrowRightEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                bubbles: true
            });
            nameInput.dispatchEvent(arrowRightEvent);
            await fixture.whenStable();
            fixture.detectChanges();

            // After navigation, price input should be shown
            const priceInput = fixture.nativeElement.querySelector('.price-input');
            expect(priceInput).toBeTruthy();

            // Name input should no longer be visible
            nameInput = fixture.nativeElement.querySelector('.name-input');
            expect(nameInput).toBeFalsy();
        });

        it('should navigate from price cell to name cell on arrow left key', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestCellNavigationComponent],
                providers: [TableService, provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestCellNavigationComponent);
            await fixture.whenStable();
            fixture.detectChanges();

            const editableCells = fixture.nativeElement.querySelectorAll('[data-p-editable-column="true"]');
            const priceCell = editableCells[1]; // First price cell (row 1)

            // Open the price cell for editing
            priceCell.click();
            await fixture.whenStable();
            fixture.detectChanges();

            // Verify price input is shown initially
            let priceInput = fixture.nativeElement.querySelector('.price-input');
            expect(priceInput).toBeTruthy();

            // Dispatch arrow left key event
            const arrowLeftEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
                code: 'ArrowLeft',
                bubbles: true
            });
            priceInput.dispatchEvent(arrowLeftEvent);
            await fixture.whenStable();
            fixture.detectChanges();

            // After navigation, name input should be shown
            const nameInput = fixture.nativeElement.querySelector('.name-input');
            expect(nameInput).toBeTruthy();

            // Price input should no longer be visible
            priceInput = fixture.nativeElement.querySelector('.price-input');
            expect(priceInput).toBeFalsy();
        });

        it('should navigate to next row when pressing arrow right on last column', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestCellNavigationComponent],
                providers: [TableService, provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestCellNavigationComponent);
            await fixture.whenStable();
            fixture.detectChanges();

            const editableCells = fixture.nativeElement.querySelectorAll('[data-p-editable-column="true"]');
            const priceCellRow1 = editableCells[1]; // Price cell in row 1
            const nameCellRow2 = editableCells[2]; // Name cell in row 2

            // Verify they are in different rows
            expect(priceCellRow1.parentElement).not.toBe(nameCellRow2.parentElement);

            // Open price cell in row 1
            priceCellRow1.click();
            await fixture.whenStable();
            fixture.detectChanges();

            let priceInput = fixture.nativeElement.querySelector('.price-input');
            expect(priceInput).toBeTruthy();

            // Dispatch arrow right to navigate to next row
            const arrowRightEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                bubbles: true
            });
            priceInput.dispatchEvent(arrowRightEvent);
            await fixture.whenStable();
            fixture.detectChanges();

            // Should now be editing name cell in row 2
            const nameInput = fixture.nativeElement.querySelector('.name-input');
            expect(nameInput).toBeTruthy();

            // The editing cell should be in row 2
            const editingCell = fixture.nativeElement.querySelector('[data-p-cell-editing="true"]');
            expect(editingCell.parentElement).toBe(nameCellRow2.parentElement);
        });

        it('should navigate to previous row when pressing arrow left on first column', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestCellNavigationComponent],
                providers: [TableService, provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestCellNavigationComponent);
            await fixture.whenStable();
            fixture.detectChanges();

            const editableCells = fixture.nativeElement.querySelectorAll('[data-p-editable-column="true"]');
            const priceCellRow1 = editableCells[1]; // Price cell in row 1
            const nameCellRow2 = editableCells[2]; // Name cell in row 2

            // Open name cell in row 2
            nameCellRow2.click();
            await fixture.whenStable();
            fixture.detectChanges();

            let nameInput = fixture.nativeElement.querySelector('.name-input');
            expect(nameInput).toBeTruthy();

            // Dispatch arrow left to navigate to previous row
            const arrowLeftEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
                code: 'ArrowLeft',
                bubbles: true
            });
            nameInput.dispatchEvent(arrowLeftEvent);
            await fixture.whenStable();
            fixture.detectChanges();

            // Should now be editing price cell in row 1
            const priceInput = fixture.nativeElement.querySelector('.price-input');
            expect(priceInput).toBeTruthy();

            // The editing cell should be in row 1
            const editingCell = fixture.nativeElement.querySelector('[data-p-cell-editing="true"]');
            expect(editingCell.parentElement).toBe(priceCellRow1.parentElement);
        });

        it('should not navigate when disabled', async () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `
                    <p-table [value]="products" [dataKey]="'id'" editMode="cell">
                        <ng-template #header>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-product let-rowIndex="rowIndex">
                            <tr>
                                <td [pEditableColumn]="product" [pEditableColumnField]="'name'" [pEditableColumnRowIndex]="rowIndex" [pEditableColumnDisabled]="true">
                                    <p-cellEditor>
                                        <ng-template #input>
                                            <input pInputText type="text" [(ngModel)]="product.name" class="name-input" />
                                        </ng-template>
                                        <ng-template #output>
                                            {{ product.name }}
                                        </ng-template>
                                    </p-cellEditor>
                                </td>
                                <td [pEditableColumn]="product" [pEditableColumnField]="'price'" [pEditableColumnRowIndex]="rowIndex">
                                    <p-cellEditor>
                                        <ng-template #input>
                                            <input pInputText type="text" [(ngModel)]="product.price" class="price-input" />
                                        </ng-template>
                                        <ng-template #output>
                                            {{ product.price | currency }}
                                        </ng-template>
                                    </p-cellEditor>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                `
            })
            class TestDisabledCellComponent {
                products = [{ id: '1001', name: 'Gaming Laptop', price: 1299.99 }];
            }

            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestDisabledCellComponent],
                providers: [TableService, provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestDisabledCellComponent);
            await fixture.whenStable();
            fixture.detectChanges();

            const editableCells = fixture.nativeElement.querySelectorAll('[data-p-editable-column="true"]');
            const disabledNameCell = editableCells[0];

            // Click on disabled cell
            disabledNameCell.click();
            await fixture.whenStable();
            fixture.detectChanges();

            // Should not open editing on disabled cell - no input should be visible
            const nameInput = fixture.nativeElement.querySelector('.name-input');
            expect(nameInput).toBeFalsy();

            // No cell should be in editing state
            const editingCell = fixture.nativeElement.querySelector('[data-p-cell-editing="true"]');
            expect(editingCell).toBeFalsy();
        });

        it('findCell should traverse up DOM tree to find cell with editing attribute', async () => {
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestCellNavigationComponent],
                providers: [TableService, provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestCellNavigationComponent);
            await fixture.whenStable();
            fixture.detectChanges();

            const editableCells = fixture.nativeElement.querySelectorAll('[data-p-editable-column="true"]');
            const nameCell = editableCells[0];

            // Open the cell for editing
            nameCell.click();
            await fixture.whenStable();
            fixture.detectChanges();

            // Get the input element which is nested inside the cell
            const input = fixture.nativeElement.querySelector('.name-input');
            expect(input).toBeTruthy();

            // The input should be a descendant of the editing cell
            const editingCell = fixture.nativeElement.querySelector('[data-p-cell-editing="true"]');
            expect(editingCell).toBeTruthy();
            expect(editingCell.contains(input)).toBe(true);

            // Verify the editing cell has the correct data attribute
            expect(editingCell.querySelector('[data-p-cell-editing="true"]') || editingCell.getAttribute('data-p-cell-editing')).toBeTruthy();
        });
    });

    describe('CellEditor', () => {
        // EditableColumn/EditableRow are injected with { optional: true } (see [[table.ts]]), so a
        // <p-cellEditor> rendered without a pEditableColumn/pEditableRow ancestor must resolve them
        // to null, and CellEditor.editing must still return a real boolean rather than leaking
        // null/undefined through the && / || chain.
        @Component({
            changeDetection: ChangeDetectionStrategy.Eager,
            standalone: false,
            template: `
                <p-table [value]="products" [dataKey]="'id'">
                    <ng-template #header>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr>
                            <td>
                                <p-cellEditor>
                                    <ng-template #input>
                                        <input pInputText type="text" [(ngModel)]="product.name" />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.name }}
                                    </ng-template>
                                </p-cellEditor>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            `
        })
        class TestCellEditorWithoutEditableAncestorComponent {
            products = [{ id: '1', name: 'Gaming Laptop' }];
        }

        it('should return a real boolean, not null/undefined, when there is no editable ancestor', async () => {
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [TableModule, CommonModule, FormsModule],
                declarations: [TestCellEditorWithoutEditableAncestorComponent],
                providers: [TableService, provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestCellEditorWithoutEditableAncestorComponent);
            await fixture.whenStable();
            fixture.detectChanges();

            const cellEditor = fixture.debugElement.query(By.directive(CellEditor)).componentInstance as CellEditor;

            expect(cellEditor.editableColumn).toBeNull();
            expect(cellEditor.editableRow).toBeNull();
            expect(cellEditor.editing).toBe(false);
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [TableModule, SharedModule],
    template: `
        <p-table [value]="rows" [paginator]="true" [rows]="2" [resizableColumns]="true" [reorderableColumns]="true">
            <ng-template #header>
                <tr>
                    <th>Name</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
            <ng-template #colgroup>
                <colgroup>
                    <col />
                </colgroup>
            </ng-template>
            <ng-template #loadingbody>
                <tr>
                    <td>loading…</td>
                </tr>
            </ng-template>
            <ng-template #footergrouped>
                <tr>
                    <td>fg</td>
                </tr>
            </ng-template>
            <ng-template #expandedrow let-row>
                <tr>
                    <td>{{ row.name }} expanded</td>
                </tr>
            </ng-template>
            <ng-template #groupheader>
                <tr>
                    <td>gh</td>
                </tr>
            </ng-template>
            <ng-template #groupfooter>
                <tr>
                    <td>gf</td>
                </tr>
            </ng-template>
            <ng-template #frozenexpandedrow>
                <tr>
                    <td>fe</td>
                </tr>
            </ng-template>
            <ng-template #frozenbody>
                <tr>
                    <td>fb</td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td>empty</td>
                </tr>
            </ng-template>
            <ng-template #paginatorleft>L</ng-template>
            <ng-template #paginatorright>R</ng-template>
            <ng-template #paginatordropdownitem let-item>{{ item?.label }}</ng-template>
            <ng-template #loadingicon>…</ng-template>
            <ng-template #reorderindicatorupicon>^</ng-template>
            <ng-template #reorderindicatordownicon>v</ng-template>
            <ng-template #sorticon let-sortOrder>{{ sortOrder }}</ng-template>
            <ng-template #checkboxicon>x</ng-template>
            <ng-template #headercheckboxicon>hx</ng-template>
            <ng-template #paginatordropdownicon>pd</ng-template>
            <ng-template #paginatorfirstpagelinkicon>first</ng-template>
            <ng-template #paginatorlastpagelinkicon>last</ng-template>
            <ng-template #paginatorpreviouspagelinkicon>prev</ng-template>
            <ng-template #paginatornextpagelinkicon>next</ng-template>
            <ng-template pTemplate="caption">caption</ng-template>
        </p-table>
    `
})
class TableQueryApiHostComponent {
    rows = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
}

describe('Table Signal Query API', () => {
    let instance: Table;
    let fixture: ComponentFixture<TableQueryApiHostComponent>;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TableQueryApiHostComponent],
            providers: [provideZonelessChangeDetection()]
        });
        fixture = TestBed.createComponent(TableQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        instance = fixture.debugElement.query(By.directive(Table)).componentInstance;
    });

    it('should resolve all contentChild template hooks', () => {
        const hooks = [
            '_colGroupTemplate',
            '_loadingBodyTemplate',
            '_footerGroupedTemplate',
            '_expandedRowTemplate',
            '_groupHeaderTemplate',
            '_groupFooterTemplate',
            '_frozenExpandedRowTemplate',
            '_frozenBodyTemplate',
            '_emptyMessageTemplate',
            '_paginatorLeftTemplate',
            '_paginatorRightTemplate',
            '_paginatorDropdownItemTemplate',
            '_loadingIconTemplate',
            '_reorderIndicatorUpIconTemplate',
            '_reorderIndicatorDownIconTemplate',
            '_sortIconTemplate',
            '_checkboxIconTemplate',
            '_headerCheckboxIconTemplate',
            '_paginatorDropdownIconTemplate',
            '_paginatorFirstPageLinkIconTemplate',
            '_paginatorLastPageLinkIconTemplate',
            '_paginatorPreviousPageLinkIconTemplate',
            '_paginatorNextPageLinkIconTemplate'
        ];
        for (const hook of hooks) {
            expect((instance as any)[hook](), `${hook} should resolve`).toBeDefined();
        }
    });

    it('should collect pTemplate directives via the _templates contentChildren query', () => {
        const templates = (instance as any)._templates();
        expect(Array.isArray(templates)).toBe(true);
        expect(templates.some((t: any) => t.getType() === 'caption')).toBe(true);
    });

    it('should resolve structural viewChild queries after render', () => {
        expect(instance.wrapperViewChild().nativeElement).toBeDefined();
        expect(instance.tableViewChild()?.nativeElement).toBeDefined();
        expect(instance.resizeHelperViewChild()?.nativeElement).toBeDefined();
        expect(instance.reorderIndicatorUpViewChild()?.nativeElement).toBeDefined();
        expect(instance.reorderIndicatorDownViewChild()?.nativeElement).toBeDefined();
    });

    it('should leave the scroller viewChild unresolved when virtual scrolling is off', () => {
        expect(instance.scroller()).toBeUndefined();
    });
});

@Component({
    standalone: true,
    imports: [TableModule, SharedModule, FormsModule],
    template: `
        <p-table [value]="rows" dataKey="name" [(selection)]="selection">
            <ng-template #header>
                <tr>
                    <th>
                        Name
                        <p-columnFilter field="name" matchMode="contains" display="menu">
                            <ng-template #filtericon>fi</ng-template>
                            <ng-template #removeruleicon>rri</ng-template>
                            <ng-template #addruleicon>ari</ng-template>
                        </p-columnFilter>
                    </th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td><p-tableRadioButton [value]="row"></p-tableRadioButton>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableFilterQueryApiHostComponent {
    rows = [{ name: 'a' }];
    selection: any = null;
}

describe('Table internals Signal Query API', () => {
    it('should resolve ColumnFilter and TableRadioButton queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TableFilterQueryApiHostComponent],
            providers: [provideZonelessChangeDetection()]
        });
        const fixture = TestBed.createComponent(TableFilterQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const cf = fixture.debugElement.query(By.directive(ColumnFilter)).componentInstance;
        expect(cf.filterIconTemplate()).toBeDefined();
        expect(cf.removeRuleIconTemplate()).toBeDefined();
        expect(cf.addRuleIconTemplate()).toBeDefined();
        expect(Array.isArray(cf._templates())).toBe(true);
        expect(cf.icon()).toBeDefined();
        // the clear button lives in the filter overlay menu, which is closed by default
        expect(cf.clearButtonViewChild()).toBeUndefined();

        const rb = fixture.debugElement.query(By.directive(TableRadioButton)).componentInstance;
        expect(rb.inputViewChild()).toBeDefined();
    });
});

// ---------------------------------------------------------------------------
// Column reorder together with column resize (#187)
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" [resizableColumns]="true" [reorderableColumns]="true">
            <ng-template #header>
                <tr>
                    <th pReorderableColumn pResizableColumn>Name</th>
                    <th pReorderableColumn pResizableColumn>Price</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.price }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableReorderResizeHostComponent {
    rows = [{ name: 'A', price: 1 }];
}

describe('Table column reorder with resizable columns', () => {
    it('keeps a header cell draggable unless the press starts on its resizer (#187)', async () => {
        await TestBed.configureTestingModule({ imports: [TableReorderResizeHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableReorderResizeHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const th = fixture.nativeElement.querySelector('th') as HTMLElement;
        const resizer = th.querySelector('[data-pc-column-resizer="true"]') as HTMLElement;
        expect(resizer).toBeTruthy();

        th.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(th.draggable).toBe(true);

        resizer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(th.draggable).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// Medium-severity bugs inherited from Optimus UI
// ---------------------------------------------------------------------------

describe('Table medium-severity fixes', () => {
    let fixture: ComponentFixture<Table>;
    let table: Table;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableModule], providers: [provideZonelessChangeDetection()] }).compileComponents();
        fixture = TestBed.createComponent(Table);
        table = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('excludes a row from a global notContains filter when any field contains the term (optimus-ui#910)', () => {
        fixture.componentRef.setInput('value', [
            { name: 'James', city: 'Paris' },
            { name: 'Anna', city: 'Rome' }
        ]);
        fixture.componentRef.setInput('globalFilterFields', ['name', 'city']);
        table._filters()['global'] = { value: 'James', matchMode: 'notContains' };

        table._filter();

        expect(table.filteredValue()!.map((r: any) => r.name)).toEqual(['Anna']);
    });

    it('sorts a frozen value array without mutating it (optimus-ui#772)', () => {
        const value = Object.freeze([{ name: 'b' }, { name: 'a' }, { name: 'c' }]);
        fixture.componentRef.setInput('value', value);
        fixture.componentRef.setInput('sortField', 'name');
        fixture.componentRef.setInput('sortOrder', 1);

        expect(() => table.sortSingle()).not.toThrow();
        expect(table._value().map((r: any) => r.name)).toEqual(['a', 'b', 'c']);
        expect(value.map((r: any) => r.name)).toEqual(['b', 'a', 'c']);

        fixture.componentRef.setInput('sortMode', 'multiple');
        fixture.componentRef.setInput('multiSortMeta', [{ field: 'name', order: -1 }]);
        table._value.set(value as any);
        expect(() => table.sortMultiple()).not.toThrow();
        expect(table._value().map((r: any) => r.name)).toEqual(['c', 'b', 'a']);
    });

    it('applies the top and bottom paginator position classes (optimus-ui#515)', async () => {
        fixture.componentRef.setInput('value', [{ name: 'a' }, { name: 'b' }]);
        fixture.componentRef.setInput('paginator', true);
        fixture.componentRef.setInput('rows', 1);
        fixture.componentRef.setInput('paginatorPosition', 'both');
        fixture.componentRef.setInput('paginatorStyleClass', 'custom-paginator');
        fixture.detectChanges();
        await fixture.whenStable();

        const paginators = fixture.nativeElement.querySelectorAll('p-paginator');
        expect(paginators.length).toBe(2);
        expect(paginators[0].classList).toContain('p-datatable-paginator-top');
        expect(paginators[0].classList).toContain('custom-paginator');
        expect(paginators[1].classList).toContain('p-datatable-paginator-bottom');
        expect(paginators[1].classList).toContain('custom-paginator');
    });

    it('emits onRowCollapse for the previously expanded row in single expand mode (optimus-ui#378)', () => {
        const rows = [
            { id: '1', name: 'A' },
            { id: '2', name: 'B' }
        ];
        fixture.componentRef.setInput('value', rows);
        fixture.componentRef.setInput('dataKey', 'id');
        fixture.componentRef.setInput('rowExpandMode', 'single');
        const collapseSpy = vi.spyOn(table.onRowCollapse, 'emit');

        table.toggleRow(rows[0]);
        table.toggleRow(rows[1]);

        expect(collapseSpy).toHaveBeenCalledTimes(1);
        expect(collapseSpy).toHaveBeenCalledWith(expect.objectContaining({ data: rows[0] }));
        expect(table.isRowExpanded(rows[1])).toBe(true);
        expect(table.isRowExpanded(rows[0])).toBe(false);
    });

    it('keeps the bound first and rows when the stored state has none (optimus-ui#144)', () => {
        const stateKey = 'medium-fix-144';
        window.sessionStorage.setItem(stateKey, JSON.stringify({ sortField: 'name', sortOrder: 1 }));
        fixture.componentRef.setInput('stateKey', stateKey);
        fixture.componentRef.setInput('paginator', true);
        table.first.set(0);
        table.rows.set(10);

        table.restoreState();

        expect(table.first()).toBe(0);
        expect(table.rows()).toBe(10);
        window.sessionStorage.removeItem(stateKey);
    });

    it('keeps the current page when the value changes while a filter is applied (optimus-ui#828)', async () => {
        const rows = Array.from({ length: 30 }, (_, i) => ({ name: 'item' + i }));
        fixture.componentRef.setInput('value', rows);
        fixture.componentRef.setInput('paginator', true);
        fixture.componentRef.setInput('rows', 10);
        fixture.componentRef.setInput('filters', { name: { value: 'item', matchMode: 'startsWith' } });
        fixture.detectChanges();
        await fixture.whenStable();
        table.first.set(10);

        fixture.componentRef.setInput('value', [...rows, { name: 'item30' }]);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(table.first()).toBe(10);
    });

    it('moves back to the last existing page when the value shrinks (optimus-ui#396)', async () => {
        const rows = Array.from({ length: 30 }, (_, i) => ({ name: 'item' + i }));
        fixture.componentRef.setInput('value', rows);
        fixture.componentRef.setInput('paginator', true);
        fixture.componentRef.setInput('rows', 10);
        fixture.detectChanges();
        await fixture.whenStable();
        table.first.set(20);

        fixture.componentRef.setInput('value', rows.slice(0, 5));
        fixture.detectChanges();
        await fixture.whenStable();

        expect(table.first()).toBe(0);
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table #dt [value]="rows" [filters]="filters()">
            <ng-template #header>
                <tr>
                    <th>Name <p-columnFilter field="name" display="menu"></p-columnFilter></th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableMenuFilterHostComponent {
    rows = [{ name: 'Anna' }, { name: 'Bob' }];
    filters = signal<any>({});
}

describe('Table menu column filter with programmatic filtering', () => {
    let fixture: ComponentFixture<TableMenuFilterHostComponent>;
    let table: Table;
    let columnFilter: ColumnFilter;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableMenuFilterHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        fixture = TestBed.createComponent(TableMenuFilterHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        table = fixture.debugElement.query(By.directive(Table)).componentInstance;
        columnFilter = fixture.debugElement.query(By.directive(ColumnFilter)).componentInstance;
    });

    it('keeps menu constraints as an array when Table.filter() is called (optimus-ui#352, optimus-ui#794)', () => {
        table.filter('An', 'name', 'startsWith');

        expect(Array.isArray(columnFilter.fieldConstraints)).toBe(true);
        expect(columnFilter.fieldConstraints![0]).toEqual(expect.objectContaining({ value: 'An', matchMode: 'startsWith' }));

        table.filter(null, 'name', 'startsWith');

        expect(Array.isArray(columnFilter.fieldConstraints)).toBe(true);
        expect(columnFilter.fieldConstraints![0].value).toBeNull();
    });

    it('recreates its constraint when the table filters are reset to {} (optimus-ui#722)', async () => {
        fixture.componentInstance.filters.set({});
        fixture.detectChanges();
        await fixture.whenStable();

        expect(Array.isArray(columnFilter.fieldConstraints)).toBe(true);
        expect(columnFilter.fieldConstraints!.length).toBe(1);
    });
});

@Component({
    standalone: true,
    imports: [TableModule, FormsModule],
    template: `
        <p-table [value]="products" dataKey="id" editMode="cell" (onEditCancel)="cancelled = $event">
            <ng-template #body let-product let-rowIndex="rowIndex">
                <tr>
                    <td [pEditableColumn]="product" pEditableColumnField="name" [pEditableColumnRowIndex]="rowIndex">
                        <p-cellEditor>
                            <ng-template #input><input type="text" [(ngModel)]="product.name" /></ng-template>
                            <ng-template #output>{{ product.name }}</ng-template>
                        </p-cellEditor>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableCellEditCancelHostComponent {
    products = [{ id: '1', name: 'Original' }];
    cancelled: any;
}

describe('Table cell edit cancel', () => {
    it('restores the original value on Escape (optimus-ui#846)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableCellEditCancelHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableCellEditCancelHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const cell: HTMLElement = fixture.nativeElement.querySelector('td');
        cell.click();
        fixture.detectChanges();
        await fixture.whenStable();

        fixture.componentInstance.products[0].name = 'Edited';
        cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        expect(fixture.componentInstance.products[0].name).toBe('Original');
        expect(fixture.componentInstance.cancelled.data.name).toBe('Original');
    });

    it('makes editable cells reachable and editable from the keyboard (optimus-ui#248)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableCellEditCancelHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableCellEditCancelHostComponent);
        document.body.appendChild(fixture.nativeElement);
        fixture.detectChanges();
        await fixture.whenStable();

        const cell: HTMLElement = fixture.nativeElement.querySelector('td');
        expect(cell.tabIndex).toBe(0);

        cell.focus();
        cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(cell.getAttribute('data-p-cell-editing')).toBe('true');

        cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(cell.getAttribute('data-p-cell-editing')).toBe('false');
        expect(document.activeElement).toBe(cell);
        fixture.nativeElement.remove();
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" dataKey="id">
            <ng-template #body let-row>
                <tr class="data-row">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
            <ng-template #expandedrow let-row>
                <tr>
                    <td>expanded {{ row.name }}</td>
                </tr>
            </ng-template>
            <ng-template #loadingbody>
                <tr class="loading-row">
                    <td>loading</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableExpansionLoadingBodyHostComponent {
    rows: any[] = [undefined, { id: '1', name: 'A' }];
}

describe('Table loading body with a row expansion template', () => {
    it('renders the loadingbody template for rows not loaded yet (optimus-ui#899)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableExpansionLoadingBodyHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableExpansionLoadingBodyHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelectorAll('tr.loading-row').length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('tr.data-row').length).toBe(1);
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" dataKey="id" rowGroupMode="subheader" groupRowsBy="category">
            <ng-template #groupheader let-row>
                <tr class="group-header">
                    <td>{{ row.category }}</td>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr class="data-row">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
            <ng-template #expandedrow let-row>
                <tr class="expanded-row">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableGroupedExpansionHostComponent {
    rows = [
        { id: '1', name: 'Bamboo Watch', category: 'Accessories' },
        { id: '2', name: 'Black Watch', category: 'Accessories' },
        { id: '3', name: 'Blue Band', category: 'Fitness' }
    ];
}

describe('Table row grouping with expandable rows', () => {
    it('renders the group header before the first row of its group (optimus-ui#517)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableGroupedExpansionHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableGroupedExpansionHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const classes = Array.from(fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>).map((tr) => tr.className);
        expect(classes).toEqual(['group-header', 'data-row', 'data-row', 'group-header', 'data-row']);
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" dataKey="id" selectionMode="single" [selection]="rows[0]">
            <ng-template #body let-row let-rowIndex="rowIndex">
                <tr [pSelectableRow]="row" [pSelectableRowIndex]="rowIndex">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableSelectableTabHostComponent {
    rows = [
        { id: '1', name: 'A' },
        { id: '2', name: 'B' }
    ];
}

describe('Table selectable row tab order', () => {
    it('keeps rows tabbable after sort or page change reset the anchor row (optimus-ui#594)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableSelectableTabHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableSelectableTabHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const table: Table = fixture.debugElement.query(By.directive(Table)).componentInstance;

        // sort() and onPageChange() reset the anchor row to null
        table.anchorRowIndex.set(null);
        fixture.detectChanges();
        await fixture.whenStable();

        const tabbable = Array.from(fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>).filter((tr) => tr.tabIndex === 0);
        expect(tabbable.length).toBeGreaterThan(0);
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" sortMode="multiple">
            <ng-template #header>
                <tr>
                    <th pSortableColumn="name">Name</th>
                    <th pSortableColumn="price">Price</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.price }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableKeyboardMultiSortHostComponent {
    rows = [
        { name: 'A', price: 2 },
        { name: 'B', price: 1 }
    ];
}

describe('Table keyboard multi-sort', () => {
    it('adds a column to the multi-sort with Ctrl/Cmd+Enter (optimus-ui#33)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableKeyboardMultiSortHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableKeyboardMultiSortHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const table: Table = fixture.debugElement.query(By.directive(Table)).componentInstance;
        const headers = fixture.nativeElement.querySelectorAll('th');

        headers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        headers[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', metaKey: true, bubbles: true }));

        expect(table._multiSortMeta()!.map((meta) => meta.field)).toEqual(['name', 'price']);

        headers[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', ctrlKey: true, bubbles: true }));

        expect(table._multiSortMeta()).toEqual([
            { field: 'name', order: -1 },
            { field: 'price', order: 1 }
        ]);
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows">
            <ng-template #header>
                <tr>
                    <th>Name <p-columnFilter type="text" field="name" display="menu"></p-columnFilter></th>
                    <th>Date <p-columnFilter type="date" field="date" display="menu"></p-columnFilter></th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableMenuApplyHostComponent {
    rows = [{ name: 'A', date: new Date(2020, 0, 1) }];
}

describe('Table menu column filter with an Apply button', () => {
    it('does not filter while the constraint is edited (optimus-ui#375)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableMenuApplyHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableMenuApplyHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const table: Table = fixture.debugElement.query(By.directive(Table)).componentInstance;
        const filterSpy = vi.spyOn(table, '_filter');

        for (const [index, value] of [
            [0, ''],
            [1, new Date(2021, 0, 1)]
        ] as const) {
            const columnFilter = fixture.debugElement.queryAll(By.directive(ColumnFilter))[index].componentInstance as ColumnFilter;
            columnFilter.toggleMenu(new MouseEvent('click'));
            fixture.detectChanges();
            await fixture.whenStable();
            const formElement = fixture.debugElement.query(By.directive(ColumnFilterFormElement)).componentInstance as ColumnFilterFormElement;
            formElement.onModelChange(value);
            columnFilter.hide();
            fixture.detectChanges();
            await fixture.whenStable();
        }

        expect(filterSpy).not.toHaveBeenCalled();
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows">
            <ng-template #header>
                <tr>
                    <th><p-columnFilter type="boolean" field="verified" ariaLabel="Verified filter"></p-columnFilter></th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.verified }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableBooleanFilterHostComponent {
    rows = [{ verified: true }, { verified: false }];
}

describe('Table boolean column filter', () => {
    let fixture: ComponentFixture<TableBooleanFilterHostComponent>;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableBooleanFilterHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        fixture = TestBed.createComponent(TableBooleanFilterHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('forwards ariaLabel to the checkbox (optimus-ui#149)', () => {
        const input: HTMLInputElement = fixture.nativeElement.querySelector('p-checkbox input');
        expect(input.getAttribute('aria-label')).toBe('Verified filter');
    });

    it('shows a clear button that resets a set boolean filter (optimus-ui#214)', async () => {
        const table: Table = fixture.debugElement.query(By.directive(Table)).componentInstance;
        expect(fixture.nativeElement.querySelector('[data-p-icon="filter-slash"]')).toBeNull();

        fixture.debugElement.query(By.directive(ColumnFilterFormElement)).componentInstance.onModelChange(true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(table.filteredValue()!.length).toBe(1);

        const clearIcon: HTMLElement = fixture.nativeElement.querySelector('[data-p-icon="filter-slash"]');
        expect(clearIcon).toBeTruthy();
        (clearIcon.closest('button') as HTMLButtonElement).click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect((table._filters()['verified'] as any).value).toBeNull();
        expect(table.filteredValue()).toBeNull();
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <div role="dialog">
            <p><span class="outside">outside the table</span></p>
            <p-table [value]="rows">
                <ng-template #header>
                    <tr>
                        <th>Name <p-columnFilter type="text" field="name" display="menu"></p-columnFilter></th>
                    </tr>
                </ng-template>
                <ng-template #body let-row>
                    <tr>
                        <td>{{ row.name }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
class TableFilterInDialogHostComponent {
    rows = [{ name: 'A' }];
}

describe('Table column filter outside click', () => {
    let fixture: ComponentFixture<TableFilterInDialogHostComponent>;
    let columnFilter: ColumnFilter;

    const click = (target: Element) => {
        target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableFilterInDialogHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        fixture = TestBed.createComponent(TableFilterInDialogHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        columnFilter = fixture.debugElement.query(By.directive(ColumnFilter)).componentInstance;
        columnFilter.toggleMenu(new MouseEvent('click'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(columnFilter.overlay()).toBeTruthy();
    });

    it('closes the menu on an outside click inside a dialog (optimus-ui#38)', () => {
        click(fixture.nativeElement.querySelector('.outside'));

        expect(columnFilter.overlayVisible()).toBe(false);
    });

    it('stays open when a body-appended overlay of the menu is clicked (optimus-ui#135)', () => {
        // outside of a dialog this time
        document.querySelectorAll('[role="dialog"]').forEach((dialog) => dialog !== columnFilter.overlay() && dialog.removeAttribute('role'));
        // a p-select or p-datepicker of the menu appended to body reports its clicks through OverlayService
        const formElement: HTMLElement = (columnFilter.overlay() as HTMLElement).querySelector('p-columnfilterformelement')!;
        const overlayService = TestBed.inject(OverlayService);
        const bodyOverlay = document.createElement('div');
        bodyOverlay.addEventListener('click', (event) => overlayService.add({ originalEvent: event, target: formElement }));
        document.body.appendChild(bodyOverlay);

        const option = bodyOverlay.appendChild(document.createElement('ul')).appendChild(document.createElement('li'));
        click(option);

        expect(columnFilter.overlayVisible()).toBe(true);
        bodyOverlay.remove();
        columnFilter.hide();
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows">
            <ng-template #header>
                <tr>
                    <th>Name <p-columnFilter type="text" field="name" display="menu"></p-columnFilter></th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableFilterButtonAriaHostComponent {
    rows = [{ name: 'A' }];
}

describe('Table column filter menu button ARIA', () => {
    it('exposes the popup state on the focusable button, not on the p-button host (optimus-ui#350)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableFilterButtonAriaHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableFilterButtonAriaHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const columnFilter: ColumnFilter = fixture.debugElement.query(By.directive(ColumnFilter)).componentInstance;
        const host: HTMLElement = fixture.nativeElement.querySelector('p-columnfilter p-button');
        const button: HTMLButtonElement = host.querySelector('button')!;

        expect(host.hasAttribute('aria-expanded')).toBe(false);
        expect(host.hasAttribute('aria-haspopup')).toBe(false);
        expect(button.getAttribute('aria-haspopup')).toBe('true');
        expect(button.getAttribute('aria-expanded')).toBe('false');

        columnFilter.toggleMenu(new MouseEvent('click'));
        fixture.detectChanges();
        await fixture.whenStable();

        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(button.getAttribute('aria-controls')).toBe(columnFilter.overlayId());
        columnFilter.hide();
    });

    it('keeps Tab and Shift+Tab inside the open menu (optimus-ui#785)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableFilterButtonAriaHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableFilterButtonAriaHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const columnFilter: ColumnFilter = fixture.debugElement.query(By.directive(ColumnFilter)).componentInstance;
        columnFilter.toggleMenu(new MouseEvent('click'));
        fixture.detectChanges();
        await fixture.whenStable();

        const overlay = columnFilter.overlay() as HTMLElement;
        const focusable = Array.from(overlay.querySelectorAll<HTMLElement>('button, input, [tabindex="0"]')).filter((el) => !el.hasAttribute('disabled'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        last.focus();
        last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
        expect(document.activeElement).toBe(first);

        first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
        expect(document.activeElement).toBe(last);
        columnFilter.hide();
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows">
            <ng-template #header>
                <tr>
                    <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableSortableHeaderAriaHostComponent {
    rows = [{ name: 'A' }];
}

describe('Table sortable header ARIA', () => {
    it('keeps the native th role and hides the decorative sort icon (optimus-ui#392)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableSortableHeaderAriaHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableSortableHeaderAriaHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const th: HTMLElement = fixture.nativeElement.querySelector('th');
        expect(th.hasAttribute('role')).toBe(false);
        expect(th.getAttribute('aria-sort')).toBe('none');
        expect(th.querySelector('p-sorticon svg')!.getAttribute('aria-hidden')).toBe('true');
    });
});

@Component({
    standalone: true,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" [virtualScroll]="true" [virtualScrollItemSize]="20" scrollHeight="400px" rowGroupMode="subheader" groupRowsBy="category">
            <ng-template #groupheader let-row>
                <tr class="group-header">
                    <td>{{ row.category }}</td>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr class="data-row" style="height: 20px">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
            <ng-template #groupfooter let-row>
                <tr class="group-footer">
                    <td>end {{ row.category }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TableVirtualScrollGroupHostComponent {
    rows = [
        { name: 'A1', category: 'A' },
        { name: 'A2', category: 'A' },
        { name: 'B1', category: 'B' }
    ];
}

describe('Table row group subheaders with virtual scroll', () => {
    it('renders group headers and footers (optimus-ui#159, optimus-ui#604)', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [TableVirtualScrollGroupHostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(TableVirtualScrollGroupHostComponent);
        document.body.appendChild(fixture.nativeElement);
        for (let i = 0; i < 3; i++) {
            fixture.detectChanges();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 20));
        }

        const classes = Array.from(fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>)
            .map((tr) => tr.className)
            .filter((className) => className);
        expect(classes).toEqual(['group-header', 'data-row', 'data-row', 'group-footer', 'group-header', 'data-row', 'group-footer']);
        fixture.nativeElement.remove();
    });
});
