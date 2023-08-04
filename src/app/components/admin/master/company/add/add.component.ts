import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../../services/common.service";

import { CompanyService } from "../../../../../services/company.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";

import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class CompanyAddComponent implements OnInit {
  submitted = false;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  userForm = new FormGroup({    
    CompanyName: new FormControl('', Validators.required),
    CountryId: new FormControl('1', Validators.required),
    StateId: new FormControl('', Validators.required),
    DistrictId: new FormControl('', Validators.required),
    CityId:new FormControl('', Validators.required),
    CompanyAddress: new FormControl('', Validators.required),
    CompanyLicenseNumber: new FormControl('', Validators.required),
    SpocName: new FormControl('', Validators.required),
    SpocMobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    AdminName: new FormControl('', Validators.required),
    AdminMobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    PinCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    CompanyWebLink: new FormControl('',[Validators.required, Validators.pattern(this.reg)]),
    Status: new FormControl(true, Validators.required)
  })
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: CompanyService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }

  ngOnInit() {


  
    this.commonsv.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });


  }



  get f() { return this.userForm.controls; }

  Save() {

    this.submitted = true;


    if (this.userForm.valid) {
      let data = this.userForm.value;
      this.spinner.show();
      data.CountryId = parseInt(data.CountryId);
      data.StateId = parseInt(data.StateId);
      data.DistrictId = parseInt(data.DistrictId);
      data.CityId = parseInt(data.CityId);

      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }

      this.sv.Save(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.notifyService.showSuccess("Add successfully", "");
          this.spinner.hide();
          this.nav.navigateByUrl('/admin/company');
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

  onStateSelected(value: string) {
    this.alldistrictlst = [];
 
    this.allcitylst = [];
  
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
  

    if (value != "" && value != undefined) {
      this.commonsv.getcity(value).subscribe((m) => {

        this.allcitylst = m.lstModel;
      });
    } else {
      this.allcitylst = [];
    }

  }


}
