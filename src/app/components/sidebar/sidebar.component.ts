import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/modelsType/data-type';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isLoggedIn = false;
  menuType = ''
  userall: User[] | undefined;
  sellerall: User[] | undefined;
  user: any;
  listMenu: any[] = []

  activeButtonIndex: number = -1;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
  ) {
  }

  // ฟังก์ชันสำหรับการกดปุ่ม
  buttonClicked(index: number) {
    this.activeButtonIndex = index; // กำหนดค่าของ activeButtonIndex เมื่อปุ่มถูกคลิก
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth-token');
    if (token != null && token != undefined) {
      const loginSubscr = this.authService.authenticateToken(token).subscribe((response: any) => {
        if (response.status === 200) {
          const decoded = response.decoded;
          if (decoded && decoded.roles !== undefined) {
            const roles = decoded.roles;
            let listMenu: any[] = []
            if (typeof roles == 'string') {
              const roleParts = roles.split('|');
              const firstRole = roleParts[0];
              if (firstRole === 'seller') {
                this.menuType = 'seller';
              } else if (firstRole === 'user') {
                this.menuType = 'user';
              } else {
                this.router.navigate(['/login/user']);
              }
            }
          }
          this.isLoggedIn = true;


          // const decoded = response.decoded;
          const userId = decoded.userId

          const classUser = decoded.class
          if (classUser == "user") {
            if (userId != null && userId != undefined) {
              this.authService.userList(userId).subscribe((userData) => {
                if (Array.isArray(userData)) {
                  this.userall = userData;
                } else {
                  this.userall = [userData];
                }
              });
            }
          } else if (classUser == "seller") {
            if (userId != null && userId != undefined) {
              this.authService.sellerList(userId).subscribe((userData) => {
                if (Array.isArray(userData)) {
                  this.sellerall = userData;
                } else {
                  this.sellerall = [userData];
                }
              });
            }
          } else {
            this.router.navigate(['/index'])
          }
        }
      });


    } else if (token == null || token == undefined) {
      this.router.navigate(['/index'])
    }
  }

  logoutSwal() {
    Swal.fire({
      title: 'Do you want to log out?',
      text: "To log out, press Yes. If you don't want to, press Cancel.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'cancel!',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Log out successful.',
          text: 'successful!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          this.logout();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/index'])
    window.location.reload();
  }

  navigateToPassword() {
    this.router.navigate(['/setting/account']);
  }
}
