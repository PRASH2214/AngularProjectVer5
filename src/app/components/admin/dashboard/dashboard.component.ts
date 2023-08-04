import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";


import { AdminService } from '../../../services/admin.service'
import { Router } from "@angular/router";
import { MasterService } from "../../../services/master";
import { StorageService } from "../../../services/storage.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  Error = "";
  dashboardtab: any;

  constructor(
    public master: MasterService,private adsv: AdminService,
    private st: StorageService) { }

  ngOnInit() {
    this.adsv.getdashboardcounters().subscribe((m) => {

      this.dashboardtab = m.model;
    });
  
  }



}
