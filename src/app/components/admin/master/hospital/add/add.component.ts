import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { NotificationService } from '../../../../../services/notification.service'
import { CommonService } from "../../../../../services/common.service";

import { HospitalService } from "../../../../../services/hospital.service";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class HospitalAddComponent implements OnInit {
  submitted = false;
  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;


  activstatus: boolean = true;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  userForm = new FormGroup({


    userTypeId: new FormControl(1, Validators.required),
    hospitalName: new FormControl('', Validators.required),
    countryId: new FormControl(1, Validators.required),
    stateId: new FormControl('', Validators.required),
    districtId: new FormControl('', Validators.required),
    cityId: new FormControl('', Validators.required),
    hospitalAddress: new FormControl('', Validators.required),
    hospitalLicenseNumber: new FormControl('', Validators.required),
    ownerName: new FormControl('', Validators.required),
    ownerMobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    contactName: new FormControl('', Validators.required),
    contactMobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    pinCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    hospitalLink: new FormControl('', [Validators.required, Validators.pattern(this.reg)]),
    status: new FormControl(true, Validators.required),

  })



  constructor(

    private nav: Router, public Notification: NotificationService, private com: CommonService,
    private sv: HospitalService,private spinner: NgxSpinnerService



  ) { }

  ngOnInit() {
    this.com.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });

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
      this.spinner.show();
      data.userTypeId = parseInt(data.userTypeId);
      data.stateId = parseInt(data.stateId);
      data.districtId = parseInt(data.districtId);
      data.cityId = parseInt(data.cityId);
      if (data.status == true) {
        data.status = 1;
      }
      else {
        data.status = 0;
      }
      this.sv.Save(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.Notification.showSuccess("Save successfully", "");
          this.spinner.hide();
          this.nav.navigateByUrl('/admin/hospital');
        } else {
          this.Notification.showError(m.message, "");
          this.spinner.hide();
        }
      }, err => {
        this.spinner.hide();
        this.Notification.showError("something went wrong", "")

      })
    }

  }

  onStateSelected(value: string) {
    this.alldistrictlst = [];
    
    this.allcitylst = [];
  

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
  
    if (value != "" && value != undefined) {
      this.com.getcity(value).subscribe((m) => {

        this.allcitylst = m.lstModel;
      });
    } else {
      this.allcitylst = [];
    }

  }

}
