import { Component, OnInit } from '@angular/core';
import { LiquidezService } from 'src/app/services/liquidez.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-resul-cliquidity',
  templateUrl: './resul-cliquidity.component.html',
  styleUrls: ['./resul-cliquidity.component.css']
})
export class ResulCLiquidityComponent implements OnInit {

  idNegocio: any;
  usuarioInfo: any[] = [];
  producto;
  usr;
  myProducts: any;
  resultados: any[] = [];
  constructor(private _sLiqui: LiquidezService, private activatedRoute: ActivatedRoute, private usuarioService: UsuariosService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
    console.log(this.idNegocio);

    this.productos();
    this.obterPublicaciones(this.idNegocio);
    this.usuario();
    this.usuario = JSON.parse(localStorage.getItem('idusu'));

    console.log(this.usuarioInfo);
    

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

      let idCreador = result.data.creador;

      this.resultados.push(result.data);

      this.obtenerUsuario(idCreador);

    })
  }
  obtenerUsuario(id) {
    this.usuarioService.consultarUsuario(id).subscribe((result: any) => {

      this.usuarioInfo.push(result.data);
     
      console.log(this.usuarioInfo);
    })

  }

}
