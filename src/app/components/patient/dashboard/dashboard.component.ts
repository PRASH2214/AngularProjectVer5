
import { Component, Inject, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/services/Connection.service';
import { globalx } from 'src/app/services/globals.service';
import { MasterService } from 'src/app/services/master';
import { PatientProfileService } from '../../../services/patientprofile.service'
declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {

  Error = "";
  dashboardtab: any;

  constructor(
    public master: MasterService,
    private connectionService: ConnectionService,private patsv: PatientProfileService,
    private globalx: globalx) { }




  ngOnInit() {
  
    this.patsv.getdashboardcounters().subscribe((m) => {

      this.dashboardtab = m.model;
    });


  }
  


}
