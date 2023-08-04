import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../../services/common.service";

import { BranchService } from "../../../../../services/branch.service";

import { NotificationService } from '../../../../../services/notification.service'

import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class BranchEditComponent implements OnInit {

  submitted = false;
  allhospitallst: any;


  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  userForm = new FormGroup({


    BranchId: new FormControl(0, Validators.required),
    HospitalId: new FormControl('', Validators.required),
    BranchName: new FormControl('', Validators.required),
    CountryId: new FormControl(1, Validators.required),
    StateId: new FormControl('', Validators.required),
    DistrictId: new FormControl('', Validators.required),
    CityId: new FormControl('', Validators.required),
    BranchHospitalAddress: new FormControl('', Validators.required),
    BranchHospitalLicenseNumber: new FormControl('', Validators.required),
    ContactName: new FormControl('', Validators.required),
    ContactMobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    PinCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    BranchHospitalLink: new FormControl('', [Validators.required, Validators.pattern(this.reg)]),
    Status: new FormControl(false, Validators.required),

  })
  branchinfo: any;
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: BranchService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
    ,
    public _route: ActivatedRoute


  ) { }

  ngOnInit() {


    this.commonsv.getactivehospitals().subscribe((m) => {

      this.allhospitallst = m.lstModel;

    });
    this.commonsv.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });



    this._route.params.subscribe(



      params => {


        this.sv.GetById(params["id"]).subscribe((m) => {
          this.branchinfo = m.model;
          Object.getOwnPropertyNames(this.branchinfo).forEach((key) => {
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
      data.BranchId = parseInt(data.BranchId);
      data.HospitalId = parseInt(data.HospitalId);
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

          this.notifyService.showSuccess("Update successfully", "");

          this.nav.navigateByUrl('/admin/branch');
        } else {
          this.notifyService.showError(m.message, "")
        }
      }, err => {

        this.notifyService.showError("Something went wrong", "")

      })
    }

  }

  onStateSelected(value: string) {
    this.alldistrictlst = [];

    this.userForm.controls["DistrictId"].setValue("");
    this.allcitylst = [];
    this.userForm.controls["CityId"].setValue("");
    if (value != "" && value != undefined) {
      this.commonsv.getdistricts(value).subscribe((m) => {

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
      this.commonsv.getcity(value).subscribe((m) => {

        this.allcitylst = m.lstModel;
      });
    } else {
      this.allcitylst = [];
    }

  }


}
