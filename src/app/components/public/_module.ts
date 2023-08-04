import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminloginComponent } from "./adminlogin/adminlogin.component";
import { DoctorloginComponent } from "./doctorlogin/doctorlogin.component";
import { PatientRegComponent } from "./patientreg/patientreg.component";

import { PatientloginComponent } from "./patientlogin/patientlogin.component";



import { MyCommonModule } from '../../guards/_module'

import { MrloginComponent } from "./mrlogin/mrlogin.component";



import { ControlloginComponent } from "./controllogin/controllogin.component";

import { HomeComponent } from "./home/home.component";
import { ToastrModule } from 'ngx-toastr';
import { CustomMaterialModule } from '../../custom-material.module';
import { AdminloginOTPComponent } from "./adminloginotp/adminloginotp.component";

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [

    AdminloginComponent,
    PatientRegComponent, PatientloginComponent,
    DoctorloginComponent,
    HomeComponent,
    MrloginComponent,
    ControlloginComponent
  ],

  imports: [
    CommonModule, MyCommonModule,
    FormsModule, ToastrModule.forRoot(),
    ReactiveFormsModule, CustomMaterialModule, TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild([
      { path: "", component: HomeComponent },
      { path: "home", component: HomeComponent },
      { path: "admin", component: AdminloginComponent },
      { path: "admin/loginotp", component: AdminloginOTPComponent },
      { path: "admin/login", component: AdminloginComponent },
      { path: "doctor", component: DoctorloginComponent },
      { path: "doctor/login", component: DoctorloginComponent },
      { path: "patient", component: PatientRegComponent },
      { path: "patient/registration", component: PatientRegComponent },
      { path: "patient/login", component: PatientloginComponent },
      { path: "mr/login", component: MrloginComponent },
      { path: "control/login", component: ControlloginComponent },
    ]),
  ],
  providers: [],

  entryComponents: []
})
export class PublicModule { }
