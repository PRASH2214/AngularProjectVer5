import { Component, ElementRef, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from '../../../../services/notification.service'
import * as XLSX from 'xlsx';

import { ViewChild } from '@angular/core';
import { BulkService } from '../../../../services/bulkupload.service'
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-hospitalbulkupload.component',
  templateUrl: './hospitalbulkupload.component.html',
  styleUrls: ['./hospitalbulkupload.component.css']
})
export class HospitalBulkuploadComponent implements OnInit {

  headertext: string;
  type: string;
  submitted = false;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  imageSrc: any;
  imagetype: any;
  imagename: any;


  sendhospitaljson: any = [];
  errorlistshow: boolean = true;
  errorlist: any = [];
  saveshow: boolean;
  finallist: any;
  constructor(
    private _bulkService: BulkService,
    public Notification: NotificationService,
    public _route: ActivatedRoute
  ) { }

  ngOnInit() {



  }




  handleFileInput(e) {


    let file1 = e.target.files[0];



    let fileName = file1.name;
    let filetype = file1.type;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    this.imagename = fileName;
    this.imagetype = filetype;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {

    let reader = e.target;
    this.imageSrc = reader.result;
  }





  Save() {



    if (this.finallist != null && this.finallist != undefined) {




      //////////////////////////////// Hospital

      this._bulkService.savehospitalbulkupload(this.finallist).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.Notification.showSuccess("save successfully", "");


        } else {
          this.Notification.showError(m.message, "")

          if (m.status = 22 && m.lstModel.length > 0) {

            this.errorlist = m.lstModel;
            this.errorlistshow = false;
            this.saveshow = false;
          } else {
            this.errorlist = [];
            this.errorlistshow = true;
            this.saveshow = false;
          }
        }
      }, err => {

        this.Notification.showError("something went wrong", "")

      })

    }


  }


  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];

    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      var firstProp;
      for (var key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
          firstProp = jsonData[key];
          break;
        }
      }
      this.errorlist = [];
      this.sendhospitaljson = [];



      for (let i = 0; i < firstProp.length; i++) {

        if (firstProp[i]["Hospital Name"] == undefined || firstProp[i]["Hospital Name"] == null || firstProp[i]["Hospital Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }
        if (firstProp[i]["State Name"] == undefined || firstProp[i]["State Name"] == null || firstProp[i]["State Name"] == "") {
          this.Notification.showError("Excel is not valid", "");

          return false;
        }

        if (firstProp[i]["District Name"] == undefined || firstProp[i]["District Name"] == null || firstProp[i]["District Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }


        if (firstProp[i]["City Name"] == undefined || firstProp[i]["City Name"] == null || firstProp[i]["City Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }


        if (firstProp[i]["Hospital Address"] == undefined || firstProp[i]["Hospital Address"] == null || firstProp[i]["Hospital Address"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["License Number"] == undefined || firstProp[i]["License Number"] == null || firstProp[i]["License Number"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["Owner Name"] == undefined || firstProp[i]["Owner Name"] == null || firstProp[i]["Owner Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["Owner Mobile"] == undefined || firstProp[i]["Owner Mobile"] == null || firstProp[i]["Owner Mobile"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["Contact Name"] == undefined || firstProp[i]["Contact Name"] == null || firstProp[i]["Contact Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }


        if (firstProp[i]["Contact Mobile"] == undefined || firstProp[i]["Contact Mobile"] == null || firstProp[i]["Contact Mobile"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["PinCode"] == undefined || firstProp[i]["PinCode"] == null || firstProp[i]["PinCode"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }


        if (firstProp[i]["Hospital Link"] == undefined || firstProp[i]["Hospital Link"] == null || firstProp[i]["Hospital Link"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        var objhostpital = {
          "HospitalName": firstProp[i]["Hospital Name"],
          "StateName": firstProp[i]["State Name"],
          "DistrictName": firstProp[i]["District Name"],
          "CityName": firstProp[i]["City Name"],
          "HospitalAddress": firstProp[i]["Hospital Address"],
          "HospitalLicenseNumber": firstProp[i]["License Number"],
          "OwnerName": firstProp[i]["Owner Name"],
          "OwnerMobile": JSON.stringify(firstProp[i]["Owner Mobile"]),
          "ContactName": firstProp[i]["Contact Name"],
          "ContactMobile": JSON.stringify(firstProp[i]["Contact Mobile"]),
          "PinCode": JSON.stringify(firstProp[i]["PinCode"]),
          "HospitalLink": firstProp[i]["Hospital Link"]
        }


        this.sendhospitaljson.push(objhostpital);
      }




      if (this.sendhospitaljson.length > 0 && this.sendhospitaljson != null) {
        this._bulkService.validatehospitalbulkupload(this.sendhospitaljson).subscribe((m) => {
          if (m.success == true && m.status == 1) {
            this.saveshow = true;
            this.finallist = m.lstModel;
            this.errorlist = [];


            this.Notification.showSuccess("Please save these records", "");

          } else {
            this.Notification.showError(m.message, "")


            if (m.status = 22 && m.lstModel.length > 0) {

              this.errorlist = m.lstModel;
              this.errorlistshow = false;
              this.saveshow = false;
            } else {
              this.errorlist = [];
              this.errorlistshow = true;
              this.saveshow = false;
            }





          }
        }, err => {

          this.Notification.showError("something went wrong", "")

        })

      }


    }
    reader.readAsBinaryString(file);
  }

  Decline() {

    this.errorlist = [];
    this.finallist = [];
    this.saveshow = false;
    this.errorlistshow = true;
    this.myInputVariable.nativeElement.value = "";
  }

  checkdata() {





    if (this.errorlist.length > 0 && this.errorlist != null) {
      this._bulkService.validatehospitalbulkupload(this.errorlist).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.saveshow = true;
          this.finallist = m.lstModel;
          this.errorlist = [];
          this.Notification.showSuccess("Please save these records", "");
        } else {
          this.Notification.showError(m.message, "")


          if (m.status = 22 && m.lstModel.length > 0) {

            this.errorlist = m.lstModel;
            this.errorlistshow = false;
            this.saveshow = false;

          } else {
            this.errorlist = [];
            this.errorlistshow = true;
            this.saveshow = false;

          }





        }
      }, err => {

        this.Notification.showError("something went wrong", "")

      })

    } else {
      this.Notification.showError("Please select excel File", "");
    }


  }
}
