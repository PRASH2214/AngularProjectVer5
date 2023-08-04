import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class DoctorConsultationService {
  api = "DoctorConsultations";
  constructor(private srv: BaseService) { }

  public GetAppointments(data) {
    return this.srv.post(data, this.api + "/gettodayappointments");
  }
  public GetPastConsultations(data) {
    return this.srv.post(data, this.api + "/getpastconsultations");
  }

  public GetPatientProfile(id) {
    return this.srv.get(this.api + "/getpatientprofile/" + id);
  }


  public refundresponse(data) {
    return this.srv.post(data, this.api + "/refundresponse");
  }


  public RefundApprovedStatus(data) {
    return this.srv.post(data, this.api + "/refundapprovedstatus");
  }

  public GetConsultationPatientDetail(id) {
    return this.srv.get(this.api + "/getconsultationpatientdetail/" + id);
  }


public getcompleteconsultation(id){
  return this.srv.get(this.api + "/getcompleteconsultation/" + id);
}




public getdrugtype() {
    return this.srv.get(this.api + "/getdrugtype/");
  }


  public getmedicinemaster() {
    return this.srv.get(this.api + "/getmedicinemaster/");
  }


  public getmasterdosevalue() {
    return this.srv.get(this.api + "/getmasterdosevalue/");
  }

  public insertconsultationresponse(data) {
    return this.srv.post(data, this.api + "/insertconsultationresponse");
  }



  
  public getmrtodayappointments(data) {
    return this.srv.post(data, this.api + "/getmrtodayappointments");
  }


  
  public getmrpastconsultations(data) {
    return this.srv.post(data, this.api + "/getmrpastconsultations");
  }



  public insertmrconsultationresponse(data) {
    return this.srv.post(data, this.api + "/insertmrconsultationresponse");
  }



}
