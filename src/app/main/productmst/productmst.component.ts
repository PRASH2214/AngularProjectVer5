import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

export class User {
  constructor(public varItem: string, public varVal: number) { }
}

@Component({
  selector: 'app-productmst',
  templateUrl: './productmst.component.html',
  styleUrls: ['./productmst.component.scss']
})
export class ProductmstComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  options = [
    new User('Type1', 1),
    new User('Type2', 2),
    new User('Type3', 3)
  ];
  filteredOptions: Observable<User[]>;

 
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
  

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private _formBuilder: FormBuilder, private _matSnackBar: MatSnackBar) {
    // Reactive form errors
    this.formErrors = {
      produtCode: {},
      productName: {},
      ptm: {},
      productType: {},
      gtinNo: {},
      genericName: {},
      composition: {},
      scheduleDrug: {},
      active: {},
      monocation: {},
      usage: {}
    };
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    // Reactive Form
    this.form = this._formBuilder.group({
      produtCode: [
        {
          value: '00001',
          disabled: true
        }, Validators.required
      ],
      productName: ['', Validators.required],
      ptm: ['', Validators.required],
      productType: ['', Validators.required],
      gtinNo: ['', Validators.required],
      genericName: ['', Validators.required],
      composition: ['', Validators.required],
      scheduleDrug: ['', Validators.required],
      active: [1],
      monocation: ['', Validators.required],
      usage: ['', Validators.required]
    });

    this.filteredOptions = this.form.get('ptm').valueChanges.pipe(
      startWith<string | User>(''),
      map(value => typeof value === 'string' ? value : value.varItem),
      map(name => name ? this.filter(name) : this.options.slice())
    );

    this.form.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.onFormValuesChanged();
      });

  }
  filter(name: string): User[] {
    return this.options.filter(option =>
      option.varItem.toLowerCase().indexOf(name.toLowerCase()) > -1);
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
