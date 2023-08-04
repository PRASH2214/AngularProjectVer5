import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalConfig } from '../fuse-config/GlobalConfig';
import { MatDialog } from '@angular/material';

import { map } from 'rxjs/operators';
import { GlobalService } from './global.service';

//import { catchError } from 'rxjs/operators';
//import { MyErrorHandler } from '../_helpers/errorHandler'
const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
    })
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    //url = GlobalConfig.apiUrlPath;
    // urlLog = GlobalConfig.apiUrlPath + "logRoutes/";
    // Countryurl = GlobalConfig.apiUrlPath + "CountryRoutes/";
    // Roleurl = GlobalConfig.apiUrlPath + "RoleRoutes/";
    // Menuurl = GlobalConfig.apiUrlPath + "MenuRoutes/";
    // Personurl = GlobalConfig.apiUrlPath + "PersonRoutes/";
    currentUser = "";
    private _onLoginChanged: BehaviorSubject<any>;


    constructor(private http: HttpClient, private dialogRef: MatDialog, private globalService: GlobalService) {
        this._onLoginChanged = new BehaviorSubject(null);

    }

    get onLoginChanged(): Observable<any> {
        return this._onLoginChanged.asObservable();
    }

    login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'loginRoutes/authenticate', { varUserName: username, varPassword: password })
                    .subscribe((res: any) => {
                        // login successful if there's a jwt token in the response
                        if (res && res.isValid == true) {
                            if (res.token) {
                                localStorage.setItem('currentUser', JSON.stringify({ varEmail: username, varUserName: res.varUserName, dtTodayDate: res.dtTodayDate, token: res.token, varUserCode_Ref1: res.varUserCode_Ref1, fk_PersonGlCode: res.fk_PersonGlCode }));

                                // store username and jwt token in local storage to keep user logged in between page refreshes
                                //localStorage.setItem('currentUser', JSON.stringify({ varEmail: username, varUserName: res.varUserName, token: res.token }));
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            },
                (error: any) => {
                    reject(error);
                });
        });
    }

    logout(): Promise<any> {
        this.dialogRef.closeAll();
        return new Promise((resolve, reject) => {
            var fk_LDGlCode = localStorage.getItem('fk_LDGlCode')
            if (fk_LDGlCode == null) {
                localStorage.clear()
                resolve();
            }
            else {
                this.globalService.GetAPIURL().then(res => {
                    this.http.post<any>(res.apiUrlPath + 'logRoutes/InsertUpdateLoginDetails', { "fk_LDGlCode": fk_LDGlCode })
                        .subscribe((response: any) => {
                            var fk_LFDGlCode = localStorage.getItem('fk_LFDGlCode')
                            if (fk_LFDGlCode != null) {
                                this.InsertUpdateLoginFormDetails(parseInt(fk_LFDGlCode), null, null, null).then(() => {
                                    localStorage.clear()
                                    resolve(response);
                                })
                            } else {
                                localStorage.clear()
                                resolve();
                            }
                        }, (error) => {
                            localStorage.clear()
                            reject(error);
                        })
                }, (error: any) => {
                    reject(error);
                });
            }
        });
    }

    LoginSuccessfullyDone(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.checkAuthentication()) {
                this.getCountry().then((res) => {
                    this._onLoginChanged.next(res);
                    resolve(res);
                }, (error: any) => {
                    reject(error);
                });
            } else {
                resolve();
            }
        });
    }


    getCountry(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'loginRoutes/GetUserCountryList', {})
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }

    GetCountryMst(intGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'CountryRoutes/GetCountryMst', { "intGlCode": intGlCode })
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }
    GetMaxCodeModuleWise(chrModule: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'CountryRoutes/GetMaxCodeModuleWise', { "chrModule": chrModule })
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }

    getRole_All(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'RoleRoutes/USP_GetRoleList', {})
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }


    InsertUpdateLoginDetails(fk_LDGlCode: number, varBrowserDetails: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.GetIPAddress().then((ipData) => {
                this.globalService.GetAPIURL().then(res => {
                    this.http.post<any>(res.apiUrlPath + 'logRoutes/InsertUpdateLoginDetails', { "fk_LDGlCode": fk_LDGlCode, "varIPAdd": ipData.ip, "varBrowserDetails": varBrowserDetails })
                        .subscribe((response: any) => {
                            if (response.status[0].isValid)
                                resolve(response.result);

                        }, (error) => {
                            reject(error);
                        })
                }, (error: any) => {
                    reject(error);
                });
            })
        });
    }
    GetIPAddress(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get('https://jsonip.com').subscribe(data => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }
    InsertUpdateLoginFormDetails(fk_LFDGlCode: number, varURL: string, varDisplayName: string, ref_MenuGlCode: number): Promise<any> {
        var fk_LDGlCode = localStorage.getItem('fk_LDGlCode');
        if (fk_LDGlCode == null) {
            fk_LDGlCode = "0";
        }
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'logRoutes/InsertUpdateLoginFormDetails', { "fk_LDGlCode": fk_LDGlCode, "fk_LFDGlCode": fk_LFDGlCode, "varURL": varURL, "varDisplayName": varDisplayName, "ref_MenuGlCode": ref_MenuGlCode })
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });
        });
    }
    refreshToken(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.get<any>(res.apiUrlPath + 'loginRoutes/refreshToken')
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });
        });
    }
    checkAuthentication(): boolean {
        if (localStorage.getItem('currentUser')) {
            return true;
        }
        return false;
    }
    GenerateResetLink(varEmail): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'loginRoutes/GenerateResetLink', { varEmail: varEmail })
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });
        });
    }
    ResetPassword(varEmail, varNewPassword, varCode): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'loginRoutes/ResetPassword', { varEmail: varEmail, varNewPassword: varNewPassword, varCode: varCode })
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });
        });
    }

    InsertUpdateCountryMst(intGlCode: number, varCountryCode: string, varCountryName: string, varCurrencyCode: string, varDefaultCurrencyCode: string, varIconPath: string, varCurICONFlag: string, varCurICONDefaultFlag: string, fk_PersonGlCode: number, chrActive: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'CountryRoutes/InsertUpdateCountryMst', { "intGlCode": intGlCode, "varCountryCode": varCountryCode, "varCountryName": varCountryName, "varCurrencyCode": varCurrencyCode, "varDefaultCurrencyCode": varDefaultCurrencyCode, "varIconPath": varIconPath, "varCurICONFlag": varCurICONFlag, "varCurICONDefaultFlag": varCurICONDefaultFlag, "fk_PersonGlCode": fk_PersonGlCode, "chrActive": chrActive })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }

    DeleteCountryMst(intGlCode: number, fk_PersonGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'CountryRoutes/DeleteCountryMst', { "intGlCode": intGlCode, "fk_PersonGlCode": fk_PersonGlCode })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }

    InsertUpdateRoleMst(intGlCode: number, varSAPCode: string, varRoleName: string, fk_CountryGlCode: number, fk_PersonGlCode: number, chrActive: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'RoleRoutes/InsertUpdateRoleMst', { "intGlCode": intGlCode, "varSAPCode": varSAPCode, "varRoleName": varRoleName, "fk_CountryGlCode": fk_CountryGlCode, "fk_PersonGlCode": fk_PersonGlCode, "chrActive": chrActive })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                // localStorage.setItem('currentUser', JSON.stringify({ varEmail: username, varUserName: res.varUserName, dtTodayDate: res.dtTodayDate, token: res.token, varUserCode_Ref1: res.varUserCode_Ref1 }));                            
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }

    GetRoleMst(intGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'RoleRoutes/GetRoleList', { "intGlCode": intGlCode })
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }

    Role_GetCountryList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'RoleRoutes/USP_Role_GetCountryList', {})
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }

    DeleteRoleMst(intGlCode: number, fk_PersonGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'RoleRoutes/DeleteRoleMst', { "intGlCode": intGlCode, "fk_PersonGlCode": fk_PersonGlCode })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }

    InsertUpdateMenuMst(intGlCode: number, varMenuCode: string, varMenuName: string, varURL: string, varIconPath: string, chrDisplayMenu: string, varTagList: string, varDisplayOrder: number, fk_PersonGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'MenuRoutes/InsertUpdateMenuMst',
                    {
                        "intGlCode": intGlCode, "varMenuCode": varMenuCode, "varMenuName": varMenuName,
                        "varURL": varURL,
                        "varIconPath": varIconPath,
                        "chrDisplayMenu": chrDisplayMenu,
                        "varTagList": varTagList,
                        "varDisplayOrder": varDisplayOrder,
                        "fk_PersonGlCode": fk_PersonGlCode
                    })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                // localStorage.setItem('currentUser', JSON.stringify({ varEmail: username, varUserName: res.varUserName, dtTodayDate: res.dtTodayDate, token: res.token, varUserCode_Ref1: res.varUserCode_Ref1 }));                            
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }

    GetMenuMst(intGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'MenuRoutes/GetMenuList', { "intGlCode": intGlCode })
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }

    Menu_GetParentMenuList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'MenuRoutes/USP_Menu_GetParentMenuList', {})
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }

    Menu_GetMenuTypeList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'MenuRoutes/USP_Menu_GetMenuTypeList', {})
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }

    DeleteMenuMst(intGlCode: number, fk_PersonGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'MenuRoutes/DeleteMenuMst', { "intGlCode": intGlCode, "fk_PersonGlCode": fk_PersonGlCode })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }

    InsertUpdatePersonMst(intGlCode: number, varUserCode: string, varUserName: string, varEmail: string,
        varMobile: string, varDesignation: string, varPassword: string,
        chrActive: string, fk_CountryGlCode: number, varUserCode_Ref1: number, Fk_Person_Countryselected: string, Fk_Person_Roleselected: string, fk_PersonCode: string): Promise<any> {
        return new Promise((resolve, reject) => {

            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'PersonRoutes/InsertUpdatePersonMst',
                    {
                        "intGlCode": intGlCode, "varUserCode": varUserCode, "varUserName": varUserName,
                        "varEmail": varEmail,
                        "varMobile": varMobile,
                        "varDesignation": varDesignation,
                        "varPassword": varPassword,
                        "chrActive": chrActive,
                        "fk_CountryGlCode": fk_CountryGlCode,
                        "varUserCode_Ref1": varUserCode_Ref1,
                        "Fk_Person_Countryselected": Fk_Person_Countryselected,
                        "Fk_Person_Roleselected": Fk_Person_Roleselected,
                        "fk_PersonCode": fk_PersonCode
                    })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                // localStorage.setItem('currentUser', JSON.stringify({ varEmail: username, varUserName: res.varUserName, dtTodayDate: res.dtTodayDate, token: res.token, varUserCode_Ref1: res.varUserCode_Ref1 }));                            
                                resolve(res);
                            }
                        } else {

                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }

    GetPersonMst(intGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'PersonRoutes/GetPersonList', { "intGlCode": intGlCode })
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }

    DeletePersonMst(intGlCode: number, fk_PersonGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'PersonRoutes/DeletePersonMst', { "intGlCode": intGlCode, "fk_PersonGlCode": fk_PersonGlCode })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }

    Person_GetRoleList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'PersonRoutes/USP_Person_GetRoleList', {})
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    });
            }, (error: any) => {
                reject(error);
            })

        });
    }

    GetRolePrivsMst(intGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'RolePrivsRoutes/GetRolePrivsList', { "intGlCode": intGlCode })
                    .subscribe((response: any) => {
                        resolve(response);
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            });

        });
    }

    DeleteRolePrivsMst(intGlCode: number, fk_PersonGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'RolePrivsRoutes/DeleteRolePrivsMst', { "intGlCode": intGlCode, "fk_PersonGlCode": fk_PersonGlCode })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }
                //this.fk_RolePrivsGlCode, this.f.fk_RoleGlCode.value, this.Selected_Add_FkMenuID.toString(), 1
    InsertUpdateRolePrivsMst(varMenuList: string, fk_RoleGlCode: number, fk_PersonGlCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(res => {
                this.http.post<any>(res.apiUrlPath + 'RolePrivsRoutes/InsertUpdateRolePrivsMst',
                    {
                        "varMenuList": varMenuList, "fk_RoleGlCode": fk_RoleGlCode,"fk_PersonGlCode": fk_PersonGlCode
                    })
                    .subscribe((res: any) => {
                        if (res && res.isValid == true) {
                            if (res.token) {
                                // localStorage.setItem('currentUser', JSON.stringify({ varEmail: username, varUserName: res.varUserName, dtTodayDate: res.dtTodayDate, token: res.token, varUserCode_Ref1: res.varUserCode_Ref1 }));                            
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    }, (error: any) => {
                        reject(error);
                    })
            }, (error: any) => {
                reject(error);
            })
        });
    }
}