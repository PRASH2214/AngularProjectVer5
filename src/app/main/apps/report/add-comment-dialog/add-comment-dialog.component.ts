import { Component, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { TableauService } from '../../../../_services/tableau.service'
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MailComposeDialogComponent } from '../../../../commonComponent/dialogs/compose/compose.component';
import { Overlay } from '@angular/cdk/overlay';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-add-comment-dialog',
  templateUrl: './add-comment-dialog.component.html',
  styleUrls: ['./add-comment-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddCommentDialogComponent implements OnDestroy {

  commentList: any;
  action: string;
  dialogTitle: string;
  eventForm: FormGroup;
  menuID: number;
  mailText: string;
  rptName: string;
  countryID: number;
  currencyCode: string;
  dialogRef: any;
  minDate: Date;


  constructor(public matDialogRef: MatDialogRef<MailComposeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private tableauService: TableauService, private _matDialog: MatDialog, private overlay: Overlay) {

    this.eventForm = this.createEventForm();
    this.menuID = _data.menuID;
    this.rptName = _data.rptName;
    this.countryID = _data.countryID;
    this.currencyCode = _data.currencyCode;
    if (localStorage.getItem('currentUser')) {
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      var serverDate = currentUser.dtTodayDate.split('-');
      if (currentUser) {
        this.minDate = new Date(serverDate[0], serverDate[1], serverDate[2]);
      }
    }
  }
  get formData() { return this.eventForm.controls; }
  ngOnInit() {
    this.setCommentMstData();

  }

  createEventForm(): FormGroup {
    return new FormGroup({
      comment: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      alertOn: new FormControl('')
    });
  }
  setCommentMstData(): void {
    this.tableauService.getCommentMst(this.menuID, this.countryID)
      .then(res => {
        if (res.status[0].isValid && res.result.length > 0) {
          this.commentList = res.result;
        } else {
          this.commentList = undefined;
        }
      });
  }
  saveComment(): void {
    let comment = this.formData.comment.value;
    let alertOn = this.formData.alertOn.value;
    let tempAlertOn = null;
    if (alertOn) {
      tempAlertOn = alertOn._d.getFullYear() + "-" + ("0" + (alertOn._d.getMonth() + 1)).slice(-2) + "-" + ("0" + (alertOn._d.getDate())).slice(-2)
    }
    this.tableauService.insertCommentMst(this.menuID, comment, this.countryID, this.currencyCode, tempAlertOn)
      .then(res => {
        if (res && res.status[0].isValid) {
          this.setCommentMstData();
          this.eventForm = this.createEventForm();
        }
      });
  }
  deleteComment(intCommentGlCode: number): void {
    this.tableauService.deleteCommentMst(intCommentGlCode)
      .then(res => {
        if (res && res.status[0].isValid) {
          this.setCommentMstData();
          this.eventForm = this.createEventForm();
        }
      });
  }
  sendMail(): void {
    this.dialogRef = this._matDialog.open(MailComposeDialogComponent, {
      panelClass: 'mail-compose-dialog',
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        commentList: this.commentList,
        rptName: this.rptName
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
      });

    // if (this._platform.IOS) {
    //   alert("Your broswer not supported to send mail.");
    //   return;
    // }
    // let mailBody = "";
    // for (const item of this.commentList) {
    //   mailBody += item.varComment + ' \n'
    // }
    // mailBody = mailBody.slice(0, -2);

    // this.mailText = "mailto:?subject=" + this.rptName + "&body=" + encodeURIComponent(mailBody);
    // window.location.href = this.mailText;
  }
  ngOnDestroy(): void {
    this.matDialogRef.close();
  }
}
