import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Menu_Mst } from '../menu-mst/menu-mst.model';
import { GlobalService } from 'app/_services/global.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu-mst.component.html',
  styleUrls: ['./menu-mst.component.scss']
})
export class MenuMstComponent implements OnInit {
  message: any;

  // selectedYear: any;
  // selectedCurrency: any;
  // tableauViz: any
  // url = '';
  urlRoute = '';
  // viewName: string;
  // workSheetName: string;
  currencyTemp: any;
  // yearTemp: any;
  currentNavigation: any;
  navigation: any;
  rptName: string;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;
  massage = null;
  //selectedAll: any;
  menuID: number;
  private _unsubscribeAll: Subject<any>;

  MenuForm: FormGroup;
  fk_MenuGlCode = 0;
  fk_PersonGlCode : any;
  chrDisplayMenu: any;
  selectedIds = new Array();
  Menu: Menu_Mst[];
  //ParentMenu: any;
  submitted = false;
  //ParentMenuLst: any;
  //Fk_ParentMenu: any;
  //MenuTypeLst: any;
  vartheme:string;
  classname:string;
  constructor(private fuseNavigationService: FuseNavigationService, private route: ActivatedRoute,
    private router: Router,
    private _matDialog: MatDialog,
    private _platform: Platform,
    private globalService: GlobalService,
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
    this.rowCellHandler = this.rowCellHandler.bind(this);
    this.allowDeleting = this.allowDeleting.bind(this);
  }
  
