import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DataSource } from '@angular/cdk/collections';
import { Observable, merge, BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { ProductsService } from 'app/main/masters/products/products.service';
import { MatPaginator, MatSort } from '@angular/material';
import { FuseUtils } from '@fuse/utils';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: fuseAnimations
})
export class ProductsComponent implements OnInit {
  dataSource: FilesDataSource | null;
  displayedColumns = ['varProductCode', 'varProductName', 'chrProductType', 'varGTINNo', 'varGenericName', 'varComposition'];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  @ViewChild('filter')
  filter: ElementRef;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private _productsService: ProductsService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  ngOnInit() {
    this.dataSource = new FilesDataSource(this._productsService, this.paginator, this.sort);

    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }

        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

}
export class FilesDataSource extends DataSource<any>
{
  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  constructor(
    private _productsService: ProductsService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort
  ) {
    super();

    this.filteredData = this._productsService.products;
  }


  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._productsService.onProductsChanged,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange
    ];

    return merge(...displayDataChanges)
      .pipe(
        map(() => {
          let data = this._productsService.products.slice();

          data = this.filterData(data);

          this.filteredData = [...data];

          
          data = this.sortData(data);

          // Grab the page's slice of data.
          const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
          return data.splice(startIndex, this._matPaginator.pageSize);
        }
        ));
  }
  disconnect(): void {
  }
  // Filtered data
  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  // Filter
  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }
  filterData(data): any {
    if (!this.filter) {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }

  /**
   * Sort data
   *
   * @param data
   * @returns {any[]}
   */
  sortData(data): any[] {
    if (!this._matSort.active || this._matSort.direction === '') {
      return data;
    }
    
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._matSort.active) {
        case 'varProductCode':
          [propertyA, propertyB] = [a.varProductCode, b.varProductCode];
          break;
        case 'varProductName':
          [propertyA, propertyB] = [a.varProductName, b.varProductName];
          break;
        case 'chrProductType':
          [propertyA, propertyB] = [a.chrProductType[0], b.chrProductType[0]];
          break;
        case 'varGTINNo':
          [propertyA, propertyB] = [a.varGTINNo, b.varGTINNo];
          break;
        case 'varGenericName':
          [propertyA, propertyB] = [a.varGenericName, b.varGenericName];
          break;
        case 'varComposition':
          [propertyA, propertyB] = [a.varComposition, b.varComposition];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
    });
  }
}
