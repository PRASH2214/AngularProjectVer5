import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MRDashboardComponent } from "./dashboard/dashboard.component";
import { MRProfileComponent } from "./profile/profile.component";
import { MRProfilePicComponent} from "./profilepic/profilepic.component";

import { MrAppointmentlistComponent} from "./appointmentlist/appointmentlist.component";

import { MrConsultationRoomComponent } from "./mrconsultationroom/mrconsultationroom.component";

import { NgxPrintModule } from 'ngx-print';

import { BookslotComponent} from "./bookslot/bookslot.Component";
import { CustomMaterialModule } from '../../custom-material.module';
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

    MRDashboardComponent,
    MRProfileComponent,
    BookslotComponent,
    MRProfilePicComponent,
    MrAppointmentlistComponent,
    MrConsultationRoomComponent
  ],

  imports: [
    CommonModule,
    FormsModule, NgxPrintModule,CustomMaterialModule,
    ReactiveFormsModule, NgxPaginationModule, TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild([
      { path: "dashboard", component: MRDashboardComponent },
      { path: "profile", component: MRProfileComponent },
      { path: "profilepic", component: MRProfilePicComponent },
      { path: "bookslot", component: BookslotComponent },
      { path: "appointmentlist", component: MrAppointmentlistComponent },
      { path: "consultationroom", component: MrConsultationRoomComponent },

    ]),
  ],
  providers: [],

  entryComponents: []
})
export class MRModule { }
