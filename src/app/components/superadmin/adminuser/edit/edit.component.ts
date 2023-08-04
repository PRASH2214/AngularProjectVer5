import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../services/common.service";

import { AdminUsersService } from "../../../../services/adminuser.service";


import { NotificationService } from '../../../../services/notification.service'
import { MasterService } from "../../../../services/master";
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class AdminuserEditComponent implements OnInit {
  submitted = false;
  allhospitallst: any;
  startDate: Date;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

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
  admininfo: any;

  constructor(

    private nav: Router,
    private com: CommonService,
    public srv: AdminUsersService,
    public master: MasterService,
    public Notification: NotificationService, private spinner: NgxSpinnerService
    ,
    private _route: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MatDialog



  ) { }


  ngOnInit() {




    this._route.params.subscribe(



      params => {

        this.srv.GetById(params["id"]).subscribe((m) => {
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


      this.srv.Update(data).subscribe((m) => {
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