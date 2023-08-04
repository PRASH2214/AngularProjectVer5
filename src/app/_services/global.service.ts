import { Injectable, Directive } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConfig } from "app/fuse-config/GlobalConfig";
import { BehaviorSubject, Observable } from "rxjs";
const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
    })
};

@Injectable({
    providedIn: "root"
})
export class GlobalService {
    //APIURL = GlobalConfig.apiUrlPath + "rptRoutes/";

    //APIURL = this._appGlobals.apiUrlPath + "rptRoutes/";

    // private _getclientmst: BehaviorSubject<any>;

    constructor(private http: HttpClient) {
        //     this._getclientmst = new BehaviorSubject(null);
    }
    // get getclientmst(): Observable<any> {
    //     return this._getclientmst.asObservable();
    // }
    // ClientMst(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         if (this.checkAuthentication()) {
    //             this.GetClientMst().then((res) => {
    //                 this._getclientmst.next(res);
    //                 resolve(res);
    //             }, (error: any) => {
    //                 reject(error);
    //             });
    //         } else {
    //             resolve();
    //         }
    //     });
    // }
    // checkAuthentication(): boolean {
    //     if (localStorage.getItem('currentUser')) {
    //         return true;
    //     }
    //     return false;
    // }

    GetAPIURL(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get("assets/config.json?id=1", httpOptions).subscribe(
                (response: any) => {
                    resolve(response);
                },
                (error: any) => {
                    reject(error);
                }
            );
        });
    }

    // GetClientMst(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.http.get(this.APIURL + 'GetClientMst', httpOptions)
    //             .subscribe((response: any) => {
    //                 resolve(response);
    //             }, (error: any) => {
    //                 reject(error);
    //             });
    //     });
    GetClientMst(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.GetAPIURL().then(
                res => {
                    this.http
                        .get(
                            res.apiUrlPath + "rptRoutes/GetClientMst",
                            httpOptions
                        )
                        .subscribe(
                            (response: any) => {
                                resolve(response);
                            },
                            (error: any) => {
                                reject(error);
                            }
                        );
                },
                (error: any) => {
                    reject(error);
                }
            );
        });
    }
}
