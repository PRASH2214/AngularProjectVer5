import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalConfig } from '../../../fuse-config/GlobalConfig'
import { GlobalService } from 'app/_services/global.service';

@Injectable()
export class ProductsService implements Resolve<any>
{
    products: any[];
    onProductsChanged: BehaviorSubject<any>;
    //serviceURL =  GlobalConfig.apiUrlPath + "marsterRoutes/";
    constructor(private _httpClient: HttpClient, private globalService: GlobalService) {
        // Set the defaults
        this.onProductsChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProducts()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getProducts(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(resapi => {
                this._httpClient.get(resapi.apiUrlPath + 'marsterRoutes/GetProduct')
                    .subscribe((response: any) => {
                        this.products = response;
                        this.onProductsChanged.next(this.products);
                        resolve(response);
                    }, reject);
            },
                (error: any) => {

                })
        });
    }
}

