import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { WINDOW } from 'app/_helpers/window.provider';

import { AuthenticationService } from '../../../../_services/authentication.service';
import { Subject } from 'rxjs';
import { GlobalService } from 'app/_services/global.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    varVersion: string;
    vartheme: string;
    varlogin: string;
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        @Inject(WINDOW) private window: Window,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private globalService: GlobalService,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.globalService.GetAPIURL().then(resapi => {
            this.varVersion = resapi.version;
            this.vartheme = resapi.theme;
            if (resapi.theme === 'blue') {
              this.varlogin = 'login-blue';
            }
            else {
              this.varlogin = 'login';
            }
          },
            (error: any) => {
      
            })
        // Configure the layout
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/dashboard';
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    btnLoginClicked(): void {
        this._fuseProgressBarService.setMode("indeterminate");
        this._fuseProgressBarService.showSpinner();
        this.authenticationService.login(this.f.email.value, this.f.password.value).then((data) => {
            if (data.isValid) {
                this.authenticationService.LoginSuccessfullyDone().then(() => {
                    this.authenticationService.InsertUpdateLoginDetails(0, this.window.navigator.userAgent).then((resolve) => {
                        localStorage.setItem("fk_LDGlCode", resolve[0].fk_LDGlCode);

                        this._fuseProgressBarService.hideSpinner();
                        this.router.navigate([this.returnUrl]);
                    })
                })
            } else {
                alert(data.varMessage);
                this._fuseProgressBarService.hideSpinner();
            }
        }, (err) => {
            if (err.status == 0) {
                alert("Please check your internet connection.");
            }
            else if (err.status == 500) {
                alert(err.statusText);
            }
            else {
                alert(err.message);
            }
            this._fuseProgressBarService.hideSpinner();
        });

    }

}
