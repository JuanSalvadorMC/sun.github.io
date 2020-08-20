import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../services/navbar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  vermembresia: boolean = false;

  constructor( private nav: NavbarService, private spinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('isInversionista') === "true") {
      this.vermembresia = true;
      this.spinnerService.hide()

    } else if(localStorage.getItem('isInversionista') === "false"){
      this.vermembresia = false;
      this.spinnerService.hide()
    }
  }
}
