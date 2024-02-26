import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { ProductComponent } from './components/product/product.component';
import { IndexComponent } from './path/index/index.component';
import { HttpClientModule } from '@angular/common/http';
import { DetailedComponent } from './path/detailed/detailed.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BackToTopComponent,
    ProductComponent,
    IndexComponent,
    DetailedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }
