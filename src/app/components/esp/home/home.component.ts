import { AfterViewInit, Component, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { map, repeatWhen, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 
})

export class HomeComponent implements OnInit {

  bgColor = 'primary';
  color = 'warn';
  ocultarRegistro: boolean = true;

   // SLIDER CONFIGURACION
   indice: number = 1;
   velocidad: number = 4000;
 
   $interval = interval(6000);
   private readonly _stop = new Subject<void>();
   private readonly _start = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem('idusu')){
      this.ocultarRegistro = false;
     
    }
  
    
  }

}