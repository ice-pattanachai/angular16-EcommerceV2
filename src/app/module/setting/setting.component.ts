import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {

  constructor(private router: Router) { }

  private excludedUrls_sidebar: Set<string> = new Set(
    [
      '/setting',
      '/setting/account',
      '/setting/cargo',
      '/setting/receipt',
      '/setting/account-shop',
      '/setting/account',
      '/setting/history',
      '/setting/manage_porders',
      '/setting/all'
    ]
  );

  shouldShowSidebar(): boolean {
    return this.excludedUrls_sidebar.has(window.location.pathname);
  }

}
