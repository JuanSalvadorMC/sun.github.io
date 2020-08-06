import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';


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
  public isLogged = true;

  constructor( private router: Router, private authService: AuthService) {}

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

  onCheckUser(){
    if(this.authService.getCurrentRol() == true) {this.verperfil= true; }
    else if(this.authService.getCurrentRol()== false) { this.verperfil=true; } 

  }  

  toggleNavbar() {
    this.navbarOpened = !this.navbarOpened;
  }


  onLogout() {
   this.authService.logout();
   this.verperfil = false;
  }
  
}
