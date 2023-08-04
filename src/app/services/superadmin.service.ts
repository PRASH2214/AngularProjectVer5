import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class SuperAdminService {
  api = "SuperAdmin";
  constructor(private srv: BaseService) { }




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
