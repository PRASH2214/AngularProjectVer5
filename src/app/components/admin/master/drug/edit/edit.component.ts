import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { DrugService } from "../../../../../services/drug.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from '../../../../../services/master';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class DrugEditComponent implements OnInit {
  submitted = false;
  druginfo: any;
  DrugForm = new FormGroup({

    DrugId: new FormControl('', Validators.required),
    DrugName: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required)


  })
  constructor(

    private nav: Router,
    private sv: DrugService,
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
          this.druginfo = m.model;
          Object.getOwnPropertyNames(this.druginfo).forEach((key) => {
            if (this.DrugForm.contains(key)) {
              this.DrugForm.controls[key].setValue(m.model[key]);


              this.spinner.hide();

            }
          })
        });

      })
  }



  get f() { return this.DrugForm.controls; }

  Save() {

    this.submitted = true;



    if (this.DrugForm.valid) {
      this.spinner.show();
      let data = this.DrugForm.value;
      data.DrugId = parseInt(data.DrugId);
      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }

      this.sv.Update(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.notifyService.showSuccess("Update successfully", "");
          this.spinner.hide();
          this.nav.navigateByUrl('/admin/drug');
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
