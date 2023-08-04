import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class ReportService {
  api = "Reports";
  constructor(private srv: BaseService) { }


  public getmrappointmentsummary(data) {
    return this.srv.post(data, this.api + "/getmrappointmentsummary");
  }

  public getpatientappointmentsummary(data) {
    return this.srv.post(data, this.api + "/getpatientappointmentsummary");
  }



  public getmrappointmentdetailbyadmin(data) {
    return this.srv.post(data, this.api + "/getmrappointmentdetailbyadmin");
  }

  public getpatientappointmentdetailbyadmin(data) {
    return this.srv.post(data, this.api + "/getpatientappointmentdetailbyadmin");
  }





  public getmrappointmentdetailbydoctor(data) {
    return this.srv.post(data, this.api + "/getmrappointmentdetailbydoctor");
  }

  public getpatientappointmentdetailbydoctor(data) {
    return this.srv.post(data, this.api + "/getpatientappointmentdetailbydoctor");
  }


}
