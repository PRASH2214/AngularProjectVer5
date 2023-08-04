import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MasterService } from './services/master';
import { StorageService } from "./services/storage.service";
import { BaseService } from "./services/base";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { APIInterceptor } from "./services/httpinp.service";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PublicModule } from './components/public/_module';

import { AdminModule } from './components/admin/_module';
import { DoctorModule } from './components/doctor/_module';
import { PatientModule } from './components/patient/_module';

import { AdminlayoutComponent } from "./layout/adminlayout/adminlayout.component";
import { DoctorlayoutComponent } from "./layout/doctorlayout/doctorlayout.component";
import { PatientlayoutComponent } from "./layout/paitentlayout/paitentlayout.component";


import { SuperAdminlayoutComponent } from "./layout/superadminlayout/superadminlayout.component";


import { MRlayoutComponent } from "./layout/mrlayout/mrlayout.component";

import { PublicComponent } from "./layout/public/public.component";

import { CustomMaterialModule } from './custom-material.module';


import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CommonService } from './services/common.service'

import { NgxPaginationModule } from 'ngx-pagination';

import { MAT_DATE_LOCALE } from '@angular/material/core';
// Master service start
import { HospitalService } from './services/hospital.service'
import { BranchService } from './services/branch.service'
import { DepartmentService } from './services/department.service'
import { DoctorService } from './services/doctor.service'
import { SpecialityService } from './services/speciality.service'
import { AdminService } from './services/admin.service'
import { SuperAdminService } from './services/superadmin.service'
import { AuthService } from './services/auth.service'
import { DrugService } from './services/drug.service'

import { MedicineService } from './services/medicine.service'

import { SlotService } from './services/slot.service'
import { BulkService } from './services/bulkupload.service'

import { CompanyService } from './services/company.service'

import { MRService } from './services/mr.service'

import { DrugTypeService } from './services/drugtype.service'


import { DosageService } from './services/dose.service'


import { AdminUsersService } from './services/adminuser.service'


/////////////////////////////doctor module///////////////////



import { DoctorProfileService } from './services/doctorprofile.service'
import { DoctorConsultationService } from './services/doctorconsultation.service'


/////////////////////////////Patient module///////////////////



import { PatientProfileService } from './services/patientprofile.service'

import { PatientConsultationService } from './services/patientconsultation.service'


////////////////////////////MR module///////////////

import { MRProfileService } from './services/mrprofile.service'


import { ExcelService } from './services/excel.service'

import { ReportService } from './services/report.service'

import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from "ngx-spinner";
import { SignalRService } from './services/signalR.service';
import { globalx } from './services/globals.service';
import { ConnectionService } from './services/Connection.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    AdminlayoutComponent, DoctorlayoutComponent, PatientlayoutComponent, MRlayoutComponent, SuperAdminlayoutComponent,
    PublicComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    PublicModule,
    AdminModule,
    DoctorModule,
    PatientModule,
    CustomMaterialModule,
    HttpClientModule, NgbModule, NgxPrintModule,
    CommonModule, NgxPaginationModule, NgxSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true }, DatePipe,
    BaseService,
    StorageService,
    MasterService,
    HospitalService,
    AuthService,
    CommonService,
    AdminService,
    BranchService,
    DepartmentService,
    DoctorService,
    SpecialityService,
    DrugService,
    MedicineService,
    SlotService,
    CompanyService,
    MRService,
    BulkService,
    DosageService,
    DrugTypeService,
    DoctorProfileService,
    SignalRService,
    globalx,
    ConnectionService,
    DoctorConsultationService,
    PatientConsultationService,
    PatientProfileService,
    MRProfileService,
    SuperAdminService,
    AdminUsersService,
    ExcelService,
    ReportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

