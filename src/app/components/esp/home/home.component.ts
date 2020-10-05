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
   velocidad: number = 10000;
 
   $interval = interval(6000);
   private readonly _stop = new Subject<void>();
   private readonly _start = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem('idusu')){
      this.ocultarRegistro = false;
     
    }

    this.muestraSlides(this.indice);
    this.iniciarContador();

  }

  ngAfterViewInit() {
  }

  limpiarInterval() {
    this._stop.next();
    this._start.next();
  }


  // SLIDER
  iniciarContador() {
    this.$interval.pipe(
      takeUntil(this._stop),
      repeatWhen(() => this._start),
      map((x) =>  {
        this.indice ++;
        this.muestraSlides(this.indice);
        return x;
      }),
    ).subscribe(x => x)
  }

  avanzaSlide(n){
    this.limpiarInterval();
    this.muestraSlides( this.indice+=n );
  }
  
  posicionSlide(n){
    this.limpiarInterval();
    this.muestraSlides(this.indice=n);
  }
 
  muestraSlides(n){
      let i;
      let slides: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName('miSlider') as HTMLCollectionOf<HTMLDivElement>;
      let barras: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName('barra') as HTMLCollectionOf<HTMLDivElement>;
  
      if(n > slides.length){
          this.indice = 1;
      }
      if(n < 1){
          this.indice = slides.length;
      }
      for(i = 0; i < slides.length; i++){
          slides[i].style.display = 'none';
      }
      for(i = 0; i < barras.length; i++){
          barras[i].className = barras[i].className.replace(" active", "");
      }
  
      slides[this.indice-1].style.display = 'block';
      barras[this.indice-1].className += ' active';
  }

}