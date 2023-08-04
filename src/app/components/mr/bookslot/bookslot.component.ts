import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DatePipe } from '@angular/common'
import { Router } from "@angular/router";
import { MasterService } from "src/app/services/master";
import { StorageService } from "src/app/services/storage.service";
import { AuthService } from "src/app/services/auth.service";
import { CommonService } from "../../../services/common.service";
import { NotificationService } from '../../../services/notification.service'
import { interval } from 'rxjs';
import { MRProfileService } from '../../../services/mrprofile.service'
import { NgxSpinnerService } from "ngx-spinner";
import { datepickerAnimation } from 'ngx-bootstrap/datepicker/datepicker-animations';
import { Moment } from 'moment';

import * as moment from 'moment';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-bookslot',
  templateUrl: './bookslot.component.html',
  styleUrls: ['./bookslot.component.css']
})
export class BookslotComponent implements OnInit {

  Error = "";

  divstep1: boolean = true;
  divstep2: boolean = false;
  divstep3: boolean = false;
  divstep4: boolean = false;
  divstep5: boolean = false;

  submitted = false;
  submitted1 = false;

  submitted3 = false;

  slotdivshow: boolean = false;

  count: number = 30;
  btnshow: boolean = true;


  todayDate = new Date(Date.now());

  selectedDate = new Date(Date.now());


  display1date: Date;
  display2date: Date;
  display3date: Date;


  cssclassdisplay1 = 1;
  cssclassdisplay2 = 0;
  cssclassdisplay3 = 0;


  docdata: any = [];
  patientregreadonly: boolean = false;
  /////

  HospitalId: string = "0";
  BranchId: string = "0";

  DepartmentId: string = "0";
  DoctorId: string = "0";
  Consultationstype = "";
  paymenttype = "";

  ////////

  public counterIntervallTimer = interval(1000);
  private countersubscription;

  userForm = new FormGroup({
    userName: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")])
  });
  userForm1 = new FormGroup({
    userName: new FormControl("", Validators.required),
    otp: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
  });




  pateintForm = new FormGroup({

    mrTeleConsultationId: new FormControl('0', Validators.required),
    mrId: new FormControl('', Validators.required),
    mrReferenceNumber: new FormControl('', Validators.required),
    consultationReferenceNumber: new FormControl('', Validators.required),
    hospitalId: new FormControl('', Validators.required),
    branchId: new FormControl('', Validators.required),
    departmentId: new FormControl('', Validators.required),
    doctorId: new FormControl('', Validators.required),
    doctorSlotTimeId: new FormControl('', Validators.required),
    slotFromTime: new FormControl('', Validators.required),
    slotEndTime: new FormControl('', Validators.required),
    appointmentDate: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    status: new FormControl('0', Validators.required),
    type: new FormControl('0', Validators.required),
    consultationsStatus: new FormControl('0', Validators.required),
    response: new FormControl('', Validators.required),

  })
  Patientinfo: any;
  allstatelst: any;
  alldistrictlst: any[];
  allcitylst: any;
  allbranchlst: any[];
  alldepartmentlst: any[];
  allhospitallst: any;
  alldoctorlst: any[];
  allslotlst: any;
  doctorSlotTimeId: any;
  slotFromTime: any;
  slotEndTime: any;
  appointmentDate: any;
  hostpitalinfo: any;
  branchinfo: any;
  departmentinfo: any;
  doctorname: any;
  slotdisplay: string;
  appointmentdisplay: any;
  imagename: any;
  imagetype: any;
  imageSrc: any;

  Subject: any;
  constructor(
    public master: MasterService, private commonsv: CommonService, private ads: MRProfileService,
    private st: StorageService, private nav: Router, public Notification: NotificationService,
    public srv: AuthService, private notifyService: NotificationService,
    private spinner: NgxSpinnerService, public datepipe: DatePipe

  ) { }

