import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { takeUntil, filter, ignoreElements } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { WINDOW } from 'app/_helpers/window.provider';
import { Overlay } from '@angular/cdk/overlay';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { person } from './person-mst.model';
import { GlobalService } from 'app/_services/global.service';

@Component({
  selector: 'app-person-mst',
  templateUrl: './person-mst.component.html',
  styleUrls: ['./person-mst.component.scss']
})
export class PersonMstComponent implements OnInit {
  message: any;
  selectedYear: any;
  selectedCurrency: any;
  tableauViz: any;
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

  Person: person[];
  PersonForm: FormGroup;
  fk_PersonGlCode = 0;
  massage = null;
  selectedAll: any;
  config: any;
  toggle = false;
  chrActive: any;
  submitted = false;
  countries: any;
  Primarycountries: any;
  Roles: any;
  varMappedCountry = Array();
  varMappedRole = Array();
  vartheme: string;
  classname: string;

  constructor(private fuseNavigationService: FuseNavigationService,
    private route: ActivatedRoute,
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
          this.currentNavigation = this.fuseNavigationService.getCurrentActiveNavigation(
            this.navigation,
            this.urlRoute
          );
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
    this.PersonForm = this._formBuilder.group({
      varUserCode: ['', Validators.required],
      varUserName: ['', Validators.required],
      varEmail: ['', Validators.required],
      varMobile: ['', Validators.required],
      varDesignation: ['', Validators.required],
      chrActive: ['', Validators.required],
      fk_CountryGlCode: ['', Validators.required],
      varUserCode_Ref1: ['', Validators.required]
    });

    this.GetList();
    this.BindCountryList();
    this.BindRoleList();
    this.fuseNavigationService.onNavigationChanged
      .pipe(
        filter(value => value !== null),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.urlRoute = this.router.url;
        this.navigation = this.fuseNavigationService.getCurrentNavigation();
        this.currentNavigation = this.fuseNavigationService.getCurrentActiveNavigation(
          this.navigation,
          this.urlRoute
        );
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
      this.loadPersonToEdit(e.row.data.intGlCode);
      e.event.preventDefault();
    }
  }
  LB_Click(e) {
    this.loadPersonToEdit(e);
  }
  allowDeleting(e) {
    if (e.row.data.intGlCode != null && e.row.data.intGlCode != 0) {
      if (confirm("Are you sure want to delete this record?")) {
        this.btnDelete_Click(e.row.data.intGlCode);
      }
      e.event.preventDefault();
    }
  }

  get f() {
    return this.PersonForm.controls;
  }


  SetNewScreen() {
    this.submitted = false;
    this.PersonForm.reset();
    for (var i = 0; i < this.countries.length; i++) {
      this.countries[i].checked = false;
    }
    for (var i = 0; i < this.Roles.length; i++) {
      this.Roles[i].checked = false;
    }
    this.PersonForm.controls['fk_CountryGlCode'].setValue('');
    this.Roles.forEach(element => {
      element.checked = false;
    });

  }

  btnClear_Click(): void {
    this.submitted = false;
    this.SetNewScreen();
  }

