import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class MRProfileService {
  api = "MRProfile";
  constructor(private srv: BaseService) { }


  public getprofile() {
    return this.srv.get(this.api + "/getprofile");
  }

  public updateprofile(data) {
    return this.srv.post(data, this.api + "/updateprofile");
  }
  public updateprofileimage(data) {

    return this.srv.post(data, this.api + "/updateprofileimage");
  }


  public logout() {
    return this.srv.get(this.api + "/logout");
  }

  public GetMRSlots(data) {
    return this.srv.post(data, this.api + "/GetMRSlots");
  }


  public InsertMRTeleConsultationReg(data) {
    return this.srv.post(data, this.api + "/InsertMRTeleConsultationReg");
  }



  public gettodayappointments(data) {
    return this.srv.post(data, this.api + "/gettodayappointments");
  }


  
  public getpastconsultations(data) {
    return this.srv.post(data, this.api + "/getpastconsultations");
  }


}
