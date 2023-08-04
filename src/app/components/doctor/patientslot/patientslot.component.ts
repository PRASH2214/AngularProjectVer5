import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../services/common.service";

import { DoctorProfileService } from "../../../services/doctorprofile.service";
import { SpecialityService } from "../../../services/speciality.service";

import { NotificationService } from '../../../services/notification.service'
import { MasterService } from "./../../../services/master";
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
// calendar.component.ts
import { Moment } from 'moment';
import { CalendarComponent } from '../calendar/calendar.component';
import * as moment from 'moment';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-patientslot',
  templateUrl: './patientslot.component.html',
  styleUrls: ['./patientslot.component.css']
})
export class PatientSlotComponent implements OnInit {
  @ViewChild('myCalendar', { static: true })
  myCalendar: CalendarComponent;
  slotDate: Date;
  alldayslst: any;
  sloatdatalst: any;

  dayid: any;
  dayname: any;
  sloatdate: Date;
  btnshow: boolean;
  sloattype: number = 4;


  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: DoctorProfileService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
    , public Notification: NotificationService,
    private _route: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    public spscv: SpecialityService,
    public datepipe: DatePipe




  ) { }

  ngOnInit() {
    this.slotDate = new Date(Date.now());

    this.commonsv.getmasterdays().subscribe((m) => {

      this.alldayslst = m.lstModel;
      this.bindslot(this.slotDate, r);
    });
    this.btnshow = true;

    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    var r = weekdays[this.slotDate.getDay()];



  }




  typechange(staus) {

    this.sloattype = staus;



    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    var r = weekdays[this.slotDate.getDay()];
    this.bindslot(this.slotDate, r);
  }

  dateSelected(value: Moment) {

    var selecteddate = new Date(value.toString());
    this.slotDate = selecteddate;
    var temptime = this.datepipe.transform(new Date(), 'MM-dd-yyyy')

    let current_date = new Date(temptime);


    if (selecteddate < current_date) {
      this.btnshow = false;
    } else {
      this.btnshow = true;

    }


    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    var r = weekdays[selecteddate.getDay()];
    this.bindslot(selecteddate, r);
  }


  Save() {

    var sendresulatdata = [];
    var resultdata = this.sloatdatalst.filter(m => m.IsActive == true);
    for (let i = 0; i < resultdata.length; i++) {

      var objslot = {
        "masterSlotId": resultdata[i].MasterSlotId,
        "dayId": resultdata[i].DayId,
        "status": 1,
        "dayName": resultdata[i].DayName,
        "slotDepartmentTimeId": resultdata[i].SlotDepartmentTimeId,
        "slotFromTime": this.conunttime(resultdata[i].SlotFromTime.totalSeconds),
        "slotEndTime": this.conunttime(resultdata[i].SlotEndTime.totalSeconds),
        "slotDate": this.sloatdate,
        "noOfPatientsAllowed": resultdata[i].NoOfPatientsAllowed,
        "noOfPatientsBooked": 0,
        "slotTimePerPatient": 0,
        "forUserTypeId": this.sloattype
      }


      sendresulatdata.push(objslot);
    }




    if (sendresulatdata.length != 0) {
      this.sv.InsertSlots(sendresulatdata).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.Notification.showSuccess("Update successfully", "");


        } else {
          this.Notification.showError(m.message, "")
          this.spinner.hide();
        }
      }, err => {

        this.Notification.showError("something went wrong", "")
        this.spinner.hide();

      })

    } else {
      this.Notification.showError("Please select at Least one slot", "")
    }


  }


  conunttime(totalsecond) {

    const duration = moment.duration(totalsecond, 'seconds');
    const resultstring = moment.utc(duration.asMilliseconds()).format('HH:mm');

    return resultstring;
  }


  bindslot(sloatdate: any, dayname: string) {



    this.sloatdatalst = [];
    var daylst = this.alldayslst.filter(entity => entity.DayName == dayname);

    var dayid = daylst[0].DayId;

    this.dayid = dayid;
    this.dayname = dayname;
    this.sloatdate = new Date();
    this.sloatdate.setDate(sloatdate.getDate());

    var bindjson = {
      "dayId": dayid,
      "dayName": dayname,
      "slotDate": this.sloatdate,
      "forUserTypeId": this.sloattype
    }


    this.sv.GetSlots(bindjson).subscribe((m) => {
      if (m.success == true && m.status == 1) {

        if (m.lstModel != null) {
          this.spinner.hide();
          this.sloatdatalst = m.lstModel;

          for (let i = 0; i < this.sloatdatalst.length; i++) {

            if (this.sloatdatalst[i].IsActive == 1) {

              this.sloatdatalst[i].IsActive = true;

            } else {
              this.sloatdatalst[i].IsActive = false;
            }
          }




        } else {

          this.spinner.hide();
          this.notifyService.showSuccess("Slot Not available", "");

        }


      } else {
        this.notifyService.showError(m.message, "")
        this.spinner.hide();
      }
    }, err => {

      this.notifyService.showError("something went wrong", "")
      this.spinner.hide();

    })
  }
}
