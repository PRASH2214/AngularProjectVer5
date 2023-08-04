import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import { CommonService } from "../../../services/common.service";

import { ExcelService } from '../../../services/excel.service';
import { ReportService } from "../../../services/report.service";

import { MatCalendar } from '@angular/material/datepicker';

import { NotificationService } from '../../../services/notification.service'

import { NgxSpinnerService } from "ngx-spinner";

import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

const moment = _moment;
import { DatePipe } from '@angular/common';


/** @title Datepicker emulating a Year and month picker */
@Component({
  selector: 'patientmrsummarydoctor',
  templateUrl: 'patientmrsummarydoctor.component.html'
})
export class PatientMRSummaryDoctorComponent {
  date1 = new FormControl(moment());
  date2 = new FormControl(moment());
  HospitalId = new FormControl('0');
  allhospitallst: any;
  Searchlst: any;
  reporttype: any = 0;
  dispreporttype: number;
  ExcelPrintSearchlst: any = [];
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private _srv: ReportService, private excelService: ExcelService, public datepipe: DatePipe,
    public notifyService: NotificationService, private spinner: NgxSpinnerService,
  ) { }


  ngOnInit() {


   

  }


  typechange(staus) {

    this.reporttype = staus;

    this.dispreporttype = 0;

  }

  search(Datefrom, DateTo) {



    var sendjson = {
      "hospitalId": 0,
      "doctorId": 0,
      "fromDate": new Date(this.datepipe.transform(new Date(this.date1.value), 'yyyy-MM-ddT00:00:00')),
      "toDate": new Date(this.datepipe.transform(new Date(this.date2.value), 'yyyy-MM-ddT24:00:00')),
    }
    this.dispreporttype = this.reporttype;

    var fdata = new Date(this.datepipe.transform(new Date(this.date1.value), 'yyyy-MM-dd'));
    var todate = new Date(this.datepipe.transform(new Date(this.date2.value), 'yyyy-MM-dd'))


    if (todate < fdata) {

      this.notifyService.showError("Please select valid month and year", "");
      return false;

    }


    if (this.dispreporttype == 1) {


      this._srv.getpatientappointmentdetailbydoctor(sendjson).subscribe((m) => {

        this.Searchlst = m.lstModel;



      }, err => {
        this.spinner.hide();
      });


    } else if (this.dispreporttype == 2) {


      this._srv.getmrappointmentdetailbydoctor(sendjson).subscribe((m) => {

        this.Searchlst = m.lstModel;



      }, err => {
        this.spinner.hide();
      });


    }
    else {

      this.notifyService.showError("Please select report type", "")

    }


  }


  captureScreenpdf(Datefrom, DateTo) {



    for (let i = 0; i < this.Searchlst.length; i++) {


      if (this.dispreporttype == 1) {
        let printjson = {
          "Sr No.": i + 1,
          "Hospital Name": this.Searchlst[i].HospitalName,
          "Branch": this.Searchlst[i].BranchName,
          "Doctor Name": this.Searchlst[i].DoctorName,
          "Department": this.Searchlst[i].DepartmentName,
          "Appointment Type": (this.Searchlst[i].AppointmentType == 1 ? "Online Appointment" : "Offline Appointment"),
          "Date": formatDate(this.Searchlst[i].MonthYear, 'dd-MM-yyyy', 'en'),
          "Patient First Name": this.Searchlst[i].FirstName,
          "Patient Last Name": this.Searchlst[i].LastName,
          "Gender": (this.Searchlst[i].Gender == 1 ? "Male" : "Female"),
          "State": this.Searchlst[i].StateName,
          "District": this.Searchlst[i].DistrictName,
          "City": this.Searchlst[i].CityName,
          "Address": this.Searchlst[i].Address,
          "Mobile Number": this.Searchlst[i].Mobile,
          "Email Address": this.Searchlst[i].EmailAddres,
          "DOB": formatDate(this.Searchlst[i].DOB, 'dd-MM-yyyy', 'en'),
          "Pincode": this.Searchlst[i].PinCode,
          "Concern": this.Searchlst[i].Concern
        }


        this.ExcelPrintSearchlst.push(printjson);
      } else {
        let printjson = {
          "Sr No.": i + 1,
          "Hospital Name": this.Searchlst[i].HospitalName,
          "Branch": this.Searchlst[i].BranchName,
          "Doctor Name": this.Searchlst[i].DoctorName,
          "Department": this.Searchlst[i].DepartmentName,
          "Appointment Type": (this.Searchlst[i].AppointmentType == 1 ? "Online Appointment" : "Offline Appointment"),
          "Date": formatDate(this.Searchlst[i].Date, 'MM-yyyy', 'en'),
          "MR First Name": this.Searchlst[i].FirstName,
          "MR Last Name": this.Searchlst[i].LastName,
          "Gender": (this.Searchlst[i].Gender == 1 ? "Male" : "Female"),
          "State": this.Searchlst[i].StateName,
          "District": this.Searchlst[i].DistrictName,
          "City": this.Searchlst[i].CityName,
          "Address": this.Searchlst[i].Address,
          "Mobile Number": this.Searchlst[i].Mobile,       
          "DOB": formatDate(this.Searchlst[i].DOB, 'dd-MM-yyyy', 'en'),
          "Pincode": this.Searchlst[i].PinCode,
        
        }
        this.ExcelPrintSearchlst.push(printjson);
      }



    }

    this.excelService.exportAsExcelFile(this.ExcelPrintSearchlst, 'Apoointmentreport');

  }

}
