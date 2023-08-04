import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import { ProductmstComponent } from './productmst.component';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatSlideToggleModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule, MatRadioModule, MatCheckboxModule, MatAutocompleteModule } from '@angular/material';

const routes = [{
  path: 'productmst',
  component: ProductmstComponent
}]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatSlideToggleModule,MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule, MatRadioModule, MatCheckboxModule, MatAutocompleteModule
  ],
  declarations: [ProductmstComponent]
})
export class ProductmstModule { }
