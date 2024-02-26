import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular16-EcommerceV2';

  private excludedUrls_navbar: Set<string> = new Set([
    '/login/seller',
    '/login/user'
  ]);
  shouldShowNavbar(): boolean {
    return !this.excludedUrls_navbar.has(window.location.pathname);
  }
}
