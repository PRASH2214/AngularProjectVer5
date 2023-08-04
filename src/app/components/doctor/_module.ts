import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DoctorDashboardComponent } from "./dashboard/dashboard.component";
import { DoctorProfileComponent } from "./profile/profile.component";

import { DoctorProfilePicComponent } from "./profilepic/profilepic.component";

import { PatientSlotComponent } from "./patientslot/patientslot.component";

import { OffLineConsultationComponent } from "./offline_consultation/offline_consultation.component"
import { ConsultationComponent } from "./consultation/consultation.component";
import { TodayAppointmentComponent } from "./todayappointment/todayappointment.component";
import { PastConsultationsComponent } from "./pastconsultations/pastconsultations.component";


import { ViewsprescriptionComponent } from "./viewsprescription/viewsprescription.component";


import { MrAppointmentlistComponent } from "./mrappointmentlist/mrappointmentlist.component";


import { MrConsultationComponent } from "./mrconsultation/mrconsultation.component";



import { MyCommonModule } from '../../guards/_module'

import { CustomMaterialModule } from '../../custom-material.module';

import { CalendarComponent } from './calendar/calendar.component';

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

    DoctorDashboardComponent,
    DoctorProfileComponent,
    DoctorProfilePicComponent,
    PatientSlotComponent,
    CalendarComponent,
    ConsultationComponent,
    TodayAppointmentComponent,
    PastConsultationsComponent,
    ConfimrPatientinfoDialog,
    OffLineConsultationComponent,
    ViewsprescriptionComponent,
    MrAppointmentlistComponent,
    MrConsultationComponent
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
      { path: "dashboard", component: DoctorDashboardComponent },
      { path: "profile", component: DoctorProfileComponent },
      { path: "profilepic", component: DoctorProfilePicComponent },
      { path: "slot", component: PatientSlotComponent },
      { path: "consultation", component: ConsultationComponent },
      { path: "consultationoffline", component: OffLineConsultationComponent },
      { path: "appointments", component: TodayAppointmentComponent },
      { path: "pastconsultations", component: PastConsultationsComponent },
      { path: "viewsprescription/:id", component: ViewsprescriptionComponent },
      { path: "mrappointment", component: MrAppointmentlistComponent },
      { path: "mrconsultation", component: MrConsultationComponent },

    ]),
  ],
  providers: [DatePipe],

  entryComponents: []
})
export class DoctorModule { }
