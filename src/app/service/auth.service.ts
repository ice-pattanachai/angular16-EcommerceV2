import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environment/environment';
import { User } from '../modelsType/data-type';

const AUTH_API = `${environment.apiUrl}`;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userAuthReload() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) { }

  login_seller(username: string, password_hash: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'login_seller',
      {
        username,
        password_hash,
      },
      httpOptions
    );
  }

  register_seller(username: string, password_hash: string, name: string,): Observable<any> {
    return this.http.post(
      AUTH_API + 'register_seller',
      {
        username,
        password_hash,
        name,
      },
      httpOptions
    );
  }

  login_user(username: string, password_hash: string): Observable<any> {
    console.log("🚀 ~ AuthService ~ login_user ~ AUTH_API:", `${AUTH_API}`)
    return this.http.post(
      AUTH_API + 'login_user',
      {
        username,
        password_hash,
      },
      httpOptions
    );
  }

  register_user(username: string, password_hash: string, mail: string,): Observable<any> {
    return this.http.post(
      AUTH_API + 'register_user',
      {
        username,
        password_hash,
        mail,
      },
      httpOptions
    );
  }

  userList(id: any): Observable<User[]> {
    const body = { id: id };
    const data = this.http.post<User[]>(AUTH_API + 'user_id', body)
    return data;
  }

  sellerList(id: any): Observable<User[]> {
    const body = { id: id };
    const data = this.http.post<User[]>(AUTH_API + 'seller_id', body)
    return data;
  }

  edit_User(
    id: number, mail: string, name: string, fullname: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'edit_user',
      {
        id,
        mail,
        name,
        fullname
      },
      httpOptions

    );
  }
  edit_User_Password(
    id: number, password_hash: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'edit_user',
      {
        id,
        password_hash,
      },
      httpOptions

    );
  }

  edit_seller(
    id: number, name: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'edit_seller',
      {
        id,
        name,
      },
      httpOptions

    );
  }

  edit_seller_Password(
    id: number, password_hash: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'edit_seller',
      {
        id,
        password_hash,
      },
      httpOptions

    );
  }
  checkPasswordUser(id: number, password_hash: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'check_password/user',
      { id, password_hash },
      httpOptions
    );
  }

  checkPasswordSeller(id: number, password_hash: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'check_password/seller',
      { id, password_hash },
      httpOptions
    );
  }

  add_Assresses(
    fullname: string, address: string, postalcode: number, phone: string, user_id: number
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'assresses_user/add',
      {
        fullname,
        address,
        postalcode,
        phone,
        user_id,
      },
      httpOptions
    );
  }

  edit_Assresses(
    id: number, fullname: string, address: string, postalcode: number, phone: string, user_id: number
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'assresses_user/edit',
      {
        id,
        fullname,
        address,
        postalcode,
        phone,
        user_id,
      },
      httpOptions
    );
  }

  delete_Assresses(id: number): Observable<any> {
    return this.http.post(
      AUTH_API + 'assresses_user/delete',
      {
        id,
      },
      httpOptions
    );
  }


  authenticateToken(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post<any>(AUTH_API + 'authen ', {}, { headers })
      .pipe(
        map((response) => response),
        catchError((error) => throwError(error))
      );
  }

  removeItem() {
    localStorage.removeItem('user');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('AddToCart');
  }

  // userAuthReload() {
  //   if (localStorage.getItem('user')) {
  //     this.router.navigate(['/']);
  //   }
  // }

  // sellerProders() {
  //   if (localStorage.getItem('user')) {
  //     this.router.navigate(['/']);
  //   }
  // }
}