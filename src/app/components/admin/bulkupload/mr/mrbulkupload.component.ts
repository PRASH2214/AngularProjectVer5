import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from '../../../../services/notification.service'
import * as XLSX from 'xlsx';


import { BulkService } from '../../../../services/bulkupload.service'
import { Router, ActivatedRoute } from "@angular/router";
import { MasterService } from "../../../../services/master";
import { StorageService } from "../../../../services/storage.service";
import { CommonService } from "../../../../services/common.service";

@Component({
  selector: 'app-mrbulkupload',
  templateUrl: './mrbulkupload.component.html',
  styleUrls: ['./mrbulkupload.component.css']
})
export class MRBulkuploadComponent implements OnInit {

  headertext: string;
  type: string;
  submitted = false;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  sendhospitaljson: any = [];
  errorlistshow: boolean = true;
  errorlist: any = [];
  saveshow: boolean;
  finallist: any;
  constructor(
    public master: MasterService,
    private st: StorageService,
    private com: CommonService,
    private _bulkService: BulkService,
    public Notification: NotificationService,
    public _route: ActivatedRoute
  ) { }

  ngOnInit() {




  }


  Save() {



    if (this.finallist != null && this.finallist != undefined) {




      //////////////////////////////// mr

      this._bulkService.savemrbulkupload(this.finallist).subscribe((m) => {
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

        if (firstProp[i]["First Name"] == undefined || firstProp[i]["First Name"] == null || firstProp[i]["First Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["Middle Name"] == undefined || firstProp[i]["Middle Name"] == null || firstProp[i]["Middle Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["Last Name"] == undefined || firstProp[i]["Last Name"] == null || firstProp[i]["Last Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }


        if (firstProp[i]["Company Name"] == undefined || firstProp[i]["Company Name"] == null || firstProp[i]["Company Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }





        if (firstProp[i]["Gender"] == undefined || firstProp[i]["Gender"] == null || firstProp[i]["Gender"] == "") {
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


        if (firstProp[i]["MR Address"] == undefined || firstProp[i]["MR Address"] == null || firstProp[i]["MR Address"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["MR License Number"] == undefined || firstProp[i]["MR License Number"] == null || firstProp[i]["MR License Number"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["Mobile"] == undefined || firstProp[i]["Mobile"] == null || firstProp[i]["Mobile"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }



        if (firstProp[i]["DOB"] == undefined || firstProp[i]["DOB"] == null || firstProp[i]["DOB"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["PinCode"] == undefined || firstProp[i]["PinCode"] == null || firstProp[i]["PinCode"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }




        var objhostpital = {
          "firstName": firstProp[i]["First Name"],
          "middleName": firstProp[i]["Middle Name"],
          "lastName": firstProp[i]["Last Name"],
          "companyName": firstProp[i]["Company Name"],
          "strGender": firstProp[i]["Gender"],
          "StateName": firstProp[i]["State Name"],
          "DistrictName": firstProp[i]["District Name"],
          "CityName": firstProp[i]["City Name"],
          "emailAddress": firstProp[i]["Email"],
          "mrAddress": firstProp[i]["MR Address"],
          "mrLicenseNumber": firstProp[i]["MR License Number"],
          "Mobile": JSON.stringify(firstProp[i]["Mobile"]),
          "strDOB": firstProp[i]["DOB"],
          "PinCode": JSON.stringify(firstProp[i]["PinCode"])

        }


        this.sendhospitaljson.push(objhostpital);
      }




      if (this.sendhospitaljson != null) {
        this._bulkService.validatemrbulkupload(this.sendhospitaljson).subscribe((m) => {
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
      this._bulkService.validatemrbulkupload(this.errorlist).subscribe((m) => {
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
