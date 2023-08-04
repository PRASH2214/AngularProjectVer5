import { NgModule } from '@angular/core';
import { ForgotPasswordComponent } from './forgot-password.component'
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
  {
      path     : 'auth/forgot-password',
      component: ForgotPasswordComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,

    FuseSharedModule,
  ],
  declarations: [
    ForgotPasswordComponent
  ]
})
export class ForgotPasswordModule { 

}
