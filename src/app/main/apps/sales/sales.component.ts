declare var tableau: any;
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TableauService } from '../../../_services/tableau.service'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, OnDestroy {
  tableauViz: any
  url = '';
  private _unsubscribeAll: Subject<any>;
  constructor(private tableauService: TableauService) {
    this._unsubscribeAll = new Subject();
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
    if (this.tableauViz != null) {
      this.tableauViz.dispose();
    }

    this.tableauService.onCurrencyChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(currency => {
        if (currency) {
          if (this.tableauViz != null) {
            this.tableauViz.dispose();
          }
          this.tableauService.getTableauReportOld("SalesDashboard", currency.varCurrencyCode)
            .then(res => {
              this.url = res;
              this.tableauViz = new tableau.Viz(placeholderDiv, this.url, options);
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
