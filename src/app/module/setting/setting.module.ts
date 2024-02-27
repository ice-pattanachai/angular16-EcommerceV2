import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { CargoComponent } from './cargo/cargo.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountShopComponent } from './account-shop/account-shop.component';
import { AccountUserComponent } from './account-user/account-user.component';
import { UserPurchaseHistoryComponent } from './user-purchase-history/user-purchase-history.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ProductsForSaleComponent } from './products-for-sale/products-for-sale.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { EditProductsComponent } from './edit-products/edit-products.component';

@NgModule({
  declarations: [
    SettingComponent,
    SidebarComponent,
    CargoComponent,
    ReceiptComponent,
    AccountShopComponent,
    AccountUserComponent,
    UserPurchaseHistoryComponent,
    ManageOrdersComponent,
    ProductsForSaleComponent,
    AddProductsComponent,
    EditProductsComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingModule { }
