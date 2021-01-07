import { DOCUMENT } from '@angular/common';
import { Component, OnInit, HostBinding, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { VistaloginService } from 'src/app/services/vistalogin.service';
/* import { AuthService2 } from '../../services/auth.service2'; */
import { NavbarService } from '../../services/navbar.service';

import { AuthService } from '@auth0/auth0-angular';
import { LoginService } from 'src/app/services/login.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isFixedNavbar;
  @HostBinding('class.navbar-opened') navbarOpened = false;
  id: any;
  verinicio: boolean = false;
  verperfil: boolean = false;
  active = 1;
  isInversionista: any;
  mostrarLogin: any = false;


  constructor(
    private ServicioLogin: VistaloginService,
    private router: Router,
    /* public authService: AuthService2,  */
    private nav: NavbarService,
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private loginS: LoginService,

  ) {
  }

  ngOnInit() {


    this.onCheckUser();
    this.redireccionar();

  }

  logOutAuth() {
    this.auth.logout({ returnTo: document.location.origin });
  }
  loginAuth0() {
    this.loginS.loginFuncion();
    /* this.auth.loginWithRedirect(); */
  }
  redireccionar() {


    if (!localStorage.getItem("redireccion")) {
      console.log("entro al creador");
      let redireccion: string = 'false';
      localStorage.setItem('redireccion', redireccion);
    }




    /*  setTimeout(() => {
       localStorage.setItem('redireccion', this.redireccion); 
      
       console.log('--');
     }, 2000);
    */

  }


  mostrarLoginFuncion() {
    /* OBSERVABLE */
    this.ServicioLogin.vistaLogin$.subscribe(valor => {
      this.mostrarLogin = valor;
    });

    if (this.mostrarLogin) {
      this.mostrarLogin = false;
      this.ServicioLogin.vistaLogin$.emit(false);

    } else {
      this.mostrarLogin = true;
      this.ServicioLogin.vistaLogin$.emit(true);
    }
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (offset > 10) {
      this.isFixedNavbar = true;
    } else {
      this.isFixedNavbar = false;
    }
  }

  irMiPerfil() {
    this.router.navigate([`/user/profile/${localStorage.getItem('idusu')}`])
  }

  toggleNavbar() {
    this.navbarOpened = !this.navbarOpened;
  }


  onLogout() {
    /*  this.authService.logout(); */
    this.verperfil = false;
    this.verinicio = true

  }

  onCheckUser() {
    if (localStorage.getItem('isInversionista') != null) {
      this.isInversionista = JSON.parse(localStorage.getItem('isInversionista'));
      this.verinicio = false;
      this.verperfil = true;
    }
    else {
      this.verinicio = true;
      this.verperfil = false;

    }
  }

}
