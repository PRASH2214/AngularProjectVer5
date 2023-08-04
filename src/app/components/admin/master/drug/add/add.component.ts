import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { DrugService } from "../../../../../services/drug.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class DrugAddComponent implements OnInit {
  submitted = false;

  DrugForm = new FormGroup({


    DrugName: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required)


  })
  constructor(

    private nav: Router,
    private sv: DrugService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }

  ngOnInit() {


  }



  get f() { return this.DrugForm.controls; }

  Save() {

    this.submitted = true;



    if (this.DrugForm.valid) {
      this.spinner.show();
      let data = this.DrugForm.value;

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
