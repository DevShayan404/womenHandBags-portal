import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { MasterComponent } from './master.component';
import { NgZorroModule } from '../shared-modules/ng-zorro/ng-zorro.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    CategoryComponent,
    ProductComponent,
    MasterComponent,
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    NgZorroModule,
    ReactiveFormsModule,
  ],
})
export class MasterModule {}
