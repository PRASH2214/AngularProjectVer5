import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from '../../../../services/notification.service'

import * as XLSX from 'xlsx';


import { BulkService } from '../../../../services/bulkupload.service'
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-companybulkupload',
  templateUrl: './companybulkupload.component.html',
  styleUrls: ['./companybulkupload.component.css']
})
export class CompanyBulkuploadComponent implements OnInit {

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

    private _bulkService: BulkService,
    public Notification: NotificationService,
    public _route: ActivatedRoute
  ) { }

  ngOnInit() {



  }

  Save() {



    if (this.finallist != null && this.finallist != undefined) {




      //////////////////////////////// Hospital

      this._bulkService.savecompanybulkupload(this.finallist).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.Notification.showSuccess("save successfully", "");


        } else {
          this.Notification.showError(m.message, "")
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

      for (let i = 0; i < firstProp.length; i++) {


        if (firstProp[i]["Company Name"] == undefined || firstProp[i]["Company Name"] == null || firstProp[i]["Company Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = null;
          break;
          return false;
        }


        if (firstProp[i]["State Name"] == undefined || firstProp[i]["State Name"] == null || firstProp[i]["State Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }

        if (firstProp[i]["District Name"] == undefined || firstProp[i]["District Name"] == null || firstProp[i]["District Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }


        if (firstProp[i]["City Name"] == undefined || firstProp[i]["City Name"] == null || firstProp[i]["City Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }


        if (firstProp[i]["Company Address"] == undefined || firstProp[i]["Company Address"] == null || firstProp[i]["Company Address"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }

        if (firstProp[i]["Company License Number"] == undefined || firstProp[i]["Company License Number"] == null || firstProp[i]["Company License Number"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }



        if (firstProp[i]["Spoc Name"] == undefined || firstProp[i]["Spoc Name"] == null || firstProp[i]["Spoc Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }


        if (firstProp[i]["Spoc Mobile"] == undefined || firstProp[i]["Spoc Mobile"] == null || firstProp[i]["Spoc Mobile"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }



        if (firstProp[i]["Admin Name"] == undefined || firstProp[i]["Admin Name"] == null || firstProp[i]["Admin Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }


        if (firstProp[i]["Admin Mobile"] == undefined || firstProp[i]["Admin Mobile"] == null || firstProp[i]["Admin Mobile"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }


        if (firstProp[i]["PinCode"] == undefined || firstProp[i]["PinCode"] == null || firstProp[i]["PinCode"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }


        if (firstProp[i]["Company Web Link"] == undefined || firstProp[i]["Company Web Link"] == null || firstProp[i]["Company Web Link"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }

        var objhostpital = {
          "companyName": firstProp[i]["Company Name"],
          "branchName": firstProp[i]["Branch Name"],
          "StateName": firstProp[i]["State Name"],
          "DistrictName": firstProp[i]["District Name"],
          "CityName": firstProp[i]["City Name"],
          "companyAddress": firstProp[i]["Company Address"],
          "companyLicenseNumber": firstProp[i]["Company License Number"],
          "spocName": firstProp[i]["Spoc Name"],
          "spocMobile": JSON.stringify(firstProp[i]["Spoc Mobile"]),
          "adminName": firstProp[i]["Admin Name"],
          "adminMobile": JSON.stringify(firstProp[i]["Admin Mobile"]),
          "PinCode": JSON.stringify(firstProp[i]["PinCode"]),
          "companyWebLink": firstProp[i]["Company Web Link"]
        }


        this.sendhospitaljson.push(objhostpital);
      }




      if (this.sendhospitaljson != null) {
        this._bulkService.validatecompanybulkupload(this.sendhospitaljson).subscribe((m) => {
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
      this._bulkService.validatecompanybulkupload(this.errorlist).subscribe((m) => {
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

    }else {
      this.Notification.showError("Please select excel File", "");
    }


  }

}
