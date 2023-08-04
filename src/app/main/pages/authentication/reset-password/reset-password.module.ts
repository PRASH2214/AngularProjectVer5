import { NgModule } from '@angular/core';
import { ResetPasswordComponent } from './reset-password.component'
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
  {
    path: 'auth/reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'auth/reset-password/:email/:code',
    component: ResetPasswordComponent
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
  declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule { }
