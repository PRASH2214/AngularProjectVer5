import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../../services/common.service";

import { DepartmentService } from "../../../../../services/department.service";

import { NotificationService } from '../../../../../services/notification.service'

import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class DepartmentEditComponent implements OnInit {
  submitted = false;
  allhospitallst: any;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  allbrachlst: any;


  userForm = new FormGroup({
    DepartmentId: new FormControl('', Validators.required),
    HospitalId: new FormControl('', Validators.required),
    BranchId: new FormControl('', Validators.required),
    DepartmentName: new FormControl('', Validators.required),
    DepartmentContactMobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    HospitalDepartmentLink: new FormControl('', [Validators.required, Validators.pattern(this.reg)]),
    Status: new FormControl(false, Validators.required),
    Amount: new FormControl(0, Validators.required),

  })
  Departmentinfo: any;
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: DepartmentService,
    private _route: ActivatedRoute,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }




  ngOnInit() {

    this.commonsv.getactivehospitals().subscribe((m) => {

      this.allhospitallst = m.lstModel;

    });

    this._route.params.subscribe(



      params => {


        this.sv.GetById(params["id"]).subscribe((m) => {
          this.Departmentinfo = m.model;
          Object.getOwnPropertyNames(this.Departmentinfo).forEach((key) => {
            if (this.userForm.contains(key)) {
              this.userForm.controls[key].setValue(m.model[key]);          

              if (key == "Amount") {
                this.userForm.controls["Amount"].setValue(m.model[key].toFixed(2));
              }

              if (key == "HospitalId") {
                this.onHospitalSelected(m.model[key]);
              }

              if (key == "Status") {

                if (m.model[key] == "1") {
                  this.userForm.controls["Status"].setValue(true);
                } else {
                  this.userForm.controls["Status"].setValue(false);
                }
              }

            }
          })
        });

      })
  }


  get f() { return this.userForm.controls; }

  Save() {

    this.submitted = true;


    //   const controls = this.userForm.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {

    //  }
    // }

    if (this.userForm.valid) {
      let data = this.userForm.value;
      data.DepartmentId = parseInt(data.DepartmentId);
      data.HospitalId = parseInt(data.HospitalId);
      data.BranchId = parseInt(data.BranchId);
      data.Amount = parseFloat(data.Amount);
      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }
      this.sv.Update(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.notifyService.showSuccess("Update successfully", "");

          this.nav.navigateByUrl('/admin/department');
        } else {
          this.notifyService.showError(m.message, "")
        }
      }, err => {

        this.notifyService.showError("something went wrong", "")

      })
    }

  }

  onHospitalSelected(value: string) {

    this.allbrachlst = [];
    if (value != "" && value != undefined) {
      this.commonsv.getbranchbyhospital(value).subscribe((m) => {

        this.allbrachlst = m.lstModel;
      });
    } else {
      this.allbrachlst = [];
    }

  }

}
