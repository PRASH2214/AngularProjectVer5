import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";

import { Router } from '@angular/router';
import { NotificationService } from './../services/notification.service'


@Component({
  selector: "ConfimrAddDrugDialog",
  templateUrl: "adddrug.html",
})
export class ConfimrAddDrugDialog {


  DrugName: any;
  constructor(
    public dialogRef: MatDialogRef<ConfimrAddDrugDialog>, public Notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.data.Confirmation = false;
    this.dialogRef.close(this.data);
  }
  onOkClick(DrugName: string, Description: string): void {


    this.data.Confirmation = true;
    this.data.DrugName = DrugName;
    this.data.Description = Description;
    if (DrugName == "" || DrugName == undefined || DrugName == null) {
      this.Notification.showError("Please Enter Drug  Name", "")

    } else if (Description == "" || Description == undefined || Description == null) {
      this.Notification.showError("Please Enter Description", "")
    }
    else {
      this.dialogRef.close(this.data);
    }

  }
}
