import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from '../../../../services/notification.service'


import * as XLSX from 'xlsx';

import { BulkService } from '../../../../services/bulkupload.service'
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-medicinebulkupload',
  templateUrl: './medicinebulkupload.component.html',
  styleUrls: ['./medicinebulkupload.component.css']
})
export class MedicineBulkuploadComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  headertext: string;
  type: string;
  submitted = false;
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

  Save() {



    if (this.finallist != null && this.finallist != undefined) {




      //////////////////////////////// Hospital

      this._bulkService.savemedicinebulkupload(this.finallist).subscribe((m) => {
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

        if (firstProp[i]["Medicine Name"] == undefined || firstProp[i]["Medicine Name"] == null || firstProp[i]["Medicine Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["Company Name"] == undefined || firstProp[i]["Company Name"] == null || firstProp[i]["Company Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }


        if (firstProp[i]["Drug Name"] == undefined || firstProp[i]["Drug Name"] == null || firstProp[i]["Drug Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }
        if (firstProp[i]["Drug Type Name"] == undefined || firstProp[i]["Drug Type Name"] == null || firstProp[i]["Drug Type Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }
        if (firstProp[i]["Description"] == undefined || firstProp[i]["Description"] == null || firstProp[i]["Description"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }





        var objhostpital = {

          "medicineName": firstProp[i]["Medicine Name"],
          "companyName": firstProp[i]["Company Name"],
          "drugName": firstProp[i]["Drug Name"],
          "drugTypeName": firstProp[i]["Drug Type Name"],
          "description": firstProp[i]["Description"]
        }


        this.sendhospitaljson.push(objhostpital);
      }




      if (this.sendhospitaljson != null) {
        this._bulkService.validatemedicinebulkupload(this.sendhospitaljson).subscribe((m) => {
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
      this._bulkService.validatemedicinebulkupload(this.errorlist).subscribe((m) => {
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
