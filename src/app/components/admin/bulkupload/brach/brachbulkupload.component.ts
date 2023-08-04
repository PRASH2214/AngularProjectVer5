import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from '../../../../services/notification.service'
import * as XLSX from 'xlsx';



import { BulkService } from '../../../../services/bulkupload.service'
import { Router, ActivatedRoute } from "@angular/router";

import { StorageService } from "../../../../services/storage.service";
import { CommonService } from "../../../../services/common.service";

@Component({
  selector: 'app-brachbulkupload',
  templateUrl: './brachbulkupload.component.html',
  styleUrls: ['./brachbulkupload.component.css']
})
export class BrachBulkuploadComponent implements OnInit {

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




      //////////////////////////////// Hospital

      this._bulkService.savebranchbulkupload(this.finallist).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.Notification.showSuccess("Update successfully", "");


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


        if (firstProp[i]["Hospital Name"] == undefined || firstProp[i]["Hospital Name"] == null || firstProp[i]["Hospital Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = null;
          break;
          return false;
        }

        if (firstProp[i]["Branch Name"] == undefined || firstProp[i]["Branch Name"] == null || firstProp[i]["Branch Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
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


        if (firstProp[i]["Branch Hospital Address"] == undefined || firstProp[i]["Branch Hospital Address"] == null || firstProp[i]["Branch Hospital Address"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }

        if (firstProp[i]["Branch Hospital License Number"] == undefined || firstProp[i]["Branch Hospital License Number"] == null || firstProp[i]["Branch Hospital License Number"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }



        if (firstProp[i]["Contact Name"] == undefined || firstProp[i]["Contact Name"] == null || firstProp[i]["Contact Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }


        if (firstProp[i]["Contact Mobile"] == undefined || firstProp[i]["Contact Mobile"] == null || firstProp[i]["Contact Mobile"] == "") {
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


        if (firstProp[i]["Branch Hospital Link"] == undefined || firstProp[i]["Branch Hospital Link"] == null || firstProp[i]["Branch Hospital Link"] == "") {
          this.Notification.showError("Excel is not valid", "");
          this.sendhospitaljson = [];
          break;
          return false;
        }

        var objhostpital = {
          "hospitalName": firstProp[i]["Hospital Name"],
          "branchName": firstProp[i]["Branch Name"],
          "StateName": firstProp[i]["State Name"],
          "DistrictName": firstProp[i]["District Name"],
          "CityName": firstProp[i]["City Name"],
          "branchHospitalAddress": firstProp[i]["Branch Hospital Address"],
          "branchHospitalLicenseNumber": firstProp[i]["Branch Hospital License Number"],
          "ContactName": firstProp[i]["Contact Name"],
          "ContactMobile": JSON.stringify(firstProp[i]["Contact Mobile"]),
          "PinCode": JSON.stringify(firstProp[i]["PinCode"]),
          "branchHospitalLink": firstProp[i]["Branch Hospital Link"]
        }


        this.sendhospitaljson.push(objhostpital);
      }




      if (this.sendhospitaljson != null) {
        this._bulkService.validatebranchbulkupload(this.sendhospitaljson).subscribe((m) => {
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
      this._bulkService.validatebranchbulkupload(this.errorlist).subscribe((m) => {
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
