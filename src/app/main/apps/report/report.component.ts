declare var tableau: any;
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { TableauService } from '../../../_services/tableau.service'
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AddCommentDialogComponent } from './add-comment-dialog/add-comment-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { WINDOW } from 'app/_helpers/window.provider';
import { Overlay } from '@angular/cdk/overlay';
import { ReportViewDialogComponent } from './report-view-dialog/report-view-dialog.component';
import { GlobalService } from 'app/_services/global.service';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
//import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2'

interface FsDocument extends HTMLDocument {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
}
export function isFullScreen(): boolean {
  const fsDoc = <FsDocument>document;
  return !!(fsDoc.fullscreenElement || fsDoc.mozFullScreenElement || fsDoc.webkitFullscreenElement || fsDoc.msFullscreenElement);
}
interface FsDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
}
export function toggleFullScreen(iframe: any): void {
  const fsDoc = <FsDocument>document;
  if (!isFullScreen()) {
    const fsDocElem = <FsDocumentElement>iframe;
    if (fsDocElem.requestFullscreen)
      fsDocElem.requestFullscreen();
    else if (fsDocElem.msRequestFullscreen)
      fsDocElem.msRequestFullscreen();
    else if (fsDocElem.mozRequestFullScreen)
      fsDocElem.mozRequestFullScreen();
    else if (fsDocElem.webkitRequestFullscreen)
      fsDocElem.webkitRequestFullscreen();
  }
  else if (fsDoc.exitFullscreen)
    fsDoc.exitFullscreen();
  else if (fsDoc.msExitFullscreen)
    fsDoc.msExitFullscreen();
  else if (fsDoc.mozCancelFullScreen)
    fsDoc.mozCancelFullScreen();
  else if (fsDoc.webkitExitFullscreen)
    fsDoc.webkitExitFullscreen();
}
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: fuseAnimations
})



export class ReportComponent implements OnInit, OnDestroy {
  message: any;

  selectedYear: any;
  selectedCurrency: any;
  tableauViz: any
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
  vartheme: string;
  classname: string;
  countryID: number;
  refreshcounter: number = 0;
  //@ViewChild('tableauViz') mytableauVizDiv: ElementRef;

