import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { NotificationService } from './../services/notification.service'

import { Router } from '@angular/router';


@Component({
  selector: "ConfimrRefundReasonDialog",
  templateUrl: "patientrefund.html",
})
export class ConfimrRefundReasonDialog {


  constructor(
    public dialogRef: MatDialogRef<ConfimrRefundReasonDialog>, public Notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.data.Confirmation = false;
    this.dialogRef.close(this.data);
  }
  onOkClick(Reason: string): void {


    this.data.Confirmation = true;
    this.data.Reason = Reason;
   
    if (Reason == "" || Reason == undefined || Reason == null) {
      this.Notification.showError("Please Enter Reason", "")
    }
    else {
      this.dialogRef.close(this.data);
    }

  }
}
