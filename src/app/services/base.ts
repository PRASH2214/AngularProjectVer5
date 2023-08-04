import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MasterService } from './master';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { StorageService } from "./../services/storage.service";
@Injectable()
export class BaseService {
  public BaseURL: string;
  Token: string = '';
  constructor(private http: HttpClient, public master: MasterService, private storage: StorageService,) {
    this.BaseURL = environment.apiUrl;
    // if (!window.origin.startsWith("http://localhost"))
    //   this.BaseURL = window.origin.replace("www", "api") .replace("prod","api-prod")+ "/";
  }

  open(url = '') {
    return this.http.get<any>(url).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  get(url = '') {
    return this.http.get<any>(this.BaseURL + url).pipe(
      map((data: any) => {
        if (data.success == false) {

          Swal.fire({
            title: 'Oops...',
            text: 'Token Expired!',
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


              } else {

                window.location.href = "/patient/login";

              }




            }
          })


        }
        return data;
      })
    );
  }
  delete(url = '') {
    return this.http.delete(this.BaseURL + url).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  post(data, url = '') {
    return this.http.post<any>(this.BaseURL + url, data).pipe(
      map((data: any) => {


        if (data.success == false) {

          Swal.fire({
            title: 'Oops...',
            text: 'Token Expired!',
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


              } else {

                window.location.href = "/patient/login";

              }
            }
          })


        }
        return data;
      })
    );
  }
  put(data, url = '') {
    return this.http.put(this.BaseURL + url, data).pipe(
      map((data: any) => {


        if (data.success == false) {

          Swal.fire({
            title: 'Oops...',
            text: 'Token Expired!',
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


              } else {

                window.location.href = "/patient/login";

              }

            }
          })


        }
        return data;
      })
    );
  }


}
