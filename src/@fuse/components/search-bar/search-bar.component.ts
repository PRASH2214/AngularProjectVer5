import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Router } from '@angular/router';

@Component({
    selector: 'fuse-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class FuseSearchBarComponent implements OnInit, OnDestroy {


    collapsed: boolean;
    fuseConfig: any;
    searchValue: string = '';
    navigation: any;
    navChildren: any;

    @Output()
    input: EventEmitter<any>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private router: Router
    ) {
        // Set the defaults
        this.input = new EventEmitter();
        this.collapsed = true;

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
        this.navChildren = [];
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (config) => {
                    this.fuseConfig = config;
                }
            );

        this._fuseNavigationService.onNavigationChanged
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
                if (this.navigation) {
                    this.navChildren = [];
                    for (var i = 0; i < this.navigation.length; i++) {
                        var item = this._fuseNavigationService.getNavigationItem(this.navigation[i].intGlCode, this.navigation);
                        for (var j = 0; j < item.children.length; j++) {
                            this.navChildren.push(item.children[j]);
                        }
                    }
                }
            });
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
     * Collapse
     */
    collapse(): void {
        this.collapsed = true;
        this.charactersFinal = [];
        this.searchValue = '';
    }

    /**
     * Expand
     */
    expand(): void {
        this.collapsed = false;
        this.searchValue = '';
    }

    /**
     * Search
     *
     * @param event
     */
    charactersFinal: any;
    characters = [
        'Sales',
        'Stock',
        'Ageing',
        'Retailer Sales',
        'Coverage',
        'Scan',
        'Top 30 Retailers',
        'State Farmer/Retailer Sales'
    ]
    search(event): void {
        //this.input.emit(event.target.value);

        this.charactersFinal = this.filterArrayByString(this.navChildren, event.target.value);

    }
    filterArrayByString(mainArr, searchText): any {
        if (searchText === '' || searchText == undefined) {
            return [];
        }

        searchText = searchText.toLowerCase();


        return mainArr.filter(it => {
            return  it.varTagList.toLowerCase().includes(searchText);
        });

        // mainArr.forEach(element => {
        //     return "ABC,DEF,GHI".split(",").find(function (category) {
        //         return element.varMenuName.toLowerCase()
        //     })
        // });

        // return mainArr.filter(it => {
        //     return it.varMenuName.toLowerCase().includes(searchText);
        // });
    }
    searchItemClicked(varURL): void {
        this.collapse();
        this.router.navigate([varURL]);
    }

}
