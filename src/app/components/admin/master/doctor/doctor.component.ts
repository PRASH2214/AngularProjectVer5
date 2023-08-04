import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DoctorService } from "../../../../services/doctor.service";
import { NotificationService } from './../../../../services/notification.service'
import { Router } from '@angular/router';
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: "app-doctor",
  templateUrl: "./doctor.component.html",
  styleUrls: ["./doctor.component.scss"],
})
export class DoctorComponent implements OnInit {



  constructor(

    private nav: Router,
    private sv: DoctorService,
    public master: MasterService,
    public notifyService: NotificationService, private spinner: NgxSpinnerService


  ) { }



  alldoclst: any;


  config: any = {
    "searchValue": "",
    "currentPage": 1,
    "skip": 0,
    "itemsPerPage": 0,
    "totalItems": 0,
    "status": 0
  }






  ngOnInit(): void {
    this.config.itemsPerPage = this.master.TablepageSize[0];
    this.Refresh();
  }


  pageChanged(event) {
    this.config.currentPage = event;
    this.Refresh();

  }


  Refresh() {
    this.sv.GetAll(this.config).subscribe((m) => {

      this.alldoclst = m.lstModel;

      if (this.alldoclst != undefined) {
        this.config.totalItems = m.lstModel[0].TotalItems;
      } else {
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
        this.sv.Delete(objdel.DoctorId).subscribe((m) => {
        
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
