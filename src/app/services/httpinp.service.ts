import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Observable, throwError, of } from "rxjs";
import { Injectable } from "@angular/core";
import { MasterService } from "./master";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { StorageService } from "./../services/storage.service";
import { NotificationService } from '../services/notification.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(public master: MasterService, private router: Router, public notifyService: NotificationService
    , private storage: StorageService,) { }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow

    if (err.status === 401 || err.status === 403) {

      this.notifyService.showError("something went wrong", "")
      if (this.storage.get("Utype") == 1) {

        window.location.href = "/admin/login";


      } else if (this.storage.get("Utype") == 2) {
        window.location.href = "/doctor/login";


      } else if (this.storage.get("Utype") == 4) {
        window.location.href = "/mr/login";


      } else if (this.storage.get("Utype") == 5) {
        window.location.href = "/control/login";


      }
      else {

        window.location.href = "/patient/login";

      }
      return of(err.message); // or EMPTY may be appropriate here
    } else {



      if (this.router.url.endsWith('/login')) {

      } else {


        Swal.fire({
          title: 'Oops...',
          text: "something went wrong",
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#133656',
          cancelButtonColor: '#E5C151',
          confirmButtonText: 'Ok!',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false

        }).then((result) => {
          if (result.value) {
            if (this.storage.get("Utype") == 1) {

              window.location.href = "/admin/login";


            } else if (this.storage.get("Utype") == 2) {
              window.location.href = "/doctor/login";


            } else if (this.storage.get("Utype") == 4) {
              window.location.href = "/mr/login";


            } else if (this.storage.get("Utype") == 5) {
              window.location.href = "/control/login";


            }
            else {

              window.location.href = "/patient/login";

            }

          }
        })

      }

      return throwError(err);
    }

  }
  private dataHandler(event: HttpEvent<any>) {
    //handle your auth error or rethrow
    // this.master.Processing=false;
    if (event instanceof HttpResponse) {
      // console.log("event--->>>", event);
    }
    return event;
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log("Insepector;",this.master);



    this.master.CurrentUser = this.storage.get("listoken");

    if (this.master.CurrentUser) {

      const authReq = req.clone({
        headers: new HttpHeaders({
          "Authorization": "Bearer " + this.master.CurrentUser.model.token
        }),
      });
      //console.log("Sending");
      //this.master.Processing=true;
      // console.log("Insepector;",this.master);
      return next.handle(authReq).pipe(
        map((x) => this.dataHandler(x)),
        catchError((x) => this.handleAuthError(x))
      );
    } else {


      // this.router.navigate(['/admin/login']);
      const authReq = req.clone({});
      // console.log("Receiving");
      return next
        .handle(authReq)
        .pipe(catchError((x) => this.handleAuthError(x)));
    }

    //console.log('Intercepted HTTP call', authReq);
  }
}
