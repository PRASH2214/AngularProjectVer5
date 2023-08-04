import { Component, HostBinding, Input } from '@angular/core';

import { FuseNavigationItem } from '@fuse/types';
import { GlobalService } from 'app/_services/global.service';

@Component({
    selector: 'fuse-nav-vertical-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class FuseNavVerticalItemComponent {
    @HostBinding('class')
    classes = 'nav-item';
    vartheme: string;
    @Input()
    item: FuseNavigationItem;

    /**
     * Constructor
     */
    constructor(private globalService: GlobalService, ) {
    }
    ngOnInit() {
        // Configure the layout
        this.globalService.GetAPIURL().then(resapi => {
            if (resapi.theme === 'blue') {
                this.vartheme = 'mat-accent-bg-blue';
            } else {
                this.vartheme = 'mat-accent-bg-green';
            }
        },
            (error: any) => {

            })
    }
}
