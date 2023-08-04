import { Component, Inject, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { forkJoin } from 'rxjs';
import { TableauService } from '../../../_services/tableau.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { GlobalService } from 'app/_services/global.service';


@Component({
  selector: 'mail-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MailComposeDialogComponent implements OnDestroy {
  @ViewChild('fileInput') file;

  public files: Set<File> = new Set();
  public filesNotUploaded: Set<File> = new Set();
  showExtraToFields: boolean;
  composeForm: FormGroup;
  commentList: any;
  messageText: string;
  messageTextBullet: string;
  progress;
  showDeleteButton = false;
  uploading = false;
  uploadSuccessful = false;
  newFileArry: string[];
  btnSaveText: string;
  menuOpen: boolean;
  mobileShortcutsPanelActive: boolean;
  receipientAddress: any;
  rptName: string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<MailComposeDialogComponent>} matDialogRef
   * @param _data
   */
  constructor(
    public matDialogRef: MatDialogRef<MailComposeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private tableauService: TableauService,
    private fuseNavigationService: FuseNavigationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar, private globalService: GlobalService
    
  ) {
    // Set the defaults
    this.menuOpen = false;
    this.btnSaveText = "SEND";
    this.newFileArry = [];
    this.messageText = "";
    this.commentList = _data.commentList;
    this.rptName = _data.rptName;
    this.messageTextBullet = "<ul>"
    for (var i = 0; i < this.commentList.length; i++) {
      this.messageText += " >> " + this.commentList[i].varComment + "\n\n";
      this.messageTextBullet += "<li style='margin-top:10px'>" + this.commentList[i].varComment + "</li>"
    }
    this.messageTextBullet += "</ul>"
    this.messageText.substr(0, (this.messageText.length - 4));

    this.composeForm = this.createComposeForm();
    this.showExtraToFields = false;

    var country = this.fuseNavigationService.getSelectedCountry;

    this.globalService.GetAPIURL().then(resapi => {
      tableauService.getReceipientEmailAdd(country.intGlCode, resapi.apiUrlPath).subscribe((res) => {
        this.receipientAddress = res.result;
      })
    },
      (error: any) => {

      })

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create compose form
   *
   * @returns {FormGroup}
   */
  createComposeForm(): FormGroup {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      return new FormGroup({
        to: new FormControl('', [Validators.required, this.emailAddressValidator]),
        cc: new FormControl('', [this.emailAddressValidator]),
        bcc: new FormControl({ value: currentUser.varEmail, disabled: true }),
        subject: new FormControl({ value: currentUser.varUserName + ' ( Commented On ) ' + this.rptName, disabled: true }),
        message: new FormControl(this.messageText)
      });
    }
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }

  onFilesAdded(): void {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        var temp = new Date().getTime() * 10000;
        files[key]["newFileName"] = files[key].name.substr(0, files[key].name.lastIndexOf('.')) + "_" + temp + files[key].name.substr(files[key].name.lastIndexOf('.'));
        this.files.add(files[key]);
        this.newFileArry.push(files[key]["newFileName"]);
        //this.filesNotUploaded.add(files[key]);
      }
    }
  }
  removeAttachment(file): void {
    this.file.nativeElement.value = "";
    this.files.delete(file);
  }
  openConfirmDialog(): void {
    if (this.uploading) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.matDialogRef.close();
        }
      });
    } else {
      this.matDialogRef.close();
    }
  }
  stopClose(event): void {
    event.stopPropagation();
  }
  toggleShortcut(event, item): void {
    event.stopPropagation();
    var toVal = this.composeForm.get('to').value;
    if (item.checked) {
      this.composeForm.get('to').setValue(toVal.replace(item.varEmail, ''));
      toVal = this.composeForm.get('to').value;
      var toValArr = toVal.split(';');
      toValArr = toValArr.filter(n => n)
      var strVal = '';
      for (var i = 0; i < toValArr.length; i++) {
        strVal += toValArr[i] + ';';
      }
      strVal = strVal.slice(0, -1);
      this.composeForm.get('to').setValue(strVal);

    } else {
      if (toVal.length > 0) {
        toVal += ";" + item.varEmail;
      } else {
        toVal = item.varEmail;
      }
      this.composeForm.get('to').setValue(toVal);
    }
  }
  onMenuOpen(): void {
    var toVal = this.composeForm.get('to').value;
    for (var i = 0; i < this.receipientAddress.length; i++) {
      if (toVal.indexOf(this.receipientAddress[i].varEmail) > -1) {
        this.receipientAddress[i].checked = true;
      } else {
        this.receipientAddress[i].checked = false;
      }
    }
  }
  get formData() { return this.composeForm.controls; }
  sendMail(): void {
    this.btnSaveText = "Sending..."

    this.uploading = true;

    // start the upload and save the progress map
    this.globalService.GetAPIURL().then(resapi => {
      this.progress = this.tableauService.uploadFile(this.files, resapi.apiUrlPath);
    },
      (error: any) => {

      })
    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    this.showDeleteButton = false;

    if (allProgressObservables.length > 0) {
      // When all progress-observables are completed...
      forkJoin(allProgressObservables).subscribe(end => {

        this.tableauService.sendMail(this.newFileArry, this.formData.to.value, this.formData.cc.value, this.formData.bcc.value, this.formData.subject.value, this.formData.message.value, this.messageTextBullet).then((res) => {
          if (res && res.status[0].isValid) {
            this.openSnackBar("Mail has been sent successfully", "Sent");
            this.matDialogRef.close();
          } else {
            this.openSnackBar("Mail not sent", "Faild");
          }
          this.uploadSuccessful = true;
          // ... and the component is no longer uploading
          this.uploading = false;

          this.showDeleteButton = true;

          this.files = new Set();

          this.progress = undefined;

          this.newFileArry = [];

          this.btnSaveText = "SEND"

          this.file.nativeElement.value = "";

        }, (rej) => {
          this.openSnackBar("Mail not sent", "Faild");
          this.uploadSuccessful = true;
          // ... and the component is no longer uploading
          this.uploading = false;

          this.showDeleteButton = true;

          this.files = new Set();

          this.progress = undefined;

          this.newFileArry = [];

          this.btnSaveText = "SEND"

          this.file.nativeElement.value = "";
        })

      });
    } else {
      this.tableauService.sendMail(this.newFileArry, this.formData.to.value, this.formData.cc.value, this.formData.bcc.value, this.formData.subject.value, this.formData.message.value, this.messageTextBullet).then((res) => {
        if (res && res.status[0].isValid) {

          this.openSnackBar("Mail has been sent successfully", "Sent");

          this.matDialogRef.close();
        } else {
          this.openSnackBar("Mail not sent", "Faild");
        }
        // ... the upload was successful...
        this.uploadSuccessful = true;

        // ... and the component is no longer uploading
        this.uploading = false;

        this.showDeleteButton = true;

        this.files = new Set();

        this.progress = undefined;

        this.newFileArry = [];

        this.btnSaveText = "SEND"

        this.file.nativeElement.value = "";
      }, (rej) => {
        this.openSnackBar("Mail not sent", "Faild");
        // ... the upload was successful...
        this.uploadSuccessful = true;

        // ... and the component is no longer uploading
        this.uploading = false;

        this.showDeleteButton = true;

        this.files = new Set();

        this.progress = undefined;

        this.newFileArry = [];

        this.btnSaveText = "SEND"

        this.file.nativeElement.value = "";
      })

    }

  }
  openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: 5000,
    });
  }

  emailAddressValidator(control: AbstractControl): { [key: string]: boolean } | null {
    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (control.value !== undefined && control.value !== "") {
      var emailAddress = control.value.split(';');
      for (var i = 0; i < emailAddress.length; i++) {
        if (!expr.test(emailAddress[i])) {
          return { 'isValid': false };
        }
      }
    }
    return null;
  }
  ngOnDestroy(): void {
    this.matDialogRef.close();
  }

}
