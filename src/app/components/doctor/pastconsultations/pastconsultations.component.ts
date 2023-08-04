import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";
import { DoctorConsultationService } from 'src/app/services/doctorconsultation.service';
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from '../../../services/notification.service'
import { ConfimrRefundApprovalDialog } from 'src/app/popups/doctorrefundapproval';
import { ConfimrPatientinfoDialog } from 'src/app/popups/patientinfo';

@Component({
  selector: 'app-drug',
  templateUrl: './pastconsultations.component.html',
  styleUrls: ['./pastconsultations.component.css']
})
export class PastConsultationsComponent implements OnInit {

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
    private _srv: DoctorConsultationService,
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

  offcline(row) {
    this.spinner.show();

    var ConsultationId = row.PatientTeleConsultationId;// + this.master.CurrentUser.model.DoctorId;
    this.master.teleConsultationId = ConsultationId;
    
    this.nav.navigateByUrl('/doctor/consultationoffline');
    


  }


  completecase(objconsulatation) {
    this.nav.navigateByUrl('/doctor/viewsprescription/' + objconsulatation.PatientTeleConsultationId);
  }



  Refresh() {

    this.spinner.show();
    this._srv.GetPastConsultations(this.config).subscribe((m) => {

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




  RefundAmount(row) {
    const dialogRef = this.dialog.open(ConfimrRefundApprovalDialog, {
      width: "450px",
      data: { Message: "Are you sure to Refund Approve ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Confirmation == true) {
        var data = {

          refundReason: result.Reason,
          consultationReferenceNumber: row.ConsultationReferenceNumber,
          patientId: parseInt(row.PatientId),
          status:parseInt(result.Reasontype)
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





  GetProfile(row){

    this.master.Id=row.PatientId;
    const dialogRef = this.dialog.open(ConfimrPatientinfoDialog, {
      width: "450px",
      data: { Message: "" },
    });
  }

}
