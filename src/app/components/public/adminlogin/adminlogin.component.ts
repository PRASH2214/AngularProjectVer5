import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { MasterService } from "src/app/services/master";
import { StorageService } from "src/app/services/storage.service";
import { AuthService } from "src/app/services/auth.service";

import { NotificationService } from './../../../services/notification.service'
import { interval } from 'rxjs';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {

  Error = "";

  divstep1: boolean = true;

  divstep2: boolean = false;

  submitted = false;
  submitted1 = false;

  count: number = 30;
  btnshow: boolean = true;



  public counterIntervallTimer = interval(1000);
  private countersubscription;

  userForm = new FormGroup({
    userName: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")])
  });
  userForm1 = new FormGroup({
    userName: new FormControl("", Validators.required),
    otp: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
  });
  constructor(
    public master: MasterService,
    private st: StorageService, private nav: Router,
    public srv: AuthService, private notifyService: NotificationService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {


    this.st.add("Utype", 1);
    this.st.remove("listoken");
    this.master.CurrentUser = undefined;
  }


  get f() { return this.userForm.controls; }


  get g() { return this.userForm1.controls; }

  Authenticate() {

    this.Error = undefined;



    //   const controls = this.userForm1.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {

    //  }
    // }

    if (this.userForm1.valid) {
      let data = this.userForm1.value;
      this.spinner.show();
      this.srv.authenticateadmin(data).subscribe((m) => {
        if (m.success == true) {

          if (m.status == 1 && m.model!= null) {

            this.master.CurrentUser = m;
            this.st.add("listoken", m);



            this.nav.navigateByUrl("/admin/dashboard");
            this.spinner.hide();

          } else {
            this.spinner.hide();
            this.notifyService.showError("something went wrong", "")
          }



        } else {
          this.spinner.hide();
          this.notifyService.showError(m.message, "")
          this.userForm1.controls["userName"].setValue(this.userForm.controls["userName"].value);


        }

      }, err => {
        this.spinner.hide();
      });

    } else {
      this.spinner.hide();

      this.notifyService.showError("Enter valid OTP Number", "")

    }
  }



  Sendotp() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.spinner.show();
      let data = this.userForm.value;
      this.srv.checkuser(data).subscribe((m) => {
        if (m.success == true) {

          if (m.status == 1) {
            this.divstep1 = false;
            this.divstep2 = true;
            this.spinner.hide();
            this.notifyService.showSuccess("OTP Sent on your registered mobile number", "")
            this.userForm1.controls["userName"].setValue(this.userForm.controls["userName"].value);
            this.countersubscription = this.counterIntervallTimer.subscribe(() => this.myTimerstart());
            this.userForm1.controls["otp"].setValue("");
            this.count = 30;

            this.btnshow = false;
          }
          else {
            this.spinner.hide();
            this.divstep1 = true;
            this.divstep2 = false;
            this.notifyService.showError(m.message, "")

            this.nav.navigateByUrl("/admin/login");
          }
        }

      }, err => {
        this.spinner.hide();
      });
    } else {
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
