import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpEventType, HttpRequest, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { GlobalConfig } from '../fuse-config/GlobalConfig'
import { GlobalService } from './global.service';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded"
  })
};
@Injectable({
  providedIn: 'root'
})
export class TableauService {
  //urlService = GlobalConfig.apiUrlPath + "loginRoutes/";
  //urlServiceReport = GlobalConfig.apiUrlPath;// + "rptRoutes/";
  //urlServer = GlobalConfig.serverIP + "/trusted";
  //urlServer1 = GlobalConfig.serverIP;
  uniqueTicket = "";
  urlReport = "";
  varEmail = "";
  varUserCode_Ref1 = "";
  _selectedYear: any;
  _selectedCurrency: any;

  private _onCurrencyChanged: BehaviorSubject<any>;
  private _onYearChanged: BehaviorSubject<any>;

  constructor(private http: HttpClient, private globalService: GlobalService) {
    this._onCurrencyChanged = new BehaviorSubject(null);
    this._onYearChanged = new BehaviorSubject(null);
  }

  setCurrencyChanged(currency: any): void {
    this._onCurrencyChanged.next(currency);
    this._selectedCurrency = currency;
  }
  setYearChanged(year: any): void {
    this._onYearChanged.next(year);
    this._selectedYear = year;
  }
  get onCurrencyChanged(): Observable<any> {
    return this._onCurrencyChanged.asObservable();
  }
  get onYearChanged(): Observable<any> {
    return this._onYearChanged.asObservable();
  }


