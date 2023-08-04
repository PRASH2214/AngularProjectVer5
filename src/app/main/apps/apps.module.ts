import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule, MatStepperModule, MatRadioModule, MatCheckboxModule, MatAutocompleteModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatDialogModule, MatToolbarModule, MatExpansionModule, MatDatepickerModule, MatProgressBarModule, MatListModule, MatMenuModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { DashboardComponent } from 'app/main/apps/dashboard/dashboard.component';
import { SalesComponent } from './sales/sales.component';
import { AuthGuard } from '../../_gaurd/auth.guard';
import { StockComponent } from './stock/stock.component';
import { AgeingComponent } from './ageing/ageing.component';
import { RetailerComponent } from './retailer/retailer.component';
import { ReportComponent } from './report/report.component';
import { AddCommentDialogComponent } from './report/add-comment-dialog/add-comment-dialog.component'
import { DialogDraggableTitleDirective } from '../../commonComponent/dialog-draggable-title.directive'
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SortGridPipe } from '../../commonComponent/sort.pipe';
import { MailComposeDialogComponent } from '../../commonComponent/dialogs/compose/compose.component';
import { ConfirmDialogComponent } from '../../commonComponent/dialogs/confirm-dialog/confirm-dialog.component';
import { ReportViewDialogComponent } from './report/report-view-dialog/report-view-dialog.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent, canActivate: [AuthGuard]
  },
  {
    path: 'sales',
    component: SalesComponent, canActivate: [AuthGuard]
  },
  {
    path: 'stock',
    component: StockComponent, canActivate: [AuthGuard]
  },
  {
    path: 'ageing',
    component: AgeingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'retailer',
    component: RetailerComponent, canActivate: [AuthGuard]
  },
  {
    path: 'report/:wsname/:vwname',
    component: ReportComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatSlideToggleModule, MatStepperModule, MatRadioModule, MatCheckboxModule, MatAutocompleteModule, MatDialogModule, MatToolbarModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatListModule,
    MatMenuModule,
    FuseSharedModule,
    FuseWidgetModule,
    CommonModule

  ],
  declarations: [
    DashboardComponent,
    SalesComponent,
    StockComponent,
    AgeingComponent,
    RetailerComponent,
    ReportComponent,
    AddCommentDialogComponent,
    DialogDraggableTitleDirective,
    SortGridPipe,
    MailComposeDialogComponent,
    ConfirmDialogComponent,
    ReportViewDialogComponent
  ],
  providers: [

  ],
  entryComponents: [
    AddCommentDialogComponent,
    MailComposeDialogComponent,
    ConfirmDialogComponent,ReportViewDialogComponent
  ]
})
export class appsModule { }
