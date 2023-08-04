import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService, private router: Router) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                localStorage.clear();
                // auto logout if 401 response returned from api
                this.authenticationService.logout().then(() => {
                    this.router.navigate(['/pages/auth/login']);
                    return of(err.message);
                    //location.reload(true);
                });
            }
            else if (err.status === 500) {
                return throwError(err);
            }
            else if (err.status === 0) {
                return throwError(err);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}