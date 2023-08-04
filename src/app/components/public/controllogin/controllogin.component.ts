import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { MasterService } from "../../../services/master";
import { StorageService } from "../../../services/storage.service";
import { AuthService } from "../../../services/auth.service";

import { NotificationService } from './../../../services/notification.service'
import { interval } from 'rxjs';

import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-controllogin',
  templateUrl: './controllogin.component.html',
  styleUrls: ['./controllogin.component.css']
})
export class ControlloginComponent implements OnInit {
  Error = "";

  divstep1: boolean = true;

  divstep2: boolean = false;


    
  count: number = 30;
  btnshow: boolean = true;



  public counterIntervallTimer = interval(1000);
  private countersubscription;

  userForm = new FormGroup({
    userName: new FormControl("", Validators.required)
  });
  userForm1 = new FormGroup({
    userName: new FormControl("", Validators.required),
    otp: new FormControl("", Validators.required),
  });
  constructor(
    public master: MasterService,
    private st: StorageService, private nav: Router,
    public srv: AuthService, private notifyService: NotificationService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {


    this.st.add("Utype", 5);
    this.st.remove("listoken");
    this.master.CurrentUser = undefined;
  }


  get f() { return this.userForm.controls; }


  get g() { return this.userForm1.controls; }

  Authenticate() {

    this.Error = undefined;


    if (this.userForm1.valid) {
      let data = this.userForm1.value;
      this.spinner.show();
      this.srv.authenticatesuperadmin(data).subscribe((m) => {
        if (m.success == true) {

          if (m.status == 1) {

            this.master.CurrentUser = m;
            this.st.add("listoken", m);
            this.spinner.hide();
            this.nav.navigateByUrl("/control/dashboard");
          } else {
              this.spinner.hide();
            this.notifyService.showError(m.message, "")
          }



        } else {
          this.spinner.hide();
          this.notifyService.showError(m.message, "")
          this.userForm1.controls["userName"].setValue(this.userForm.controls["userName"].value);


        }

      });
    }else{
      this.spinner.hide();

      this.notifyService.showError("Enter valid OTP Number", "")

    }
  }



  Sendotp() {
    if (this.userForm.valid) {
      this.spinner.show();
      let data = this.userForm.value;
      this.srv.checksuperuserexists(data).subscribe((m) => {
        if (m.success == true) {

          if (m.status == 1) {
            this.divstep1 = false;
            this.divstep2 = true;
            this.spinner.hide();
            this.notifyService.showSuccess("OTP Sent on your registered mobile number", "")
            this.userForm1.controls["userName"].setValue(this.userForm.controls["userName"].value);
            this.countersubscription = this.counterIntervallTimer.subscribe(() => this.myTimerstart());

            this.count = 30;

            this.btnshow = false;
          }
          else {
            this.spinner.hide();
            this.divstep1 = true;
            this.divstep2 = false;
            this.notifyService.showError(m.message, "")

            this.nav.navigateByUrl("/control/login");
          }
        }

      })
    }else{
      this.spinner.hide();
      this.notifyService.showError("Enter valid Mobile Number", "")

    }

  }



  
  myTimerstart() {

    if (this.count <= 0) {

      this.countersubscription.unsubscribe();
      this.btnshow = true;
    } else {

      this.btnshow = false;
      this.count = this.count - 1;
    }


  }
}
