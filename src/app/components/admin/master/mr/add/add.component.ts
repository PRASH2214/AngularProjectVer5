import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../../services/common.service";

import { MRService } from "../../../../../services/mr.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";

import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class MRAddComponent implements OnInit {
  submitted = false;
  allcompanylist: any;


  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  userForm = new FormGroup({

    FirstName: new FormControl('', Validators.required),
    MiddleName: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    GenderId: new FormControl('', Validators.required),
    CompanyId: new FormControl('', Validators.required),
    CountryId: new FormControl('1', Validators.required),
    StateId: new FormControl('', Validators.required),
    DistrictId: new FormControl('', Validators.required),
    CityId: new FormControl('', Validators.required),
    MRAddress: new FormControl('', Validators.required),
    MRLicenseNumber: new FormControl('', Validators.required),
    Mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    MRLicenseImage: new FormControl(''),
    Dob: new FormControl('', Validators.required),
    Age: new FormControl('0', Validators.required),
    PinCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    Status: new FormControl(true, Validators.required),

    ImagePath: new FormControl(''),
    FileName: new FormControl(''),
    FileFlag: new FormControl(''),

  })
  imagename: any;
  imagetype: any;
  imageSrc: any;
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: MRService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }

  ngOnInit() {


    this.commonsv.getactivecompany().subscribe((m) => {

      this.allcompanylist = m.lstModel;

    });
    this.commonsv.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });


  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }


  get f() { return this.userForm.controls; }

  Save() {

    this.submitted = true;





    if (this.userForm.valid) {
      let data = this.userForm.value;


      this.spinner.show();
      data.CountryId = parseInt(data.CountryId);
      data.GenderId = parseInt(data.GenderId);
      data.Age = parseInt(data.Age);
      data.CompanyId = parseInt(data.CompanyId);
      data.StateId = parseInt(data.StateId);
      data.DistrictId = parseInt(data.DistrictId);
      data.Dob = formatDate(data.Dob, 'yyyy-MM-ddT00:00:00', 'en')


      data.CityId = parseInt(data.CityId);
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

      this.sv.Save(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.notifyService.showSuccess("Add successfully", "");

          this.nav.navigateByUrl('/admin/mr');
        } else {
          this.spinner.hide();
          this.notifyService.showError(m.message, "")
        }
      }, err => {
        this.spinner.hide();
        this.notifyService.showError("something went wrong", "")

      })
    }

  }

  onStateSelected(value: string) {
    this.alldistrictlst = [];

    this.allcitylst = [];

    if (value != "" && value != undefined) {
      this.commonsv.getdistricts(value).subscribe((m) => {

        this.alldistrictlst = m.lstModel;
      });
    } else {
      this.alldistrictlst = [];
    }

  }



  onDelete() {
    this.imagename = "";
    this.imagetype = "";
    this.imageSrc = "";
    this.userForm.controls["MedicalLicenseImage"].setValue("");

  }

  onDistrictSelected(value: string) {
    this.allcitylst = [];

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

      if (fileName.length < 25) {
        let filetype = file1.type;
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var pattern = /image-*/;
        var reader = new FileReader();
        this.imagename = fileName;
        this.imagetype = filetype;
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);

      } else {
        this.userForm.controls["MedicalLicenseImage"].setValue("");
        this.notifyService.showError("Please file name too long", "");
        this.imagename = "";
        this.imagetype = "";
        this.imageSrc = null;
      }

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
}
