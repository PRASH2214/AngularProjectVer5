import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MasterService } from "../../services/master";
import { StorageService } from "../../services/storage.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { TranslateService } from '@ngx-translate/core';
import { SignalRService } from "src/app/services/signalR.service";
import { globalx } from 'src/app/services/globals.service';
import { NgxSpinnerService } from 'ngx-spinner';


import { DoctorProfileService } from '../../services/doctorprofile.service'

@Component({
  selector: "app-doctorlayout",
  templateUrl: "./doctorlayout.component.html",
  styleUrls: ["./doctorlayout.component.scss"],
})
export class DoctorlayoutComponent implements OnInit {

  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  showFiller = false;
  menu = false;
  setting = false;
  inventory = false;
  public show: boolean = false;
  public show1: boolean = false;
  report = false;
  activeclassName: string = "sidebar sidebar-offcanvas";
  activeclassName1: string = "container-scroller";

  imagestring = "";

  menu1: string = "nav-item";
  menu2: string = "nav-item";
  menu3: string = "nav-item";
  menu4: string = "nav-item";
  menu5: string = "nav-item";
  menu6: string = "nav-item";
  constructor(
    public master: MasterService,
    private storage: StorageService,
    private nav: Router,
    public translate: TranslateService,
    private signalRService: SignalRService,
    private globalx: globalx,
    private spinner: NgxSpinnerService,
    private docService: DoctorProfileService
  ) { }

  ngOnInit(): void {

    this.storage.add("Utype", 2);
    this.globalx.CallDenied(this.playAudio.bind(this));

    this.master.CurrentUser = this.storage.get("listoken");


    this.translate.use(this.storage.get("lang-web"));


    if (this.master.CurrentUser.model.profileImagePath != "" && this.master.CurrentUser.model.profileImagePath != undefined && this.master.CurrentUser.model.profileImagePath != null) {

      this.imagestring = this.master.CurrentUser.model.profileImagePath;
    } else {

      this.imagestring = "assets/images/face1.jpg";
    }

    var loginId = this.master.CurrentUser.model.doctorId;
    var name = this.master.CurrentUser.model.firstName + " " + this.master.CurrentUser.model.middleName + " " + this.master.CurrentUser.model.lastName;
    // Create HUB Connection
    this.signalRService.createConnection();
    //Start or Established Connection
    this.signalRService.startConnection("D" + loginId, name);
    //Register Server HUB Methods
    this.signalRService.registerOnServerEvents();
  }


  logout() {
    

    this.docService.logout().subscribe((m) => {
      this.storage.remove("listoken");
      this.master.CurrentUser = undefined;  
      this.nav.navigateByUrl("/doctor/login");



    });


  }


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
    if (menunumber == 5) {

      if ($event.type == 'mouseover') {
        this.menu5 = "nav-item hover-open";

      } else {
        this.menu5 = "nav-item";
      }
    }
    if (menunumber == 6) {

      if ($event.type == 'mouseover') {
        this.menu6 = "nav-item hover-open";

      } else {
        this.menu6 = "nav-item";
      }
    }
  }


  playAudio(audioRingEnabled) {
    this.spinner.hide();
    if (audioRingEnabled) {
      this.audioPlayerRef.nativeElement.load();
      this.audioPlayerRef.nativeElement.play();
    }
    else {
      this.audioPlayerRef.nativeElement.pause();
    }
  }


}