  ngOnInit() {

    this.st.add("Utype", 3);

    this.binddaycalender(0);

    this.commonsv.getstates().subscribe((m) => {

      this.allstatelst = m.lstModel;
    });


    this.srv.getactivehospitals().subscribe((m) => {

      this.allhospitallst = m.lstModel;

    });



  }


  get f() { return this.userForm.controls; }


  get g() { return this.userForm1.controls; }


  get h() { return this.pateintForm.controls; }






  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }


  DoctorStepcancel() {
    this.divstep1 = false;
    this.divstep2 = true;
    this.divstep3 = false;
    this.divstep4 = false;
    this.divstep5 = false;
  }

  DoctorStep() {


    this.submitted3 = true;

    if (this.pateintForm.valid) {


      this.divstep1 = false;
      this.divstep2 = false;
      this.divstep3 = false;
      this.divstep4 = true;
      this.divstep5 = false;

      this.binddaycalender(0);

      this.srv.getactivehospitals().subscribe((m) => {

        this.allhospitallst = m.lstModel;

      });


    }

  }

  onStateSelected(value: string) {


    this.alldistrictlst = [];
    this.pateintForm.controls["districtId"].setValue("");
    this.allcitylst = [];
    this.pateintForm.controls["cityId"].setValue("");
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
    this.pateintForm.controls["cityId"].setValue("");
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
    this.alldepartmentlst = [];
    this.alldoctorlst = [];
    this.BranchId = "0";
    this.DepartmentId = "0";
    this.slotdivshow = false;
    this.DoctorId = "0";
    if (value != "" && value != undefined) {
      this.srv.getactivebranchbyhospital(value).subscribe((m) => {

        this.allbranchlst = m.lstModel;
      });
    } else {
      this.allbranchlst = [];
    }

  }



  onBranchSelected(value: string) {
    this.alldepartmentlst = [];
    this.alldoctorlst = [];
    this.DepartmentId = "0";
    this.slotdivshow = false;
    this.DoctorId = "0";
    if (value != "" && value != undefined) {
      this.srv.getactivedepartmentbybranch(value).subscribe((m) => {

        this.alldepartmentlst = m.lstModel;
      });
    } else {
      this.alldepartmentlst = [];
    }

  }




  onDepartmentSelected(value: string) {
    this.alldoctorlst = [];
    this.DoctorId = "0";
    this.slotdivshow = false;
    if (value != "" && value != undefined) {
      this.srv.getactivedoctorbydepartment(value).subscribe((m) => {

        this.alldoctorlst = m.lstModel;
      });
    } else {
      this.alldoctorlst = [];
    }

  }




  onDoctorSelected(value: string) {
    this.allslotlst = [];
    if (value != "" && value != undefined) {
      this.slotdivshow = true;
      var bindjson = {
        "doctorId": parseInt(value),
        "slotDate": new Date(Date.now())
      }
      this.ads.GetMRSlots(bindjson).subscribe((m) => {

        this.allslotlst = m.lstModel;
      });
    } else {

      this.slotdivshow = false;
      this.allslotlst = [];
    }

  }




  f_selectdate(dayselect, btnid) {


    if (btnid == 1) {

      this.cssclassdisplay1 = 1;
      this.cssclassdisplay2 = 0;
      this.cssclassdisplay3 = 0;

    } else if (btnid == 2) {

      this.cssclassdisplay1 = 0;
      this.cssclassdisplay2 = 1;
      this.cssclassdisplay3 = 0;

    } else if (btnid == 3) {

      this.cssclassdisplay1 = 0;
      this.cssclassdisplay2 = 0;
      this.cssclassdisplay3 = 1;
    }



    if (this.DoctorId != "0") {
      var bindjson = {
        "doctorId": parseInt(this.DoctorId),
        "slotDate": new Date(dayselect)
      }
      this.ads.GetMRSlots(bindjson).subscribe((m) => {

        this.allslotlst = m.lstModel;
      });
    } else {

      this.notifyService.showError("Please select doctor", "")
    }


  }




  binddaycalender(dayid) {



    if (dayid == 0) {

      this.selectedDate = new Date();
      this.display1date = this.selectedDate;
      this.display2date = new Date();
      this.display2date.setDate(this.selectedDate.getDate() + 1);
      this.display3date = new Date();
      this.display3date.setDate(this.selectedDate.getDate() + 2);



    } else if (dayid == 1) {


      let latest_date = this.datepipe.transform(this.display1date, 'dd-MM-yyyy');

      let current_date = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

      if (latest_date == current_date) {

      } else {



        this.display1date = new Date(this.selectedDate);
        this.display1date.setDate(this.selectedDate.getDate() - 2);
        this.selectedDate = new Date(this.display1date);

        this.display2date = new Date(this.selectedDate);
        this.display2date.setDate(this.selectedDate.getDate() + 1);

        this.display3date = new Date(this.selectedDate);
        this.display3date.setDate(this.selectedDate.getDate() + 2);

        if (this.DoctorId != "0") {
          var bindjson = {
            "doctorId": parseInt(this.DoctorId),
            "slotDate": new Date(this.display1date)
          }
          this.ads.GetMRSlots(bindjson).subscribe((m) => {

            this.allslotlst = m.lstModel;
          });
        } else {

          this.notifyService.showError("Please select doctor", "")
        }

        this.cssclassdisplay1 = 1;
        this.cssclassdisplay2 = 0;
        this.cssclassdisplay3 = 0;
      }



    } else if (dayid == 2) {



      this.selectedDate = new Date(this.display3date);
      this.display1date = this.selectedDate;

      this.display2date = new Date(this.selectedDate);
      this.display2date.setDate(this.display2date.getDate() + 1);

      this.display3date = new Date(this.selectedDate);
      this.display3date.setDate(this.display3date.getDate() + 2);

      if (this.DoctorId != "0") {
        var bindjson = {
          "doctorId": parseInt(this.DoctorId),
          "slotDate": new Date(this.display1date)
        }
        this.ads.GetMRSlots(bindjson).subscribe((m) => {

          this.allslotlst = m.lstModel;
        });
      } else {

        this.notifyService.showError("Please select doctor", "")
      }
      this.cssclassdisplay1 = 1;
      this.cssclassdisplay2 = 0;
      this.cssclassdisplay3 = 0;

    }


  }




  paymentStep() {



    if (this.HospitalId == undefined || this.HospitalId == null || this.HospitalId == "0") {
      this.Notification.showError("Please select Hospital", "")
      this.spinner.hide();
      return false;
    }


    if (this.BranchId == undefined || this.BranchId == null || this.BranchId == "0") {
      this.Notification.showError("Please select Branch", "")
      this.spinner.hide();
      return false;
    }


    if (this.DepartmentId == undefined || this.DepartmentId == null || this.DepartmentId == "0") {
      this.Notification.showError("Please select Department", "")
      this.spinner.hide();
      return false;
    }


    if (this.DoctorId == undefined || this.DoctorId == null || this.DoctorId == "0") {
      this.Notification.showError("Please select Doctor", "")
      this.spinner.hide();
      return false;
    }
    if (this.Subject == undefined || this.Subject == null || this.Subject == "") {
      this.Notification.showError("Please Fill Subject", "")
      this.spinner.hide();
      return false;
    }




    if (this.appointmentDate == undefined || this.appointmentDate == null || this.appointmentDate == "") {
      this.Notification.showError("Please select Slot", "")
      this.spinner.hide();
      return false;
    }


    this.divstep1 = false;
    this.divstep2 = true;


    this.hostpitalinfo = this.allhospitallst.filter(x => x.HospitalId == this.HospitalId)[0];
    this.branchinfo = this.allbranchlst.filter(x => x.BranchId == this.BranchId)[0];
    this.departmentinfo = this.alldepartmentlst.filter(x => x.DepartmentId == this.DepartmentId)[0];
    this.doctorname = this.alldoctorlst.filter(x => x.DoctorId == this.DoctorId)[0];


    this.slotdisplay = this.tConverttime(this.slotFromTime) + " - " + this.tConverttime(this.slotEndTime);
    this.appointmentdisplay = this.appointmentDate;

  }


  tConverttime(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }



  paymentcancel() {

    this.divstep1 = true;
    this.divstep2 = false;

  }



  payment() {




    if (this.HospitalId == undefined || this.HospitalId == null || this.HospitalId == "0") {
      this.Notification.showError("Please select Hospital", "")
      this.spinner.hide();
      return false;
    }


    if (this.BranchId == undefined || this.BranchId == null || this.BranchId == "0") {
      this.Notification.showError("Please select Branch", "")
      this.spinner.hide();
      return false;
    }


    if (this.DepartmentId == undefined || this.DepartmentId == null || this.DepartmentId == "0") {
      this.Notification.showError("Please select Department", "")
      this.spinner.hide();
      return false;
    }


    if (this.DoctorId == undefined || this.DoctorId == null || this.DoctorId == "0") {
      this.Notification.showError("Please select Doctor", "")
      this.spinner.hide();
      return false;
    }





    if (this.appointmentDate == undefined || this.appointmentDate == null || this.appointmentDate == "") {
      this.Notification.showError("Please select Slot", "")
      this.spinner.hide();
      return false;
    }

    var localstore = JSON.parse(localStorage.getItem('listoken'));



    var sendjson = {


      "mrTeleConsultationId": 0,
      "mrId": localstore.model.mrId,
      "mrReferenceNumber": "",
      "consultationReferenceNumber": "",
      "hospitalId": parseInt(this.HospitalId),
      "branchId": parseInt(this.BranchId),
      "departmentId": parseInt(this.DepartmentId),
      "doctorId": parseInt(this.DoctorId),
      "doctorSlotTimeId": parseInt(this.doctorSlotTimeId),
      "slotFromTime": this.slotFromTime,
      "slotEndTime": this.slotEndTime,
      "appointmentDate": this.appointmentDate,
      "mobile": localstore.model.mobile,
      "subject": this.Subject,
      "status": 0,
      "type": 0,
      "consultationsStatus": 0,
      "response": ""


    }

    this.spinner.show();

    this.ads.InsertMRTeleConsultationReg(sendjson).subscribe((m) => {
      if (m.success == true && m.status == 1) {
        this.spinner.hide();
        Swal.fire({
          title: "Appointment Book!",
          text: m.message,
          type: "success",
          showCancelButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        }).then((result) => {

          this.nav.navigateByUrl("/mr/appointmentlist");

        });


      } else {
        this.Notification.showError(m.message, "")
        this.spinner.hide();
      }
    }, err => {

      this.Notification.showError("something went wrong", "")
      this.spinner.hide();

    })


  }



  typechange(staus) {

    this.Consultationstype = staus;

  }


  f_paymenttype(staus) {

    this.paymenttype = staus;

  }



  slotselected(objecslost: any) {

    for (let i = 0; i < this.allslotlst.length; i++) {
      this.allslotlst[i].Status = 1;
    }


    this.doctorSlotTimeId = objecslost.DoctorSlotTimeId;
    objecslost.Status = 0;

    this.slotFromTime = this.conunttime(objecslost.SlotFromTime.totalSeconds),
      this.slotEndTime = this.conunttime(objecslost.SlotEndTime.totalSeconds),
      this.appointmentDate = objecslost.SlotDate;
  }


  conunttime(totalsecond) {

    const duration = moment.duration(totalsecond, 'seconds');
    const resultstring = moment.utc(duration.asMilliseconds()).format('HH:mm');
    return resultstring;
  }




}
