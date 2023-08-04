import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ConnectionService } from '../../../services/Connection.service';
import { globalx } from '../../../services/globals.service';
import { MasterService } from '../../../services/master';
import { interval } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { DoctorConsultationService } from 'src/app/services/doctorconsultation.service';
import { NotificationService } from 'src/app/services/notification.service';
declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-mrconsultation',
  templateUrl: './mrconsultation.component.html',
  styleUrls: ['./mrconsultation.component.css']
})
export class MrConsultationComponent implements OnInit {

  Error = "";
  Patientmessage: string = "";
  chatmessagelist: any = [];
  response = "";
  constructor(@Inject(DOCUMENT) private document: any,
    public master: MasterService, public notifyService: NotificationService,
    private connectionService: ConnectionService,  private _srv: DoctorConsultationService,
    private globalx: globalx, private spinner: NgxSpinnerService, private nav: Router) { }



  elem;
  public counterIntervallTimer = interval(1000);
  private countersubscription;
  ngOnInit(): void {
    this.globalx.MessageRecievedByDoctor(this.MessageReceived.bind(this));
    this.elem = document.getElementById("divcontainer");
    this.connectionService.GetVCToken("D" + this.master.CurrentUser.model.doctorId).subscribe((m) => {
      if (m.model.room != null) {
        this.spinner.show();
        // Initiate VC Call
        this.CallJitsi(m.model);
        this.countersubscription = this.counterIntervallTimer.subscribe(() => this.myTimerstart());

      }
      else
        alert("Wrong attempt");
    }, err => {

    });



  }
  myTimerstart() {
    if (document.getElementById("divcontainer").innerHTML != "") {
      this.spinner.hide();
      this.countersubscription.unsubscribe();
    }
  }

  CallJitsi(data) {
    var name = this.master.CurrentUser.model.firstName + " " + this.master.CurrentUser.model.middleName + " " + this.master.CurrentUser.model.lastName;
    if (document.getElementById("divcontainer").innerHTML != "") {
      alert('Please wait...');
      return;
    }
    var displayname = "Doctor";

    //const domain = 'connect.ecubix.com';
    var options = {
      roomName: data.room,
      // width: w,
      // height: h,
      parentNode: document.getElementById("divcontainer"),
      jwt: data.token,// document.getElementById("hidToekn").value,
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        filmStripOnly: false,
        TOOLBAR_BUTTONS: ['hangup', 'microphone', 'camera', 'fullscreen']
      },
      userInfo: { displayName: displayname }
    };

    const api = new JitsiMeetExternalAPI("connect.ecubix.com", options);
    //api = new JitsiMeetExternalAPI(domain, options);

    api.on('readyToClose', () => {

      document.getElementById("divcontainer").innerHTML = "";
    });
    return false;
  }

  checkmessage() {
    if (this.Patientmessage != null || this.Patientmessage != undefined || this.Patientmessage != "") {
      this.SendMessage(this.Patientmessage);
      this.Patientmessage = "";
    }
  }

  MessageReceived(data) {

    var meg = { "send": 0, "messagetext": data.message }
    this.chatmessagelist.push(meg);
  }


  SendMessage(data) {
    var meg = { "send": 1, "messagetext": data }

    this.chatmessagelist.push(meg);

    this.connectionService.SendMessageByDoctor(this.master.doctorConnectionId, this.master.patientConnectionId, data).subscribe((m) => {


    }, err => {

    });
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    return false;
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    return false;
  }





  Consultationsend() {



    var consulationjson = {
      "mrTeleConsultationId": parseInt(this.master.teleConsultationId),
      "mrId": 0,
      "response": this.response

    }


    this._srv.insertmrconsultationresponse(consulationjson).subscribe((m) => {
      if (m.success == true && m.status == 1) {
        this.connectionService.MRConsultationComplete(this.master.doctorConnectionId, this.master.patientConnectionId, "Call Completed").subscribe((m) => {

        });
        this.nav.navigateByUrl('/doctor/appointments');
        this.notifyService.showSuccess("Consultation successfully done", "");

      } else {
        this.spinner.hide();

        this.notifyService.showError(m.message, "");
      }
    }, err => {
      this.spinner.hide();

      this.notifyService.showError("something went wrong", "")

    })




  }


}
