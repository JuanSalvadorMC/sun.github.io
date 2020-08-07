import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-result-sale',
  templateUrl: './result-sale.component.html',
  styleUrls: ['./result-sale.component.css']
})
export class ResultSaleComponent implements OnInit {
  columnas: string[] = ['codigo', 'descripcion', 'precio'];

  datos: Articulo[] = [new Articulo(1, 'papas', 55),
  new Articulo(2, 'manzanas', 53),
  new Articulo(3, 'naranjas', 25),
  new Articulo(1, ' Comida', 25),
  ];

  dataSource = null;

  constructor() { }

  ngOnInit()/* : void */ {
    this.dataSource = new MatTableDataSource(this.datos);
    
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }  
}

export class Articulo {
  constructor(public codigo: number, public descripcion: string, public precio: number) {
  }

}
