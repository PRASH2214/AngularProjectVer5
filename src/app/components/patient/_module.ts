import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PatientDashboardComponent } from "./dashboard/dashboard.component";
import { ConsultationRoomComponent } from "./consultationroom/consultationroom.component";

import { PatientProfileComponent } from "./profile/profile.component"




import { PatientProfilePicComponent } from "./profilepic/profilepic.component"

import { PatientTodayAppointmentComponent } from "./todayappointment/todayappointment.component";
import {PatientPastConsultationsComponent } from "./pastconsultations/pastconsultations.component";

import { ViewsprescriptionComponent} from "./viewsprescription/viewsprescription.component";

import {NgxPrintModule} from 'ngx-print';

import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [

    PatientDashboardComponent,
    PatientProfileComponent,
    PatientProfilePicComponent,
    PatientTodayAppointmentComponent,
    PatientPastConsultationsComponent,
    ViewsprescriptionComponent,
    ConsultationRoomComponent
  ],

  imports: [
    CommonModule,
    FormsModule,NgxPrintModule,
    ReactiveFormsModule,NgxPaginationModule, TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild([
      { path: "dashboard", component: PatientDashboardComponent },
      { path: "consultationroom", component: ConsultationRoomComponent },
      { path: "profile", component: PatientProfileComponent },
      { path: "profilepic", component: PatientProfilePicComponent },
      { path: "appointments", component: PatientTodayAppointmentComponent },
      { path: "pastconsultations", component: PatientPastConsultationsComponent },
      { path: "viewsprescription/:id", component: ViewsprescriptionComponent },
      
    ]),
  ],
  providers: [],

  entryComponents: []
})
export class PatientModule { }
