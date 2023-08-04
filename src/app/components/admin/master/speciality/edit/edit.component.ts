import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SpecialityService } from "../../../../../services/speciality.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";

import { NgxSpinnerService } from "ngx-spinner";

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class SpecialityEditComponent implements OnInit {

  submitted = false;


  allhospitallst: any;


  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  SpecialityForm = new FormGroup({

    SpecialityId: new FormControl('', Validators.required),
    SpecialityName: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required)


  })
  specialityinfo: any;
  constructor(

    private nav: Router,
    private sv: SpecialityService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
,
    public _route: ActivatedRoute


  ) { }

  ngOnInit() {



    this._route.params.subscribe(



      params => {

        this.spinner.show();

        this.sv.GetById(params["id"]).subscribe((m) => {
          this.specialityinfo = m.model;
          this.spinner.hide();

          Object.getOwnPropertyNames(this.specialityinfo).forEach((key) => {
            if (this.SpecialityForm.contains(key)) {
              this.SpecialityForm.controls[key].setValue(m.model[key]);




            }
          })
        });

      })
  }



  get f() { return this.SpecialityForm.controls; }

  Save() {

    this.submitted = true;

    this.spinner.show();


    if (this.SpecialityForm.valid) {
      let data = this.SpecialityForm.value;
      data.SpecialityId = parseInt(data.SpecialityId);
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
