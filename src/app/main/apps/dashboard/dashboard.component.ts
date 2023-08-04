declare var tableau: any;

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { TableauService } from '../../../_services/tableau.service'
import { GlobalService } from 'app/_services/global.service';
import { ReportViewDialogComponent } from '../report/report-view-dialog/report-view-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Platform } from '@angular/cdk/platform';
import { WINDOW } from 'app/_helpers/window.provider';
import { Overlay } from '@angular/cdk/overlay';
import { takeUntil, timeInterval, timeout } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';

interface FsDocument extends HTMLDocument {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
}
export function isFullScreen(): boolean {
  const fsDoc = <FsDocument>document;
  return !!(fsDoc.fullscreenElement || fsDoc.mozFullScreenElement || fsDoc.msFullscreenElement);//|| fsDoc.webkitFullscreenElement
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

  }
  else if (fsDoc.exitFullscreen)
    fsDoc.exitFullscreen();
  else if (fsDoc.msExitFullscreen)
    fsDoc.msExitFullscreen();
  else if (fsDoc.mozCancelFullScreen)
    fsDoc.mozCancelFullScreen();
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})



export class DashboardComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  intervalId: any;
  tableauViz: any
  url = '';
  mailToLink = '';
  commentList: any;
  cnt: number;
  message: any;
  selectedYear: any;
  selectedCurrency: any;
  //tableauViz: any
  urlRoute = '';
  viewName: string;
  workSheetName: string;
  currencyTemp: any;
  yearTemp: any;
  currentNavigation: any;
  navigation: any;
  menuList: any;
  menuLength: number;
  rptName: string;
  menuID: number;
  countryID: number;
  vartheme: string;
  classname: string;
  isShow = true;
  private _unsubscribeAll: Subject<any>;

  constructor(private tableauService: TableauService, private globalService: GlobalService
    // ,private _matDialog: MatDialog,
    , private _platform: Platform, @Inject(WINDOW) private window: Window,
    private overlay: Overlay,
    private fuseNavigationService: FuseNavigationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.globalService.GetAPIURL().then(resapi => {
      this.vartheme = resapi.theme;
      if (this.vartheme === 'blue') {
        this.classname = 'header mat-accent-bg-blue p-24';
      } else if (this.vartheme === 'green') {
        this.classname = 'header mat-accent-bg-green p-24';
      }
      this.tableauService.getAllCommentMstData(resapi.apiUrlPath)
        .subscribe((res) => {
          if (res) {
            if (res.status[0].isValid) {

              var distComment = [];
              res.result.filter(function (item) {
                var i = distComment.findIndex(x => x.varMenuName == item.varMenuName && x.fk_CountryGlCode == item.fk_CountryGlCode);
                if (i <= -1) {
                  distComment.push({ varMenuName: item.varMenuName, fk_CountryGlCode: item.fk_CountryGlCode, varCountryName: item.varCountryName, chrAlertOnToday: item.chrAlertOnToday, chrAlertExists: item.chrAlertExists });
                }
              });

              var temp = [];
              for (const item in distComment) {
                var varMenuName = distComment[item].varMenuName;
                var varCountryName = distComment[item].varCountryName;

                var filterItem = res.result.filter(function (arrItem) {
                  return arrItem.fk_CountryGlCode == distComment[item].fk_CountryGlCode && arrItem.varMenuName == distComment[item].varMenuName;
                });


                var dateSort = this.sortByKey(filterItem, "dtEntryDate");

                var lastIndex = dateSort.length - 1;

                temp.push({ 'dtEntryDate': dateSort[lastIndex].dtEntryDate, 'varMenuName': varMenuName, 'varCountryName': varCountryName, 'intNoOfComment': filterItem.length, 'varLastCommentOn': dateSort[lastIndex].varDate, 'alertOnTodayDate': dateSort[0].chrAlertExists == "N" ? false : true, 'commentOnTodayDate': dateSort[0].chrAlertOnToday == "N" ? false : true, 'detail': filterItem })
              }
              this.commentList = temp;
            }
          }
        })

      //Hitesh Anadani 
      this.fuseNavigationService.onCountryChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(country => {
          if (country) {
            var fk_CountryGlCode;
            if (country) {
              fk_CountryGlCode = country.intGlCode;
            }
            this.fuseNavigationService.getNavigationFromServer(fk_CountryGlCode, resapi.apiUrlPath)
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe(nav => {
                if (nav) {
                  if (nav.status[0].isValid) {
                    this.navigation = nav.result;
                  }
                }
              });
          }
        });

      //Hitesh Anadani 
      this.tableauService.onYearChanged.subscribe(selectedYear => this.selectedYear = selectedYear);
      this.tableauService.onCurrencyChanged.subscribe(selectedCurrency => this.selectedCurrency = selectedCurrency);
    },
      (error: any) => {

      })

  }
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //Hitesh Anadani 
  FullScreenExit(intervalId: any) {
    if (!isFullScreen()) {
      window.location.reload();
    }
  }
  //Hitesh Anadani 
  PlayWithFullScreen() {

    this.cnt = 0;
    this.menuLength = 0;
    this.menuList = [];
    if (this.navigation.length > 0) {
      this.menuList = this.navigation[0].children;
      this.menuLength = this.menuList.length;
    }
    if (this.menuLength == 0) {
      return;
    }
    if (this._platform.IOS) {
      alert("Your broswer not supported to view full screen.");
      return;
    }
    var placeholderDiv = document.querySelector('#tableauViz');
    if (true !== isFullScreen()) {
      toggleFullScreen(placeholderDiv);
    }
    setTimeout(() => { this.LoadReport(this.selectedYear.title, this.selectedCurrency.varCurrencyCode) }, 1000);
    this.intervalId = setInterval(() => { this.LoadReport(this.selectedYear.title, this.selectedCurrency.varCurrencyCode) }, 60000);
    placeholderDiv.addEventListener('fullscreenchange', this.FullScreenExit.bind(this.intervalId));
    placeholderDiv.addEventListener('webkitfullscreenchange', this.FullScreenExit.bind(this.intervalId));
    placeholderDiv.addEventListener('mozfullscreenchange', this.FullScreenExit.bind(this.intervalId));
    placeholderDiv.addEventListener('MSFullscreenChange', this.FullScreenExit.bind(this.intervalId));
    //this.subscription = this.intervalId.subscribe(() => { this.LoadReport(this.selectedYear.title, this.selectedCurrency.varCurrencyCode) });

    //setInterval(()=> { this.LoadReport(this.selectedYear.title, this.selectedCurrency.varCurrencyCode) }, 20000);

  }

  LoadReport(selectedYear: any, selectedCurrency: any) {
    this.isShow = false;
    if (this.cnt === undefined || this.cnt === 0) {
      this.cnt = 1;
    }
    if (this.menuLength > this.cnt) {
      var placeholderDiv = document.querySelector('#tableauViz');
      this.workSheetName = this.menuList[this.cnt].varURL.split('/')[3];
      this.viewName = this.menuList[this.cnt].varURL.split('/')[4];

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
      this.tableauService.getTableauReport(this.workSheetName, this.viewName, selectedCurrency, selectedYear)
        .then(res => {
          this.url = res;
          if (this.url != "") {
            if (this.tableauViz != null) {
              this.tableauViz.dispose();
            }
            this.tableauViz = new tableau.Viz(placeholderDiv, this.url, options);
          }
        });
      this.cnt++;
    } else {
      this.cnt = 1;
    }
  }
}

