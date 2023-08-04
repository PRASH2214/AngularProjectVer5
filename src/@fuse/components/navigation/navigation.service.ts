import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { FuseNavigationItem } from '@fuse/types';

import { GlobalConfig } from '../../../app/fuse-config/GlobalConfig'


@Injectable({
    providedIn: 'root'
})
export class FuseNavigationService {
    //url = GlobalConfig.apiUrlPath + "navRoutes/";
    onItemCollapsed: Subject<any>;
    onItemCollapseToggled: Subject<any>;

    // Private
    private _onNavigationChanged: BehaviorSubject<any>;
    private _onNavigationRegistered: BehaviorSubject<any>;
    private _onNavigationUnregistered: BehaviorSubject<any>;
    private _onCountryChanged: BehaviorSubject<any>;


    private _currentNavigationKey: string;
    private _registry: { [key: string]: any } = {};
    private _selectedCountry: any

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
        // Set the defaults
        this.onItemCollapsed = new Subject();
        this.onItemCollapseToggled = new Subject();

        // Set the private defaults
        this._currentNavigationKey = null;
        this._onNavigationChanged = new BehaviorSubject(null);
        this._onNavigationRegistered = new BehaviorSubject(null);
        this._onNavigationUnregistered = new BehaviorSubject(null);
        this._onCountryChanged = new BehaviorSubject(null);


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get onCountryChanged(): Observable<any> {
        return this._onCountryChanged.asObservable();
    }
    /**
     * Get onNavigationChanged
     *
     * @returns {Observable<any>}
     */
    get onNavigationChanged(): Observable<any> {
        return this._onNavigationChanged.asObservable();
    }

    /**
     * Get onNavigationRegistered
     *
     * @returns {Observable<any>}
     */
    get onNavigationRegistered(): Observable<any> {
        return this._onNavigationRegistered.asObservable();
    }

    /**
     * Get onNavigationUnregistered
     *
     * @returns {Observable<any>}
     */
    get onNavigationUnregistered(): Observable<any> {
        return this._onNavigationUnregistered.asObservable();
    }

