import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { GlobalConfig } from 'app/fuse-config/GlobalConfig';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (request.url != 'assets/config.json' && request.url != 'https://jsonip.com' && request.url.indexOf('refreshToken') <= 0 && request.url.indexOf('config.json') <= 0) {
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
                this.authenticationService.refreshToken().then((res) => {
                    currentUser.token = res.refreshedToken;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                });

            }
        }
        else if (request.url.indexOf('refreshToken') > 0) {
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        }
        // this.getJSON().subscribe(data => {
        //     GlobalConfig.apiUrlPath = data.apiUrlPath;
        //     GlobalConfig.serverIP = data.serverIP
        //     alert(1);
        // });
        return next.handle(request);
    }
    // public getJSON(): Observable<any> {
    //     return this.http.get("./assets/config.json");
    // }
}