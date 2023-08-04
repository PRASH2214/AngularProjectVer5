import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasteruploadComponent } from './masterupload.component';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatRadioModule,MatIconModule,MatFormFieldModule,MatInputModule,MatButtonModule} from '@angular/material';

const routes = [
  {
      path: 'masterupload',
      component: MasteruploadComponent
  }
];

@NgModule({
  declarations: [
    MasteruploadComponent
  ],
  imports: [
      RouterModule.forChild(routes),
      FuseSharedModule,
      MatRadioModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule
  ],
  exports: [
    MasteruploadComponent,
    MatRadioModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class MasteruploadModule { }
