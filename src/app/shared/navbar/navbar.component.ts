import { DOCUMENT } from '@angular/common';
import { Component, OnInit, HostBinding, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VistaloginService } from 'src/app/services/vistalogin.service';
 import { AuthService2 } from '../../services/auth.service2'; 
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
    private observ: VistaloginService,
    private router: Router,
    /* public authService: AuthService2,  */
    private nav: NavbarService,
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private loginS: LoginService,
    private authService: AuthService2,
    private activatedRoute: ActivatedRoute,

  ) {
  }

  ngOnInit() {
    this.observ.vistaNav$.subscribe(valor => {
      if (valor) {
        this.isInversionista = JSON.parse(localStorage.getItem('isInversionista'));
        this.verinicio = false;
        this.verperfil = true;
      }
      else {
        this.verinicio = true;
        this.verperfil = false;
      }
    });
    this.onCheckUser();
    this.redireccionar();
    this.mostrarLoginFuncion();
  }

  logOutAuth() {
    this.auth.logout({ returnTo: document.location.origin });
    this.verperfil = false;
    this.verinicio = true
    this.authService.logout(); 
    this.observ.vistaNav$.emit(false);
  }
  async loginAuth0() {
  await this.loginS.getDataUsuario();


  
   /*  const exito= await this.loginS.loginFuncion(xee).toPromise(); */
    /* window.location.href = '/#/investment';  */
    /* this.auth.loginWithRedirect(); */
  }

  loginAlterno(){
    console.log("entrada");
    this.loginS.getDataUsuario();
  /*   this.loginS.getDataUsuario().subscribe(resp=>{
   console.log(resp);
    },err=>{
      console.log(err);
      
    }); */
  }

  redireccionar() {
    if (!localStorage.getItem("redireccion")) {
      let redireccion: string = 'false';
      localStorage.setItem('redireccion', redireccion);
    }
  }

/* login viejo */
  mostrarLoginFuncion() {
    /* OBSERVABLE */
    this.observ.vistaLogin$.subscribe(valor => {
      this.mostrarLogin = valor;
    });

    if (this.mostrarLogin) {
      this.mostrarLogin = false;
      this.observ.vistaLogin$.emit(false);

    } else {
      this.mostrarLogin = true;
      this.observ.vistaLogin$.emit(true);
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
