import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../../services/common.service";

import { DepartmentService } from "../../../../../services/department.service";

import { NotificationService } from '../../../../../services/notification.service'

import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-departmentslot',
  templateUrl: './departmentslot.component.html',

})
export class DepartmentslotComponent implements OnInit {
  submitted = false;

  Departmentid: any;
  DaysId: any;
  alldayslst: any;
  allsloatlst: any = [];
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: DepartmentService,
    private _route: ActivatedRoute,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }




  ngOnInit() {



    this.commonsv.getmasterdays().subscribe((m) => {

      this.alldayslst = m.lstModel;

    });



    this._route.params.subscribe(



      params => {


        this.Departmentid = params["id"];

      })
  }




  onDaysSelected(value: string) {
    this.allsloatlst = [];
    if (value != "" && value != undefined) {


      var dayarray = this.alldayslst.filter(entity => entity.DayId == value);
      var senddayjson = {
        "departmentId": parseInt(this.Departmentid),
        "dayId": parseInt(value),
        "dayName": dayarray[0].DayName
      }


      this.sv.GetSlots(senddayjson).subscribe((m) => {

        this.allsloatlst = m.lstModel;
      });
    } else {
      this.allsloatlst = [];
    }

  }




  TimeFunction(timeObj) {
    return timeObj.hours + ':' + timeObj.minutes;
  }



  tConverttime(time) {
    // Check correct time format and split into components
      time = time.substring(0, time.length - 3);

    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }


  Save() {



    var datasend = this.allsloatlst.filter(entity => entity.isActive == true);

    this.sv.InsertSlots(datasend).subscribe((m) => {
      if (m.success == true && m.status == 1) {

        this.notifyService.showSuccess("Add successfully", "");
        this.DaysId = "";
        this.allsloatlst = [];
        // this.nav.navigateByUrl('/admin/department');

      } else {
        this.notifyService.showError(m.message, "")
      }
    }, err => {

      this.notifyService.showError("something went wrong", "")

    })
  }
}
