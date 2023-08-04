import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from './../../../services/notification.service'

import { NgxSpinnerService } from "ngx-spinner";


import { AdminService } from '../../../services/admin.service'
import { Router } from "@angular/router";
import { MasterService } from "../../../services/master";
import { StorageService } from "../../../services/storage.service";
import { CommonService } from "../../../services/common.service";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  Error = "";
  allstatelst: any;
  submitted = false;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  userForm = new FormGroup({
    AdminId: new FormControl('', Validators.required),
    UserTypeId: new FormControl('1', Validators.required),
    AdminName: new FormControl('', Validators.required),
    StateId: new FormControl('', Validators.required),
    DistrictId: new FormControl('', Validators.required),
    CityId: new FormControl('', Validators.required),
    Address: new FormControl('', Validators.required),
    AdminMobile: new FormControl('', Validators.required),
    Status: new FormControl('', Validators.required),
    ClientName: new FormControl('', Validators.required),
    WebUrl: new FormControl('', [Validators.required, Validators.pattern(this.reg)]),
    MrUrl: new FormControl('', [Validators.required, Validators.pattern(this.reg)])
  })
  alldistrictlst: any;
  allcitylst: any[];
  admininfo: any;

  constructor(
    public master: MasterService,
    private st: StorageService,
    private com: CommonService,
    private ads: AdminService,
    public Notification: NotificationService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {


    
  

    this.ads.getprofile().subscribe((m) => {
      this.admininfo = m.model;
      Object.getOwnPropertyNames(this.admininfo).forEach((key) => {
        if (this.userForm.contains(key)) {
          this.userForm.controls[key].setValue(m.model[key]);

          if (key == "StateId") {
            this.onStateSelected(m.model[key]);
          }

          if (key == "DistrictId") {
            this.onDistrictSelected(m.model[key]);
          }


        }
      })
    });

    this.com.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });



  }


  onStateSelected(value: string) {
    this.alldistrictlst = [];
    this.allcitylst = [];
    this.userForm.controls["DistrictId"].setValue("");
    if (value != "" && value != undefined) {
      this.com.getdistricts(value).subscribe((m) => {

        this.alldistrictlst = m.lstModel;
      });
    } else {
      this.alldistrictlst = []; this.allcitylst = [];
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



  get f() { return this.userForm.controls; }

  Save() {



    //   const controls = this.userForm.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {

    //  }
    // }

    this.submitted = true;
    if (this.userForm.valid) {
      this.spinner.show();
      let data = this.userForm.value;
      data.AdminId = parseInt(data.AdminId);
      data.UserTypeId = parseInt(data.UserTypeId);
      data.StateId = parseInt(data.StateId);
      data.DistrictId = parseInt(data.DistrictId);
      data.CityId = parseInt(data.CityId);
      data.Status = parseInt(data.Status);


      this.ads.updateprofile(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.Notification.showSuccess("Update successfully", "");


        } else {
          this.Notification.showError(m.message, "")
          this.spinner.hide();
        }
      }, err => {

        this.Notification.showError("something went wrong", "")
        this.spinner.hide();

      })


    }

  }
}
