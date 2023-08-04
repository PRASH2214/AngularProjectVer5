import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { SlotService } from "../../../../../services/slot.service";

import { CommonService } from "../../../../../services/common.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";
import { partitionArray } from '@angular/compiler/src/util';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class SlotAddComponent implements OnInit {
  submitted = false;
  allhospitallst: any;
  allbranchlst: any;
  alldepartmentlst: any[];


  SlotForm = new FormGroup({


    // slotTimeID: new FormControl('', Validators.required),
    SlotFromTime: new FormControl('', Validators.required),
    SlotEndTime: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required),


  })
  constructor(

    private nav: Router,
    private sv: SlotService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
    ,
    public _cs: CommonService


  ) { }

  ngOnInit() {



  }



  get f() { return this.SlotForm.controls; }



  Save() {



    this.submitted = true;
    if (this.SlotForm.valid) {

      this.spinner.show();

      var timeStart = new Date("01/01/2007 " + this.SlotForm.controls['SlotFromTime'].value);
      var timeEnd = new Date("01/01/2007 " + this.SlotForm.controls['SlotEndTime'].value);


      if (timeStart >= timeEnd) {
        this.notifyService.showError("Slot End Time should be greater  than Slot From Time", "");
        this.spinner.hide();
        return false;
      }
      let data = this.SlotForm.value;
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
          this.nav.navigateByUrl('/admin/slot');
        } else {
          this.notifyService.showError(m.message, "");
          this.spinner.hide();
        }
      }, err => {

        this.notifyService.showError("something went wrong", "")
        this.spinner.hide();
      })
    }

  }





}
