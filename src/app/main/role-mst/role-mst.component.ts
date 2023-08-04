import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { WINDOW } from 'app/_helpers/window.provider';
import { Overlay } from '@angular/cdk/overlay';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { AuthenticationService } from '../../_services/authentication.service';
//import { FormGroup } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role_Mst } from './role-mst.model';
import { GlobalService } from 'app/_services/global.service';


@Component({
  selector: 'app-role',
  templateUrl: './role-mst.component.html',
  styleUrls: ['./role-mst.component.scss']
})
export class RoleMstComponent implements OnInit {
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
  fk_RoleGlCode = 0;
  chrActive: any;
  private _unsubscribeAll: Subject<any>;

  RoleForm: FormGroup;
  selectedIds = new Array();
  Role: Role_Mst[];
  countries: any;
  submitted = false;
  fk_PersonGlCode: any;
  vartheme: string;
  classname: string;
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
    // Configure the layout
    this.RoleForm = this._formBuilder.group({
      varSAPCode: ['', Validators.required],
      varRoleName: ['', Validators.required],
      fk_CountryGlCode: ['', Validators.required],
      chrActive: ['', Validators.required]
    });

    this.BindGrid();
    this.BindCountryList();

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
      this.loadRoleToEdit(e.row.data.intGlCode);
      e.event.preventDefault();
    }
  }

  allowDeleting(e) {
    if (e.row.data.intGlCode != null && e.row.data.intGlCode != 0) {
      if (confirm("Are you sure want to delete this record?")) {
        this.btnDelete_Click(e.row.data.intGlCode);
      }
      e.event.preventDefault();
    }
  }

  // selectionChangedHandler(e) {
  //   if (e.selectedRowKeys.length !== null) {
  //     this.selectedIds.push(e.selectedRowKeys);
  //   }
  // }


  get f() { return this.RoleForm.controls; }

  SetNewScreen() {
    this.submitted = false;
    this.RoleForm.reset();
    this.RoleForm.controls['fk_CountryGlCode'].setValue("");//set by default value 0
  }

  btnClear_Click(): void {
    this.SetNewScreen();
  }

  BindGrid(): void {
    this.authenticationService.GetRoleMst(0).then(
      data => {
        if (data.status[0].isValid) {
          this.Role = data.result;

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
  LB_Click(e) {
    this.loadRoleToEdit(e);
  }
  BindCountryList(): void {
    this.authenticationService.Role_GetCountryList().then(
      data => {
        if (data.status[0].isValid) {
          this.countries = data.result;

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
    if (this.RoleForm.invalid) {
      return;
    }

    this._fuseProgressBarService.setMode("indeterminate");
    this._fuseProgressBarService.showSpinner();
    if (this.f.chrActive.value === true || this.f.chrActive.value === "Y") {
      this.chrActive = "Y";
    }
    else {
      this.chrActive = "N";
    }
    this.authenticationService.InsertUpdateRoleMst(this.fk_RoleGlCode, this.f.varSAPCode.value, this.f.varRoleName.value, this.f.fk_CountryGlCode.value, this.fk_PersonGlCode, this.chrActive).then(res => {
      if (res && res.status[0].isValid) {
        alert('Data Save Successfuly');
        this.SetNewScreen();

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

  loadRoleToEdit(intGlCode: number) {

    this._fuseProgressBarService.setMode('indeterminate');
    this._fuseProgressBarService.showSpinner();
    this.authenticationService.GetRoleMst(intGlCode).then(
      data => {
        console.log(data);
        if (data.status[0].isValid) {
          this.fk_RoleGlCode = data.result[0].intGlCode;
          this.RoleForm.controls['varSAPCode'].setValue(data.result[0].varSAPCode);
          this.RoleForm.controls['varRoleName'].setValue(data.result[0].varRoleName);
          this.RoleForm.controls['fk_CountryGlCode'].setValue(data.result[0].fk_CountryGlCode);
          if (data.result[0].chrActive != "N") {
            this.RoleForm.controls['chrActive'].setValue(
              true
            );
          }
          else {
            this.RoleForm.controls['chrActive'].setValue(
              false
            );
          }
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
      .DeleteRoleMst(intGlCode, this.fk_PersonGlCode
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
