import { Component, signal } from '@angular/core';
import { LoginForm } from './component/login-form/login-form';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [LoginForm, NgOptimizedImage],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  isLogin = signal<boolean>(true);
  authType = signal<string>('');

  toggleIsLogin(type: string) {
    this.authType.set(type);
    this.isLogin.set(!this.isLogin());
  }
  toggleIsRegister(type: string) {
    this.authType.set(type);
    this.isLogin.set(!this.isLogin());
  }
}
