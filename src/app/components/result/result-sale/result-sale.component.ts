import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-result-sale',
  templateUrl: './result-sale.component.html',
  styleUrls: ['./result-sale.component.css']
})
export class ResultSaleComponent implements OnInit {

  /* ////////////////// */
 

  animales: negocios[]=[
    {tipo:'Comida',nombre:'Tacos Jose'  ,descripcion:" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima consequatur esse rem perferendis  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima consequatur esse rem perferendis."},
    {tipo:'Zapateria',nombre:'3 Reyes'  ,descripcion:" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima consequatur esse rem perferendis  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima consequatur esse rem perferendis."},
    {tipo:'Comida' ,nombre:'Torlilleria Adelita' ,descripcion:" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima consequatur esse rem perferendis  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima consequatur esse rem perferendis." },
    {tipo:'Entretenimiento' ,nombre:"Billar Moon",descripcion:" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima consequatur esse rem perferendis  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima consequatur esse rem perferendis." },
  ];

 
  /* --------------------------------- */

  columnas: string[] = ['codigo', 'descripcion', 'precio'];

  datos: Articulo[] = [
  new Articulo(1, 'papas', 55),
  new Articulo(2, 'manzanas', 53),
  new Articulo(3, 'naranjas', 25),
  new Articulo(1, ' Comida', 25),
  ];

  

  dataSource = null;

  constructor() { }

  ngOnInit()/* : void */ {
    this.dataSource = new MatTableDataSource(this.datos);
    
    
    if (this.vacio == true) {
      console.log('entro weon')
      console.log(this.termino)
    }
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
  
 

      /* 1--------------------------------- */

      vacio=true;
      heroes:any[] = [];
      termino:string;

  buscarHeroe( termino:string ){

    console.log(termino); 
    if (termino== '') {
      this.vacio=true;
    }else{
      this.vacio=false; 
    } 
   
    
      this.termino =termino;
      this.heroes = this.buscarHeroes( termino );


     console.log( this.heroes ); 
     if (this.heroes .length ==0 ) {
      console.log('Esta limpio weon');
     }
     /* console.log(termino);  */
    
  }

  getHeroes():negocios[]{
    return this.animales;

  }
  getHeroe( idx: string ){
    return this.animales[idx];
  } 


  buscarHeroes( termino:string ):negocios[]{

    let heroesArr:negocios[] = [];

 /*    termino = termino.toLowerCase(); */
    console.log(termino);
    for( let i = 0; i < this.animales.length; i ++ ){

      let heroe = this.animales[i];

      let nombre = heroe.nombre.toLowerCase();
      let tipo = heroe.tipo.toLowerCase();
      

      if( nombre.indexOf( termino ) >= 0  || tipo.indexOf( termino ) >= 0){
        heroe.idx = i;
        heroesArr.push( heroe )
      }

    }
    /* console.log(heroesArr); */
    return heroesArr;

  }
  /*2 --------------------------------- */
  
}

export class Articulo {
  constructor(public codigo: number, public descripcion: string, public precio: number) {
  }

}
  /* 1--------------------------------- */

export interface negocios{
  tipo: string;
  nombre: string;
  descripcion: string;
  idx?: number;
  
};
  /* 2--------------------------------- */
