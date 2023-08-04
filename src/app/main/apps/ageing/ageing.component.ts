declare var tableau: any;
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TableauService } from '../../../_services/tableau.service'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ageing',
  templateUrl: './ageing.component.html',
  styleUrls: ['./ageing.component.scss']
})
export class AgeingComponent implements OnInit, OnDestroy {
  tableauViz: any;
  url = '';
  private _unsubscribeAll: Subject<any>;

  constructor(private tableauService: TableauService) {
    this._unsubscribeAll = new Subject();
  }
  exportPDF() {
    this.tableauViz.showExportImageDialog();
  }
  ngOnInit() {
    var placeholderDiv = document.getElementById('tableauViz');

    var options = {
      hideTabs: true,
      hideToolbar: true,
      width: 100 + '%',
      height: window.innerHeight,
      onFirstInteractive: function () {
        // The viz is now ready and can be safely used.
      }
    };


    this.tableauService.onCurrencyChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(currency => {
        if (currency) {
          if (this.tableauViz != null) {
            this.tableauViz.dispose();
          }
          this.tableauService.getTableauReportOld("AgeingDashboard", currency.varCurrencyCode)
            .then(res => {
              this.url = res;

              this.tableauViz = new tableau.Viz(placeholderDiv, this.url, options);
              this.tableauViz.showExportImageDialog();
            });
        }
      });

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }



}
