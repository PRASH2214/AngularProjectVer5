import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class CommonService {
  api = "Common";
  constructor(private srv: BaseService) { }



  public getstates() {
    return this.srv.get(this.api + "/getstates");

  }


  public getmaritalstatus() {
    return this.srv.get(this.api + "/getmaritalstatus");

  }


  public getdistricts(Id) {
    return this.srv.get(this.api + "/getdistricts/" + Id);

  }

  public getcity(Id) {
    return this.srv.get(this.api + "/getcity/" + Id);

  }


  public getactivehospitals(){

    return this.srv.get(this.api + "/getactivehospitals");
  }



  public getmasterdays(){

    return this.srv.get(this.api + "/getmasterdays");
  }

  
  public getactivecompany(){

    return this.srv.get(this.api + "/getactivecompany");
  }


  
  public getmasterdrug(){

    return this.srv.get(this.api + "/getmasterdrug");
  }

  
  public getactivedrugtype(){

    return this.srv.get(this.api + "/getactivedrugtype");
  }

  public getactivespeciality(){

    return this.srv.get(this.api + "/getactivespeciality");
  }

  public getactivespecialitybydoctor(){

    return this.srv.get(this.api + "/getactivespecialitybydoctor");
  }
  

  public getbranchbyhospital(Id) {
    return this.srv.get(this.api + "/getactivebranchbyhospital/" + Id);

  }


  public getactivedepartmentbybranch(Id) {
    return this.srv.get(this.api + "/getactivedepartmentbybranch/" + Id);

  }


}