    get getSelectedCountry(): any {
        return this._selectedCountry;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register the given navigation
     * with the given key
     *
     * @param key
     * @param navigation
     */
    register(key, navigation): void {
        // Check if the key already being used
        if (this._registry[key]) {
            console.error(`The navigation with the key '${key}' already exists. Either unregister it first or use a unique key.`);

            return;
        }

        // Add to the registry
        this._registry[key] = navigation;

        // Notify the subject
        this._onNavigationRegistered.next([key, navigation]);
    }

    /**
     * Unregister the navigation from the registry
     * @param key
     */
    unregister(key): void {
        // Check if the navigation exists
        if (!this._registry[key]) {
            console.warn(`The navigation with the key '${key}' doesn't exist in the registry.`);
        }

        // Unregister the sidebar
        delete this._registry[key];

        // Notify the subject
        this._onNavigationUnregistered.next(key);
    }

    /**
     * Get navigation from registry by key
     *
     * @param key
     * @returns {any}
     */
    getNavigation(key): any {
        // Check if the navigation exists
        if (!this._registry[key]) {
            console.warn(`The navigation with the key '${key}' doesn't exist in the registry.`);

            return;
        }

        // Return the sidebar
        return this._registry[key];
    }

    /**
     * Get flattened navigation array
     *
     * @param navigation
     * @param flatNavigation
     * @returns {any[]}
     */
    getFlatNavigation(navigation, flatNavigation: FuseNavigationItem[] = []): any {
        for (const item of navigation) {
            if (item.varMenuType === 'item') {
                flatNavigation.push(item);

                continue;
            }

            if (item.varMenuType === 'collapsable' || item.varMenuType === 'group') {
                if (item.children) {
                    this.getFlatNavigation(item.children, flatNavigation);
                }
            }
        }

        return flatNavigation;
    }

    /**
     * Get the current navigation
     *
     * @returns {any}
     */
    getCurrentNavigation(): any {
        if (!this._currentNavigationKey) {
            console.warn(`The current navigation is not set.`);

            return;
        }

        return this.getNavigation(this._currentNavigationKey);
    }

    /**
     * Set the navigation with the key
     * as the current navigation
     *
     * @param key
     */
    setCurrentNavigation(key): void {
        // Check if the sidebar exists
        if (!this._registry[key]) {
            console.warn(`The navigation with the key '${key}' doesn't exist in the registry.`);

            return;
        }

        // Set the current navigation key
        this._currentNavigationKey = key;

        // Notify the subject
        this._onNavigationChanged.next(key);
    }

    /**
     * Get navigation item by id from the
     * current navigation
     *
     * @param id
     * @param {any} navigation
     * @returns {any | boolean}
     */
    getNavigationItem(id, navigation = null): any | boolean {
        if (!navigation) {
            navigation = this.getCurrentNavigation();
        }

        for (const item of navigation) {
            if (item.intGlCode === id) {
                return item;
            }

            if (item.children) {
                const childItem = this.getNavigationItem(id, item.children);

                if (childItem) {
                    return childItem;
                }
            }
        }

        return false;
    }

    /**
     * Get the parent of the navigation item
     * with the id
     *
     * @param id
     * @param {any} navigation
     * @param parent
     */
    getNavigationItemParent(id, navigation = null, parent = null): any {
        if (!navigation) {
            navigation = this.getCurrentNavigation();
            parent = navigation;
        }

        for (const item of navigation) {
            if (item.intGlCode === id) {
                return parent;
            }

            if (item.children) {
                const childItem = this.getNavigationItemParent(id, item.children, item);

                if (childItem) {
                    return childItem;
                }
            }
        }

        return false;
    }

    /**
     * Add a navigation item to the specified location
     *
     * @param item
     * @param id
     */
    addNavigationItem(item, id): void {
        // Get the current navigation
        const navigation: any[] = this.getCurrentNavigation();

        // Add to the end of the navigation
        if (id === 'end') {
            navigation.push(item);

            return;
        }

        // Add to the start of the navigation
        if (id === 'start') {
            navigation.unshift(item);
        }

        // Add it to a specific location
        const parent: any = this.getNavigationItem(id);

        if (parent) {
            // Check if parent has a children entry,
            // and add it if it doesn't
            if (!parent.children) {
                parent.children = [];
            }

            // Add the item
            parent.children.push(item);
        }
    }

    /**
     * Remove navigation item with the given id
     *
     * @param id
     */
    removeNavigationItem(id): void {
        const item = this.getNavigationItem(id);

        // Return, if there is not such an item
        if (!item) {
            return;
        }

        // Get the parent of the item
        let parent = this.getNavigationItemParent(id);

        // This check is required because of the first level
        // of the navigation, since the first level is not
        // inside the 'children' array
        parent = parent.children || parent;

        // Remove the item
        parent.splice(parent.indexOf(item), 1);
    }

    getCurrentActiveNavigation(navigation = null, varURL): any {
        if (!navigation) {
            navigation = this.getCurrentNavigation();
        }
        for (const item of navigation) {
            if (item.varURL === varURL) {
                return item;
            }
            if (item.children) {
                var val = this.getCurrentActiveNavigation(item.children, varURL);
                if (val)
                    return val;
            }
        }
    }

    getNavigationFromServer(fk_CountryGlCode: number,apiUrlPath:string): Observable<any> {
        
        return this._httpClient.post<any>(apiUrlPath + 'navRoutes/GetNavigation', { "fk_CountryGlCode": fk_CountryGlCode });

    }

    getMenuDetailFromURL(varURL: string,apiUrlPath:string): Observable<any> {
        return this._httpClient.post<any>(apiUrlPath + 'navRoutes/GetMenuDetailFromURL', { "varURL": varURL });
    }

    setSelectedCountry(selectedCountry: any): void {
        this._selectedCountry = selectedCountry;
        this._onCountryChanged.next(selectedCountry);
    }


}
