import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { SpecialityService } from "../../../../../services/speciality.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class SpecialityAddComponent implements OnInit {
  submitted = false;


  allhospitallst: any;


  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  SpecialityForm = new FormGroup({


    SpecialityName: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required)


  })
  constructor(

    private nav: Router,
    private sv: SpecialityService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }

  ngOnInit() {


  }



  get f() { return this.SpecialityForm.controls; }

  Save() {

    this.submitted = true;


    //   const controls = this.userForm.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {

    //  }
    // }

    if (this.SpecialityForm.valid) {
      this.spinner.show();

      let data = this.SpecialityForm.value;

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

          this.nav.navigateByUrl('/admin/speciality');
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





}
