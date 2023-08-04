import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { NotificationService } from './../services/notification.service'
import { DoctorConsultationService } from 'src/app/services/doctorconsultation.service';
import { Router } from '@angular/router';
import { MasterService } from "src/app/services/master";

@Component({
  selector: "ConfimrPatientinfoDialog",
  templateUrl: "patientinfo.html",
})
export class ConfimrPatientinfoDialog {
  patientdetail: any;
  imagepath: string;


  constructor(
    public dialogRef: MatDialogRef<ConfimrPatientinfoDialog>,
    public Notification: NotificationService, private _srv: DoctorConsultationService, public master: MasterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this._srv.GetPatientProfile(this.master.Id).subscribe((m) => {
      if (m.status == 1) {
        this.patientdetail = m.model;

        if (this.patientdetail?.ProfileImagePath == undefined || this.patientdetail?.ProfileImagePath == null || this.patientdetail?.ProfileImagePath == "") {
          this.imagepath = "assets/images/patient_default.png";
        } else {
          this.imagepath = this.patientdetail?.ProfileImagePath;
        }

      }

    }, err => {

    });


  }

  onNoClick(): void {
    this.data.Confirmation = false;
    this.dialogRef.close(this.data);
  }

}
