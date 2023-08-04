import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConfig } from '../fuse-config/GlobalConfig'
import { GlobalService } from './global.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    //url = GlobalConfig.apiUrlPath + "loginRoutes/";
    constructor(private http: HttpClient) { }

    getAll(apiUrlPath) {
        return this.http.get<any>(apiUrlPath + 'testAuth');

    }
}