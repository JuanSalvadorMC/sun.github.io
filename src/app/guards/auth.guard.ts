import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(){
    if (localStorage.getItem('SCtoken') ){
      console.log('si hay permiso');
      return true;
    }
    else{
      this.router.navigate(['/home'])
      return false;
    }
  }
}
