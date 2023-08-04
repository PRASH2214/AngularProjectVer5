import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Product } from './product.model';
import { ProductService } from '../product/product.service';
import { Location } from '@angular/common';

export class User {
  constructor(public varItem: string, public varVal: number) { }
}


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: fuseAnimations
})
export class ProductComponent implements OnInit {
  product: Product;
  pageType: string;
  productForm: FormGroup;

  // Private
  private _unsubscribeAll: Subject<any>;

  form: FormGroup;
  formErrors: any;
  options = [
    new User('Type1', 1),
    new User('Type2', 2),
    new User('Type3', 3)
  ];
  filteredOptions: Observable<User[]>;

  ptmItem = [{
    varItem: 'Type1',
    varVal: 1
  }, {
    varItem: 'Type2',
    varVal: 2
  },{
    varItem: 'Type3',
    varVal: 3
  }];
  productTypeItem = [{
    varItem: 'Own',
    varVal: 'O'
  }, {
    varItem: 'Loan',
    varVal: 'L'
  }];
  scheduleItem = [{
    varItem: 'Schedule Drug',
    varVal: 'Y'
  }, {
    varItem: 'Non Schedule Drug',
    varVal: 'N'
  }];


  constructor(
    private _productService: ProductService,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the default
    this.product = new Product();

    this.formErrors = {
      varProductCode: {},
      varProductName: {},
      fk_PTMGlCode: {},
      chrProductType: {},
      varGTINNo: {},
      varGenericName: {},
      varComposition: {},
      chrScheduled: {},
      varUsage: {},
      chrMonocarton: {},
      chrActive: {}
    };

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {
    // Subscribe to update product on changes
    this._productService.onProductChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(product => {

        if (typeof product === typeof this.product) {
          this.product = new Product(product);
          this.pageType = 'edit';
        }
        else {
          this.pageType = 'new';
          this.product = new Product();
          this.product.varProductCode = product;
        }

        this.form = this.createProductForm();

        this.form.valueChanges
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.onFormValuesChanged();
          });

      });

  }

  createProductForm(): FormGroup {
    return this._formBuilder.group({
      intGlCode: [this.product.intGlCode],
      varProductCode: [{ value: this.product.varProductCode, disabled: true }],
      varProductName: [this.product.varProductName, Validators.required],
      fk_PTMGlCode: [this.product.fk_PTMGlCode, Validators.required],
      chrProductType: [this.product.chrProductType, Validators.required],
      varGTINNo: [this.product.varGTINNo, Validators.required],
      varGenericName: [this.product.varGenericName, Validators.required],
      varComposition: [this.product.varComposition, Validators.required],
      chrScheduled: [this.product.chrScheduled, Validators.required],
      varUsage: [this.product.varUsage, Validators.required],
      chrMonocarton: [this.product.chrMonocarton, Validators.required],
      chrActive: [this.product.chrActive === 'N' ? 0 : 1]
    });
  }


  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On form values changed
   */
  onFormValuesChanged(): void {
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.formErrors[field] = {};

      // Get the control
      const control = this.form.get(field);

      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }


  SaveProduct(): void {
    // Show the success message
    this._matSnackBar.open('Product saved', 'OK', {
      verticalPosition: 'top',
      duration: 5000
    });
  }

}
