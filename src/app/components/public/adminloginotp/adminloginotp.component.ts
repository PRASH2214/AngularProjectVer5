import { Component, OnInit ,HostListener, ViewChild } from "@angular/core";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { Router } from "@angular/router";
import { MasterService } from "src/app/services/master";
import { StorageService } from "src/app/services/storage.service";
@Component({
  selector: 'app-adminloginotp',
  templateUrl: './adminloginotp.component.html',
  styleUrls: ['./adminloginotp.component.css']
})
export class AdminloginOTPComponent implements OnInit {

  Error = "";
  userForm = new FormGroup({
    UserName: new FormControl("", Validators.required),
    Password: new FormControl("", Validators.required),
  });
  constructor(
    public master: MasterService,
    private st: StorageService) { }

  ngOnInit() {

    this.st.remove("listoken");
    this.master.CurrentUser = undefined;
  }

  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;

  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker.hide();
  }

  Authenticate() {

    this.Error = undefined;
    if (this.userForm.valid) {

    }
  }
}
