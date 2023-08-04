import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable()
export class ConnectionService {
    api = "Connection";
    constructor(private srv: BaseService) { }


    public TestConnection(fromid) {
        return this.srv.get(this.api + "/TestConnection/" + fromid);

    }

    public callinitiated(fromid, toid, message,name) {
        return this.srv.get(this.api + "/CallInitiated?FromId=" + fromid + "&ToId=" + toid + "&Message=" + message+ "&Name=" + name);

    }

    
    public calldenied(fromid, toid, message) {
        return this.srv.get(this.api + "/CallDenied?FromId=" + fromid + "&ToId=" + toid + "&Message=" + message);

    }
    public callaccepted(fromid, toid, message) {
        return this.srv.get(this.api + "/CallAccepted?FromId=" + fromid + "&ToId=" + toid + "&Message=" + message);

    }
    public mrcallaccepted(fromid, toid, message) {
        return this.srv.get(this.api + "/MRCallAccepted?FromId=" + fromid + "&ToId=" + toid + "&Message=" + message);

    }
    

    public GetVCToken(Id) {//pass doctor connection Id
       
        return this.srv.get(this.api + "/GetVCToken/" + Id);
    }

    public ConsultationComplete(fromid, toid, message) {
       
        return this.srv.get(this.api + "/ConsultationComplete?FromId=" + fromid + "&ToId=" + toid + "&Message=" + message);
    }

    public MRConsultationComplete(fromid, toid, message) {
       
        return this.srv.get(this.api + "/MRConsultationComplete?FromId=" + fromid + "&ToId=" + toid + "&Message=" + message);
    }


    public SendMessageByDoctor(fromid, toid, message) {
       
        return this.srv.get(this.api + "/SendMessageByDoctor?FromId=" + fromid + "&ToId=" + toid + "&Message=" + message);
    }

    public SendMessageByPatient(fromid, toid, message) {
       
        return this.srv.get(this.api + "/SendMessageByPatient?FromId=" + fromid + "&ToId=" + toid + "&Message=" + message);     
    }


    public callMRinitiated(fromid, toid, message,name) {
        return this.srv.get(this.api + "/MRCallInitiated?FromId=" + fromid + "&ToId=" + toid + "&Message=" + message+ "&Name=" + name);

    }


}
