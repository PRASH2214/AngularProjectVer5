import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ConnectionService } from '../../../services/Connection.service';
import { globalx } from '../../../services/globals.service';
import { MasterService } from '../../../services/master';
import { interval } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-mrconsultationroom',
  templateUrl: './mrconsultationroom.component.html',
  styleUrls: ['./mrconsultationroom.component.css']
})
export class MrConsultationRoomComponent implements OnInit {

  Error = "";
  Patientmessage: string = "";
  chatmessagelist: any = [];

  constructor(@Inject(DOCUMENT) private document: any,
    public master: MasterService,
    private connectionService: ConnectionService,
    private globalx: globalx, private spinner: NgxSpinnerService, private nav: Router) { }



  elem;
  public counterIntervallTimer = interval(1000);
  private countersubscription;
  ngOnInit(): void {
    this.globalx.MessageRecievedByPatient(this.MessageReceived.bind(this));
    this.elem = document.getElementById("divcontainer");
    this.connectionService.GetVCToken(this.master.doctorConnectionId).subscribe((m) => {
      if (m.model.room != null) {
        this.CallJitsi(m.model);
        this.countersubscription = this.counterIntervallTimer.subscribe(() => this.myTimerstart());
      }
      else {
        Swal.fire(
          {
            title: 'Call Ended!',
            text: 'Wait for another Call.',
            type: 'warning',
            timer: 3000,
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
          }
        ).then((result) => {

          this.nav.navigateByUrl('/mr/dashboard');

        })
      }
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

    if (document.getElementById("divcontainer").innerHTML != "") {
      alert('Please wait...');
      return;
    }
    var displayname = "MR";

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
    this.connectionService.SendMessageByPatient(this.master.patientConnectionId, this.master.doctorConnectionId, data).subscribe((m) => {





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


}
