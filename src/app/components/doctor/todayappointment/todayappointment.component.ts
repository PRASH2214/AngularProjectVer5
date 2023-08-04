
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/services/Connection.service';
import { MasterService } from 'src/app/services/master';
import { NgxSpinnerService } from "ngx-spinner";
import { DoctorConsultationService } from 'src/app/services/doctorconsultation.service';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from '../../../services/notification.service'
import { ConfimrRefundApprovalDialog } from 'src/app/popups/doctorrefundapproval';
import { ConfimrPatientinfoDialog } from 'src/app/popups/patientinfo';

import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-drug',
  templateUrl: './todayappointment.component.html',
  styleUrls: ['./todayappointment.component.css']
})
export class TodayAppointmentComponent implements OnInit {

  allappointmentlst: any;
  patientdetail: any;

  config: any = {
    "searchValue": "",
    "currentPage": 1,
    "skip": 0,
    "itemsPerPage": 0,
    "totalItems": 0,
    "status": 0
  }


  constructor(

    private nav: Router,
    public master: MasterService,
    private spinner: NgxSpinnerService,
    private _srv: DoctorConsultationService,
    private connectionService: ConnectionService,
    public dialog: MatDialog,
    public notifyService: NotificationService,

  ) { }


  InitiateCall(row) {
    this.spinner.show();
    var DoctorConnectionId = "D" + this.master.CurrentUser.model.doctorId;
    var PatientonnectionId = "P" + row.PatientId;// + this.master.CurrentUser.model.DoctorId;
    var ConsultationId = row.PatientTeleConsultationId;// + this.master.CurrentUser.model.DoctorId;
    var name = this.master.CurrentUser.model.firstName + " " + this.master.CurrentUser.model.middleName + " " + this.master.CurrentUser.model.lastName;
    this.master.teleConsultationId = ConsultationId;
    this.connectionService.callinitiated(DoctorConnectionId, PatientonnectionId, ConsultationId, name).subscribe((m) => {
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


  offcline(row) {
    this.spinner.show();

    var ConsultationId = row.PatientTeleConsultationId;// + this.master.CurrentUser.model.DoctorId;
    this.master.teleConsultationId = ConsultationId;

    this.nav.navigateByUrl('/doctor/consultationoffline');



  }


  completecase(objconsulatation) {
    this.nav.navigateByUrl('/doctor/viewsprescription/' + objconsulatation.PatientTeleConsultationId);
  }




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
    this._srv.GetAppointments(this.config).subscribe((m) => {

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





  RefundAmount(row) {
    const dialogRef = this.dialog.open(ConfimrRefundApprovalDialog, {
      width: "450px",
      data: { Message: "Are you sure to Refund Approve ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Confirmation == true) {
        var data = {

          refundResponseReason: result.Reason,
          consultationReferenceNumber: row.ConsultationReferenceNumber,
          patientId: parseInt(row.PatientId),
          status: parseInt(result.Reasontype)
        };


        this._srv.refundresponse(data).subscribe((m) => {
          if (m.success == true && m.status == 1) {

            this.notifyService.showSuccess("Refund Request successfully done", "");
            this.config.itemsPerPage = this.master.TablepageSize[0];
            this.Refresh();

          } else {
            this.spinner.hide();

            this.notifyService.showError(m.message, "")
          }
        }, err => {
          this.spinner.hide();

          this.notifyService.showError("something went wrong", "")

        })

      }
    });


  }


  GetProfile(row) {


    this.master.Id = row.PatientId;
    const dialogRef = this.dialog.open(ConfimrPatientinfoDialog, {
      width: "450px",
      data: { Message: "" },
    });
  }
}
