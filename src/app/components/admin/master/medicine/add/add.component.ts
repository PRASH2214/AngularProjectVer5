import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';

import { MedicineService } from "../../../../../services/medicine.service";
import { CommonService } from "../../../../../services/common.service";


import { DrugService } from "../../../../../services/drug.service";

import { DrugTypeService } from "../../../../../services/drugtype.service";


import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";


import { ConfimrAddDrugDialog } from 'src/app/popups/adddrug';
import { ConfimrAddDrugTypeDialog } from 'src/app/popups/adddrugtype';
import { JsonpInterceptor } from '@angular/common/http';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class MedicineAddComponent implements OnInit {
  submitted = false;


  alldruglst: any;



  MedicineForm = new FormGroup({



    MedicineName: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required),

    DrugId: new FormControl('', Validators.required),
    DrugType: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    CompanyName: new FormControl(''),
    CompanyId: new FormControl('', Validators.required),


  })
  allcompanylist: any;
  alldrugtypelst: any;
  constructor(

    private nav: Router,
    private sv: MedicineService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
    , public dialog: MatDialog,
    public spds: DrugService, public spdt: DrugTypeService,
    public comservice: CommonService


  ) { }

  ngOnInit() {


    this.comservice.getmasterdrug().subscribe((m) => {

      this.alldruglst = m.lstModel;
    });

    this.comservice.getactivedrugtype().subscribe((m) => {

      this.alldrugtypelst = m.lstModel;
    });


    this.comservice.getactivecompany().subscribe((m) => {

      this.allcompanylist = m.lstModel;

    });

  }



  get f() { return this.MedicineForm.controls; }

  Save() {

    this.submitted = true;


    //   const controls = this.userForm.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {

    //  }
    // }

    if (this.MedicineForm.valid) {


      this.spinner.show();
      let data = this.MedicineForm.value;
      data.CompanyId = parseInt(data.CompanyId);
      var companyarray = this.allcompanylist.filter(entity => entity.CompanyId == data.CompanyId);
      data.CompanyName = companyarray[0].CompanyName,
        data.DrugId = parseInt(data.DrugId);
        data.DrugType = parseInt(data.DrugType)
      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }

      this.sv.Save(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.notifyService.showSuccess("Add successfully", "");

          this.nav.navigateByUrl('/admin/medicine');
        } else {
          this.spinner.hide();
          this.notifyService.showError(m.message, "")
        }
      }, err => {
        this.spinner.hide();
        this.notifyService.showError("something went wrong", "")

      })
    }

  }


  /////////////////drug



  AddDrug() {
    const dialogRef = this.dialog.open(ConfimrAddDrugDialog, {
      width: "450px",
      data: { Message: "Are you sure to Add Drug ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Confirmation == true) {

    
        var data = {
          DrugName: result.DrugName,
          Description: result.Description,
          Status: 1
        };


        this.spds.Save(data).subscribe((m) => {
          if (m.success == true && m.status == 1) {

            this.notifyService.showSuccess("Add successfully", "");
            this.spinner.hide();
            this.refreshdrug();

          } else {
            this.spinner.hide();

            this.notifyService.showError(m.message, "")
          }
        }, err => {
          this.spinner.hide();

          this.notifyService.showError("something went wrong", "")

        })

      }
    });


  }



  refreshdrug() {
    this.comservice.getmasterdrug().subscribe((m) => {

      this.alldruglst = m.lstModel;
    });

  }





  //////////////////////////drug type



  AddDrugType() {
    const dialogRef = this.dialog.open(ConfimrAddDrugTypeDialog, {
      width: "450px",
      data: { Message: "Are you sure to Add Drug Type ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Confirmation == true) {


     
    
        var data = {
          Name: result.DrugTypeName,
          Description: result.Description,
          Status: 1
        };
       

        this.spdt.Save(data).subscribe((m) => {
          if (m.success == true && m.status == 1) {

            this.notifyService.showSuccess("Add successfully", "");
            this.spinner.hide();
            this.refreshdrugtype();

          } else {
            this.spinner.hide();

            this.notifyService.showError(m.message, "")
          }
        }, err => {
          this.spinner.hide();

          this.notifyService.showError("something went wrong", "")

        })

      }
    });


  }



  refreshdrugtype() {

    this.comservice.getactivedrugtype().subscribe((m) => {

      this.alldrugtypelst = m.lstModel;
    });

  }

}
