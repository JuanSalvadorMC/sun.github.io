import { Component, OnInit } from '@angular/core';
import { LiquidezService } from 'src/app/services/liquidez.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resul-cliquidity',
  templateUrl: './resul-cliquidity.component.html',
  styleUrls: ['./resul-cliquidity.component.css']
})
export class ResulCLiquidityComponent implements OnInit {

   idNegocio:any;
   
  producto;
  usr;
  myProducts: any;
  resultados: any[] = [];
  constructor(private _sLiqui: LiquidezService,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
    console.log(this.idNegocio);
    
    this.productos();
    this.obterPublicaciones(this.idNegocio);
    this.usuario();
    this.usuario = JSON.parse(localStorage.getItem('idusu'));
  }

  productos() {
    // this.producto = this.produc.consultaProductos();
    console.log();
  }

  usuario() {
    // this.usr = this.produc.consultaUsuarios();
    console.log();
  }



  obterPublicaciones(idN) {
    this._sLiqui.obtenerLiquidez(idN).subscribe((result: any) => {
     
      console.log(result.data);
      
     this.resultados.push(result.data);
     console.log(this.resultados);


     
    })
  }

}
