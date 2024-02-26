import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from '../setting/setting.component';
import { UserComponent } from './user/user.component';
import { SellerComponent } from './seller/seller.component';

const routes: Routes = [
  {
    path: '', component: SettingComponent,
    children: [
      { path: 'user', component: UserComponent },
      { path: 'seller', component: SellerComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class LoginRoutingModule { }
