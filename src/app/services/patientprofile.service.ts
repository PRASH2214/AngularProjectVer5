import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class PatientProfileService {
  api = "PatientProfile";
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


  public getdashboardcounters() {
    return this.srv.get(this.api + "/getdashboardcounters");
  }

}
