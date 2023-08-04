import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConnectionService } from 'src/app/services/Connection.service';
import { globalx } from 'src/app/services/globals.service';
import { MasterService } from 'src/app/services/master';
import { interval } from 'rxjs';
import { Router } from '@angular/router';
import { DoctorConsultationService } from 'src/app/services/doctorconsultation.service';
import { NotificationService } from '../../../services/notification.service'
declare var JitsiMeetExternalAPI: any;
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent implements OnInit {
  @ViewChild('audioConnect') audioPlayerRef: ElementRef;

  Error = "";

  consultationinfo: any;
  advice: any;
  /////////////alergy/////////////////
  AllergyName: any;
  Still_Have: any;
  DurationId: any;
  SeverityId: any;
  allergynote: any;
  Allergyselectedlst: any = [];
  ///////////////////////////

  ///////////////////////////////chat
  dispdate = new Date();

  chatmessagelist: any = [];

  /////////////////////////////

  Smoking: boolean = false;
  Diabetes: boolean = false;
  Alcohol: boolean = false;
  generalExamination: any;


  /////////////////
  //////////////////medicaine

  Frequency: any;
  Dosagetype: any;
  Dosage: any;
  Duration: any;
  Durationtype: any;
  medicainenotes: any;

  rxlist: any = [];
  DosageTypelist: any = [];
  Dosagelist: any = [];
  arryrxlist: any = [];

  ////////////////

  Durationid: any;
  Durationtxt: any;
  Severityid: any;
  Severitytxt: any;
  Durationlst: any;
  Severitylst: any;
  MedicineId: any;
  DiagnosisName: any;

  DiagnosisNamelst: any = [];
  showAge: number;

  closeResult: string;
  previewbtn: boolean = true;
  Doctormessage: string = "";
  constructor(@Inject(DOCUMENT) private document: any,
    private router: Router,
    public master: MasterService, private nav: Router,
    private connectionService: ConnectionService,
    private globalx: globalx, private spinner: NgxSpinnerService,
    private _srv: DoctorConsultationService,
    public notifyService: NotificationService,
    private modalService: NgbModal
  ) { }



  elem;
  public counterIntervallTimer = interval(1000);
  private countersubscription;
  ngOnInit(): void {
    // this.playAudio(true);
    this.globalx.MessageRecievedByDoctor(this.MessageReceived.bind(this));
    this.elem = document.getElementById("divcontainer");
    this.connectionService.GetVCToken("D" + this.master.CurrentUser.model.doctorId).subscribe((m) => {
      if (m.model.room != null) {
        //get Consultation by COnsultation Id
        this._srv.GetConsultationPatientDetail(this.master.teleConsultationId).subscribe((res) => {
          //If consultation exists
          if (res != null && res.model != res) {
            this.spinner.show();
            // Initiate VC Call
            this.CallJitsi(m.model);
            this.countersubscription = this.counterIntervallTimer.subscribe(() => this.myTimerstart());

            this.consultationinfo = res.model;
            this.f_age(this.consultationinfo.patientTeleConsultationDetail.dob)

          }
        }, err => {
          this.spinner.hide();
        });

        // this.spinner.show();
        // this.CallJitsi(m.model);
        // this.countersubscription = this.counterIntervallTimer.subscribe(() => this.myTimerstart());

      }
      else
        alert("Wrong attempt");
    }, err => {

    });



    this._srv.getmedicinemaster().subscribe((m) => {
      if (m.status == 1) {
        this.rxlist = m.lstModel;
      } else {
        this.rxlist = [];
      }

    }, err => {

      this.rxlist = [];

    });

    this._srv.getdrugtype().subscribe((m) => {
      if (m.status == 1) {
        this.DosageTypelist = m.lstModel;


      } else {
        this.DosageTypelist = [];
      }

    }, err => {

      this.DosageTypelist = [];

    });

    this._srv.getmasterdosevalue().subscribe((m) => {
      if (m.status == 1) {
        this.Dosagelist = m.lstModel;
      } else {
        this.Dosagelist = [];
      }

    }, err => {

      this.Dosagelist = [];

    });




  }



  AddDiagnosis() {



    if (this.DiagnosisName == null || this.DiagnosisName == "" || this.DiagnosisName == undefined) {
      this.notifyService.showError("Please Fill Diagnosis ", '');
      return false;
    }

    var diagnosisitobj = {
      "consultationDiagnosisId": 0,
      "patientTeleConsultationId": this.consultationinfo.patientTeleConsultationDetail.patientTeleConsultationId,
      "name": this.DiagnosisName,
      "code": this.DiagnosisName,
      "consultationReferenceNumber": (this.consultationinfo.patientTeleConsultationDetail.consultationReferenceNumber),
      "patientId": parseInt(this.consultationinfo.patientTeleConsultationDetail.patientId),
      "doctorId": parseInt(this.master.CurrentUser.model.doctorId),
    }
    this.DiagnosisNamelst.push(diagnosisitobj);
    this.DiagnosisName = "";


  }



  onDeleteprobItem(objecpro) {

    var index = this.DiagnosisNamelst.indexOf(objecpro);
    if (index !== -1) {
      this.DiagnosisNamelst.splice(index, 1);
    }
  }




  myTimerstart() {
    if (document.getElementById("divcontainer").innerHTML != "") {
      //  this.playAudio(false);
      this.spinner.hide();
      this.countersubscription.unsubscribe();
    }
  }

  CallJitsi(data) {
    var name = this.master.CurrentUser.model.firstName + " " + this.master.CurrentUser.model.middleName + " " + this.master.CurrentUser.model.lastName;
    if (document.getElementById("divcontainer").innerHTML != "") {
      alert('Please wait...');
      return;
    }
    var displayname = "Doctor";

    //const domain = 'connect.ecubix.com';
    var options = {
      roomName: data.room,
      // width: w,
      // height: h,
      parentNode: document.getElementById("divcontainer"),
      jwt: data.token,// document.getElementById("hidToekn").value,
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        filmStripOnly: false,
        TOOLBAR_BUTTONS: ['hangup', 'microphone', 'camera', 'fullscreen']
      },
      userInfo: { displayName: displayname }
    };

    const api = new JitsiMeetExternalAPI("connect.ecubix.com", options);
    //api = new JitsiMeetExternalAPI(domain, options);

    api.on('readyToClose', () => {

      document.getElementById("divcontainer").innerHTML = "";
    });
    return false;
  }


  onDurationChange(event: any) {
    this.Durationid = event.target.value;
    this.Durationtxt = event.target.options[event.target.selectedIndex].text;
  }

  onSeverityChange(event: any) {
    this.Severityid = event.target.value;
    this.Severitytxt = event.target.options[event.target.selectedIndex].text;
  }


  onDeleteallergyItem(objallergy) {


    var index = this.Allergyselectedlst.indexOf(objallergy);
    if (index !== -1) {
      this.Allergyselectedlst.splice(index, 1);
    }

  }


  addallergy() {


    if (this.AllergyName == null || this.AllergyName == "" || this.AllergyName == undefined) {
      this.notifyService.showError("Please Fill Allergy", '');
      return false;
    }


    if (this.Still_Have == null || this.Still_Have == undefined) {

      this.notifyService.showError("Please select still have Allergy", '');
      return false;
    }

    if (this.DurationId == null || this.DurationId == "" || this.DurationId == undefined) {
      this.notifyService.showError("Please select Duration", '');
      return false;
    }
    if (this.SeverityId == null || this.SeverityId == "" || this.SeverityId == undefined) {
      this.notifyService.showError("Please select severity Type", '');
      return false;
    }


    if (this.allergynote == null || this.allergynote == undefined) {
      this.allergynote = "";
    }


    var allergyobj = {
      "consultationAllergyId": 0,
      "patientTeleConsultationId": this.consultationinfo.patientTeleConsultationDetail.patientTeleConsultationId,
      "name": this.AllergyName,
      "isStill": (this.Still_Have == true) ? true : false,
      "notes": this.allergynote,
      "severityType": this.SeverityId,
      "duration": this.DurationId,
      "consultationReferenceNumber": this.consultationinfo.patientTeleConsultationDetail.consultationReferenceNumber,
      "patientId": parseInt(this.consultationinfo.patientTeleConsultationDetail.patientId),
      "doctorId": parseInt(this.master.CurrentUser.model.doctorId),
    }

    this.Allergyselectedlst.push(allergyobj);

    this.allergynote = "";
    this.SeverityId = "";
    this.DurationId = "";
    this.Still_Have = "";
    this.AllergyName = "";

  }

  onMedicineChange() {

  }


  addrx() {



    if (this.MedicineId == null || this.MedicineId == "" || this.MedicineId == undefined) {
      this.notifyService.showError("Please Fill Rx from listing", '');
      return false;
    }

    if (this.Frequency == null || this.Frequency == "" || this.Frequency == undefined) {

      this.notifyService.showError("Please select Frequency", '');

      return false;
    }

    if (this.Dosage == null || this.Dosage == "" || this.Dosage == undefined) {

      this.notifyService.showError("Please select Dose", '');

      return false;
    }


    if (this.Dosagetype == null || this.Dosagetype == "" || this.Dosagetype == undefined) {

      this.notifyService.showError("Please select Dose Type", '');

      return false;
    }





    if (this.Durationtype == null || this.Durationtype == "" || this.Durationtype == undefined) {
      this.notifyService.showError("Please select Duration", '');


      return false;
    }

    if (this.Duration == null || this.Duration == "" || this.Duration == undefined) {
      this.notifyService.showError("Please select Duration Type", '');


      return false;
    }

    if (this.medicainenotes == null || this.medicainenotes == undefined) {


      this.medicainenotes = "";
    }




    var tempstatname = this.arryrxlist.filter(entity => entity.medicineId == this.MedicineId);

    if (tempstatname.length == 0) {


      var medicanname = this.rxlist.filter(entity => entity.MedicineId == this.MedicineId);
      this.arryrxlist.push({
        "consultationMedicineId": 0,
        "patientTeleConsultationId": this.consultationinfo.patientTeleConsultationDetail.patientTeleConsultationId,
        "medicineId": parseInt(this.MedicineId),
        "medicineName": medicanname[0].MedicineName,
        "frequency": this.Frequency,
        "dosage": this.Dosage,
        "dosageType": this.Dosagetype,
        "duration": this.Durationtype,
        "notes": this.medicainenotes,
        "consultationReferenceNumber": (this.consultationinfo.patientTeleConsultationDetail.consultationReferenceNumber),
        "patientId": parseInt(this.consultationinfo.patientTeleConsultationDetail.patientId),
        "doctorId": parseInt(this.master.CurrentUser.model.doctorId),
      });


      this.MedicineId = "";
      this.Frequency = "";
      this.Dosage = "";
      this.Dosagetype = "";
      this.Duration = "";
      this.medicainenotes = "";
      this.Durationtype = "";

    } else {

      this.notifyService.showError("Same medicines should not get replicated", '');
      this.MedicineId = "";
      this.Frequency = "";
      this.Dosage = "";
      this.Dosagetype = "";
      this.Duration = "";
      this.medicainenotes = "";
      this.Durationtype = "";

      return false;

    }
  }

  f_age(bDay) {


    const convertAge = new Date(bDay);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);


  }
  onDeleterxItem(objecpro) {

    var index = this.arryrxlist.indexOf(objecpro);
    if (index !== -1) {
      this.arryrxlist.splice(index, 1);
    }

  }


  Consultationsend() {

    if (this.arryrxlist.length == 0) {
      this.notifyService.showError("Please fill Medicine", '');
      return false;
    }

    if (this.advice == null || this.advice == "" || this.advice == undefined) {
      this.notifyService.showError("Please fill advice", '');
      return false;
    }

    var consulationjson = {
      "patientTeleConsultationDetail": {
        "patientTeleConsultationId": parseInt(this.consultationinfo.patientTeleConsultationDetail.patientTeleConsultationId),
        "patientReferenceNumber": this.consultationinfo.patientTeleConsultationDetail.patientReferenceNumber,
        "consultationReferenceNumber": this.consultationinfo.patientTeleConsultationDetail.consultationReferenceNumber,
        "patientId": parseInt(this.consultationinfo.patientTeleConsultationDetail.patientId),
        "firstName": this.consultationinfo.patientTeleConsultationDetail.firstName,
        "lastName": this.consultationinfo.patientTeleConsultationDetail.lastName,
        "patientAddress": this.consultationinfo.patientTeleConsultationDetail.patientAddress,
        "mobile": this.consultationinfo.patientTeleConsultationDetail.mobile,
        "dob": this.consultationinfo.patientTeleConsultationDetail.dob,
        "genderId": parseInt(this.consultationinfo.patientTeleConsultationDetail.genderId),
        "age": parseInt(this.consultationinfo.patientTeleConsultationDetail.age),
        "profileImagePath": this.consultationinfo.patientTeleConsultationDetail.profileImagePath,
        "hospitalName": "",
        "branchName": "",
        "departmentName": "",
        "doctorName": "",
        "concern": this.consultationinfo.patientTeleConsultationDetail.concern,
        "type": parseInt(this.consultationinfo.patientTeleConsultationDetail.type),
        "paymentMode": this.consultationinfo.patientTeleConsultationDetail.paymentMode,
        "advice": this.advice
      },
      "patientDocumentReg": [

      ],
      "patientTeleConsultationAllergy": this.Allergyselectedlst,
      "patientTeleConsultationExamination": {
        "consultationExamId": 0,
        "patientTeleConsultationId": this.consultationinfo.patientTeleConsultationDetail.patientTeleConsultationId,
        "generalExamination": this.generalExamination,
        "isSmoker": (this.Smoking == true) ? 1 : 0,
        "isDiabetic": (this.Diabetes == true) ? 1 : 0,
        "isAlcoholic": (this.Alcohol == true) ? 1 : 0,
        "additionalMedicine": this.generalExamination,
        "consultationReferenceNumber": (this.consultationinfo.patientTeleConsultationDetail.consultationReferenceNumber),
        "patientId": parseInt(this.consultationinfo.patientTeleConsultationDetail.patientId),
        "doctorId": parseInt(this.master.CurrentUser.model.doctorId),
      },
      "patientTeleConsultationDiagnosis": this.DiagnosisNamelst,
      "patientTeleConsultationMedicine": this.arryrxlist
    }


    this._srv.insertconsultationresponse(consulationjson).subscribe((m) => {
      if (m.success == true && m.status == 1) {
        this.connectionService.ConsultationComplete(this.master.doctorConnectionId, this.master.patientConnectionId, "Call Completed").subscribe((m) => {

        });
        this.nav.navigateByUrl('/doctor/appointments');
        this.notifyService.showSuccess("Consultation successfully done", "");

      } else {
        this.spinner.hide();

        this.notifyService.showError(m.message, "")
      }
    }, err => {
      this.spinner.hide();

      this.notifyService.showError("something went wrong", "")

    })




  }

  getimage(filepath: any) {

    //window.open(filepath, '_blank');
    this.router.navigate([]).then(result => { window.open(filepath, '_blank'); });

  }



  checkmessage() {
    if (this.Doctormessage != null || this.Doctormessage != undefined || this.Doctormessage != "") {
      this.SendMessage(this.Doctormessage);
      this.Doctormessage = "";
    }
  }


  SendMessage(data) {
    var meg = { "send": 1, "messagetext": data }

    this.chatmessagelist.push(meg);

    this.connectionService.SendMessageByDoctor(this.master.doctorConnectionId, this.master.patientConnectionId, data).subscribe((m) => {


    }, err => {

    });
  }

  MessageReceived(data) {

    var meg = { "send": 0, "messagetext": data.message }
    this.chatmessagelist.push(meg);
  }




  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    return false;
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    return false;
  }


  playAudio(audioRingEnabled) {
    this.spinner.hide();
    if (audioRingEnabled) {
      this.audioPlayerRef.nativeElement.load();
      this.audioPlayerRef.nativeElement.play();
    }
    else {
      this.audioPlayerRef.nativeElement.pause();
    }
  }




  Previewopen() {
    this.previewbtn = false;
  }


  Previewclose() {
    this.previewbtn = true;

  }



  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult =
        `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
