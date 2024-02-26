import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

const USER_KEY = 'user';
const TOKEN_KEY = 'auth-token';
const seller = 'seller'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private router: Router) { }

  clean(): void {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }

  public saveUser(user: any): void {
    if (user.status && user.status.toLowerCase() === 'error') {
      // Handle error case, do not setItem
      console.error('Login failed:', user.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: user.message || 'Login failed',
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      // SetItem only if the response is not an error
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }
  public registerUser(user: any): void {
    if (user.status && user.status.toLowerCase() === 'error') {
      console.error('Login failed:', user.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: user.message || 'Register failed',
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      this.router.navigate(['/user-login'])
    }
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }


}
