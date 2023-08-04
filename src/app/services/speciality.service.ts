import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class SpecialityService {
  api = "SpecialityMaster";
  constructor(private srv: BaseService) { }

  public GetAll(data) {
    return this.srv.post(data, this.api + "/GetAll");

  }
  public GetById(Id) {
    return this.srv.get(this.api + "/" + Id);

  }
  public Save(data) {
    return this.srv.post(data, this.api);
  }
  public Update(data) {
    return this.srv.put(data, this.api);
  }
  public Delete(Id) {
    return this.srv.delete(this.api + "/" + Id);
  }



}
