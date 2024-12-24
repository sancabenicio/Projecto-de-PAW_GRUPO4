import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import {User} from '../model/User'


const endpoint = 'http://localhost:3000/users/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

export interface AuthRestModelResponse {
  token: string;
}

export class LoginModel {
  constructor(public name: string, public email: string, public password: string) {}
}

export class PasswordResetModel {
  constructor(public email: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  buildUserForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        this.validateEmailDomain
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
      ]),
    });
  }

  validateEmailDomain(control: FormControl): { [key: string]: any } | null {
    const email: string = control.value;
    if (email && email.indexOf('@') !== -1) {
      const parts: string[] = email.split('@');
      const domain: string = parts[1];

      if (parts.length !== 2 || domain.length < 3) {
        return { invalidEmail: true };
      }

      const lastDotIndex: number = domain.lastIndexOf('.');
      const domainExtension: string = domain.substring(lastDotIndex + 1);
      if (domainExtension.length < 2) {
        return { invalidEmail: true };
      }
    } else {
      return { invalidEmail: true };
    }

    return null;
  }

  login(email: string, password: string): Observable<AuthRestModelResponse> {
    const loginModel: LoginModel = new LoginModel('', email, password);
    return this.http.post<AuthRestModelResponse>(
      endpoint + 'loginCliente',
      loginModel,
      httpOptions
    ).pipe(
      tap((response: AuthRestModelResponse) => {
        // Armazene o token no localStorage ou em cookies
        localStorage.setItem('token', response.token);
      })
    );
  }
  

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  addAuthorizationHeader(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  

  getAuthenticatedUser(): Observable<User> {
    return this.http.get<User>(`${endpoint}profile`, {
      headers: this.addAuthorizationHeader()
    });
  }
  
  

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<AuthRestModelResponse> {
    const user = {
      name: name,
      email: email,
      password: password,
      role: 'CLIENTE',
    };
    return this.http.post<AuthRestModelResponse>(
      endpoint + 'registerCliente',
      user,
      httpOptions
    );
  }

  recuperarSenha(email: string): Observable<any> {
    const passwordResetModel: PasswordResetModel = new PasswordResetModel(email);
    return this.http.post<any>(endpoint + 'recuperarSenha', passwordResetModel, httpOptions);
  }
  


 
}
