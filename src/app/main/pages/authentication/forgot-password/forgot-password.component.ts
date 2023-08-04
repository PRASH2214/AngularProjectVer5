import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'app/_services/authentication.service';
import { MatSnackBar } from '@angular/material';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { GlobalService } from 'app/_services/global.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  ShowMessagePart = false;
  varTitle = "Success";
  varMessage = "Reset link sent to your email.";
  SetMessagePartClass = "div-show-message-part-success";
  varVersion: string;
  vartheme: string;
  varlogin: string;
  private _unsubscribeAll: Subject<any>;

  constructor(private _fuseConfigService: FuseConfigService,
    private authenticationService: AuthenticationService,
    public snackBar: MatSnackBar,
    private globalService: GlobalService,
    private _fuseProgressBarService: FuseProgressBarService
  ) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
    this._unsubscribeAll = new Subject();
  }
  ngOnInit() {
    this.globalService.GetAPIURL().then(resapi => {
      this.varVersion = resapi.version;
      this.vartheme = resapi.theme;
      if (resapi.theme === 'blue') {
        this.varlogin = 'login-blue';
      }
      else {
        this.varlogin = 'login';
      }
    },
      (error: any) => {

      })
    this.forgotPasswordForm = this.createForm();
  }
  createForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })

  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  get form() { return this.forgotPasswordForm.controls; }
  GenerateResetLink(): void {
    this._fuseProgressBarService.setMode("indeterminate");
    this._fuseProgressBarService.showSpinner();
    this.authenticationService.GenerateResetLink(this.form.email.value).then((res) => {
      if (res) {
        if (res.status[0].isValid) {
          //this.ShowMessagePart = true;
          this.openSnackBar("Reset link sent to your email", "Success");
          this.forgotPasswordForm.reset();
          Object.keys(this.forgotPasswordForm.controls).forEach(key => {
            this.forgotPasswordForm.controls[key].setErrors(null)
          });
        } else {
          // this.ShowMessagePart = true;
          // this.SetMessagePartClass = "div-show-message-part-fail";
          // this.varTitle = "Failed";
          // this.varMessage = res.status[0].varMessage;
          this.openSnackBar(res.status[0].varMessage, "Failed");
        }
        this._fuseProgressBarService.hideSpinner();
      }
    }, (err) => {
      this._fuseProgressBarService.hideSpinner();
    })
  }
  openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: 5000,
    });
  }
}
