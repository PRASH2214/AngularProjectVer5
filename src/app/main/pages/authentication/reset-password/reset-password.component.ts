import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from 'app/_services/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {Router} from "@angular/router";
import { GlobalService } from 'app/_services/global.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  resetManual = true;
  varEmail: string;
  code: string;
  ShowMessagePart = false;
  varTitle = "Success";
  varMessage = "Your password is reset successfully";
  ShowFogotPasswordLink = false;
  SetMessagePartClass = "div-show-message-part-success";
  varVersion : string;
  vartheme: string;
  varlogin: string;
  private _unsubscribeAll: Subject<any>;

  constructor(private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private globalService: GlobalService,
    private router: Router
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
    this.resetPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.resetPasswordForm.get('password').valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
      });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.resetPasswordForm.get('password').valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
      });

    if (this.route.snapshot.queryParams.email != undefined) {
      this.resetManual = false;
      this.varEmail = this.route.snapshot.queryParams.email;
      this.code = this.route.snapshot.queryParams.code;
      this.resetPasswordForm.get('email').clearValidators();
    } else {

    }
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  get form() { return this.resetPasswordForm.controls; }
  ResetPassword(): void {
    this.authenticationService.ResetPassword(this.varEmail, this.form.password.value, this.code).then(res => {
      if (res) {
        if (res.status[0].isValid) {
          //this.ShowMessagePart = true;
          this.openSnackBar("Password reset successfully", "Success");
          this.router.navigate(['/pages/auth/login']);
        } else {
          //this.ShowMessagePart = true;
          // this.varTitle = "Failed";
          // this.varMessage = res.status[0].varMessage;
          // this.ShowFogotPasswordLink = true;
          // this.SetMessagePartClass = "div-show-message-part-fail";
          this.openSnackBar(res.status[0].varMessage, "Failed");

        }
      }
    })
  }
  openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: 5000,
    });
  }

}


export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { 'passwordsNotMatching': true };
};
