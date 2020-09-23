import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 
})

export class HomeComponent implements OnInit {

  bgColor = 'primary';
  color = 'warn';
  ocultarRegistro: boolean = true;

  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem('idusu')){
      this.ocultarRegistro = false;
     
    }
  }

}