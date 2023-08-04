import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/services/master";
import { StorageService } from "src/app/services/storage.service";
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-public",
  templateUrl: "./public.component.html",
  styleUrls: ["./public.component.scss"],
})
export class PublicComponent implements OnInit {
  showFiller = false;
  menu = false;
  setting = false;
  inventory = false;

  report = false;
  allExams: any;

  constructor(
    public master: MasterService,
    private storage: StorageService,
    private nav: Router,
    public translate: TranslateService,
  ) {

    translate.addLangs(['en', 'hi']);

    if (this.storage.get("lang-web") != undefined) {
      this.translate.use(this.storage.get("lang-web"));
    } else {
      translate.setDefaultLang('en');

      this.storage.add("lang-web", 'en');
    }


  }

  ngOnInit(): void {



  }
  switchLang(lang: string) {

    this.storage.add("lang-web", lang);
    this.translate.use(lang);
  }


}
