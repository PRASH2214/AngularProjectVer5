import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { SpecialityService } from "../../../../services/speciality.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { NotificationService } from '../../../../services/notification.service'
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-speciality',
  templateUrl: './speciality.component.html',
  styleUrls: ['./speciality.component.css']
})
export class SpecialityComponent implements OnInit {

  allspeciality: any;


  config: any = {
    "searchValue": "",
    "currentPage": 1,
    "skip": 0,
    "itemsPerPage": 0,
    "totalItems": 0,
    "status": 0
  }


  constructor(

    private nav: Router,
   
    private sv: SpecialityService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService



  ) { }



  
  ngOnInit(): void {
    this.config.itemsPerPage = this.master.TablepageSize[0];
    this.Refresh();
  }


  pageChanged(event) {
    this.config.currentPage = event;
    this.Refresh();

  }


  Refresh() {

    this.spinner.show();

    this.sv.GetAll(this.config).subscribe((m) => {

      this.allspeciality = m.lstModel;
      if (this.allspeciality != undefined) {
        this.spinner.hide();

        this.config.totalItems = m.lstModel[0].TotalItems;
      } else {
        this.spinner.hide();

        this.config.totalItems = 0;
      }

     
    }, err => {
      this.spinner.hide();
    });

  }



  ondelete(objdel) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover it!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.sv.Delete(objdel.SpecialityId).subscribe((m) => {
     
          if (m.success == true && m.status == 1) {

            Swal.fire(
              'Deleted!',
              'Your entry is deleted.',
              'success'
            )
            this.spinner.hide();

            this.Refresh();
          } else {
            this.spinner.hide();
            this.notifyService.showError(m.message, "")
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    }) 


  }


}