  private _unsubscribeAll: Subject<any>;
  isButtonVisible : boolean = true;
  constructor(private tableauService: TableauService,
    private fuseNavigationService: FuseNavigationService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private _matDialog: MatDialog,
    private _platform: Platform,
    private _fuseProgressBarService: FuseProgressBarService,
    @Inject(WINDOW) private window: Window,
    //@Inject(DOCUMENT) private document: any,
    private overlay: Overlay
  ) {
    this._unsubscribeAll = new Subject();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.workSheetName = params["wsname"];
        this.viewName = params["vwname"];
        if (this.workSheetName === 'ECP_Asset_Dashboard') {
          this.isButtonVisible = true;
        }
        else {
          this.isButtonVisible = false;
        }
        if (this.currencyTemp) {
          this.tableauService.setCurrencyChanged(this.currencyTemp);
          this.urlRoute = this.router.url;
          this.currentNavigation = this.fuseNavigationService.getCurrentActiveNavigation(this.navigation, this.urlRoute);
          if (this.currentNavigation) {
            this.rptName = this.currentNavigation.varMenuName;
            this.menuID = this.currentNavigation.intGlCode;

          }
        }
      });


  }
  exportPDF() {
    this.tableauViz.showExportImageDialog();
  }
  ResetView() {
    this.tableauViz.revertAllAsync();
  }

  fullscreen() {
    if (this._platform.IOS) {
      alert("Your broswer not supported to view full screen.");
      return;
    }
    var iframe = document.querySelector('#container iframe');
    if (true !== isFullScreen())
      toggleFullScreen(iframe);
  }
  test() {
    // var test = document.getElementById("dashboard-viewport")
    // test.setAttribute("style","cursor:default;overflow:hidden;")
  }
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
    this.tableauService.onYearChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(year => {
        var placeholderDiv = document.querySelector('#tableauViz');
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
                  if (this.tableauViz != null) {
                    this.tableauViz.dispose();
                  }
                  this.tableauViz = new tableau.Viz(placeholderDiv, this.url, options);
                }
              });
          }
        }
      })

    this.tableauService.onCurrencyChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(currency => {
        var placeholderDiv = document.querySelector('#tableauViz');
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
        if (currency) {
          this.currencyTemp = currency;
          this.tableauService.onYearChanged.subscribe(selectedYear => this.selectedYear = selectedYear);
          this.tableauService.getTableauReport(this.workSheetName, this.viewName, currency.varCurrencyCode, this.selectedYear.title)
            .then(res => {
              this.url = res;
              if (this.url != "") {
                if (this.tableauViz != null) {
                  this.tableauViz.dispose();
                }
                this.tableauViz = new tableau.Viz(placeholderDiv, this.url, options);
                //this.mytableauVizDiv.nativeElement.children[0].contentDocument.body.className = "loadingSpinner";
                //this.document.body.style.cursor='default';
                //this.mytableauVizDiv.nativeElement.children[0].className = "loadingSpinner2";
                //this.mytableauVizDiv.nativeElement.children[0].style.cursor = "pointer";
                // this.mytableauVizDiv.nativeElement.children[0].contentDocument.body.style.cursor = "pointer";
                // setTimeout(() => {
                //   this.mytableauVizDiv.nativeElement.children[0].contentDocument.body.className = "loadingSpinner3";  
                // });
                //console.log(this.mytableauVizDiv.nativeElement.children[0].contentDocument.body);
              }
            });
        }
      })

    this.fuseNavigationService.onCountryChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(country => {
        if (country) {
          this.countryID = country.intGlCode;
        }
      });

    this.fuseNavigationService.onNavigationChanged
      .pipe(
        filter(value => value !== null),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.urlRoute = this.router.url;
        this.navigation = this.fuseNavigationService.getCurrentNavigation();
        this.currentNavigation = this.fuseNavigationService.getCurrentActiveNavigation(this.navigation, this.urlRoute);
        if (this.currentNavigation) {
          this.rptName = this.currentNavigation.varMenuName;
          this.menuID = this.currentNavigation.intGlCode;

        }
      });
  }
  private validateRefreshJobID(site_id: string, job_id: string, token_id: string) {
    if (this.refreshcounter <= 3) {
      this.tableauService.validateRefreshJobID(site_id, job_id, token_id)
        .then(res1 => {
          if (res1 !== undefined) {
            if (res1.progress === '100') {
              // this._fuseProgressBarService.hideSpinner();
              Swal.fire('','Data refresh activity is done','info');
              this.refreshcounter = 0;
              window.location.reload();
              // Swal.fire({
              //   title: '',
              //   text: 'Data refresh activity is done',
              //   type: 'question',
              //   showCancelButton: false,
              //   confirmButtonText: 'Ok',
              //   cancelButtonText: 'No'
              // }).then((result) => {
              //   if (result.value) {
              //     this.refreshcounter = 0;
              //     window.location.reload();
              //   } else if (result.dismiss === Swal.DismissReason.cancel) {
              //   }
              // });
            }
            else {
              setTimeout(() => {
                this.refreshcounter = this.refreshcounter + 1;
                this.validateRefreshJobID(site_id, job_id, token_id);
              },
                10000);
            }
          }
          else {
            // this._fuseProgressBarService.hideSpinner();
          }
        },
          (error: any) => {
            //this._fuseProgressBarService.hideSpinner();
          });
    }
    else {
      //this._fuseProgressBarService.hideSpinner();
    }
  }
  RefreshDashboard(): void {
    // this._fuseProgressBarService.setMode('indeterminate');
    // this._fuseProgressBarService.showSpinner();
    this.tableauService.signin()
      .then(resT => {
        if (resT !== undefined && resT.token !== '') {
          var token_id = resT.token;
          var site_id = resT.site_id;
          this.tableauService.CheckJobStatus(site_id, token_id)
            .then(resC => {
              if (resC !== undefined && resC.totalAvailable == '0') {
                Swal.fire('','Data Refresh Request sent','info');
                this.tableauService.refreshDashboard(site_id, token_id)
                  .then(res => {
                    if (res !== undefined && res.job_id !== '') {
                      setTimeout(() => {
                        this.validateRefreshJobID(site_id, res.job_id, token_id);
                      },
                        5000);
                    }
                    // else {
                    //   this._fuseProgressBarService.hideSpinner();
                    // }
                  },
                    (error: any) => {
                      //this._fuseProgressBarService.hideSpinner();
                    });
              } else {
                //this._fuseProgressBarService.hideSpinner();
                Swal.fire('','Please wait refresh activity is running','info');
              }
            },
              (error: any) => {
                //this._fuseProgressBarService.hideSpinner();
              }
            );
        } else {
          //this._fuseProgressBarService.hideSpinner();
        }
      },
        (error: any) => {
          //this._fuseProgressBarService.hideSpinner();
        });
  }
  addComment(): void {
    this.dialogRef = this._matDialog.open(AddCommentDialogComponent, {
      panelClass: 'event-form-dialog',
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        menuID: this.menuID,
        countryID: this.countryID,
        currencyCode: this.currencyTemp.varCurrencyCode,
        rptName: this.rptName
      }
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}
