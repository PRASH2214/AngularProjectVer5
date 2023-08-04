import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { GlobalService } from 'app/_services/global.service';

@Component({
    selector: 'navbar-vertical-style-1',
    templateUrl: './style-1.component.html',
    styleUrls: ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
    fuseConfig: any;
    vartheme: string;
    classname: string;
    fusePerfectScrollbarUpdateTimeout: any;
    navigation: any;
    // varClientLogo: string;
    // varClientLogoIcon:string;
    varClientLogo: 'assets/images/logos/basf-logo.png';
    varClientLogoIcon: 'assets/images/logos/icon_basf.png';

    // Private
    private _fusePerfectScrollbar: FusePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Router} _router
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _globalService: GlobalService,
        private _router: Router
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._globalService.GetAPIURL().then(resapi => {
            this.vartheme = resapi.theme;
            if (this.vartheme === 'blue') {
                this.classname = 'navbar-top mat-indigo-700-bg';
            } else if (this.vartheme === 'green') {
                this.classname = 'navbar-top-green mat-indigo-700-bg';
            }
        }, (error: any) => {
        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Directive
    @ViewChild(FusePerfectScrollbarDirective)
    set directive(theDirective: FusePerfectScrollbarDirective) {
        if (!theDirective) {
            return;
        }

        this._fusePerfectScrollbar = theDirective;

        // Update the scrollbar on collapsable item toggle
        this._fuseNavigationService.onItemCollapseToggled
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.fusePerfectScrollbarUpdateTimeout = setTimeout(() => {
                    this._fusePerfectScrollbar.update();
                }, 310);
            });

        // Scroll to the active item position
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                setTimeout(() => {
                    const activeNavItem: any = document.querySelector('navbar .nav-link.active');
                    if (activeNavItem) {
                        const activeItemOffsetTop = activeNavItem.offsetTop,
                            activeItemOffsetParentTop = activeNavItem.offsetParent.offsetTop,
                            scrollDistance = activeItemOffsetTop - activeItemOffsetParentTop - (48 * 3) - 168;

                        this._fusePerfectScrollbar.scrollToTop(scrollDistance);
                    }
                });
            });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._globalService.GetAPIURL().then(resapi => {
            this.vartheme = resapi.theme;
            if (this.vartheme === 'blue') {
                this.classname = 'navbar-top mat-indigo-700-bg';
            } else if (this.vartheme === 'green') {
                this.classname = 'navbar-top-green mat-indigo-700-bg';
            }
        }, (error: any) => {
        })
        this._globalService.GetClientMst().then(res => {
            if (res.status[0].isValid) {
                this.varClientLogo = res.result[0].varClientLogo;
                this.varClientLogoIcon = res.result[0].varClientLogoIcon;
            }
            else {
                this.varClientLogo = 'assets/images/logos/basf-logo.png';
                this.varClientLogoIcon = 'assets/images/logos/icon_basf.png';
            }
        }, (err) => {

        });
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                if (this._fuseSidebarService.getSidebar('navbar')) {
                    this._fuseSidebarService.getSidebar('navbar').close();
                }
            }
            );

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });

        // Get current navigation
        // this._fuseNavigationService.onNavigationChanged
        //     .pipe(
        //         filter(value => value !== null),
        //         takeUntil(this._unsubscribeAll)
        //     )
        //     .subscribe(() => {
        //         this.navigation = this._fuseNavigationService.getCurrentNavigation();
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        if (this.fusePerfectScrollbarUpdateTimeout) {
            clearTimeout(this.fusePerfectScrollbarUpdateTimeout);
        }

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpened(): void {
        this._fuseSidebarService.getSidebar('navbar').toggleOpen();
    }

    /**
     * Toggle sidebar folded status
     */
    toggleSidebarFolded(): void {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
    }
}
