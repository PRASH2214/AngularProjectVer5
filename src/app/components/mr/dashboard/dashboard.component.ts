
import { Component, Inject, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/services/Connection.service';
import { globalx } from 'src/app/services/globals.service';
import { MasterService } from 'src/app/services/master';

declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MRDashboardComponent implements OnInit {

  Error = "";

  constructor(
    public master: MasterService,
    private connectionService: ConnectionService,
    private globalx: globalx) { }




  ngOnInit() {
   
    // this.CallJitsi();
  }
  


}
