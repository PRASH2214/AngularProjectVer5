import { Component, OnInit } from "@angular/core";
import { MasterService } from "../../services/master";
import { StorageService } from "../../services/storage.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../services/admin.service'

@Component({
  selector: "app-adminlayout",
  templateUrl: "./adminlayout.component.html",
  styleUrls: ["./adminlayout.component.scss"],
})
export class AdminlayoutComponent implements OnInit {
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
  menu7: string = "nav-item";
  constructor(
    public master: MasterService,
    private storage: StorageService,
    private nav: Router,
    public translate: TranslateService,
    public _AdminService: AdminService
  ) { }

  ngOnInit(): void {

    this.storage.add("Utype", 1);

    this.master.CurrentUser = this.storage.get("listoken");


    this.translate.use(this.storage.get("lang-web"));


    if (this.master.CurrentUser.model.profileImagePath != "" && this.master.CurrentUser.model.profileImagePath != undefined && this.master.CurrentUser.model.profileImagePath != null) {

      this.imagestring = this.master.CurrentUser.model.profileImagePath;
    } else {

      this.imagestring = "assets/images/face1.jpg";
    }
  }


  logout() {



    this._AdminService.logout().subscribe((m) => {
      this.storage.remove("listoken");
      this.master.CurrentUser = undefined;
      this.nav.navigateByUrl("/admin/login");

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



      if (menunumber == 7) {

        if ($event.type == 'mouseover') {
          this.menu7 = "nav-item hover-open";

        } else {
          this.menu7 = "nav-item";
        }
      }
    }
  }

}
