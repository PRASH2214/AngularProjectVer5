import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { MasterService } from "src/app/services/master";
import { StorageService } from "src/app/services/storage.service";
@Component({
  selector: 'app-patientlogin',
  templateUrl: './patientlogin.component.html',
  styleUrls: ['./patientlogin.component.css']
})
export class PatientloginComponent implements OnInit {

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



  Authenticate() {

    this.Error = undefined;
    if (this.userForm.valid) {

    }
  }
}
