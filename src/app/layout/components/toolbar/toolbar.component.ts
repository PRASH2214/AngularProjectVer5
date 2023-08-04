import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Router } from '@angular/router'

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service'
import { AuthenticationService } from 'app/_services/authentication.service';
import { TableauService } from '../../../_services/tableau.service'
import { GlobalService } from 'app/_services/global.service';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    yearList: any;
    Country: any;

    CountryVisible: boolean;
    CurrencyVisible: boolean;
    YearVisible: boolean;

    navigation: any;
    selectedLanguage: any;
    selectedYear: any;
    selectedCurrency: any;
    selectedCountry: any;
    currentUser: any;
    currencies: any;
    fk_LDGlCode: number;
    _Date: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private _fuseNavigationService: FuseNavigationService,
        private _authenticationService: AuthenticationService,
        private _tableauService: TableauService,
        private _globalService: GlobalService,
        private router: Router
    ) {


        this._globalService.GetClientMst().then(res => {
            if (res.status[0].isValid) {
                this.CountryVisible = res.result[0].chrCountryOptionVisible === 'Y' ? true : false;
                this.CurrencyVisible = res.result[0].chrCurrencyOptionVisible === 'Y' ? true : false;
                this.YearVisible = res.result[0].chrYearOptionVisible === 'Y' ? true : false;
            }
            else {
                this.CountryVisible = false;
                this.CurrencyVisible = false;
                this.YearVisible = false;
            }
        }, (err) => {

        });

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'tr',
                title: 'Turkish',
                flag: 'tr'
            }
        ];

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {


        this.yearList = [];
        if (localStorage.getItem('currentUser')) {
            var currentUser = JSON.parse(localStorage.getItem('currentUser'));
            var serverDate = currentUser.dtTodayDate.split('-');
            if (currentUser) {
                this._Date = new Date(serverDate[0], serverDate[1], serverDate[2]);
            }
            this.yearList.push({ id: this._Date.getFullYear(), title: this._Date.getFullYear() });
            this.yearList.push({ id: this._Date.getFullYear() - 1, title: this._Date.getFullYear() - 1 });
        }
        else {
            this.yearList.push({ id: new Date().getFullYear(), title: new Date().getFullYear() });
            this.yearList.push({ id: new Date().getFullYear() - 1, title: new Date().getFullYear() - 1 });
        }


        this.currentUser = "";
        let tempCurrentUser = localStorage.getItem('currentUser');
        if (tempCurrentUser) {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }

        // this._globalService.getclientmst
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((res) => {
        //         if (res) {
        //             if (res.status[0].isValid) {
        //                 this.CountryVisible = res.result[0].chrCountryOptionVisible === 'Y' ? true : false;
        //                 this.CurrencyVisible = res.result[0].chrCurrencyOptionVisible === 'Y' ? true : false;
        //                 this.YearVisible = res.result[0].chrYearOptionVisible === 'Y' ? true : false;
        //             }
        //             else {
        //                 this.CountryVisible = false;
        //                 this.CurrencyVisible = false;
        //                 this.YearVisible = false;
        //             }
        //         }
        //     });
        this._authenticationService.onLoginChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res && res.status[0].isValid) {
                    this.Country = res.result;
                    var filterCountry = this.Country.filter(function (arrItem) {
                        return arrItem.intGlCode == arrItem.fk_CountryGlCode_Selected;
                    });
                    this.selectedCountry = filterCountry[0];
                    this._fuseNavigationService.setSelectedCountry(this.selectedCountry);
                    this.navigation = this._fuseNavigationService.getCurrentNavigation();
                    this.updateCurrencySelection();
                }
            });

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });




        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { 'id': this._translateService.currentLang });
        if (localStorage.getItem('currentUser')) {
            if (this.yearList) {
                if (this._Date.getMonth() + 1 < 4) {
                    this.selectedYear = _.find(this.yearList, { 'id': this._Date.getFullYear() - 1 });
                } else {
                    this.selectedYear = _.find(this.yearList, { 'id': this._Date.getFullYear() });
                }
                this._tableauService.setYearChanged(this.selectedYear);
            }
        }
        else {
            if (this.yearList) {
                if (new Date().getMonth() + 1 < 4) {
                    this.selectedYear = _.find(this.yearList, { 'id': new Date().getFullYear() - 1 });
                } else {
                    this.selectedYear = _.find(this.yearList, { 'id': new Date().getFullYear() });
                }
                this._tableauService.setYearChanged(this.selectedYear);
            }
        }
        //this.selectedCountry = _.find(this.Country, { 'id': 'en' });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;
        // Use the selected language for translations
        this._translateService.use(lang.id);
    }
    setCurrency(cur): void {
        // Set the selected language for the toolbar
        this._tableauService.setCurrencyChanged(cur);
        this.selectedCurrency = cur;
    }
    setYear(year): void {
        // Set the selected language for the toolbar
        this._tableauService.setYearChanged(year);
        this.selectedYear = year;

    }
    setCountry(country): void {
        // Set the selected language for the toolbar
        this.selectedCountry = country;
        this._fuseNavigationService.setSelectedCountry(this.selectedCountry);
        this.updateCurrencySelection();
        // Use the selected language for translations
        //this._translateService.use(country.id);
    }

    logOut(): void {
        this._authenticationService.logout().then((res) => {
            this.router.navigate(['/pages/auth/login']);
        });
    }
    updateCurrencySelection(): void {
        var currencies = this.Country.filter(item => item.intGlCode == this.selectedCountry.intGlCode)
        this.currencies = [];
        this.currencies.push({ varCurrencyCode: currencies[0].varCurrencyCode, varCurICONFlag: currencies[0].varCurICONFlag });
        this.currencies.push({ varCurrencyCode: currencies[0].varDefaultCurrencyCode, varCurICONFlag: currencies[0].varCurICONDefaultFlag });
        this.selectedCurrency = _.find(this.currencies, { 'varCurrencyCode': this.selectedCountry.varCurrencyCode });
        this._tableauService.setCurrencyChanged(this.selectedCurrency);
    }

}
