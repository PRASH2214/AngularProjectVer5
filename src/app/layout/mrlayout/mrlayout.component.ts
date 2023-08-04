import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MasterService } from "../../services/master";
import { StorageService } from "../../services/storage.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { TranslateService } from '@ngx-translate/core';
import { SignalRService } from "../../services/signalR.service";
import { globalx } from '../../services/globals.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConnectionService } from 'src/app/services/Connection.service';
import { MRProfileService } from '../../services/mrprofile.service'

import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: "app-mrlayout",
  templateUrl: "./mrlayout.component.html",
  styleUrls: ["./mrlayout.component.scss"],
})




export class MRlayoutComponent implements OnInit {
  @ViewChild('audioOption') audioPlayerRef: ElementRef;


  showFiller = false;
  menu = false;
  setting = false;
  inventory = false;

  public show: boolean = false;
  public show1: boolean = false;
  activeclassName: string = "sidebar sidebar-offcanvas";
  activeclassName1: string = "container-scroller";

  report = false;

  menu1: string = "nav-item";
  menu2: string = "nav-item";
  menu3: string = "nav-item";
  menu4: string = "nav-item";
  menu5: string = "nav-item";
  imagestring: any;
  constructor(
    public master: MasterService,
    private storage: StorageService,
    private nav: Router,
    private signalRService: SignalRService,
    private globalx: globalx,
    private connectionService: ConnectionService,
    private prservice: MRProfileService
  ) { }

  ngOnInit(): void {
    this.storage.add("Utype", 4);
    this.globalx.MRCallRequest(this.CallRequest.bind(this));

    this.master.CurrentUser = this.storage.get("listoken");
    var loginId = this.master.CurrentUser.model.mrId;
    var name = this.master.CurrentUser.model.firstName + " " + this.master.CurrentUser.model.middleName + "" + this.master.CurrentUser.model.lastName;

    if (this.master.CurrentUser.model.imagePath != "" && this.master.CurrentUser.model.imagePath != undefined && this.master.CurrentUser.model.imagePath != null) {

      this.imagestring = this.master.CurrentUser.model.imagePath;
    } else {

      this.imagestring = "assets/images/face1.jpg";
    }

    // Create HUB Connection
    this.signalRService.createConnection();
    //Start or Established Connection
    this.signalRService.startConnection("M" + loginId, name);
    //Register Server HUB Methods
    this.signalRService.registerOnServerEvents();
  }


  logout() {



    this.prservice.logout().subscribe((m) => {

      this.storage.remove("listoken");
      this.master.CurrentUser = undefined;
      this.nav.navigateByUrl("/mr/login");


    });

  }

  CallRequest(data) {
    //  this.globalx.callredirect();
    this.showswal(data);
  }

  showswal(data) {

    this.playAudio(true);
    Swal.fire({
      title: 'Consultation Call',
      text: 'Call from Dr.' + data.name,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Deny',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    }).then((result) => {
      if (result.value) {
        this.playAudio(false);
        this.connectionService.mrcallaccepted(this.master.patientConnectionId, this.master.doctorConnectionId, data.message).subscribe((m) => {

        }, err => {

        });
        this.nav.navigateByUrl('/mr/consultationroom');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.playAudio(false);
        this.connectionService.calldenied(this.master.patientConnectionId, this.master.doctorConnectionId, "deny").subscribe((m) => {

        }, err => {

        });
      }
    })



  }


  playAudio(audioRingEnabled) {
    if (audioRingEnabled) {
      this.audioPlayerRef.nativeElement.load();
      this.audioPlayerRef.nativeElement.play();
    }
    else {
      this.audioPlayerRef.nativeElement.pause();
    }
  }


  // RingSound(audioRingEnabled: boolean): void {

  //   var audioRingSource: string; //'https://raw.githubusercontent.com/rpaschoal/ng-chat/master/src/ng-chat/assets/notification.wav';
  //   audioRingSource = 'https://raw.githubusercontent.com/rpaschoal/ng-chat/master/src/ng-chat/assets/notification.wav';

  //   this.audioPlayerRef.nativeElement.src = audioRingSource;
  //   //audio.muted = true;
  //   console.log("SoundCalled");

  //   if (audioRingEnabled) {
  //     this.audioPlayerRef.nativeElement.play();
  //   }
  //   else {
  //     this.audioPlayerRef.nativeElement.pause();
  //   }
  // }

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.activeclassName = "sidebar sidebar-offcanvas active";
    else
      this.activeclassName = "sidebar sidebar-offcanvas";
  }

  toggle1() {
    this.show1 = !this.show1;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show1)

      this.activeclassName1 = "container-scroller sidebar-icon-only";
    else
      this.activeclassName1 = "container-scroller";
  }


  changeStyle($event, menunumber) {
    if (menunumber == 1) {

      if ($event.type == 'mouseover') {
        this.menu1 = "nav-item hover-open";

      } else {
        this.menu1 = "nav-item";
      }
    }

    if (menunumber == 2) {

      if ($event.type == 'mouseover') {
        this.menu2 = "nav-item hover-open";

      } else {
        this.menu2 = "nav-item";
      }

    }

    if (menunumber == 3) {

      if ($event.type == 'mouseover') {
        this.menu3 = "nav-item hover-open";

      } else {
        this.menu3 = "nav-item";
      }
    }

    if (menunumber == 4) {

      if ($event.type == 'mouseover') {
        this.menu4 = "nav-item hover-open";

      } else {
        this.menu4 = "nav-item";
      }
    }
  }


}
