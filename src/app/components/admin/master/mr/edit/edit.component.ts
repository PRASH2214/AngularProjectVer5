import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../../services/common.service";

import { MRService } from "../../../../../services/mr.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";

import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class MREditComponent implements OnInit {
  submitted = false;
  allcompanylist: any;


  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;
  pdficon: boolean;
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

    ImagePath: new FormControl(''),
    FileName: new FormControl(''),
    FileFlag: new FormControl(''),

  })
  imagename: any;
  imagetype: any;
  imageSrc: any;
  mrinfo: any;
  displaydob: any;
  imageshow: boolean = false;
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: MRService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
    ,
    private _route: ActivatedRoute,

  ) { }

  ngOnInit() {


    this.commonsv.getactivecompany().subscribe((m) => {

      this.allcompanylist = m.lstModel;

    });
    this.commonsv.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });





    this._route.params.subscribe(



      params => {


        this.sv.GetById(params["id"]).subscribe((m) => {
          this.mrinfo = m.model;

          this.imageSrc = m.model.MrLicenseImage;

          this.displaydob = m.model.DOB;

          if (m.model.MrLicenseImage != null && m.model.MrLicenseImage != undefined && m.model.MrLicenseImage != "") {
            this.imageshow = true;
          } else {
            this.imageshow = false;
          }


          if (this.imageSrc.split('.').pop() == "pdf") {

            this.pdficon = true;
          } else if (this.imageSrc.split('.').pop() == "png") {
            this.pdficon = false;
          } else if (this.imageSrc.split('.').pop() == "jpeg") {
            this.pdficon = false;
          }
          const date = moment(m.model.DOB);

          this.userForm.controls["DOB"].setValue(date);

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

      })


  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }



  get f() { return this.userForm.controls; }

  Save() {

    this.submitted = true;


    const controls = this.userForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {

      }
    }
    if (this.userForm.valid) {
      this.spinner.show();
      let data = this.userForm.value;

     
      data.MrId = parseInt(data.MrId);
      data.CountryId = parseInt(data.CountryId);
      data.GenderId = parseInt(data.GenderId);
      data.Age = parseInt(data.Age);
      data.CompanyId = parseInt(data.CompanyId);
      data.StateId = parseInt(data.StateId);
      data.DistrictId = parseInt(data.DistrictId);
      data.CityId = parseInt(data.CityId);

      data.DOB = formatDate(data.DOB, 'yyyy-MM-ddT00:00:00', 'en')


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

      this.sv.Update(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.notifyService.showSuccess("Update successfully", "");

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


  onDelete() {
    this.imagename = "";
    this.imagetype = "";
    this.imageSrc = "";
    this.userForm.controls["MedicalLicenseImage"].setValue("");
  
  }


  handleFileInput(e) {


    let file1 = e.target.files[0];



    let fileName = file1.name;
    if (file1.type == "image/png" || file1.type == "image/jpeg" || file1.type == "application/pdf") {


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


  getInvoiceUrl() {

    return this.imageSrc;
  }
}
