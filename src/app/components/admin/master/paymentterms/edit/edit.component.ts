import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',

})
export class HospitalEditComponent implements OnInit {

  constructor(

    private nav: Router,
    private _route: ActivatedRoute,
    //private modalService: NgbModal,

  ) { }

  ngOnInit() {




  }

}
