import { Injectable } from "@angular/core";
import { BaseService } from "./base";
import { environment } from "../../environments/environment";
import { StorageService } from "./storage.service";
import { IfStmt } from "@angular/compiler";
@Injectable()
export class MasterService {
  constructor(private st: StorageService) { }

  Id: number;

  PageSize: 20;
  CurrentUser: any;
  patientConnectionId: any;
  doctorConnectionId: any;
  teleConsultationId: any;
  TablepageSize = [10, 25, 50, 100];

}
