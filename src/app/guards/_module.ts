
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";





import { UnsernameOnlyDirective } from '../guards/username-only.directive';


import { IgnorespecialcharDirective } from '../guards/no_special_character.directive';
import { NumberDirective } from '../guards/numbers-only.directive';


import { IgnoredosagespecialcharDirective } from '../guards/no_special_dosage_character.directive';

@NgModule({
  declarations: [UnsernameOnlyDirective,IgnorespecialcharDirective,NumberDirective,IgnoredosagespecialcharDirective],
  exports:[UnsernameOnlyDirective,IgnorespecialcharDirective,NumberDirective,IgnoredosagespecialcharDirective]
 })
 export class MyCommonModule{}