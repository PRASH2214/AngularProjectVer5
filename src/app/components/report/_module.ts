import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppointmentSummaryComponent } from "./appointmentsummary/appointmentsummary.component";


import { PatientMRSummaryComponent } from "./patientmrsummary/patientmrsummary.component";

import { PatientMRSummaryDoctorComponent } from "./patientmrsummarydoctor/patientmrsummarydoctor.component";


import { MyCommonModule } from '../../guards/_module'

import { CustomMaterialModule } from '../../custom-material.module';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxPrintModule } from 'ngx-print';
import { ConfimrPatientinfoDialog } from '../../popups/patientinfo'
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}



@NgModule({
  declarations: [

    AppointmentSummaryComponent,
    PatientMRSummaryComponent,
    PatientMRSummaryDoctorComponent
  ],

  imports: [
    CommonModule,
    FormsModule, CustomMaterialModule, NgbModule, NgxPrintModule, MyCommonModule,
    ReactiveFormsModule, NgxPaginationModule, TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild([
      { path: "appointmentsummary", component: AppointmentSummaryComponent },
      { path: "patientmrsummary", component: PatientMRSummaryComponent },
      { path: "patientmrdoctorsummary", component: PatientMRSummaryDoctorComponent },
    ]),
  ],
  providers: [DatePipe],

  entryComponents: []
})
export class ReportModule { }
