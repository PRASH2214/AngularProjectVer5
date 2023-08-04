//custom-material.module.ts

import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        MatButtonModule,
        MatDatepickerModule,
        MatRadioModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatMomentDateModule,
        MatSelectModule
    ],
    exports: [
        MatButtonModule,
        MatDatepickerModule,
        MatRadioModule,
        MatDialogModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule
    ]
})
export class CustomMaterialModule { }