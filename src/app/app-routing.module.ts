import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminlayoutComponent } from "./layout/adminlayout/adminlayout.component";
import { DoctorlayoutComponent } from "./layout/doctorlayout/doctorlayout.component";
import { PatientlayoutComponent } from "./layout/paitentlayout/paitentlayout.component";

import { MRlayoutComponent } from "./layout/mrlayout/mrlayout.component";
import { PublicComponent } from "./layout/public/public.component";
import { SuperAdminlayoutComponent } from "./layout/superadminlayout/superadminlayout.component";
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [

  {
    path: "",
    component: PublicComponent,
    loadChildren: () => import('./components/public/_module').then((m) => m.PublicModule),
  },

  {
    path: "admin",
    component: AdminlayoutComponent, canActivate: [AuthGuard],
    loadChildren: () => import('./components/admin/_module').then((m) => m.AdminModule),
  },
  {
    path: "doctor",
    component: DoctorlayoutComponent, canActivate: [AuthGuard],
    loadChildren: () => import('./components/doctor/_module').then((m) => m.DoctorModule),
  },
  {
    path: "patient",
    component: PatientlayoutComponent, canActivate: [AuthGuard],
    loadChildren: () => import('./components/patient/_module').then((m) => m.PatientModule),
  },
  {
    path: "mr",
    component: MRlayoutComponent, canActivate: [AuthGuard],
    loadChildren: () => import('./components/mr/_module').then((m) => m.MRModule),
  },
  {
    path: "control",
    component: SuperAdminlayoutComponent, canActivate: [AuthGuard],
    loadChildren: () => import('./components/superadmin/_module').then((m) => m.SuperAdminModule),
  }
  ,
  {
    path: "report",
    component: AdminlayoutComponent, canActivate: [AuthGuard],
    loadChildren: () => import('./components/report/_module').then((m) => m.ReportModule),
  },
  {
    path: "doctorreport",
    component: DoctorlayoutComponent, canActivate: [AuthGuard],
    loadChildren: () => import('./components/report/_module').then((m) => m.ReportModule),
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
