declare var tableau: any;

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { TableauService } from 'app/_services/tableau.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { MailComposeDialogComponent } from 'app/commonComponent/dialogs/compose/compose.component';
import { Overlay } from '@angular/cdk/overlay';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { WINDOW } from 'app/_helpers/window.provider';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-report-view-dialog',
  templateUrl: './report-view-dialog.component.html',
  styleUrls: ['./report-view-dialog.component.scss']
})
export class ReportViewDialogComponent implements OnDestroy {

  message: any;
  selectedYear: any;
  selectedCurrency: any;
  tableauVizPop: any
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

  constructor(public matDialogRef: MatDialogRef<MailComposeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private tableauService: TableauService,
    private fuseNavigationService: FuseNavigationService,
    private route: ActivatedRoute,
    private router: Router,
    private _matDialog: MatDialog, private overlay: Overlay,
    private _platform: Platform, @Inject(WINDOW) private window: Window) {

    this._unsubscribeAll = new Subject();
    // this.route.params
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(params => {
    //     this.workSheetName = params["wsname"];
    //     this.viewName = params["vwname"];
    //     if (this.currencyTemp) {
    //       this.tableauService.setCurrencyChanged(this.currencyTemp);
    //       this.urlRoute = this.router.url;
    //       this.currentNavigation = this.fuseNavigationService.getCurrentActiveNavigation(this.navigation, this.urlRoute);
    //       if (this.currentNavigation) {
    //         this.rptName = this.currentNavigation.varMenuName;
    //         this.menuID = this.currentNavigation.intGlCode;
    //       }
    //     }
    //   });
  }
  ngOnDestroy(): void {
    this.matDialogRef.close();
  }
  ngOnInit() {
    this.workSheetName = 'AIN';
    this.viewName = 'ScanDB';
    this.rptName = 'Scan';
    
    this.tableauService.onYearChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(year => {
        var placeholderDiv = document.querySelector('#tableauVizPop');
        var options = {
          hideTabs: true,
          hideToolbar: true,
          width: 100 + '%',
          height: this.window.innerHeight,
          onFirstInteractive: function () {
            //var workbook = tableau.getWorkbook();
            // The viz is now ready and can be safely used.
          }
        };
        this.tableauService.onCurrencyChanged.subscribe(selectedCurrency => this.message = selectedCurrency);
        if (year) {
          if (this.message) {
            this.yearTemp = year;
            this.tableauService.getTableauReport(this.workSheetName, this.viewName, this.message.varCurrencyCode, year.id)
              .then(res => {
                this.url = res;
                if (this.url != "") {
                  if (this.tableauVizPop != null) {
                    this.tableauVizPop.dispose();
                  }
                  this.tableauVizPop = new tableau.Viz(placeholderDiv, this.url, options);
                }
              });
          }
        }
      })
  }

}
