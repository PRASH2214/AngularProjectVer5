import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { NotificationService } from './../services/notification.service'

import { Router } from '@angular/router';


@Component({
  selector: "ConfimrAddSpecialityDialog",
  templateUrl: "addspeciality.html",
})
export class ConfimrAddSpecialityDialog {


  SpecialityName: any;
  constructor(
    public dialogRef: MatDialogRef<ConfimrAddSpecialityDialog>, public Notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.data.Confirmation = false;
    this.dialogRef.close(this.data);
  }
  onOkClick(SpecialityName: string, Description: string): void {


    this.data.Confirmation = true;
    this.data.SpecialityName = SpecialityName;
    this.data.Description = Description;
    if (SpecialityName == "" || SpecialityName == undefined || SpecialityName == null) {
      this.Notification.showError("Please Enter Speciality Name", "")

    } else if (Description == "" || Description == undefined || Description == null) {
      this.Notification.showError("Please Enter Description", "")
    }
    else {
      this.dialogRef.close(this.data);
    }

  }
}
