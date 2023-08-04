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

import { NgxSpinnerService } from "ngx-spinner";
import { datepickerAnimation } from 'ngx-bootstrap/datepicker/datepicker-animations';
import { Moment } from 'moment';

import * as moment from 'moment';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-patientreg',
  templateUrl: './patientreg.component.html',
  styleUrls: ['./patientreg.component.css']
})
export class PatientRegComponent implements OnInit {

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
    patientId: new FormControl('0'),
    patientReferenceNumber: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    countryId: new FormControl('1', Validators.required),
    stateId: new FormControl('', Validators.required),
    districtId: new FormControl('', Validators.required),
    cityId: new FormControl('', Validators.required),
    patientAddress: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    dob: new FormControl('', Validators.required),
    age: new FormControl('0', Validators.required),
    pinCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    status: new FormControl('1', Validators.required),
    genderId: new FormControl('', Validators.required),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    relationId: new FormControl('1', Validators.required),
    relationName: new FormControl('self', Validators.required),
    concern: new FormControl('', Validators.required),

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


  constructor(
    public master: MasterService, private commonsv: CommonService,
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



  Sendotp() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.spinner.show();
      let data = this.userForm.value;
      this.srv.patientregistrationotp(data).subscribe((m) => {
        if (m.success == true) {

          if (m.status == 1) {
            this.divstep1 = false;
            this.divstep2 = true;
            this.divstep3 = false;
            this.divstep4 = false;
            this.divstep5 = false;
            this.spinner.hide();
            this.notifyService.showSuccess("OTP Sent on your registered mobile number", "")
            this.userForm1.controls["userName"].setValue(this.userForm.controls["userName"].value);
            this.pateintForm.controls["mobile"].setValue(this.userForm.controls["userName"].value);
            this.countersubscription = this.counterIntervallTimer.subscribe(() => this.myTimerstart());
            this.userForm1.controls["otp"].setValue("");
            this.count = 30;

            this.btnshow = false;
          }
          else if (m.status == 20) {// Payment already in process
            this.spinner.hide();
            Swal.fire({
              title: 'Payment already in process.',
              text: 'Do you want to complete the previous payment or discard previous appointment.',
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Complete the payment',
              cancelButtonText: 'Discard!',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false
            }).then((result) => {
              if (result.value) {
                window.location.href = m.message;
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.srv.DiscardConsultation({ "ConsultationReferenceNumber": m.model }).subscribe((m) => { });
              }
            });
          }
          else {
            this.spinner.hide();
            this.divstep1 = true;
            this.divstep2 = false;
            this.divstep3 = false;
            this.divstep4 = false;
            this.divstep5 = false;
            this.notifyService.showError(m.message, "")

            //  this.nav.navigateByUrl("/patient/login");
          }
        }

      }, err => {
        this.spinner.hide();
      });
    } else {
      this.spinner.hide();
      this.notifyService.showError("Enter valid Mobile Number", "")

    }

  }




  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }


  Authenticate() {

    this.Error = undefined;



    //   const controls = this.userForm1.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {
    //   
    //  }
    // }

    if (this.userForm1.valid) {
      let data = this.userForm1.value;
      this.spinner.show();
      this.srv.checkpatientexists(data).subscribe((m) => {
        if (m.success == true) {

          if (m.status == 1) {


            this.divstep1 = false;
            this.divstep2 = false;
            this.divstep3 = true;
            this.divstep4 = false;
            this.divstep5 = false;
            this.Patientinfo = m.model;

            this.pateintForm.controls["mobile"].setValue(this.userForm1.controls["userName"].value);


            if (m.model.patientId != 0) {

              const date = moment(m.model.dob);
              this.pateintForm.controls["dob"].setValue(date);


              //   this.pateintForm.controls["dob"].setValue(formatDate(m.model.dob, 'dd-MM-yyyy', 'en'));
              this.onStateSelected(m.model.stateId);
              this.onDistrictSelected(m.model.districtId);
              this.patientregreadonly = true;
              Object.getOwnPropertyNames(this.Patientinfo).forEach((key) => {
                if (this.pateintForm.contains(key)) {

                  if (key != "dob") {

                    this.pateintForm.controls[key].setValue(m.model[key]);

                  }

                }
              })


            } else {
              this.patientregreadonly = false;
            }


            this.spinner.hide();

          } else {
            this.spinner.hide();
            this.notifyService.showError(m.message, "");
            this.divstep1 = false;
            this.divstep2 = true;
            this.divstep3 = false;
            this.divstep4 = false;
            this.divstep5 = false;
          }



        } else {
          this.spinner.hide();
          this.notifyService.showError(m.message, "")
          this.userForm1.controls["userName"].setValue(this.userForm.controls["userName"].value);

          this.divstep1 = false;
          this.divstep2 = true;
          this.divstep3 = false;
          this.divstep4 = false;
          this.divstep5 = false;
        }

      }, err => {
        this.spinner.hide();
      });

    } else {
      this.spinner.hide();

      this.notifyService.showError("Enter valid OTP Number", "")

    }
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

      var concerstr = "";
      var firstName = "", lastName = "", patientAddress = "";

      firstName = this.pateintForm.controls["firstName"].value;
      if (firstName.trim() == "") {
        this.notifyService.showError("First Name is required", "");
        return false;
      }

      lastName = this.pateintForm.controls["lastName"].value;
      if (lastName.trim() == "") {
        this.notifyService.showError("Last Name is required", "");
        return false;
      }

      patientAddress = this.pateintForm.controls["patientAddress"].value;
      if (patientAddress.trim() == "") {
        this.notifyService.showError("Address is required", "");
        return false;
      }


      concerstr = this.pateintForm.controls["concern"].value;
      if (concerstr.trim() == "") {
        this.notifyService.showError("Concern is required", "");
        return false;
      }




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
      this.srv.GetDoctorSlots(bindjson).subscribe((m) => {

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
      this.srv.GetDoctorSlots(bindjson).subscribe((m) => {

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
          this.srv.GetDoctorSlots(bindjson).subscribe((m) => {

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
        this.srv.GetDoctorSlots(bindjson).subscribe((m) => {

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


  paymentStepcancel() {

    this.divstep1 = false;
    this.divstep2 = false;
    this.divstep3 = true;
    this.divstep4 = false;
    this.divstep5 = false;

  }

  paymentStep() {


    if (this.Consultationstype == undefined || this.Consultationstype == null || this.Consultationstype == "") {
      this.Notification.showError("Please select Appointment Type", "")
      this.spinner.hide();
      return false;
    }
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


    this.divstep1 = false;
    this.divstep2 = false;
    this.divstep3 = false;
    this.divstep4 = false;
    this.divstep5 = true;

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

    this.divstep1 = false;
    this.divstep2 = false;
    this.divstep3 = false;
    this.divstep4 = true;
    this.divstep5 = false;

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

    if (this.Consultationstype == "2") {
      if (this.paymenttype == undefined || this.paymenttype == null || this.paymenttype == "") {
        this.Notification.showError("Please select Payment type", "")
        this.spinner.hide();
        return false;
      }
    } else {
      this.paymenttype = "ONLINE"
    }





    var sendjson = {
      "patientReg": {
        "patientId": parseInt(this.pateintForm.controls["patientId"].value),
        "patientReferenceNumber": this.pateintForm.controls["patientReferenceNumber"].value,
        "firstName": this.pateintForm.controls["firstName"].value,
        "lastName": this.pateintForm.controls["lastName"].value,
        "countryId": parseInt(this.pateintForm.controls["countryId"].value),
        "stateId": parseInt(this.pateintForm.controls["stateId"].value),
        "districtId": parseInt(this.pateintForm.controls["districtId"].value),
        "cityId": parseInt(this.pateintForm.controls["cityId"].value),
        "patientAddress": this.pateintForm.controls["patientAddress"].value,
        "mobile": this.pateintForm.controls["mobile"].value,
        "dob": this.pateintForm.controls["dob"].value,
        "age": 0,
        "pinCode": this.pateintForm.controls["pinCode"].value,
        "status": 1,
        "genderId": parseInt(this.pateintForm.controls["genderId"].value),
        "emailAddress": this.pateintForm.controls["emailAddress"].value,
        "relationId": parseInt(this.pateintForm.controls["relationId"].value),
        "relationName": this.pateintForm.controls["relationName"].value,
        "otp": this.userForm1.controls["otp"].value
      },
      "patientTeleConsultationReg": {
        "hospitalId": parseInt(this.HospitalId),
        "branchId": parseInt(this.BranchId),
        "departmentId": parseInt(this.DepartmentId),
        "doctorId": parseInt(this.DoctorId),
        "doctorSlotTimeId": parseInt(this.doctorSlotTimeId),
        "slotFromTime": this.slotFromTime,
        "slotEndTime": this.slotEndTime,
        "appointmentDate": this.appointmentDate,
        "paymentAmmount": this.departmentinfo.Amount,
        "mobile": this.pateintForm.controls["mobile"].value,
        "concern": this.pateintForm.controls["concern"].value,
        "type": parseInt(this.Consultationstype),
        "PaymentMode": this.paymenttype
      },
      "lstPatientDocumentReg": this.docdata
    }

    this.spinner.show();

    if (this.pateintForm.controls["patientId"].value == "0") {

      this.srv.newpatientrregistration(sendjson).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          if (this.paymenttype == "ONLINE") {
            window.location.href = m.message;
          }
          else {
            this.spinner.hide();
            Swal.fire({
              title: "Appointment!",
              text: m.message,
              type: "success",
              showCancelButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false
            }).then((result) => {

              this.nav.navigateByUrl('/patient/login');


            });

          }

        } else {
          this.Notification.showError(m.message, "")
          this.spinner.hide();
        }
      }, err => {

        this.Notification.showError("something went wrong", "")
        this.spinner.hide();

      })

    } else {


      this.srv.revisitpatientregistration(sendjson).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();
          if (this.paymenttype == "ONLINE") {
            window.location.href = m.message;
          }
          else {
            this.spinner.hide();
            Swal.fire({
              title: "Appointment!",
              text: m.message,
              type: "success",
              showCancelButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false
            }).then((result) => {

              this.nav.navigateByUrl('/patient/login');


            });
          }

        } else {
          this.Notification.showError(m.message, "")
          this.spinner.hide();
        }
      }, err => {

        this.Notification.showError("something went wrong", "")
        this.spinner.hide();

      })

    }


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


  myTimerstart() {

    if (this.count <= 0) {

      this.countersubscription.unsubscribe();
      this.btnshow = true;
    } else {

      this.btnshow = false;
      this.count = this.count - 1;
    }


  }




  handleFileInput(e) {


    let file1 = e.target.files[0];


    if (file1.type == "image/png" || file1.type == "image/jpeg" || file1.type == "application/pdf") {



      let fileName = file1.name;
      let filetype = file1.type;
      var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      var pattern = /image-*/;
      var reader = new FileReader();
      this.imagename = fileName;
      this.imagetype = filetype;
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    } else {
      this.imagename = "";
      this.imagetype = "";
      this.imageSrc = null;
      this.Notification.showError("Please select valid file", "")

    }
  }
  _handleReaderLoaded(e) {

    let reader = e.target;
    this.imageSrc = reader.result;


    var docarrary = {
      "patientDocumentId": 0,
      "patientId": 0,
      "patientReferenceNumber": "",
      "consultationReferenceNumber": "",
      "fileName": this.imagename,
      "filePath": this.imageSrc.split(',')[1],
      "fileType": 1,
      "status": 1,
      "fileFlag": this.imagetype
    }

    this.docdata.push(docarrary);



  }





  onDeleteprobItem(objecpro) {

    var index = this.docdata.indexOf(objecpro);
    if (index !== -1) {
      this.docdata.splice(index, 1);
    }
  }
}
