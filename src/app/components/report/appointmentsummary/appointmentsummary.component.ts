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
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfimrAddSpecialityDialog } from 'src/app/popups/addspeciality';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

const moment = _moment;
import { DatePipe } from '@angular/common';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/** @title Datepicker emulating a Year and month picker */
@Component({
  selector: 'appointmentsummary',
  templateUrl: 'appointmentsummary.component.html',
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AppointmentSummaryComponent {
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
    private _srv: ReportService, private excelService: ExcelService,
    public master: MasterService, public datepipe: DatePipe,
    public notifyService: NotificationService, private spinner: NgxSpinnerService,
  ) { }


  ngOnInit() {


    this.commonsv.getactivehospitals().subscribe((m) => {

      this.allhospitallst = m.lstModel;

    });

  }
  chosenYearHandler1(normalizedYear: Moment) {
    const ctrlValue = this.date1.value;
    ctrlValue.year(normalizedYear.year());
    this.date1.setValue(ctrlValue);
  }

  chosenMonthHandler1(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date1.value;
    ctrlValue.month(normalizedMonth.month());
    this.date1.setValue(ctrlValue);
    datepicker.close();
  }



  chosenYearHandler2(normalizedYear: Moment) {
    const ctrlValue = this.date2.value;
    ctrlValue.year(normalizedYear.year());
    this.date2.setValue(ctrlValue);
  }

  chosenMonthHandler2(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date2.value;
    ctrlValue.month(normalizedMonth.month());
    this.date2.setValue(ctrlValue);
    datepicker.close();
  }


  typechange(staus) {

    this.reporttype = staus;

    this.dispreporttype = 0;

  }

  search(Datefrom, DateTo, hosppitalddl) {



    var sendjson = {
      "hospitalId": parseInt(hosppitalddl.value),
      "doctorId": 0,
      "fromDate": new Date(this.datepipe.transform(new Date(this.date1.value), 'yyyy-MM-01')),
      "toDate": new Date(this.datepipe.transform(new Date(this.date2.value), 'yyyy-MM-31')),
    }
    this.dispreporttype = this.reporttype;

    var fdata = new Date(this.datepipe.transform(new Date(this.date1.value), 'yyyy-MM-01'));
    var todate = new Date(this.datepipe.transform(new Date(this.date2.value), 'yyyy-MM-01'))


    if (todate < fdata) {

      this.notifyService.showError("Please select valid month and year", "");
      return false;

    }


    if (this.dispreporttype == 1) {


      this._srv.getpatientappointmentsummary(sendjson).subscribe((m) => {

        this.Searchlst = m.lstModel;



      }, err => {
        this.spinner.hide();
      });


    } else if (this.dispreporttype == 2) {


      this._srv.getmrappointmentsummary(sendjson).subscribe((m) => {

        this.Searchlst = m.lstModel;



      }, err => {
        this.spinner.hide();
      });


    }
    else {

      this.notifyService.showError("Please select report type", "")

    }


  }


  captureScreenpdf(Datefrom, DateTo, hosppitalddl) {



    for (let i = 0; i < this.Searchlst.length; i++) {


      if (this.dispreporttype == 1) {
        let printjson = {
          "Sr No.": i + 1,
          "Hospital Name": this.Searchlst[i].hospitalName,
          "Branch": this.Searchlst[i].branchName,
          "Doctor Name": this.Searchlst[i].doctorName,
          "Department": this.Searchlst[i].departmentName,
          "Appointment Type": (this.Searchlst[i].appointmentType == 1 ? "Online Appointment" : "Offline Appointment"),
          "Month year": formatDate(this.Searchlst[i].monthYear, 'MM-yyyy', 'en'),
          "Total Patient Appointments": this.Searchlst[i].totalPatientAppointments,
          "Total Patient Consulted": this.Searchlst[i].totalPatientConsulted,
          "Total Fees Amount": this.Searchlst[i].totalFeesAmount,
          "Total Refund Amount": this.Searchlst[i].totalRefundAmount
        }


        this.ExcelPrintSearchlst.push(printjson);
      } else {
        let printjson = {
          "Sr No.": i + 1,
          "Hospital Name": this.Searchlst[i].hospitalName,
          "Branch": this.Searchlst[i].branchName,
          "Doctor Name": this.Searchlst[i].doctorName,
          "Department": this.Searchlst[i].departmentName,
          "Appointment Type": (this.Searchlst[i].appointmentType == 1 ? "Online Appointment" : "Offline Appointment"),
          "Month year": formatDate(this.Searchlst[i].monthYear, 'MM-yyyy', 'en'),
          "Total MR Appointments": this.Searchlst[i].totalMRAppointments,
          "Total MR Consulted": this.Searchlst[i].totalMRConsulted,
        }
        this.ExcelPrintSearchlst.push(printjson);
      }



    }

    this.excelService.exportAsExcelFile(this.ExcelPrintSearchlst, 'Apoointmentreport');

  }

}
