import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


import { CustomMaterialModule } from "./../../custom-material.module"
import { AdminProfilePicComponent } from "./profilepic/profilepic.component";


import { SuperAdminDashboardComponent } from "./dashboard/dashboard.component";




import { AdminUserComponent } from "./adminuser/adminuser.component";

import { AdminUserAddComponent } from "./adminuser/add/add.component";
import { AdminuserEditComponent } from "./adminuser/edit/edit.component";


import { MyCommonModule } from '../../guards/_module'



import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [


     AdminProfilePicComponent, SuperAdminDashboardComponent,
    AdminUserComponent, AdminUserAddComponent, AdminuserEditComponent

  ],

  imports: [
    CommonModule,
    FormsModule, CustomMaterialModule, MyCommonModule,
    ReactiveFormsModule, NgxPaginationModule, TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild([


      // { path: "profile", component: AdminProfileComponent },
      { path: "profilepic", component: AdminProfilePicComponent },
      { path: "dashboard", component: SuperAdminDashboardComponent },

      { path: "adminuser", component: AdminUserComponent },
      { path: "adminuser/add", component: AdminUserAddComponent },
      { path: "adminuser/edit/:id", component: AdminuserEditComponent },


    ]),
  ],
  providers: [DatePipe],

  entryComponents: []
})
export class SuperAdminModule { }
