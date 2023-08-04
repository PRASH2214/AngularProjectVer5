import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../../services/common.service";

import { DoctorService } from "../../../../../services/doctor.service";


import { SpecialityService } from "../../../../../services/speciality.service";
import { MatCalendar } from '@angular/material/datepicker';

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfimrAddSpecialityDialog } from 'src/app/popups/addspeciality';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class DoctorAddComponent implements OnInit {
  submitted = false;
  allhospitallst: any;

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  userForm = new FormGroup({


    FirstName: new FormControl('', Validators.required),
    MiddleName: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    HospitalId: new FormControl('', Validators.required),
    GenderId: new FormControl('', Validators.required),

    CountryId: new FormControl('1', Validators.required),
    StateId: new FormControl('', Validators.required),
    DistrictId: new FormControl('', Validators.required),
    CityId: new FormControl('', Validators.required),
    DoctorAddress: new FormControl('', Validators.required),
    EmailAddress: new FormControl('', [Validators.required, Validators.email]),
    DoctorLicenseNumber: new FormControl('', Validators.required),
    Mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    MedicalLicenseImage: new FormControl(''),
    Dob: new FormControl('', Validators.required),
    Age: new FormControl('0', Validators.required),
    PinCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    SpecialityId: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required),
    ImagePath: new FormControl(''),
    FileName: new FormControl(''),
    FileFlag: new FormControl(''),
    BranchId: new FormControl('', Validators.required),
    DepartmentId: new FormControl('', Validators.required),
  })
  imageSrc: any;
  imagetype: any;
  imagename: any;
  allspecialitylst: any;
  allbranchlst: any[];
  alldepartmentlst: any[];

  minDate = new Date(1950, 4, 12); 
  maxDate = new Date();

  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: DoctorService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public spscv: SpecialityService



  ) { }

  ngOnInit() {


    this.commonsv.getactivehospitals().subscribe((m) => {

      this.allhospitallst = m.lstModel;

    });


    this.commonsv.getactivespeciality().subscribe((m) => {

      this.allspecialitylst = m.lstModel;

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
      data.GenderId = parseInt(data.GenderId);
      data.HospitalId = parseInt(data.HospitalId);
      data.BranchId = parseInt(data.BranchId);
      data.DepartmentId = parseInt(data.DepartmentId);
      data.StateId = parseInt(data.StateId);
      data.DistrictId = parseInt(data.DistrictId);
      data.CountryId = parseInt(data.CountryId);
      data.CityId = parseInt(data.CityId);
      data.SpecialityId = parseInt(data.SpecialityId);
      data.Dob = formatDate(data.Dob, 'yyyy-dd-MMT00:00:00', 'en')


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

      this.sv.Save(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          this.notifyService.showSuccess("Add successfully", "");

          this.nav.navigateByUrl('/admin/doctor');
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


  onHospitalSelected(value: string) {
    this.allbranchlst = [];
    if (value != "" && value != undefined) {
      this.commonsv.getbranchbyhospital(value).subscribe((m) => {

        this.allbranchlst = m.lstModel;
      });
    } else {
      this.allbranchlst = [];
    }

  }



  onBranchSelected(value: string) {
    this.alldepartmentlst = [];
    if (value != "" && value != undefined) {
      this.commonsv.getactivedepartmentbybranch(value).subscribe((m) => {

        this.alldepartmentlst = m.lstModel;
      });
    } else {
      this.alldepartmentlst = [];
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



    if (file1.type == "image/png" || file1.type == "image/jpeg" || file1.type == "application/pdf") {



      let fileName = file1.name;

     

      if (parseInt(fileName.length) < 25) {

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
      this.notifyService.showError("Please select valid file", "");
      this.userForm.controls["MedicalLicenseImage"].setValue("");
      this.imagename = "";
      this.imagetype = "";
      this.imageSrc = null;
    }
  }
  _handleReaderLoaded(e) {

    let reader = e.target;
    this.imageSrc = reader.result;
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
