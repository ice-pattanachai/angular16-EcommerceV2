import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { CargoComponent } from './cargo/cargo.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { AccountUserComponent } from './account-user/account-user.component';
import { AccountShopComponent } from './account-shop/account-shop.component';
import { UserPurchaseHistoryComponent } from './user-purchase-history/user-purchase-history.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ProductsForSaleComponent } from './products-for-sale/products-for-sale.component';

const routes: Routes = [
  {
    path: '', component: SettingComponent,
    children: [
      { path: 'account', component: AccountUserComponent },
      { path: 'account-shop', component: AccountShopComponent },
      { path: 'cargo', component: CargoComponent },
      { path: 'receipt', component: ReceiptComponent },
      { path: 'history', component: UserPurchaseHistoryComponent },
      { path: 'manage_porders', component: ManageOrdersComponent },
      { path: 'all', component: ProductsForSaleComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})

export class SettingRoutingModule { }
