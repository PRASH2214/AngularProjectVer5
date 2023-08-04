import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalConfig } from '../../../fuse-config/GlobalConfig'
import { GlobalService } from 'app/_services/global.service';

@Injectable()
export class ProductService implements Resolve<any>
{
    routeParams: any;
    product: any;
    onProductChanged: BehaviorSubject<any>;
    //serviceURL = GlobalConfig.apiUrlPath + "marsterRoutes/";

    constructor(private _httpClient: HttpClient, private globalService: GlobalService) {
        this.onProductChanged = new BehaviorSubject({});
    }

    /**
       * Resolver
       *
       * @param {ActivatedRouteSnapshot} route
       * @param {RouterStateSnapshot} state
       * @returns {Observable<any> | Promise<any> | any}
       */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProduct()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getProduct(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.globalService.GetAPIURL().then(resapi => {
                if (this.routeParams.id === 'new') {
                    this._httpClient.get(resapi.apiUrlPath + 'marsterRoutes/GetProductCode')
                        .subscribe((response: any) => {
                            this.onProductChanged.next(response[0].varProductCode);
                            resolve(response);
                        }, reject);

                    resolve(false);
                }
                else {
                    this._httpClient.get(resapi.apiUrlPath + 'marsterRoutes/GetProduct/' + this.routeParams.id)
                        .subscribe((response: any) => {
                            this.product = response[0];
                            this.onProductChanged.next(this.product);
                            resolve(response);
                        }, reject);
                }
            },
                (error: any) => {

                })
        });

    }
}
