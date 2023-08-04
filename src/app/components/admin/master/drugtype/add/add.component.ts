import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { DrugTypeService } from "../../../../../services/drugtype.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "../../../../../services/master";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class DrugTypeAddComponent implements OnInit {
  submitted = false;


  allhospitallst: any;


  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  DrugTypeForm = new FormGroup({


    Name: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required)


  })
  constructor(

    private nav: Router,
    private sv: DrugTypeService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }

  ngOnInit() {


  }



  get f() { return this.DrugTypeForm.controls; }

  Save() {

    this.submitted = true;


    //   const controls = this.userForm.controls;
    // for (const name in controls) {
    //  if (controls[name].invalid) {

    //  }
    // }

    if (this.DrugTypeForm.valid) {
      this.spinner.show();

      let data = this.DrugTypeForm.value;

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

          this.nav.navigateByUrl('/admin/drugtype');
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





}
