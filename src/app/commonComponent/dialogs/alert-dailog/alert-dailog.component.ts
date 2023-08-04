import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-alert-dailog',
  templateUrl: './alert-dailog.component.html',
  styleUrls: ['./alert-dailog.component.scss']
})
export class AlertDailogComponent implements OnInit {
  message: string;
  constructor(public dialogRef: MatDialogRef<AlertDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
  }

  ngOnInit() {
  }

  onOkClick(): void {
    this.dialogRef.close();
  }
}
