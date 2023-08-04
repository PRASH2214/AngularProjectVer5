import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { NotificationService } from './../services/notification.service'

import { Router } from '@angular/router';


@Component({
  selector: "ConfimrRefundApprovalDialog",
  templateUrl: "doctorrefundapproval.html",
})
export class ConfimrRefundApprovalDialog {


  constructor(
    public dialogRef: MatDialogRef<ConfimrRefundApprovalDialog>, public Notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.data.Confirmation = false;
    this.dialogRef.close(this.data);
  }
  onOkClick(Reason: string, Reasontype: string): void {


    this.data.Confirmation = true;
    this.data.Reason = Reason;
    this.data.Reasontype = Reasontype;

    if (Reason == "" || Reason == undefined || Reason == null) {
      this.Notification.showError("Please Enter Reason", "")
    }
    else {
      this.dialogRef.close(this.data);
    }

  }
}
