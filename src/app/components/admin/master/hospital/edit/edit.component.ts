import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgxSpinnerService } from "ngx-spinner";


import { NotificationService } from '../../../../../services/notification.service'
import { CommonService } from "../../../../../services/common.service";

import { HospitalService } from "../../../../../services/hospital.service";

import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class HospitalEditComponent implements OnInit {

  submitted = false;
  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  userForm = new FormGroup({

    HospitalId: new FormControl('', Validators.required),
    UserTypeId: new FormControl(1, Validators.required),
    HospitalName: new FormControl('', Validators.required),
    CountryId: new FormControl(1, Validators.required),
    StateId: new FormControl('', Validators.required),
    DistrictId: new FormControl('', Validators.required),
    CityId: new FormControl('', Validators.required),
    HospitalAddress: new FormControl('', Validators.required),
    HospitalLicenseNumber: new FormControl('', Validators.required),
    OwnerName: new FormControl('', Validators.required),
    OwnerMobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    ContactName: new FormControl('', Validators.required),
    ContactMobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    PinCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    HospitalLink: new FormControl('', [Validators.required, Validators.pattern(this.reg)]),
    Status: new FormControl(true, Validators.required),

  })
  Hospitalinfo: any;



  constructor(

    private nav: Router,
    public Notification: NotificationService,
    private com: CommonService,
    private sv: HospitalService,
    private _route: ActivatedRoute,
     private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {
    this.com.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });

    this._route.params.subscribe(



      params => {

        this.spinner.show();
        this.sv.GetById(params["id"]).subscribe((m) => {
          this.Hospitalinfo = m.model;
          Object.getOwnPropertyNames(this.Hospitalinfo).forEach((key) => {
            if (this.userForm.contains(key)) {
              this.userForm.controls[key].setValue(m.model[key]);

              if (key == "StateId") {
                this.onStateSelected(m.model[key]);
              }

              if (key == "DistrictId") {
                this.onDistrictSelected(m.model[key]);
              }

              if (key == "Status") {

                if (m.model[key] == "1") {
                  this.userForm.controls["Status"].setValue(true);
                } else {
                  this.userForm.controls["Status"].setValue(false);
                }
              }
              this.spinner.hide();
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
      this.spinner.show();
      let data = this.userForm.value;
      data.HospitalId = parseInt(data.HospitalId);
      data.UserTypeId = parseInt(data.UserTypeId);
      data.StateId = parseInt(data.StateId);
      data.DistrictId = parseInt(data.DistrictId);
      data.CityId = parseInt(data.CityId);
      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }
      this.sv.Update(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.Notification.showSuccess("Update successfully", "");

          this.nav.navigateByUrl('/admin/hospital');
        } else {
          this.spinner.hide();
          this.Notification.showError(m.message, "")
        }
      }, err => {
        this.spinner.hide();
        this.Notification.showError("something went wrong", "")

      })
    }

  }

  onStateSelected(value: string) {
    this.alldistrictlst = [];
    this.userForm.controls["DistrictId"].setValue("");
    this.allcitylst = [];
    this.userForm.controls["CityId"].setValue("");
    if (value != "" && value != undefined) {
      this.com.getdistricts(value).subscribe((m) => {

        this.alldistrictlst = m.lstModel;
      });
    } else {
      this.alldistrictlst = [];
    }

  }



  onDistrictSelected(value: string) {
    this.allcitylst = [];
    this.userForm.controls["CityId"].setValue("");
    if (value != "" && value != undefined) {
      this.com.getcity(value).subscribe((m) => {

        this.allcitylst = m.lstModel;
      });
    } else {
      this.allcitylst = [];
    }

  }


}
