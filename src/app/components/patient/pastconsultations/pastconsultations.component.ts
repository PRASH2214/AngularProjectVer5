import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";
import { PatientConsultationService } from 'src/app/services/patientconsultation.service';
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from '../../../services/notification.service';
import { ConfimrRefundReasonDialog } from 'src/app/popups/patientrefund';
@Component({
  selector: 'app-drug',
  templateUrl: './pastconsultations.component.html',
  styleUrls: ['./pastconsultations.component.css']
})
export class PatientPastConsultationsComponent implements OnInit {

  allconsultationslst: any;
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
    private _srv: PatientConsultationService,
    public dialog: MatDialog,
    public notifyService: NotificationService,

  ) { }




  ngOnInit(): void {
    this.config.itemsPerPage = this.master.TablepageSize[0];
    this.Refresh();
  }


  pageChanged(event) {
    this.config.currentPage = event;
    this.Refresh();

  }
 
  GetProfile(row) {

    this.spinner.show();
    this._srv.GetPatientProfile(row.patientId).subscribe((m) => {
      if (m.status == 1) {
        this.patientdetail = m.model;
      }
      this.spinner.hide();
      alert(JSON.stringify(this.patientdetail));
    }, err => {
      this.spinner.hide();
    });

  }

  Refresh() {

    this.spinner.show();
    this._srv.getpastconsultations(this.config).subscribe((m) => {

      this.allconsultationslst = m.lstModel;
      if (this.allconsultationslst != undefined) {
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


  completecase(objconsulatation) {
    this.nav.navigateByUrl('/patient/viewsprescription/' + objconsulatation.PatientTeleConsultationId);
  }


  
  RefundAmount(row) {
    const dialogRef = this.dialog.open(ConfimrRefundReasonDialog, {
      width: "450px",
      data: { Message: "Are you sure to Refund ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Confirmation == true) {
        var data = {

          refundReason: result.Reason,
          consultationReferenceNumber: row.ConsultationReferenceNumber,
          patientId: parseInt(row.PatientId),
          status:0
        };


        this._srv.refundrequest(data).subscribe((m) => {
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



}
