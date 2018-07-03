import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isAuthanticated = false;
  private token: string;
  public userPost: [string];
  public userType: string;
  private userId: string;
  // used to weather user authanticated or not, to change ui headers etc...
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
  }
  getIsAuth() {
    return this.isAuthanticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, type: string) {
    const authData: AuthData = { email: email, password: password, userType: type };
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => {
      this.router.navigate(['/login']);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, userType: null };
    this.http.post<{token: string, userType: string, userId: string}>('http://localhost:3000/api/user/login', authData)
    .subscribe(response => {
      // with the response we send a token in, user.js, so we can use it here
      const token = response.token;
      const userId = response.userId;
      const userType = response.userType;
      this.userType = userType;
      this.userId = userId;
      this.token = token;

      if ( token ) {
        this.isAuthanticated = true;
        this.userType = userType;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }

    });
  }

  logout() {
    this.token = null;
    this.isAuthanticated = false;
    this.authStatusListener.next(false);
    this.userType = null;
    this.router.navigate(['/']);
  }
}
