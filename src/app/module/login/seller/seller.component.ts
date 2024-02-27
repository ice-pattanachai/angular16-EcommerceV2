import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent {

  username: string = '';
  password_hash: string = '';
  name: string = '';
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  errorMessages: any;

  images: string[] = [
    "../../../../../assets/images/login.png",
  ];

  isSignIn: boolean = true;
  toggleSignIn() {
    this.isSignIn = !this.isSignIn;
  }

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
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
              this.router.navigate(['/login/seller']);
            }
          },);
      }
    } else {
      localStorage.clear()
      this.router.navigate(['/login/seller']);
    }
  }

  onClickSubmitLogin() {
    this.authService.login_seller(this.username, this.password_hash).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        if (data.token) {
          this.storageService.saveToken(data.token);
          this.router.navigate(['/index']);
          console.log('Log', data);

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
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.message || 'Login failed',
          showConfirmButton: false,
          timer: 1000,
        });
        this.isLoginFailed = true;
        console.log(err.error.message);
      }
    });
  }


  onClickSubmitRegister() {
    this.authService.register_seller(this.username, this.password_hash, this.name).subscribe({
      next: data => {
        console.log('⚡⚡⚡', data);

        this.storageService.registerUser(data);
        this.reloadPage();
        Swal.fire({
          icon: 'success',
          title: 'register Success',
          text: 'register Success',
           showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
