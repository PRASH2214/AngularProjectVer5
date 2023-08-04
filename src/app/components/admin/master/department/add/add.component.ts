import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from "../../../../../services/common.service";

import { DepartmentService } from "../../../../../services/department.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "src/app/services/master";

import { Router } from '@angular/router';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class DepartmentAddComponent implements OnInit {
  submitted = false;
  allhospitallst: any;

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  allbrachlst: any;


  userForm = new FormGroup({
    HospitalId: new FormControl('', Validators.required),
    BranchId: new FormControl('', Validators.required),
    DepartmentName: new FormControl('', Validators.required),
    DepartmentContactMobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
    HospitalDepartmentLink: new FormControl('', [Validators.required, Validators.pattern(this.reg)]),
    Status: new FormControl(true, Validators.required),
    Amount: new FormControl(0, Validators.required),

  })
  constructor(

    private nav: Router,
    private commonsv: CommonService,
    private sv: DepartmentService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }




  ngOnInit() {

    this.commonsv.getactivehospitals().subscribe((m) => {

      this.allhospitallst = m.lstModel;

    });


  }



  get f() { return this.userForm.controls; }

  Save() {

    this.submitted = true;


    //   const controls = this.userForm.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {

    //  }
    // }

    if (this.userForm.valid) {
      let data = this.userForm.value;
      this.spinner.show();
      data.HospitalId = parseInt(data.HospitalId);
      data.BranchId = parseInt(data.BranchId);
      data.Amount = parseFloat(data.Amount);

      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }

      this.sv.Save(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.notifyService.showSuccess("Add successfully", "");
          this.spinner.hide();
          this.nav.navigateByUrl('/admin/department');
        } else {
          this.spinner.hide();
          this.notifyService.showError(m.message, "")
        }
      }, err => {
        this.spinner.hide();
        this.notifyService.showError("something went wrong", "")

      })
    }

  }

  onHospitalSelected(value: string) {

    this.allbrachlst = [];
    if (value != "" && value != undefined) {
      this.commonsv.getbranchbyhospital(value).subscribe((m) => {

        this.allbrachlst = m.lstModel;
      });
    } else {
      this.allbrachlst = [];
    }

  }

  avoidspecialchar(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

}
