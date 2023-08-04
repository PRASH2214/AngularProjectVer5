import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";

import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { WINDOW } from 'app/_helpers/window.provider';
import { Overlay } from '@angular/cdk/overlay';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { FormBuilder, FormGroup, Validators, CheckboxControlValueAccessor } from '@angular/forms';
import { Role_Privs } from '../role-privs/role-privs.model'
import { DxDataGridComponent } from 'devextreme-angular';
import { GlobalService } from 'app/_services/global.service';




@Component({
  selector: 'app-role-privs',
  templateUrl: './role-privs.component.html',
  styleUrls: ['./role-privs.component.scss']
})
export class RolePrivsComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  message: any;

  varselectedmenulist: string;
  selectedYear: any;
  selectedCurrency: any;
  urlRoute = '';
  currencyTemp: any;
  yearTemp: any;
  currentNavigation: any;
  navigation: any;
  rptName: string;
  menuID: number;
  selectedRowsData = [];
  //selectedIds = new Array();

  private _unsubscribeAll: Subject<any>;
  RolePrivsForm: FormGroup;
  Role_Privs: Role_Privs[];
  submitted = false;
  RoleList: any;
  vartheme: string;
  classname: string;
  constructor(private fuseNavigationService: FuseNavigationService, private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private _matDialog: MatDialog,
    private _platform: Platform,
    @Inject(WINDOW) private window: Window,
    private _fuseProgressBarService: FuseProgressBarService,
    private authenticationService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private overlay: Overlay) {
    this._unsubscribeAll = new Subject();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        if (this.currencyTemp) {
          this.urlRoute = this.router.url;
          this.currentNavigation = this.fuseNavigationService.getCurrentActiveNavigation(this.navigation, this.urlRoute);
          if (this.currentNavigation) {
            this.rptName = this.currentNavigation.varMenuName;
            this.menuID = this.currentNavigation.intGlCode;
          }
        }
      });
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
    // Configure the layout
    this.RolePrivsForm = this._formBuilder.group({
      fk_RoleGlCode: [0, Validators.required],
    });

    //by default set First value
    this.RolePrivsForm.controls['fk_RoleGlCode'].setValue(1);
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
    this.BindRoleList();
    this.BindGrid(this.f.fk_RoleGlCode.value);
  }

  OnRoleChange() {
    this.BindGrid(this.f.fk_RoleGlCode.value)
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  get f() { return this.RolePrivsForm.controls; }

  SetNewScreen() {
    this.submitted = false;
    this.BindGrid(this.f.fk_RoleGlCode.value);
  }

  btnClear_Click(): void {
    this.SetNewScreen();
  }

  BindGrid(fk_RoleGlCode): void {


    //this.selectedIds = [];
    this.authenticationService.GetRolePrivsMst(fk_RoleGlCode).then(
      data => {
        if (data.status[0].isValid) {
          this.Role_Privs = data.result;
          // for (var i = 0; i < data.result.length; i++) {
          //   if (data.result[i].chrActive === "Y") {
          //     this.selectedIds.push(data.result[i].fk_MenuGlCode);
          //   }
          // }
          //this.dataGrid.instance.selectRows(this.selectedIds, true);
          this._fuseProgressBarService.hideSpinner();

        } else {
          alert(data.varMessage);
          this._fuseProgressBarService.hideSpinner();
        }
      },
      err => {
        if (err.status === 0) {
          alert('Please check your internet connection.');
        } else if (err.status === 500) {
          alert(err.statusText);
        } else {
          alert(err.message);
        }
        this._fuseProgressBarService.hideSpinner();
      }
    );
  }
  BindRoleList(): void {
    this.authenticationService.Person_GetRoleList().then(
      data => {
        if (data.status[0].isValid) {
          this.RoleList = data.result;

        } else {
          alert(data.varMessage);
          this._fuseProgressBarService.hideSpinner();
        }
      },
      err => {
        if (err.status === 0) {
          alert('Please check your internet connection.');
        } else if (err.status === 500) {
          alert(err.statusText);
        } else {
          alert(err.message);
        }
        this._fuseProgressBarService.hideSpinner();
      }
    );
  }

  btnSave_Click(): void {
    this.submitted = true;
    this.varselectedmenulist = "";

    if (this.RolePrivsForm.invalid) {
      return;
    }

    this._fuseProgressBarService.setMode("indeterminate");
    this._fuseProgressBarService.showSpinner();

    this.selectedRowsData = this.dataGrid.instance.getSelectedRowKeys();
    this.dataGrid.instance.getSelectedRowKeys().then((selectedRowsData) => {
      for (var i = 0; i < selectedRowsData.length; i++) {
        this.varselectedmenulist += "," + selectedRowsData[i];
      }
      this.authenticationService.InsertUpdateRolePrivsMst(this.varselectedmenulist, this.f.fk_RoleGlCode.value, 1)
        .then(res => {
          if (res && res.status[0].isValid) {
            alert("Data Save Successfuly");
            this._fuseProgressBarService.hideSpinner();
            this.BindGrid(this.f.fk_RoleGlCode.value);
          }
          else {
            alert(res.varMessage);
            this._fuseProgressBarService.hideSpinner();
          }
        },
          (err) => {
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
    });
  }
}
