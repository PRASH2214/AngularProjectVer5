import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { SlotService } from "../../../../../services/slot.service";

import { CommonService } from "../../../../../services/common.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";
import { partitionArray } from '@angular/compiler/src/util';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class SlotEditComponent implements OnInit {
  submitted = false;
  allhospitallst: any;
  allbranchlst: any;
  alldepartmentlst: any[];


  SlotForm = new FormGroup({

    MasterSlotId: new FormControl('', Validators.required),
    SlotFromTime: new FormControl('', Validators.required),
    SlotEndTime: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required),


  })
  slotinfo: any;
  constructor(

    private nav: Router,
    private sv: SlotService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
    ,
    public _cs: CommonService,
    public _route: ActivatedRoute


  ) { }

  ngOnInit() {





    this._route.params.subscribe(



      params => {


        this.sv.GetById(params["id"]).subscribe((m) => {
          this.slotinfo = m.model;



          Object.getOwnPropertyNames(this.slotinfo).forEach((key) => {
            if (this.SlotForm.contains(key)) {


              var SlotFromTimeminute = "";
              var SlotFromTimehours = "";

              if (this.slotinfo.SlotFromTime.minutes <= 9) {

                SlotFromTimeminute = "0" + this.slotinfo.SlotFromTime.minutes;
              } else {
                SlotFromTimeminute = this.slotinfo.SlotFromTime.minutes;
              }

              if (this.slotinfo.SlotFromTime.hours <= 9) {

                SlotFromTimehours = "0" + this.slotinfo.SlotFromTime.hours
              } else {
                SlotFromTimehours = this.slotinfo.SlotFromTime.hours
              }


         

              this.SlotForm.controls['SlotFromTime'].setValue(SlotFromTimehours + ":" + SlotFromTimeminute);




              var SlotEndTimeminute = "";
              var SlotEndTimehours = "";
              if (this.slotinfo.SlotEndTime.minutes <= 9) {

                SlotEndTimeminute = "0" + this.slotinfo.SlotEndTime.minutes;
              } else {
                SlotEndTimeminute = this.slotinfo.SlotEndTime.minutes;
              }

              if (this.slotinfo.SlotEndTime.hours <= 9) {

                SlotEndTimehours = "0" + this.slotinfo.SlotEndTime.hours
              } else {
                SlotEndTimehours = this.slotinfo.SlotEndTime.hours
              }


              this.SlotForm.controls['SlotEndTime'].setValue(SlotEndTimehours + ":" + SlotEndTimeminute);



              this.SlotForm.controls[key].setValue(m.model[key]);
              if (key == "Status") {

                if (m.model[key] == "1") {
                  this.SlotForm.controls["Status"].setValue(true);
                } else {
                  this.SlotForm.controls["Status"].setValue(false);
                }
              }


            }
          })
        });

      })


  }



  get f() { return this.SlotForm.controls; }


  Save() {

    this.submitted = true;
    if (this.SlotForm.valid) {
      let data = this.SlotForm.value;
      data.MasterSlotId = parseInt(data.MasterSlotId);
      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }


      var timeStart = new Date("01/01/2007 " + this.SlotForm.controls['SlotFromTime'].value);
      var timeEnd = new Date("01/01/2007 " + this.SlotForm.controls['SlotEndTime'].value);


      if (timeStart >= timeEnd) {
        this.notifyService.showError("Slot End Time should be greater  than Slot From Time", "");
        this.spinner.hide();
        return false;
      }

      this.sv.Update(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.notifyService.showSuccess("Update successfully", "");

          this.nav.navigateByUrl('/admin/slot');
        } else {
          this.notifyService.showError(m.message, "")
        }
      }, err => {

        this.notifyService.showError("something went wrong", "")

      })
    }

  }







}
