import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatSlideToggleModule, MatStepperModule, MatRadioModule, MatCheckboxModule, MatAutocompleteModule,MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';


import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ProductsComponent } from 'app/main/masters/products/products.component';
import { ProductComponent } from 'app/main/masters/product/product.component';
import { ProductService } from 'app/main/masters//product/product.service';
import { ProductsService } from 'app/main/masters/products/products.service';

const routes: Routes = [
  {
      path     : 'products',
      component: ProductsComponent,
      resolve  : {
          data: ProductsService
      }
  },
  {
      path     : 'products/:id',
      component: ProductComponent,
      resolve  : {
          data: ProductService
      }
  },
  {
      path     : 'products/:id/:handle',
      component: ProductComponent,
      resolve  : {
          data: ProductService
      }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatSlideToggleModule, MatStepperModule, MatRadioModule, MatCheckboxModule, MatAutocompleteModule,

    FuseSharedModule,
    FuseWidgetModule,
  ],
  declarations: [
    ProductComponent,
    ProductsComponent
  ],
  providers   : [
    ProductService,
    ProductsService
]
})
export class MastersModule { }
