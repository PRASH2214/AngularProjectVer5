import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";

import { Router } from '@angular/router';
import { NotificationService } from './../services/notification.service'


@Component({
  selector: "ConfimrAddDrugTypeDialog",
  templateUrl: "adddrugtype.html",
})
export class ConfimrAddDrugTypeDialog {


  DrugTypeName: any;
  constructor(
    public dialogRef: MatDialogRef<ConfimrAddDrugTypeDialog>, public Notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.data.Confirmation = false;
    this.dialogRef.close(this.data);
  }
  onOkClick(DrugTypeName: string, Description: string): void {


    this.data.Confirmation = true;
    this.data.DrugTypeName = DrugTypeName;
    this.data.Description = Description;
    if (DrugTypeName == "" || DrugTypeName == undefined || DrugTypeName == null) {
      this.Notification.showError("Please Enter Drug  Type", "")

    } else if (Description == "" || Description == undefined || Description == null) {
      this.Notification.showError("Please Enter Description", "")
    }
    else {
      this.dialogRef.close(this.data);
    }

  }
}
