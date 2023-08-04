import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../services/common.service";



import { MRProfileService } from '../../../services/mrprofile.service'
import { SpecialityService } from "../../../services/speciality.service";
import { ConfimrAddSpecialityDialog } from 'src/app/popups/addspeciality';

import { NotificationService } from '../../../services/notification.service'
import { MasterService } from "./../../../services/master";
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class MRProfileComponent implements OnInit {

  submitted = false;
  allhospitallst: any;
  startDate: Date;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  userForm = new FormGroup({

    MrId: new FormControl('', Validators.required),
    FirstName: new FormControl('', Validators.required),
    MiddleName: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    GenderId: new FormControl('', Validators.required),
    CompanyId: new FormControl('', Validators.required),
    CountryId: new FormControl('1', Validators.required),
    StateId: new FormControl('', Validators.required),
    DistrictId: new FormControl('', Validators.required),
    CityId: new FormControl('', Validators.required),
    MrAddress: new FormControl('', Validators.required),
    MrLicenseNumber: new FormControl('', Validators.required),
    Mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    MrLicenseImage: new FormControl(''),
    DOB: new FormControl('', Validators.required),
    Age: new FormControl('0', Validators.required),
    PinCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    Status: new FormControl(true, Validators.required),



  })
  imageSrc: any;
  imagetype: any;
  imagename: any;
  allspecialitylst: any;
  Doctorinfo: any;
  allbranchlst: any[];
  alldepartmentlst: any[];
  pdficon: boolean;
  allcompanylist: any;
  mrinfo: any;
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: MRProfileService,
    public master: MasterService,
    public notifyService: NotificationService, 
    private spinner: NgxSpinnerService,
    private _route: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    public spscv: SpecialityService




  ) { }

  ngOnInit() {
    this.startDate = new Date(Date.now());



    this.commonsv.getactivecompany().subscribe((m) => {

      this.allcompanylist = m.lstModel;

    });
    this.commonsv.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });


    this.sv.getprofile().subscribe((m) => {
      const date = moment(m.model.DOB);

      this.userForm.controls["DOB"].setValue(date);
      this.mrinfo = m.model;
      Object.getOwnPropertyNames(this.mrinfo).forEach((key) => {
        if (this.userForm.contains(key)) {

          if (key == "DOB") {


          } else {
            this.userForm.controls[key].setValue(m.model[key]);

          }

          if (key == "StateId") {
            this.onStateSelected(m.model[key]);
          }

          if (key == "DistrictId") {
            this.onDistrictSelected(m.model[key]);
          }

        }
      })
    });


  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }


  get f() { return this.userForm.controls; }

  Save() {



    //   const controls = this.userForm.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {

    //  }
    // }

    this.submitted = true;
    if (this.userForm.valid) {
      this.spinner.show();
      let data = this.userForm.value;
      data.GenderId = parseInt(data.GenderId);
      data.DoctorId = parseInt(data.DoctorId);
      data.HospitalId = parseInt(data.HospitalId);
      data.BranchId = parseInt(data.BranchId);
      data.DepartmentId = parseInt(data.DepartmentId);
      data.HospitalId = parseInt(data.HospitalId);
      data.StateId = parseInt(data.StateId);
      data.DistrictId = parseInt(data.DistrictId);
      data.CountryId = parseInt(data.CountryId);
      data.CityId = parseInt(data.CityId);
      data.SpecialityId = parseInt(data.SpecialityId);
      data.DOB = new Date(data.DOB);
      data.Age = parseInt(data.Age);
      if (this.imageSrc != null) {
        data.ImagePath = this.imageSrc.split(',')[1];
        data.FileName = this.imagename;
        data.FileFlag = this.imagetype;
      }


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
    this.userForm.controls["DistrictId"].setValue("");
    this.allcitylst = [];
    this.userForm.controls["CityId"].setValue("");
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
    this.userForm.controls["CityId"].setValue("");
    if (value != "" && value != undefined) {
      this.commonsv.getcity(value).subscribe((m) => {

        this.allcitylst = m.lstModel;
      });
    } else {
      this.allcitylst = [];
    }

  }



  handleFileInput(e) {


    let file1 = e.target.files[0];


    if (file1.type == "image/png" || file1.type == "image/jpeg" || file1.type == "application/pdf") {



      let fileName = file1.name;
      let filetype = file1.type;
      var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      var pattern = /image-*/;
      var reader = new FileReader();
      this.imagename = fileName;
      this.imagetype = filetype;
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);

    } else {
      this.imagename = "";
      this.imagetype = "";
      this.imageSrc = null;
      this.notifyService.showError("Please select valid file", "")
    }
  }
  _handleReaderLoaded(e) {

    let reader = e.target;
    this.imageSrc = reader.result;
  }





  getInvoiceUrl() {

    return this.imageSrc;
  }







  AddSpeciality() {
    const dialogRef = this.dialog.open(ConfimrAddSpecialityDialog, {
      width: "450px",
      data: { Message: "Are you sure to Speciality ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Confirmation == true) {
        var data = {

          SpecialityName: result.SpecialityName,
          Description: result.Description,
          Status: 1
        };


        this.spscv.Save(data).subscribe((m) => {
          if (m.success == true && m.status == 1) {

            this.notifyService.showSuccess("Add successfully", "");
            this.spinner.hide();
            this.refreshspeciality();

          } else {
            this.spinner.hide();

            this.notifyService.showError(m.message, "")
          }
        }, err => {
          this.spinner.hide();

          this.notifyService.showError("something went wrong", "")

        })

      }
    });


  }



  refreshspeciality() {

    this.commonsv.getactivespeciality().subscribe((m) => {

      this.allspecialitylst = m.lstModel;

    });
  }
}
