import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { WINDOW } from 'app/_helpers/window.provider';
import { Overlay } from '@angular/cdk/overlay';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../country-mst/Country.model';
import { getMaxListeners } from 'cluster';
import { GlobalService } from 'app/_services/global.service';


@Component({
    selector: 'app-country-mst',
    templateUrl: './country-mst.component.html',
    styleUrls: ['./country-mst.component.scss']
})

export class CountryMstComponent implements OnInit {
    message: any;
    selectedYear: any;
    selectedCurrency: any;
    tableauViz: any;
    url = '';
    urlRoute = '';
    viewName: string;
    workSheetName: string;
    currencyTemp: any;
    yearTemp: any;
    currentNavigation: any;
    navigation: any;
    rptName: string;
    menuID: number;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;
    countryID: number;
    private _unsubscribeAll: Subject<any>;

    country: Country[];
    chrModule: string;
    selectedIds = new Array();
    CountryForm: FormGroup;
    fk_CountryGlCode = 0;
    massage = null;
    selectedAll: any;
    config: any;
    toggle = false;
    chrActive: any;
    submitted = false;
    fk_PersonGlCode: any;
    vartheme: string;
    classname: string;
    constructor(
        private fuseNavigationService: FuseNavigationService,
        private route: ActivatedRoute,
        private router: Router,
        private _matDialog: MatDialog,
        private _platform: Platform,
        private globalService: GlobalService,
        @Inject(WINDOW) private window: Window,
        private _fuseProgressBarService: FuseProgressBarService,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private overlay: Overlay
    ) {
        this._unsubscribeAll = new Subject();
        this.route.params
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(params => {
                if (this.currencyTemp) {
                    this.urlRoute = this.router.url;
                    this.currentNavigation = this.fuseNavigationService.getCurrentActiveNavigation(
                        this.navigation,
                        this.urlRoute
                    );
                    if (this.currentNavigation) {
                        this.rptName = this.currentNavigation.varMenuName;
                        this.menuID = this.currentNavigation.intGlCode;
                    }
                }
            });
        //this.rowCellHandler = this.rowCellHandler.bind(this);
        this.allowDeleting = this.allowDeleting.bind(this);

    }

    // selectionChangedHandler(e) {
    //     if (e.selectedRowKeys.length !== null) {
    //         this.selectedIds.push(e.selectedRowKeys);
    //     }
    // }
    ngOnInit() {
        this.globalService.GetAPIURL().then(resapi => {
            this.vartheme = resapi.theme;
            if (this.vartheme === 'blue') {
                this.classname = 'header mat-accent-bg-blue p-24';
            } else if (this.vartheme === 'green') {
                this.classname = 'header mat-accent-bg-green p-24';
            }
        },
            (error: any) => {

            })
        // Configure the layout
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.fk_PersonGlCode = currentUser.fk_PersonGlCode;

        this.CountryForm = this._formBuilder.group({
            varCountryCode: ['', Validators.required],
            varCountryName: ['', Validators.required],
            varCurrencyCode: ['', Validators.required],
            varDefaultCurrencyCode: ['', Validators.required],
            varIconPath: ['', Validators.required],
            varCurICONFlag: ['', Validators.required],
            varCurICONDefaultFlag: ['', Validators.required],
            chrActive: ['', Validators.required]
        });

        this.GetMaxCodeModuleWise();
        this.GetList();

        this.fuseNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.urlRoute = this.router.url;
                this.navigation = this.fuseNavigationService.getCurrentNavigation();
                this.currentNavigation = this.fuseNavigationService.getCurrentActiveNavigation(
                    this.navigation,
                    this.urlRoute
                );
                if (this.currentNavigation) {
                    this.rptName = this.currentNavigation.varMenuName;
                    this.menuID = this.currentNavigation.intGlCode;
                }
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

    }

    // rowCellHandler(e) {
    //     if (e.row.data.intGlCode != null && e.row.data.intGlCode != 0) {
    //         this.loadCountryToEdit(e.row.data.intGlCode);
    //         e.event.preventDefault();
    //     }
    // }
    LB_Click(e) {
        this.loadCountryToEdit(e);
    }

    allowDeleting(e) {
        if (e.row.data.intGlCode != null && e.row.data.intGlCode != 0) {
            if (confirm("Are you sure want to delete this record?")) {
                this.btnDelete_Click(e.row.data.intGlCode);
            }
            e.event.preventDefault();
        }
    }

    get f() {
        return this.CountryForm.controls;
    }


    // allowDeleting(e) {
    //     //return !CountryMstComponent.isChief(e.row.data.Position);
    // }

    SetNewScreen() {
        this.submitted = false;
        this.CountryForm.reset();
        this.GetMaxCodeModuleWise();
        this.GetList();
    }

