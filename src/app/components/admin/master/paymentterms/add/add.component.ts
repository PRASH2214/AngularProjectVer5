import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',

})
export class HospitalAddComponent implements OnInit {
  submitted = false;


  constructor(
    
    private nav: Router,



  ) { }

  ngOnInit() {

  
  }



}
