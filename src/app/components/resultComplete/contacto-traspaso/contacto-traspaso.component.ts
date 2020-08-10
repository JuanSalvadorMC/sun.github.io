import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { TraspasosService } from 'src/app/services/traspasos.service';

@Component({
  selector: 'app-contacto-traspaso',
  templateUrl: './contacto-traspaso.component.html',
  styleUrls: ['./contacto-traspaso.component.css']
})
export class ContactoTraspasoComponent implements OnInit {

  constructor( private activatedRoute: ActivatedRoute, private usuarioService: UsuariosService, private traspasosService: TraspasosService) { }

  idNegocio: any;
  usuarioInfo: any[] = [];
  myProducts: any;
  resultados: any[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
    this.obterPublicaciones(this.idNegocio);
  }
  obterPublicaciones(idN) {
    this.traspasosService.obtenerTraspaso(idN).subscribe((result: any) => {
      let idCreador = result.data.creador;
      this.resultados.push(result.data);
      this.obtenerUsuario(idCreador);
    })
  }
  obtenerUsuario(id) {
    this.usuarioService.consultarUsuario(id).subscribe((result: any) => {
      this.usuarioInfo.push(result.data);
    })
  }

}
