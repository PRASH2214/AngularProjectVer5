import { Injectable } from '@angular/core';

@Injectable()
export class globalx {
  constructor() {


  }

  public callrequest: (data:any) => void;
  CallRequest(fn: (data) => void) {
    this.callrequest = fn;
    // from now on, call myFunc wherever you want inside this service
  }

  
  public MRcallrequest: (data:any) => void;
  MRCallRequest(fn: (data) => void) {
    this.MRcallrequest = fn;
    // from now on, call myFunc wherever you want inside this service
  }

  public callredirect: () => void;
  CallRedirect(fn: () => void) {
 
    this.callredirect = fn;
    // from now on, call myFunc wherever you want inside this service
  }


  public calldenied: (data:any) => void;
  CallDenied(fn: (data) => void) {
    this.calldenied = fn;
    // from now on, call myFunc wherever you want inside this service
  }


  public messagerecievedbydoctor: (data:any) => void;
  MessageRecievedByDoctor(fn: (data) => void) {
    this.messagerecievedbydoctor = fn;
    // from now on, call myFunc wherever you want inside this service
  }

  
  public messagerecievedbypatient: (data:any) => void;
  MessageRecievedByPatient(fn: (data) => void) {
    this.messagerecievedbypatient = fn;
    // from now on, call myFunc wherever you want inside this service
  }

}
