
import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { MasterService } from '../.../../../../services/master';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { MRProfileService } from '../../../services/mrprofile.service'
@Component({
  selector: 'app-appointmentlist',
  templateUrl: './appointmentlist.component.html',
  styleUrls: ['./appointmentlist.component.css']
})
export class MrAppointmentlistComponent implements OnInit {

  allappointmentlst: any;
  patientdetail: any;

  config: any = {
    "searchValue": "",
    "currentPage": 1,
    "skip": 0,
    "itemsPerPage": 0,
    "totalItems": 0,
    "status": 0,
    "doctorId": 0
  }
  allpastappointmentlst: any;


  constructor(

    private nav: Router,

    private spinner: NgxSpinnerService,
    private _srv: MRProfileService,
    public dialog: MatDialog,
    public master: MasterService


  ) { }




  ngOnInit(): void {
    this.config.itemsPerPage = this.master.TablepageSize[0];
    this.Refresh();
  }


  pageChanged(event) {
    this.config.currentPage = event;
    this.Refresh();

  }


  Refresh() {

    this.spinner.show();
    this._srv.gettodayappointments(this.config).subscribe((m) => {

      this.allappointmentlst = m.lstModel;
      if (this.allappointmentlst != undefined) {
        this.spinner.hide();
        this.config.totalItems = m.lstModel[0].TotalItems;
      } else {
        this.spinner.hide();
        this.config.totalItems = 0;
      }


    }, err => {
      this.spinner.hide();
    });

  }


  pastconsultation() {

    this.spinner.show();
    this._srv.getpastconsultations(this.config).subscribe((m) => {

      this.allpastappointmentlst = m.lstModel;

      if (this.allpastappointmentlst != undefined) {
        this.spinner.hide();
        this.config.totalItems = m.lstModel[0].TotalItems;
      } else {
        this.spinner.hide();
        this.config.totalItems = 0;
      }


    }, err => {
      this.spinner.hide();
    });

  }



}