  // get getSelectedYear(): any {
  //   return this._selectedYear;
  // }
  // get getSelectedCurrency(): any {
  //   return this._selectedCurrency;
  // }
  CheckJobStatus(site_id: string, token_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(res => {
        this.http.post<any>(res.apiUrlPath + "loginRoutes/CheckJobStatus", { "site_id": site_id, "token_id": token_id })
          .subscribe((response: any) => {
            resolve(response);
          }, (error) => {
            reject(error);
          })
      },
        (error: any) => {
          reject(error);
        });
    });
  }
  validateRefreshJobID(site_id: string, job_id: string, token_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(res => {
        this.http.post<any>(res.apiUrlPath + "loginRoutes/validateRefreshJobID", { "site_id": site_id, "job_id": job_id, "token_id": token_id })
          .subscribe((response: any) => {
            resolve(response);
          }, (error) => {
            reject(error);
          })
      },
        (error: any) => {
          reject(error);
        });
    });
  }
  signin(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(res => {
        this.http.post<any>(res.apiUrlPath + "loginRoutes/signin", {})
          .subscribe((response: any) => {
            resolve(response);
          }, (error) => {
            reject(error);
          })
      },
        (error: any) => {
          reject(error);
        });
    });
  }
  refreshDashboard(site_id: string, token_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(res => {
        this.http.post<any>(res.apiUrlPath + "loginRoutes/refreshdashboard", { "site_id": site_id, "dashboard_id": res.asset_dashboard_id, "token_id": token_id })
          .subscribe((response: any) => {
            resolve(response);
          }, (error) => {
            reject(error);
          })
      },
        (error: any) => {
          reject(error);
        });
    });
  }
  getTableauReportAuthKey(resurl): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(resurl.apiUrlPath + "loginRoutes/getTableauReportAuthKey", { "username": this.varEmail, "target_site": "", "client_ip": "" })
        .subscribe((response: any) => {
          resolve(response);
        }, (error) => {
          reject(error);
        })
        ;
    });
  }
  getTableauReport(workSheetName: string, viewName: string, currency: string, year: string): Promise<any> {
    // alert(year);
    if (currency == "EUR") {
      currency = "Euro";
    }
    else {
      currency = "Local";
    }
    let tempCurrentUser = localStorage.getItem('currentUser');

    if (tempCurrentUser) {
      this.varEmail = JSON.parse(localStorage.getItem('currentUser')).varEmail;
      this.varUserCode_Ref1 = JSON.parse(localStorage.getItem('currentUser')).varUserCode_Ref1;
    }
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(resurl => {
        if (!localStorage.getItem("rptToken")) {
          this.getTableauReportAuthKey(resurl).then((res) => {
            this.uniqueTicket = res.data;
            if (this.uniqueTicket == "-1") {
              resolve("");
            } else {
              this.urlReport = resurl.serverIP + "/trusted/" + this.uniqueTicket + "/views/" + workSheetName + "/" + viewName + "?iframeSizedToWindow=true&:embed=y&CurrencySelection=" + currency + "&YearSelection=" + year + "&UserCode=" + this.varUserCode_Ref1;
              resolve(this.urlReport);
              localStorage.setItem("rptToken", this.uniqueTicket);
            }
          }, (error) => {
            reject(error);
          });
        } else {
          this.uniqueTicket = localStorage.getItem("rptToken")
          //this.urlReport = this.urlServer + "/" + this.uniqueTicket + "/views/AgeingReports/" + reportName + "?iframeSizedToWindow=true&:embed=y&CurrencySelection=INR";
          this.urlReport = resurl.serverIP + "/views/" + workSheetName + "/" + viewName + "?iframeSizedToWindow=true&:embed=y&CurrencySelection=" + currency + "&YearSelection=" + year + "&UserCode=" + this.varUserCode_Ref1;
          resolve(this.urlReport);
        }
      },
        (error: any) => {
          reject(error);
        })
    });
  }

  getTableauReportOld(reportName: string, currency: string): Promise<any> {
    let tempCurrentUser = localStorage.getItem('currentUser');
    if (tempCurrentUser) {
      this.varEmail = JSON.parse(localStorage.getItem('currentUser')).varEmail;
    }
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(resurl => {
        if (!localStorage.getItem("rptToken")) {
          this.getTableauReportAuthKey(resurl).then((res) => {
            this.uniqueTicket = res.data;
            this.urlReport = resurl.serverIP + "/trusted/" + this.uniqueTicket + "/views/BASFINDIADashboards/" + reportName + "?iframeSizedToWindow=true&:embed=y&CurrencySelection=" + currency;

            resolve(this.urlReport);
            localStorage.setItem("rptToken", this.uniqueTicket);
          }, (error) => {
            reject(error);
          });
        } else {
          this.uniqueTicket = localStorage.getItem("rptToken")
          //this.urlReport = this.urlServer + "/" + this.uniqueTicket + "/views/AgeingReports/" + reportName + "?iframeSizedToWindow=true&:embed=y&CurrencySelection=INR";
          this.urlReport = resurl.serverIP + "/views/BASFINDIADashboards/" + reportName + "?iframeSizedToWindow=true&:embed=y&CurrencySelection=" + currency;
          resolve(this.urlReport);
        }
      },
        (error: any) => {
          reject(error);
        })
    });
  }
  getCommentMst(fk_MenuGlCode: number, fk_CountryGlCode: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(res => {
        this.http.post<any>(res.apiUrlPath + "rptRoutes/GetCommentMst", { "fk_MenuGlCode": fk_MenuGlCode, "fk_CountryGlCode": fk_CountryGlCode })
          .subscribe((response: any) => {
            resolve(response);
          }, (error) => {
            reject(error);
          })
      },
        (error: any) => {
          reject(error);
        });
    });
  }
  insertCommentMst(fk_MenuGlCode: number, varComment: string, fk_CountryGlCode: number, varCurrencyCode: string, dtAlertOn: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(res => {
        this.http.post<any>(res.apiUrlPath + "rptRoutes/InsertCommentMst", { "fk_MenuGlCode": fk_MenuGlCode, "varComment": varComment, "fk_CountryGlCode": fk_CountryGlCode, "varCurrencyCode": varCurrencyCode, 'dtAlertOn': dtAlertOn })
          .subscribe((response: any) => {
            resolve(response);
          }, (error) => {
            reject(error);
          })
      },
        (error: any) => {
          reject(error);
        });
    });
  }
  deleteCommentMst(intCommentGlCode: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(res => {
        this.http.post<any>(res.apiUrlPath + "rptRoutes/DeleteCommentMst", { "intCommentGlCode": intCommentGlCode })
          .subscribe((response: any) => {
            resolve(response);
          }, (error) => {
            reject(error);
          })
      },
        (error: any) => {
          reject(error);
        });
    });
  }
  getAllCommentMstData(apiUrlPath): Observable<any> {
    return this.http.post<any>(apiUrlPath + "rptRoutes/GetAllCommentMstData", {})
  }
  sendMail(files: any, msgTo: string, msgCC: string, msgBCC: string, msgSubject: string, msgBody: string, messageTextBullet: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.globalService.GetAPIURL().then(res => {
        this.http.post<any>(res.apiUrlPath + "rptRoutes/SendMail", { "files": files, "msgTo": msgTo, "msgCC": msgCC, "msgBCC": msgBCC, "msgSubject": msgSubject, "msgBody": msgBody, "messageTextBullet": messageTextBullet })
          .subscribe((response: any) => {
            resolve(response);
          }, reject => {
            var err = reject;
          })
      },
        (error: any) => {
          reject(error);
        });
    });
  }
  uploadFile(files: Set<File>, apiUrlPath): { [key: string]: Observable<number> } {
    // this will be the our resulting map
    const status = {};
    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('newFileName', file['newFileName']);

      // create a http-post request and pass the form
      // tell it to report the upload progress

      const req = new HttpRequest('POST', apiUrlPath + "rptRoutes/UploadFile", formData, {
        reportProgress: true
      });


      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
  getReceipientEmailAdd(fk_CountryGlCode, apiUrlPath): Observable<any> {

    return this.http.post<any>(apiUrlPath + "rptRoutes/GetEmailAddress", { 'fk_CountryGlCode': fk_CountryGlCode })
  }

}
