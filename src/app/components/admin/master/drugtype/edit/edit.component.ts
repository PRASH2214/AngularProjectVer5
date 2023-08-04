import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DrugTypeService } from "../../../../../services/drugtype.service";

import { NotificationService } from '../../../../../services/notification.service'
import { MasterService } from "../../../../../services/master";

import { NgxSpinnerService } from "ngx-spinner";

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class DrugTypeEditComponent implements OnInit {

  submitted = false;


  allhospitallst: any;


  alldistrictlst: any;
  allcitylst: any[];
  allstatelst: any;

  DrugTypeForm = new FormGroup({

    DrugTypeId: new FormControl('', Validators.required),
    Name: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    Status: new FormControl(true, Validators.required)


  })
  DrugTypeinfo: any;
  constructor(

    private nav: Router,
    private sv: DrugTypeService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService
,
    public _route: ActivatedRoute


  ) { }

  ngOnInit() {



    this._route.params.subscribe(



      params => {

        this.spinner.show();

        this.sv.GetById(params["id"]).subscribe((m) => {
          this.DrugTypeinfo = m.model;
          this.spinner.hide();

          Object.getOwnPropertyNames(this.DrugTypeinfo).forEach((key) => {
            if (this.DrugTypeForm.contains(key)) {
              this.DrugTypeForm.controls[key].setValue(m.model[key]);




            }
          })
        });

      })
  }



  get f() { return this.DrugTypeForm.controls; }

  Save() {

    this.submitted = true;

    this.spinner.show();


    if (this.DrugTypeForm.valid) {
      let data = this.DrugTypeForm.value;
      data.DrugTypeId = parseInt(data.DrugTypeId);
      if (data.Status == true) {
        data.Status = 1;
      }
      else {
        data.Status = 0;
      }

      this.sv.Update(data).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          this.spinner.hide();

          this.notifyService.showSuccess("Update successfully", "");

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
