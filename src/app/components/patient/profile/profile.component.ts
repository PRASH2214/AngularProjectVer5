import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../services/common.service";



import { PatientProfileService } from '../../../services/patientprofile.service'
import { SpecialityService } from "../../../services/speciality.service";
import { ConfimrAddSpecialityDialog } from 'src/app/popups/addspeciality';

import { NotificationService } from '../../../services/notification.service'
import { MasterService } from "./../../../services/master";
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class PatientProfileComponent implements OnInit {

  submitted = false;
  allhospitallst: any;
  startDate: Date;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  patientregreadonly: boolean = true;
  pateintForm = new FormGroup({
    PatientId: new FormControl('0'),
    PatientReferenceNumber: new FormControl(''),
    FirstName: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    CountryId: new FormControl('1', Validators.required),
    StateId: new FormControl('', Validators.required),
    DistrictId: new FormControl('', Validators.required),
    CityId: new FormControl('', Validators.required),
    PatientAddress: new FormControl('', Validators.required),
    Mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    DOB: new FormControl('', Validators.required),
    Age: new FormControl('0', Validators.required),
    PinCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    Status: new FormControl('1', Validators.required),
    GenderId: new FormControl('', Validators.required),
    EmailAddress: new FormControl('', [Validators.required, Validators.email]),
    RelationId: new FormControl('1', Validators.required),
    RelationName: new FormControl('self', Validators.required),
   

  })
  imageSrc: any;
  imagetype: any;
  imagename: any;
  allspecialitylst: any;
  Doctorinfo: any;
  allbranchlst: any[];
  alldepartmentlst: any[];
  pdficon: boolean;
  Patientinfo: any;
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: PatientProfileService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
    ,
    private _route: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    public spscv: SpecialityService




  ) { }

  ngOnInit() {
    this.startDate = new Date(Date.now());


    this.commonsv.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });




    this.sv.getprofile().subscribe((m) => {
      this.Patientinfo = m.model;



      if (m.model.PatientId != 0) {



        this.pateintForm.controls["DOB"].setValue(formatDate(m.model.DOB, 'dd-MM-yyyy', 'en'));
        this.onStateSelected(m.model.StateId);
        this.onDistrictSelected(m.model.DistrictId);

        Object.getOwnPropertyNames(this.Patientinfo).forEach((key) => {
          if (this.pateintForm.contains(key)) {

            if (key == "DOB") {


            } else {



              this.pateintForm.controls[key].setValue(m.model[key]);

            }




          }
        })


      }
    });


  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }


  get h() { return this.pateintForm.controls; }

  Save() {



    //   const controls = this.userForm.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {

    //  }
    // }

    this.submitted = true;
    if (this.pateintForm.valid) {
      this.spinner.show();
      let data = this.pateintForm.value;
      data.GenderId = parseInt(data.GenderId);
      data.StateId = parseInt(data.StateId);
      data.DistrictId = parseInt(data.DistrictId);
      data.CountryId = parseInt(data.CountryId);
      data.CityId = parseInt(data.CityId);
     
      data.DOB = new Date(data.DOB);
      data.Age = parseInt(data.Age);
     

      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }
      this.sv.updateprofile(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.notifyService.showSuccess("Update successfully", "");


        } else {
          this.notifyService.showError(m.message, "")
          this.spinner.hide();
        }
      }, err => {

        this.notifyService.showError("something went wrong", "")
        this.spinner.hide();

      })


    }

  }



  onStateSelected(value: string) {
    this.alldistrictlst = [];
    this.pateintForm.controls["DistrictId"].setValue("");
    this.allcitylst = [];
    this.pateintForm.controls["CityId"].setValue("");
    if (value != "" && value != undefined) {
      this.commonsv.getdistricts(value).subscribe((m) => {

        this.alldistrictlst = m.lstModel;
      });
    } else {
      this.alldistrictlst = [];
    }

  }



  onDistrictSelected(value: string) {
    this.allcitylst = [];
    this.pateintForm.controls["CityId"].setValue("");
    if (value != "" && value != undefined) {
      this.commonsv.getcity(value).subscribe((m) => {

        this.allcitylst = m.lstModel;
      });
    } else {
      this.allcitylst = [];
    }

  }






}
