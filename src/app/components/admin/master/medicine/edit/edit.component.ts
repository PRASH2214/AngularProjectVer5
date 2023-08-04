import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { MedicineService } from "../../../../../services/medicine.service";
import { CommonService } from "../../../../../services/common.service";

import { DrugService } from "../../../../../services/drug.service";

import { DrugTypeService } from "../../../../../services/drugtype.service";


import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "../../../../../services/master";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material/dialog";

import { ConfimrAddDrugDialog } from 'src/app/popups/adddrug';
import { ConfimrAddDrugTypeDialog } from 'src/app/popups/adddrugtype';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class MedicineEditComponent implements OnInit {
  submitted = false;


  alldruglst: any;



  MedicineForm = new FormGroup({

    MedicineId: new FormControl('', Validators.required),

    MedicineName: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required),

    DrugId: new FormControl('', Validators.required),
    DrugType: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    CompanyName: new FormControl(''),
    CompanyId: new FormControl('', Validators.required),


  })
  medicineinfo: any;
  allcompanylist: any;
  alldrugtypelst: any;
  constructor(

    private nav: Router,
    private sv: MedicineService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
,
    public comservice: CommonService,
    public _route: ActivatedRoute,
    public dialog: MatDialog,
    public spds: DrugService, public spdt: DrugTypeService,



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
    this._route.params.subscribe(



      params => {

        this.spinner.show();
        this.sv.GetById(params["id"]).subscribe((m) => {
          this.medicineinfo = m.model;
          Object.getOwnPropertyNames(this.medicineinfo).forEach((key) => {
            if (this.MedicineForm.contains(key)) {
              this.MedicineForm.controls[key].setValue(m.model[key]);

              this.spinner.hide();


            }
          })
        });

      })

  }



  get f() { return this.MedicineForm.controls; }

  Save() {

    this.submitted = true;



    if (this.MedicineForm.valid) {
      let data = this.MedicineForm.value;
      this.spinner.show();
      data.CompanyId = parseInt(data.CompanyId);
      var companyarray = this.allcompanylist.filter(entity => entity.CompanyId == data.CompanyId);
      data.CompanyName = companyarray[0].CompanyName,
      data.MedicineId = parseInt(data.MedicineId)
      data.DrugId = parseInt(data.DrugId)
      data.DrugType = parseInt(data.DrugType)
      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }

      this.sv.Update(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.notifyService.showSuccess("Update successfully", "");

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
