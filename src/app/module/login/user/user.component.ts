import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isSignIn: boolean = true;
  username: string = '';
  password_hash: string = '';
  mail: string = '';
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  errorMessages: any;

  images: string[] = [
    "../../../../../assets/images/login.png",
  ];

  toggleSignIn() {
    this.isSignIn = !this.isSignIn;
  }

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData != null && userData != undefined) {
      const userObject = JSON.parse(userData);
      const token = userObject.token;
      if (token != null) {
        this.authService.authenticateToken(token)
          .subscribe((response: any) => {
            const status = response.status;
            if (status == 200) {
              this.router.navigate(['/index']);
            } else {
              localStorage.clear()
              this.router.navigate(['/login/user']);
            }
          },);
      }
    } else {
      localStorage.clear()
      this.router.navigate(['/login/user']);
    }
  }
  onClickSubmitLogin() {
    this.authService.login_user(this.username, this.password_hash).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        if (data.token) {
          this.storageService.saveToken(data.token);
          this.router.navigate(['/index']);
          Swal.fire({
            icon: 'success',
            title: 'Login Success',
            text: 'Login Success',
            showConfirmButton: false,
            timer: 1000,
          });
        }
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
      },
      // error: err => {
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Error',
      //     text: err.error.message || 'Login failed',
      //   });
      //   this.isLoginFailed = true;
      //   console.log(err.error.message);
      // }
    });
  }

  onClickSubmitRegister() {
    this.authService.register_user(this.username, this.password_hash, this.mail).subscribe({
      next: data => {
        this.storageService.registerUser(data);
        this.reloadPage();
        Swal.fire({
          icon: 'success',
          title: 'register Success',
          text: 'register Success',
        });
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

}
