import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './path/index/index.component';
import { DetailedComponent } from './path/detailed/detailed.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'product/:id', component: DetailedComponent },
  {
    path: 'setting',
    loadChildren: () =>
      import('./module/setting/setting.module').then((x) => x.SettingModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./module/login/login.module').then((x) => x.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
