import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class BulkService {
  api = "Bulk";
  constructor(private srv: BaseService) { }

  public hospitalbulkupload(data) {
    return this.srv.post(data, this.api + '/hospitalbulkupload');
  }



  public validatehospitalbulkupload(data) {
    return this.srv.post(data, this.api + '/validatehospitalbulkupload');
  }




  public savehospitalbulkupload(data) {
    return this.srv.post(data, this.api + '/savehospitalbulkupload');
  }






  public validatebranchbulkupload(data) {
    return this.srv.post(data, this.api + '/validatebranchbulkupload');
  }




  public savebranchbulkupload(data) {
    return this.srv.post(data, this.api + '/savebranchbulkupload');
  }


  ///////////////////company




  public validatecompanybulkupload(data) {
    return this.srv.post(data, this.api + '/validatecompanybulkupload');
  }




  public savecompanybulkupload(data) {
    return this.srv.post(data, this.api + '/savecompanybulkupload');
  }




  ///////////////



  ///////////////////department




  public validatedepartmentbulkupload(data) {
    return this.srv.post(data, this.api + '/validatedepartmentbulkupload');
  }




  public savedepartmentbulkupload(data) {
    return this.srv.post(data, this.api + '/savedepartmentbulkupload');
  }




  ///////////////



  ///////////////////medicine




  public validatemedicinebulkupload(data) {
    return this.srv.post(data, this.api + '/validatemedicinebulkupload');
  }




  public savemedicinebulkupload(data) {
    return this.srv.post(data, this.api + '/savemedicinebulkupload');
  }




  ///////////////




  ///////////////////doctor




  public validatedoctorbulkupload(data) {
    return this.srv.post(data, this.api + '/validatedoctorbulkupload');
  }




  public savedoctorbulkupload(data) {
    return this.srv.post(data, this.api + '/savedoctorbulkupload');
  }




  ///////////////





  ///////////////////MR




  public validatemrbulkupload(data) {
    return this.srv.post(data, this.api + '/validatemrbulkupload');
  }




  public savemrbulkupload(data) {
    return this.srv.post(data, this.api + '/savemrbulkupload');
  }




  ///////////////



  public branchbulkupload(data) {
    return this.srv.post(data, this.api + '/branchbulkupload');
  }



  public departmentbulkupload(data) {
    return this.srv.post(data, this.api + '/departmentbulkupload');
  }




  public doctorbulkupload(data) {
    return this.srv.post(data, this.api + '/doctorbulkupload');
  }


  public companybulkupload(data) {
    return this.srv.post(data, this.api + '/companybulkupload');
  }


  public drugbulkupload(data) {
    return this.srv.post(data, this.api + '/drugbulkupload');
  }


}
