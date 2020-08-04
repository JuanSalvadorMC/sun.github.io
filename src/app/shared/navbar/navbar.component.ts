import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';


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

  constructor( private router: Router
  ) { }
  ngOnInit() {
      if (localStorage.getItem('isInversionista') === "true") {
      this.verperfil = true;
    } else if(localStorage.getItem('isInversionista') === "false"){
      this.verperfil = false;
    }
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


  inciasesion() {
    this.router.navigate(['/user/login'])
  }

  onLogout() {
    localStorage.removeItem('SCtoken');
    localStorage.removeItem('idusu');
    localStorage.removeItem('isInversionista');
    this.router.navigate(['user/login'])
    .then(dato=>{
      location.reload();
     });
   
  }
  
}