  GetList(): void {
    this.authenticationService.GetPersonMst(0).then(
      data => {
        if (data.status[0].isValid) {
          this.Person = data.result;

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

  BindCountryList(): void {
    this.authenticationService.Role_GetCountryList().then(
      data => {
        if (data.status[0].isValid) {
          this.countries = data.result;
          this.Primarycountries = data.result;

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
          this.Roles = data.result;

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
    if (this.PersonForm.invalid) {
      return;
    }

    this._fuseProgressBarService.setMode('indeterminate');
    this._fuseProgressBarService.showSpinner();
    if (this.f.chrActive.value === true || this.f.chrActive.value === "Y") {
      this.chrActive = "Y";
    }
    else {
      this.chrActive = "N";
    }
    for (var i = 0; i < this.Roles.length; i++) {
      if (this.Roles[i].checked === true) {
        this.varMappedRole.push(this.Roles[i].intGlCode);
      }
    }
    for (var i = 0; i < this.countries.length; i++) {
      if (this.countries[i].checked === true) {
        this.varMappedCountry.push(this.countries[i].intGlCode);
      }
    }

    this.authenticationService
      .InsertUpdatePersonMst(
        this.fk_PersonGlCode,
        this.f.varUserCode.value,
        this.f.varUserName.value,
        this.f.varEmail.value,
        this.f.varMobile.value,
        this.f.varDesignation.value,
        '48-D0-DD-AF-DD-3D-AC-8F-89-0B-8F-64-FB-E2-A4-AE',
        this.chrActive, this.f.fk_CountryGlCode.value,
        this.f.varUserCode_Ref1.value,
        this.varMappedCountry.toString(), this.varMappedRole.toString(), "1"
      )
      .then(
        res => {
          if (res && res.status[0].isValid) {
            alert('Data Save Successfuly');

            this._fuseProgressBarService.hideSpinner();
            this.GetList();
            this.SetNewScreen();
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

  loadPersonToEdit(intGlCode: number) {
    this._fuseProgressBarService.setMode('indeterminate');
    this._fuseProgressBarService.showSpinner();
    this.authenticationService.GetPersonMst(intGlCode).then(
      data => {
        console.log(data);
        if (data.status[0].isValid) {
          this.fk_PersonGlCode = data.result[0].intGlCode;
          this.PersonForm.controls['varUserCode'].setValue(data.result[0].varUserCode);
          this.PersonForm.controls['varUserName'].setValue(
            data.result[0].varUserName
          );
          this.PersonForm.controls['varEmail'].setValue(
            data.result[0].varEmail
          );
          this.PersonForm.controls['varMobile'
          ].setValue(data.result[0].varMobile);
          this.PersonForm.controls['varDesignation'].setValue(
            data.result[0].varDesignation
          );
          if (data.result[0].chrActive !== "N" && data.result[0].chrActive !== "No") {
            this.PersonForm.controls['chrActive'].setValue(
              true
            );
          }
          else {
            this.PersonForm.controls['chrActive'].setValue(
              false
            );
          }
          this.PersonForm.controls['fk_CountryGlCode'].setValue(
            data.result[0].fk_CountryGlCode
          );

          this.PersonForm.controls['varUserCode_Ref1'].setValue(
            data.result[0].varUserCode_Ref1
          );

          this.updateCheckedOptions_Country(data.result[0].varMappedCountry);
          this.updateCheckedOptions_Role(data.result[0].varMappedRole);


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

  // btnDelete_Click(): void {
  btnDelete_Click(intGlCode: number) {
    this._fuseProgressBarService.setMode('indeterminate');
    this._fuseProgressBarService.showSpinner();
    this.authenticationService
      .DeleteCountryMst(
        intGlCode, 1
      )
      .then(
        res => {
          if (res && res.status[0].isValid) {
            alert('Data Deleted Successfuly');
            this._fuseProgressBarService.hideSpinner();
            this.GetList();
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  onPersonCountryChange(event, country_Person) {

    if (event.checked) {

      for (var i = 0; i < this.countries.length; i++) {
        if (parseInt(country_Person.intGlCode) === parseInt(this.countries[i].intGlCode)) {
          this.countries[i].checked = true;
        }
      }
    } else {

      for (var i = 0; i < this.countries.length; i++) {
        if (parseInt(country_Person.intGlCode) === parseInt(this.countries[i].intGlCode)) {
          this.countries[i].checked = false;
        }
      }
    }


  }

  onPersonRoleChange(event, Role) {
    if (event.checked) {
      this.varMappedRole.push(Role.intGlCode);
      for (var i = 0; i < this.Roles.length; i++) {
        if (parseInt(Role.intGlCode) === parseInt(this.Roles[i].intGlCode)) {
          this.Roles[i].checked = true;
        }
      }
    } else {
      this.varMappedRole.splice(this.varMappedRole.indexOf(Role.intGlCode), 1)
      for (var i = 0; i < this.Roles.length; i++) {
        if (parseInt(Role.intGlCode) === parseInt(this.Roles[i].intGlCode)) {
          this.Roles[i].checked = false;
        }
      }
    }

  }

  updateCheckedOptions_Country(intGlCode) {
    if (intGlCode !== null) {
      var CountryID = new Array();
      CountryID = intGlCode.split(',');
      for (var i = 0; i < this.countries.length; i++) {
        this.countries[i].checked = false;

      }

      for (var x = 0; x < CountryID.length; x++) {
        for (var i = 0; i < this.countries.length; i++) {
          if (parseInt(CountryID[x]) === parseInt(this.countries[i].intGlCode)) {
            this.countries[i].checked = true;

          }
        }
      }
    }
  }

  updateCheckedOptions_Role(intGlCode) {
    if (intGlCode !== null) {
      var RoleID = new Array();
      RoleID = intGlCode.split(',');
      for (var i = 0; i < this.Roles.length; i++) {
        this.Roles[i].checked = false;
      }
      for (var x = 0; x < RoleID.length; x++) {
        for (var i = 0; i < this.Roles.length; i++) {
          if (parseInt(RoleID[x]) === parseInt(this.Roles[i].intGlCode)) {
            this.Roles[i].checked = true;

          }
        }
      }
    }
  }

}
