import { Component, OnInit } from '@angular/core';
import {  FormGroup,FormControl,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-masterupload',
  templateUrl: './masterupload.component.html',
  styleUrls: ['./masterupload.component.scss']
})
export class MasteruploadComponent implements OnInit {
  form: FormGroup;
  favoriteSeason: string;
  masterType = [
    'Upload',
    'Download'
  ];
  masters = [
    'Product Master',
    'Batch Master',
    'Employee Master',
    'Employee Role Mapping',
    'State Master',
    'City Master',
    'Plant Master',
    'Employee with Plant Mapping',
    'Packing Line Master'
  ];
  
  constructor(fb: FormBuilder) { 
    this.form = fb.group({
      masterType: 'auto',
      masters: 'auto',
    });
  }

  ngOnInit() {
  }

  

}
