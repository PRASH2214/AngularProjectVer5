import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";

import { HospitalService } from "./../../../../services/hospital.service";

import { NotificationService } from './../../../../services/notification.service'
import { MasterService } from "src/app/services/master";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: "app-hospital",
  templateUrl: "./hospital.component.html",
  styleUrls: ["./hospital.component.scss"],
})
export class HospitalComponent implements OnInit {
  allhospitallst: any;


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
    private sv: HospitalService,
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

      this.allhospitallst = m.lstModel;
      if (this.allhospitallst != undefined) {
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
        this.sv.Delete(objdel.HospitalId).subscribe((m) => {

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
