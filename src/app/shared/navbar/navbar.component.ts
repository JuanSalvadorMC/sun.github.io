import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarService } from '../../services/navbar.service';



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

  constructor( private router: Router, private authService: AuthService, private nav:NavbarService ) {
  }

  ngOnInit() {
    this.onCheckUser();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if(offset > 10) {
      this.isFixedNavbar = true;
    } else {
      this.isFixedNavbar = false;
    }
  }

  toggleNavbar() {
    this.navbarOpened = !this.navbarOpened;
  }


  onLogout() {
   this.authService.logout();
   this.verperfil = false;
   console.log(this.verperfil);
   
  }

  onCheckUser(){
  if(localStorage.getItem('isInversionista')){
    this.isInversionista = JSON.parse(localStorage.getItem('isInversionista'));
    this.verinicio = false;
    this.verperfil = true;
  }
  else {
    console.log('entró al else');
    this.verinicio = true;
    this.verperfil = false;

  }
  console.log(this.isInversionista);
  }
  
}
