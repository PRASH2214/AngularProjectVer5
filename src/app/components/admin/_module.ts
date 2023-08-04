import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { HospitalComponent } from './master/Hospital/hospital.component';
import { AdminProfileComponent } from "./profile/profile.component";

import { CustomMaterialModule } from "./../../custom-material.module"
import { AdminProfilePicComponent } from "./profilepic/profilepic.component";

import { HospitalAddComponent } from './master/Hospital/add/add.component';


import { HospitalEditComponent } from './master/Hospital/edit/edit.component';

import { DoctorComponent } from './master/doctor/doctor.component';

import { DoctorAddComponent } from './master/doctor/add/add.component';
import { DoctorEditComponent } from './master/doctor/edit/edit.component';


import { BranchComponent } from './master/branch/branch.component';
import { BranchAddComponent } from './master/branch/add/add.component';

import { BranchEditComponent } from './master/branch/edit/edit.component';


import { DepartmentComponent } from './master/department/department.component';
import { DepartmentAddComponent } from './master/department/add/add.component';

import { DepartmentEditComponent } from './master/department/edit/edit.component';


import { DepartmentslotComponent } from './master/department/departmentslot/departmentslot.component';


import { MedicineComponent } from './master/medicine/medicine.component';
import { MedicineAddComponent } from './master/medicine/add/add.component';
import { MedicineEditComponent } from './master/medicine/edit/edit.component';


import { SlotComponent } from './master/slot/slot.component';
import { SlotAddComponent } from './master/slot/add/add.component';
import { SlotEditComponent } from './master/slot/edit/edit.component';



import { DrugTypeComponent } from './master/drugtype/drugtype.component';
import { DrugTypeAddComponent } from './master/drugtype/add/add.component';
import { DrugTypeEditComponent } from './master/drugtype/edit/edit.component';


import { DrugComponent } from './master/drug/drug.component';
import { DrugAddComponent } from './master/drug/add/add.component';
import { DrugEditComponent } from './master/drug/edit/edit.component';

import { DosageComponent } from './master/dosage/dosage.component';
import { DosageAddComponent } from './master/dosage/add/add.component';

import { DosageEditComponent } from './master/dosage/edit/edit.component';


import { SpecialityComponent } from './master/speciality/speciality.component';
import { SpecialityAddComponent } from './master/speciality/add/add.component';
import { SpecialityEditComponent } from './master/speciality/edit/edit.component';

import { CompanyBulkuploadComponent } from './bulkupload/company/companybulkupload.component';

import { BrachBulkuploadComponent } from './bulkupload/brach/brachbulkupload.component';

import { HospitalBulkuploadComponent } from './bulkupload/hospital/hospitalbulkupload.component';

import { MedicineBulkuploadComponent } from './bulkupload/medicine/medicinebulkupload.component';

import { DepartmentBulkuploadComponent } from './bulkupload/department/departmentbulkupload.component';


import { DoctorBulkuploadComponent } from './bulkupload/doctor/doctorbulkupload.component';



import { MRBulkuploadComponent } from './bulkupload/mr/mrbulkupload.component';




import { MyCommonModule } from '../../guards/_module'


import { CompanyComponent } from './master/company/company.component';
import { CompanyAddComponent } from './master/company/add/add.component';
import { CompanyEditComponent } from './master/company/edit/edit.component';





import { MRComponent } from './master/mr/mr.component';
import { MRAddComponent } from './master/mr/add/add.component';
import { MREditComponent } from './master/mr/edit/edit.component';