    btnClear_Click(): void {
        this.submitted = false;
        this.SetNewScreen();
    }
    GetMaxCodeModuleWise(): void {
        this.authenticationService.GetMaxCodeModuleWise('A').then(
            data => {
                if (data.status[0].isValid) {
                    //this.chrModule = data.result;
                    this.CountryForm.controls['varCountryCode'].setValue(data.result[0].MaxGlCode);

                } else {
                    alert(data.varMessage);
                    this._fuseProgressBarService.hideSpinner();
                }
            },
            err => {
                if (err.status === 0) {
                    alert('Please check your internet connection.');
                } else if (err.status === 500) {
                    alert(err.statusText);
                } else {
                    alert(err.message);
                }
                this._fuseProgressBarService.hideSpinner();
            }
        );
    }
    GetList(): void {
        this.authenticationService.GetCountryMst(0).then(
            data => {
                if (data.status[0].isValid) {
                    this.country = data.result;

                } else {
                    alert(data.varMessage);
                    this._fuseProgressBarService.hideSpinner();
                }
            },
            err => {
                if (err.status === 0) {
                    alert('Please check your internet connection.');
                } else if (err.status === 500) {
                    alert(err.statusText);
                } else {
                    alert(err.message);
                }
                this._fuseProgressBarService.hideSpinner();
            }
        );
    }

    btnSave_Click(): void {
        this.submitted = true;
        if (this.CountryForm.invalid) {
            return;
        }

        this._fuseProgressBarService.setMode('indeterminate');
        this._fuseProgressBarService.showSpinner();
        if (this.f.chrActive.value === true || this.f.chrActive.value === "Y") {
            this.chrActive = "Y";
        }
        else {
            this.chrActive = "N";
        }

        this.authenticationService
            .InsertUpdateCountryMst(
                this.fk_CountryGlCode,
                this.f.varCountryCode.value,
                this.f.varCountryName.value,
                this.f.varCurrencyCode.value,
                this.f.varDefaultCurrencyCode.value,
                this.f.varIconPath.value,
                this.f.varCurICONFlag.value,
                this.f.varCurICONDefaultFlag.value, this.fk_PersonGlCode, this.chrActive
            )
            .then(
                res => {
                    if (res && res.status[0].isValid) {
                        alert('Data Save Successfuly');

                        this._fuseProgressBarService.hideSpinner();
                        this.GetList();
                        this.SetNewScreen();
                    } else {
                        alert(res.varMessage);
                        this._fuseProgressBarService.hideSpinner();
                    }
                },
                err => {
                    if (err.status == 0) {
                        alert('Please check your internet connection.');
                    } else if (err.status == 500) {
                        alert(err.statusText);
                    } else {
                        alert(err.message);
                    }
                    this._fuseProgressBarService.hideSpinner();
                }
            );
    }

    loadCountryToEdit(intGlCode: number) {
        this._fuseProgressBarService.setMode('indeterminate');
        this._fuseProgressBarService.showSpinner();
        this.authenticationService.GetCountryMst(intGlCode).then(
            data => {
                console.log(data);
                if (data.status[0].isValid) {
                    this.fk_CountryGlCode = data.result[0].intGlCode;
                    this.CountryForm.controls['varCountryCode'].setValue(data.result[0].varCountryCode);
                    this.CountryForm.controls['varCountryName'].setValue(
                        data.result[0].varCountryName
                    );
                    this.CountryForm.controls['varCurrencyCode'].setValue(
                        data.result[0].varCurrencyCode
                    );
                    this.CountryForm.controls['varDefaultCurrencyCode'
                    ].setValue(data.result[0].varDefaultCurrencyCode);
                    this.CountryForm.controls['varIconPath'].setValue(
                        data.result[0].varIconPath
                    );
                    this.CountryForm.controls['varCurICONFlag'].setValue(
                        data.result[0].varCurICONFlag
                    );
                    this.CountryForm.controls['varCurICONDefaultFlag'].setValue(
                        data.result[0].varCurICONDefaultFlag
                    );
                    if (data.result[0].chrActive != "N" && data.result[0].chrActive != "No") {
                        this.CountryForm.controls['chrActive'].setValue(
                            true
                        );
                    }
                    else {
                        this.CountryForm.controls['chrActive'].setValue(
                            false
                        );
                    }
                    this._fuseProgressBarService.hideSpinner();
                } else {
                    alert(data.varMessage);
                    this._fuseProgressBarService.hideSpinner();
                }
            },
            err => {
                if (err.status === 0) {
                    alert('Please check your internet connection.');
                } else if (err.status === 500) {
                    alert(err.statusText);
                } else {
                    alert(err.message);
                }
                this._fuseProgressBarService.hideSpinner();
            }
        );
    }

    // btnDelete_Click(): void {
    btnDelete_Click(intGlCode: number) {
        this._fuseProgressBarService.setMode('indeterminate');
        this._fuseProgressBarService.showSpinner();
        this.authenticationService
            .DeleteCountryMst(
                intGlCode, this.fk_PersonGlCode
            )
            .then(
                res => {
                    if (res && res.status[0].isValid) {
                        alert('Data Deleted Successfuly');
                        this._fuseProgressBarService.hideSpinner();
                        this.GetList();
                    } else {
                        alert(res.varMessage);
                        this._fuseProgressBarService.hideSpinner();
                    }
                },
                err => {
                    if (err.status == 0) {
                        alert('Please check your internet connection.');
                    } else if (err.status == 500) {
                        alert(err.statusText);
                    } else {
                        alert(err.message);
                    }
                    this._fuseProgressBarService.hideSpinner();
                }
            );



    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }


}
