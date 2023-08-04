import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { DosageService } from "../../../../../services/dose.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "../../../../../services/master";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class DosageEditComponent implements OnInit {
  submitted = false;

  DosagForm = new FormGroup({

    DosageValueId: new FormControl('', Validators.required),
    DosageValue: new FormControl('', Validators.required),
    DosageRemarks: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required)


  })
  Dosaginfo: any;
  constructor(

    private nav: Router,
    private sv: DosageService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
    ,
    public _route: ActivatedRoute

  ) { }

  ngOnInit() {


    this._route.params.subscribe(



      params => {


        this.sv.GetById(params["id"]).subscribe((m) => {
          this.Dosaginfo = m.model;
          Object.getOwnPropertyNames(this.Dosaginfo).forEach((key) => {
            if (this.DosagForm.contains(key)) {
              this.DosagForm.controls[key].setValue(m.model[key]);


              if (key == "Status") {

                if (m.model[key] == "1") {
                  this.DosagForm.controls["Status"].setValue(true);
                } else {
                  this.DosagForm.controls["Status"].setValue(false);
                }
              }


            }
          })
        });

      })

  }



  get f() { return this.DosagForm.controls; }

  Save() {

    this.submitted = true;



    if (this.DosagForm.valid) {
      let data = this.DosagForm.value;
      data.DosageValueId = parseInt(data.DosageValueId)
      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }

      this.sv.Update(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.notifyService.showSuccess("Update successfully", "");

          this.nav.navigateByUrl('/admin/dosage');
        } else {
          this.notifyService.showError(m.message, "")
        }
      }, err => {

        this.notifyService.showError("something went wrong", "")

      })
    }

  }




}
