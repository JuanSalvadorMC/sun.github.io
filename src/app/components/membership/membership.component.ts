import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Cargo mensual por servicio', name: '$ 1500.00  + IVA', weight: '$ 1000.00 + IVA', symbol: '$ 500.00 + IVA'},
  {position: 'Número de contactos', name: 'ILIMITADOS', weight: '5 contactos', symbol: '1 contacto'},
  {position: 'Número de contactos con negocios', name: 'ILIMITADOS', weight: '5 contactos', symbol: '1 contacto'},
  {position: 'Visibilidad total de informacón', name: 'ILIMITADOS', weight: '5 contactos', symbol: '1 contacto'},
];

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;


  response = [
    {titulo: 'PLAN ESTANDAR', costo: 0, beneficios: [
      {desc: 'CONTACTOS ILIMITADOS', activo: true},
      {desc: 'CONTACTOS CON NEGOCIOS ILIMITADOS',activo: false},
      {desc: 'VISIBILIDAD TOTAL DE CONTACTOS', activo: false}
    ]},
    {titulo: 'PLAN DESTACADO', costo: 1000, beneficios: [
      {desc: 'CONTACTOS ILIMITADOS', activo: true},
      {desc: 'CONTACTOS CON NEGOCIOS ILIMITADOS',activo: true},
      {desc: 'VISIBILIDAD TOTAL DE CONTACTOS', activo: false}
    ]},
    {titulo: 'PLAN PREMIUM', costo: 1500, beneficios: [
      {desc: 'CONTACTOS ILIMITADOS', activo: true},
      {desc: 'CONTACTOS CON NEGOCIOS ILIMITADOS',activo: true},
      {desc: 'VISIBILIDAD TOTAL DE CONTACTOS', activo: true}
    ]},
  ]
  

  constructor() { }

  ngOnInit(): void {
  }


}
