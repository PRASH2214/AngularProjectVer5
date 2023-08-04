import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { DosageService } from "../../../../../services/dose.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class DosageAddComponent implements OnInit {
  submitted = false;

  DosagForm = new FormGroup({


    DosageValue: new FormControl('', Validators.required),
    DosageRemarks: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required)


  })
  constructor(

    private nav: Router,
    private sv: DosageService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }

  ngOnInit() {


  }



  get f() { return this.DosagForm.controls; }

  Save() {

    this.submitted = true;



    if (this.DosagForm.valid) {
      this.spinner.show();
      let data = this.DosagForm.value;

      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }

      this.sv.Save(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.notifyService.showSuccess("Add successfully", "");

          this.nav.navigateByUrl('/admin/dosage');
        } else {
          this.notifyService.showError(m.message, "");
          this.spinner.hide();
        }
      }, err => {

        this.notifyService.showError("something went wrong", "");
        this.spinner.hide();

      })
    }

  }




}
