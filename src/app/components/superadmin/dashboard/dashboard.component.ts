import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { SuperAdminService } from "../../../services/superadmin.service";
import { Router } from "@angular/router";
import { MasterService } from "../../../services/master";
import { StorageService } from "../../../services/storage.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {

  Error = "";
  dashboardtab: any;

  constructor(
    public master: MasterService,private sv: SuperAdminService,
    private st: StorageService) { }

  ngOnInit() {

    this.sv.getdashboardcounters().subscribe((m) => {

      this.dashboardtab = m.model;
    });


  }



}