  ngOnInit() {
    // Configure the layout
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
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.fk_PersonGlCode = currentUser.fk_PersonGlCode;

    this.MenuForm = this._formBuilder.group({
      varMenuCode: ['', Validators.required],
      varMenuName: ['', Validators.required],
      // varMenuType: ['', Validators.required],
      // ref_ParentMenuGLCode: [0],
      varURL: ['', Validators.required],
      varIconPath: ['', Validators.required],
      chrDisplayMenu: ['', Validators.required],
      varDisplayOrder: ['', Validators.required],
      varTagList: ['', Validators.required]
    });

    this.BindGrid();
    // this.BindParentMenuList();
    // this.BindMenuTypeList();

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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  rowCellHandler(e) {
    if (e.row.data.intGlCode != null && e.row.data.intGlCode != 0) {
      this.loadMenuToEdit(e.row.data.intGlCode);
      e.event.preventDefault();
    }
  }
  LB_Click(e) {
    this.loadMenuToEdit(e);
  }
  allowDeleting(e) {
    if (e.row.data.intGlCode != null && e.row.data.intGlCode != 0) {
      if (confirm("Are you sure want to delete this record?")) {
        this.btnDelete_Click(e.row.data.intGlCode);
      }
      e.event.preventDefault();
    }
  }

  get f() { return this.MenuForm.controls; }

  SetNewScreen() {
    this.submitted = false;
    this.MenuForm.reset();
  }

  btnClear_Click(): void {
    this.SetNewScreen();
  }

  BindGrid(): void {
    this.authenticationService.GetMenuMst(0).then(
      data => {
        if (data.status[0].isValid) {
          this.Menu = data.result;
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

  // BindParentMenuList(): void {
  //   this.authenticationService.Menu_GetParentMenuList().then(
  //     data => {
  //       if (data.status[0].isValid) {
  //         this.ParentMenuLst = data.result;

  //       } else {
  //         alert(data.varMessage);
  //         this._fuseProgressBarService.hideSpinner();
  //       }
  //     },
  //     err => {
  //       if (err.status === 0) {
  //         alert('Please check your internet connection.');
  //       } else if (err.status === 500) {
  //         alert(err.statusText);
  //       } else {
  //         alert(err.message);
  //       }
  //       this._fuseProgressBarService.hideSpinner();
  //     }
  //   );
  // }

  // BindMenuTypeList(): void {
  //   this.authenticationService.Menu_GetMenuTypeList().then(
  //     data => {
  //       if (data.status[0].isValid) {
  //         this.MenuTypeLst = data.result;

  //       } else {
  //         alert(data.varMessage);
  //         this._fuseProgressBarService.hideSpinner();
  //       }
  //     },
  //     err => {
  //       if (err.status === 0) {
  //         alert('Please check your internet connection.');
  //       } else if (err.status === 500) {
  //         alert(err.statusText);
  //       } else {
  //         alert(err.message);
  //       }
  //       this._fuseProgressBarService.hideSpinner();
  //     }
  //   );
  // }

  btnSave_Click(): void {
    this.submitted = true;

    if (this.MenuForm.invalid) {
      return;
    }

    this._fuseProgressBarService.setMode("indeterminate");
    this._fuseProgressBarService.showSpinner();
    if (this.f.chrDisplayMenu.value === true || this.f.chrDisplayMenu.value === "Y") {
      this.chrDisplayMenu = "Y";
    }
    else {
      this.chrDisplayMenu = "N";
    }

    // if (this.f.ref_ParentMenuGLCode.value === undefined || this.f.ref_ParentMenuGLCode.value === "0") {
    //   this.Fk_ParentMenu = 0;
    // }
    // else {
    //   this.Fk_ParentMenu = this.f.ref_ParentMenuGLCode.value;
    // }

    this.authenticationService.InsertUpdateMenuMst(this.fk_MenuGlCode, this.f.varMenuCode.value, this.f.varMenuName.value,this.f.varURL.value, this.f.varIconPath.value, this.chrDisplayMenu, this.f.varTagList.value, this.f.varDisplayOrder.value, this.fk_PersonGlCode)
      .then(res => {
        if (res && res.status[0].isValid) {
          alert("Data Save Successfuly");
          this._fuseProgressBarService.hideSpinner();
          this.SetNewScreen();
          this.BindGrid();
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
  }

  loadMenuToEdit(intGlCode: number) {

    this._fuseProgressBarService.setMode('indeterminate');
    this._fuseProgressBarService.showSpinner();
    this.authenticationService.GetMenuMst(intGlCode).then(
      data => {
        console.log(data);
        if (data.status[0].isValid) {
          this.fk_MenuGlCode = data.result[0].intGlCode;
          this.MenuForm.controls['varMenuCode'].setValue(data.result[0].varMenuCode);
          this.MenuForm.controls['varMenuName'].setValue(data.result[0].varMenuName);
          // this.MenuForm.controls['varMenuType'].setValue(data.result[0].varMenuType);
          // this.MenuForm.controls['ref_ParentMenuGLCode'].setValue(data.result[0].ref_ParentMenuGLCode);
          this.MenuForm.controls['varURL'].setValue(data.result[0].varURL);
          this.MenuForm.controls['varIconPath'].setValue(data.result[0].varIconPath);
          if (data.result[0].chrDisplayMenu != "N" && data.result[0].chrDisplayMenu != "No") {
            this.MenuForm.controls['chrDisplayMenu'].setValue(
              true
            );
          }
          else {
            this.MenuForm.controls['chrDisplayMenu'].setValue(
              false
            );
          }
          this.MenuForm.controls['varTagList'].setValue(data.result[0].varTagList);
          this.MenuForm.controls['varDisplayOrder'].setValue(data.result[0].varDisplayOrder);
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

  //btnDelete_Click(): void {
  btnDelete_Click(intGlCode: number) {
    this._fuseProgressBarService.setMode('indeterminate');
    this._fuseProgressBarService.showSpinner();
    this.authenticationService
      .DeleteMenuMst(intGlCode, 1
      )
      .then(
        res => {
          if (res && res.status[0].isValid) {
            alert('Data Deleted Successfuly');
            this._fuseProgressBarService.hideSpinner();
            this.BindGrid();
          } else {
            alert(res.varMessage);
            this._fuseProgressBarService.hideSpinner();
          }
        },
        err => {
          if (err.status == 0) {
            alert('Please check your internet connection.');
          } else if (err.status == 500) {
            alert(err.statusText);
          } else {
            alert(err.message);
          }
          this._fuseProgressBarService.hideSpinner();
        }
      );
  }

}
