import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class PatientConsultationService {
  api = "PatientConsultations";

  constructor(private srv: BaseService) { }

  public GetAll(data) {
    return this.srv.post(data, this.api + "/getall");
  }
  public gettodayappointments(data) {
    return this.srv.post(data, this.api + "/gettodayappointments");
  }
  public getpastconsultations(data) {
    return this.srv.post(data, this.api + "/getpastconsultations");
  }

  public GetPatientProfile(id) {
    return this.srv.get(this.api + "/getpatientprofile/" + id);
  }

  public waitingroom(data) {
    return this.srv.post(data, this.api + "/waitingroom");
  }

  public refundrequest(data) {
    return this.srv.post(data, this.api + "/refundrequest");
  }
  public GetConsultationPatientDetail(id) {
    return this.srv.get(this.api + "/getconsultationpatientdetail/" + id);
  }



  public getcompleteconsultation(id){
    return this.srv.get(this.api + "/getcompleteconsultation/" + id);
  }
  

}
