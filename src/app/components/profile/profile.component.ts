import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../services/navbar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {



  constructor( private nav: NavbarService, private spinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.nav.ocultarNavOpciones();
    this.nav.visible;
    console.log(this.nav.visible);
  }


}
