import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DoctorConsultationService } from 'src/app/services/doctorconsultation.service';
import { Router, ActivatedRoute } from "@angular/router";
import { MasterService } from "../../../services/master";
import { StorageService } from "../../../services/storage.service";

import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-viewsprescription',
  templateUrl: './viewsprescription.component.html',
  styleUrls: ['./viewsprescription.component.css'],
  providers: [DatePipe]
})
export class ViewsprescriptionComponent implements OnInit {

  Error = "";
  prescriptioninfo: any = [];
  Allergylist: any;
  showAge: number;

  constructor(
    public master: MasterService, private _srv: DoctorConsultationService, public _route: ActivatedRoute,
    private st: StorageService) { }

  ngOnInit() {

    this._route.params.subscribe(



      params => {

        this._srv.getcompleteconsultation(params["id"]).subscribe((m) => {
          this.prescriptioninfo = m.model;
          this.f_age(this.prescriptioninfo.patientTeleConsultationDetail.dob)
          this.Allergylist = m.model.patientTeleConsultationAllergy;

        })



      })

  }

  f_age(bDay) {


    const convertAge = new Date(bDay);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);


  }




}
