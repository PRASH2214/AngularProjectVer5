import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class DoctorProfileService {
  api = "DoctorProfile";
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
  public GetSlots(data) {
    return this.srv.post(data, this.api + "/GetSlots");
  }
  public InsertSlots(data) {
    return this.srv.post(data, this.api + "/InsertSlots");
  }


  public logout() {
    return this.srv.get(this.api + "/logout");
  }


  public getdashboardcounters() {
    return this.srv.get(this.api + "/getdashboardcounters");
  }


}