import { PaymenttermsComponent } from './master/paymentterms/paymentterms.component';

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

    AdminDashboardComponent,
    DepartmentComponent,
    DepartmentAddComponent, DepartmentslotComponent,
    MedicineComponent, MedicineAddComponent, MedicineEditComponent,
    DrugComponent, DrugAddComponent, DrugEditComponent,
    DrugTypeComponent, DrugTypeAddComponent, DrugTypeEditComponent,
    DosageComponent, DosageAddComponent, DosageEditComponent,
    SpecialityComponent, SpecialityEditComponent, SpecialityAddComponent,
    PaymenttermsComponent,
    HospitalComponent,
    DoctorComponent, DoctorAddComponent, DoctorEditComponent,
    BranchComponent,
    BranchAddComponent,
    HospitalAddComponent,
    AdminProfileComponent, AdminProfilePicComponent,
    HospitalEditComponent,
    BranchEditComponent,
    DepartmentEditComponent,
    SlotComponent, SlotAddComponent, SlotEditComponent,
    CompanyComponent, CompanyAddComponent, CompanyEditComponent,
    MRComponent, MRAddComponent, MREditComponent,
    CompanyBulkuploadComponent, BrachBulkuploadComponent, HospitalBulkuploadComponent, MedicineBulkuploadComponent, DepartmentBulkuploadComponent, DoctorBulkuploadComponent
    , MRBulkuploadComponent,
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

      { path: "dashboard", component: AdminDashboardComponent },
      { path: "profile", component: AdminProfileComponent },
      { path: "profilepic", component: AdminProfilePicComponent },

      { path: "companybulkupload", component: CompanyBulkuploadComponent },
      { path: "brachbulkupload", component: BrachBulkuploadComponent },
      { path: "hospitalbulkupload", component: HospitalBulkuploadComponent },
      { path: "medicinebulkupload", component: MedicineBulkuploadComponent },
      { path: "departmentbulkupload", component: DepartmentBulkuploadComponent },
      { path: "doctorbulkupload", component: DoctorBulkuploadComponent },

      { path: "mrbulkupload", component: MRBulkuploadComponent },


      { path: "department", component: DepartmentComponent },
      { path: "department/add", component: DepartmentAddComponent },
      { path: "department/edit/:id", component: DepartmentEditComponent },

      { path: "department/slot/:id", component: DepartmentslotComponent },

      { path: "medicine", component: MedicineComponent },
      { path: "medicine/add", component: MedicineAddComponent },
      { path: "medicine/edit/:id", component: MedicineEditComponent },

      { path: "drug", component: DrugComponent },
      { path: "drug/add", component: DrugAddComponent },
      { path: "drug/edit/:id", component: DrugEditComponent },


      { path: "drugtype", component: DrugTypeComponent },
      { path: "drugtype/add", component: DrugTypeAddComponent },
      { path: "drugtype/edit/:id", component: DrugTypeEditComponent },


      { path: "slot", component: SlotComponent },
      { path: "slot/add", component: SlotAddComponent },
      { path: "slot/edit/:id", component: SlotEditComponent },


      { path: "dosage", component: DosageComponent },
      { path: "dosage/add", component: DosageAddComponent },

      { path: "dosage/edit/:id", component: DosageEditComponent },



      { path: "speciality", component: SpecialityComponent },
      { path: "speciality/add", component: SpecialityAddComponent },
      { path: "speciality/edit/:id", component: SpecialityEditComponent },

      { path: "paymentterms", component: PaymenttermsComponent },

      { path: "hospital", component: HospitalComponent },
      { path: "hospital/add", component: HospitalAddComponent },
      { path: "hospital/edit/:id", component: HospitalEditComponent },

      { path: "doctor", component: DoctorComponent },
      { path: "doctor/add", component: DoctorAddComponent },
      { path: "doctor/edit/:id", component: DoctorEditComponent },


      { path: "branch", component: BranchComponent },
      { path: "branch/add", component: BranchAddComponent },
      { path: "branch/edit/:id", component: BranchEditComponent },


      { path: "company", component: CompanyComponent },
      { path: "company/add", component: CompanyAddComponent },
      { path: "company/edit/:id", component: CompanyEditComponent },

      { path: "mr", component: MRComponent },
      { path: "mr/add", component: MRAddComponent },
      { path: "mr/edit/:id", component: MREditComponent },

    ]),
  ],
  providers: [DatePipe],

  entryComponents: []
})
export class AdminModule { }
