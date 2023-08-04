
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/services/Connection.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MasterService } from '../.../../../../services/master';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { DoctorConsultationService } from '../../../services/doctorconsultation.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-mrappointmentlist',
  templateUrl: './mrappointmentlist.component.html',
  styleUrls: ['./mrappointmentlist.component.css']
})
export class MrAppointmentlistComponent implements OnInit {

  allappointmentlst: any;
  patientdetail: any;

  config: any = {
    "searchValue": "",
    "currentPage": 1,
    "skip": 0,
    "itemsPerPage": 10,
    "totalItems": 0,
    "status": 0,
    "doctorId": 0
  }
  allpastappointmentlst: any;


  constructor(

    private nav: Router,
    private connectionService: ConnectionService,
    private spinner: NgxSpinnerService,
    private _srv: DoctorConsultationService,
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
    this._srv.getmrtodayappointments(this.config).subscribe((m) => {

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
    this._srv.getmrpastconsultations(this.config).subscribe((m) => {

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


  InitiateCall(row) {
    this.spinner.show();
    var DoctorConnectionId = "D" + row.DoctorId;
    var MRconnectionId = "M" + row.MRId;// + this.master.CurrentUser.model.DoctorId;
    var ConsultationId = row.MRTeleConsultationId;// + this.master.CurrentUser.model.DoctorId;
    var name = this.master.CurrentUser.model.firstName + " " + this.master.CurrentUser.model.middleName + " " + this.master.CurrentUser.model.lastName;
    this.master.teleConsultationId = ConsultationId;
    this.connectionService.callMRinitiated(DoctorConnectionId, MRconnectionId, ConsultationId, name).subscribe((m) => {
      if (m == false) {
        Swal.fire({
          title: "Not Available!",
          text: "User not Available.",
          type: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
        this.spinner.hide();
      }

    }, err => {

    });


  }


}
