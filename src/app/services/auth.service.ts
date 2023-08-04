import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class AuthService {
  api = "Auth";
  constructor(private srv: BaseService) { }



  public authenticateadmin(data) {
    return this.srv.post(data, this.api + '/authenticateadmin');
  }
  public checkuser(data) {
    return this.srv.post(data, this.api + '/checkuserexists');
  }


  ////////////////////////////////////doctor auth service////////////

  public checkdoctorexists(data) {
    return this.srv.post(data, this.api + '/checkdoctorexists');
  }

  public authenticatedoctor(data) {

    return this.srv.post(data, this.api + '/authenticatedoctor');
  }

  ////////////////////////////////////////////////////////////////////


  
  ////////////////////////////////////Mr auth service////////////

  public checkmrexists(data) {
    return this.srv.post(data, this.api + '/checkmrexists');
  }

  public authenticatemr(data) {

    return this.srv.post(data, this.api + '/authenticatemr');
  }

  ////////////////////////////////////////////////////////////////////

  
  ////////////////////////////////////super admin service////////////

  public checksuperuserexists(data) {
    return this.srv.post(data, this.api + '/checksuperuserexists');
  }

  public authenticatesuperadmin(data) {

    return this.srv.post(data, this.api + '/authenticatesuperadmin');
  }

  ////////////////////////////////////////////////////////////////////


  //////////////////////////patient auth service//////////////////




  public patientlogin(data) {
    return this.srv.post(data, this.api + '/patientlogin');
  }




  public patientregistrationotp(data) {
    return this.srv.post(data, this.api + '/patientregistrationotp');
  }

  public DiscardConsultation(data) {
    return this.srv.post(data, this.api + '/discardconsultation');
  }


  public checkpatientexists(data) {
    return this.srv.post(data, this.api + '/checkpatientexists');
  }




  public newpatientrregistration(data) {
    return this.srv.post(data, this.api + '/newpatientrregistration');
  }





  public revisitpatientregistration(data) {
    return this.srv.post(data, this.api + '/revisitpatientregistration');
  }


  public GetDoctorSlots(data) {
    return this.srv.post(data, this.api + '/GetDoctorSlots');
  }



  public getactivehospitals() {
    return this.srv.get(this.api + "/getactivehospitals/");

  }


  public getactivebranchbyhospital(Id) {
    return this.srv.get(this.api + "/getactivebranchbyhospital/" + Id);

  }




  public getactivedepartmentbybranch(Id) {
    return this.srv.get(this.api + "/getactivedepartmentbybranch/" + Id);

  }





  public getactivedoctorbydepartment(Id) {
    return this.srv.get(this.api + "/getactivedoctorbydepartment/" + Id);

  }




  public checkpatientprofile(data) {
    return this.srv.post(data, this.api + '/checkpatientprofile');
  }

  public authenticatepatientprofile(data) {

    return this.srv.post(data, this.api + '/authenticatepatientprofile');
  }




  //////////////////////////////////////////////////////////////






  public getlandingcount() {
    return this.srv.get(this.api + "/getlandingcount");

  }



}