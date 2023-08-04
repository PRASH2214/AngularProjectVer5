import { Component, OnInit } from '@angular/core';
import { AUTO_STYLE } from '@angular/animations';
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { MasterService } from "src/app/services/master";
import { StorageService } from "src/app/services/storage.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  landingcounter: any;

  constructor(public nav: Router, public master: MasterService,public srv: AuthService,
    private st: StorageService) { }

  ngOnInit() {





    this.srv.getlandingcount().subscribe((m) => {
      this.landingcounter = m.model;




    })

  }
}
