import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from '../../../../services/notification.service'



import * as XLSX from 'xlsx';
import { BulkService } from '../../../../services/bulkupload.service'
import { Router, ActivatedRoute } from "@angular/router";
import { MasterService } from "../../../../services/master";
import { StorageService } from "../../../../services/storage.service";
import { CommonService } from "../../../../services/common.service";
import { parse } from "url";

@Component({
  selector: 'app-departmentbulkupload',
  templateUrl: './departmentbulkupload.component.html',
  styleUrls: ['./departmentbulkupload.component.css']
})
export class DepartmentBulkuploadComponent implements OnInit {
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




      //////////////////////////////// Hospital

      this._bulkService.savedepartmentbulkupload(this.finallist).subscribe((m) => {
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

        if (firstProp[i]["Branch Name"] == undefined || firstProp[i]["Branch Name"] == null || firstProp[i]["Branch Name"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }


        if (firstProp[i]["Department Name"] == undefined || firstProp[i]["Department Name"] == null || firstProp[i]["Department Name"] == "") {
          this.Notification.showError("Excel is not valid", "");


          return false;
        }


        if (firstProp[i]["Department Contact Mobile"] == undefined || firstProp[i]["Department Contact Mobile"] == null || firstProp[i]["Department Contact Mobile"] == "") {
          this.Notification.showError("Excel is not valid", "");
          return false;
        }

        if (firstProp[i]["Hospital Department Link"] == undefined || firstProp[i]["Hospital Department Link"] == null || firstProp[i]["Hospital Department Link"] == "") {
          this.Notification.showError("Excel is not valid", "");

          return false;
        }

        if (firstProp[i]["Amount"] == undefined || firstProp[i]["Amount"] == null || firstProp[i]["Amount"] == "") {
          this.Notification.showError("Excel is not valid", "");

          return false;
        }

        if (firstProp[i]["IsRefundAllowed"] == undefined || firstProp[i]["IsRefundAllowed"] == null || firstProp[i]["IsRefundAllowed"] == "") {
          this.Notification.showError("Excel is not valid", "");

          return false;
        }






        var objhostpital = {
          "departmentName": firstProp[i]["Department Name"],
          "branchName": firstProp[i]["Branch Name"],
          "hospitalName": firstProp[i]["Hospital Name"],
          "departmentContactMobile": JSON.stringify(firstProp[i]["Department Contact Mobile"]),
          "hospitalDepartmentLink": firstProp[i]["Hospital Department Link"],
          "amount": parseFloat(firstProp[i]["Amount"]),
          "isRefundAllowed": firstProp[i]["IsRefundAllowed"] === 'Yes' ? 1 : 0

        }


        this.sendhospitaljson.push(objhostpital);
      }




      if (this.sendhospitaljson != null) {
        this._bulkService.validatedepartmentbulkupload(this.sendhospitaljson).subscribe((m) => {
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
      for (let i = 0; i < this.errorlist.length; i++) {

        if (this.errorlist[i].isRefundAllowed == 1 || this.errorlist[i].isRefundAllowed == true) {
          this.errorlist[i].isRefundAllowed = 1;
        } else {
          this.errorlist[i].isRefundAllowed = 0;
        }
      }




      this._bulkService.validatedepartmentbulkupload(this.errorlist).subscribe((m) => {
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
