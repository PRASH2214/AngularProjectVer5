import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../services/common.service";

import { AdminUsersService } from "../../../../services/adminuser.service";


import { SpecialityService } from "../../../../services/speciality.service";
import { MatCalendar } from '@angular/material/datepicker';

import { NotificationService } from '../../../../services/notification.service'
import { MasterService } from "../../../../services/master";
import { NgxSpinnerService } from "ngx-spinner";

import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class AdminUserAddComponent implements OnInit {
  submitted = false;


  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  userForm = new FormGroup({

   
    UserTypeId: new FormControl('1', Validators.required),
    AdminName: new FormControl('', Validators.required),
    StateId: new FormControl('', Validators.required),
    DistrictId: new FormControl('', Validators.required),
    CityId: new FormControl('', Validators.required),
    Address: new FormControl('', Validators.required),
    AdminMobile: new FormControl('', Validators.required),

    ClientName: new FormControl('', Validators.required),
    WebUrl: new FormControl('', [Validators.required, Validators.pattern(this.reg)]),
    MrUrl: new FormControl('', [Validators.required, Validators.pattern(this.reg)])
  })


  constructor(

    private nav: Router,
    private com: CommonService,
    public master: MasterService,
    public Notification: NotificationService, private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public srv: AdminUsersService



  ) { }


  ngOnInit() {




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

 

    this.submitted = true;
    if (this.userForm.valid) {
      this.spinner.show();
      let data = this.userForm.value;
     
      data.UserTypeId = parseInt(data.UserTypeId);
      data.StateId = parseInt(data.StateId);
      data.DistrictId = parseInt(data.DistrictId);
      data.CityId = parseInt(data.CityId);



      this.srv.Save(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.Notification.showSuccess("Update successfully", "");
          this.nav.navigateByUrl('/control/dashboard');

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
