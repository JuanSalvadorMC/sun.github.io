import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EquipamientosService } from 'src/app/services/equipamientos.service';

@Component({
  selector: 'app-contacto-equipamiento',
  templateUrl: './contacto-equipamiento.component.html',
  styleUrls: ['./contacto-equipamiento.component.css']
})
export class ContactoEquipamientoComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuariosService, private equipamientoService: EquipamientosService) { }

  idNegocio: any;
  usuarioInfo: any[] = [];
  myProducts: any;
  resultados: any[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
    this.obterPublicaciones(this.idNegocio);
    /* console.log(this.resultados); */
    
  }
  obterPublicaciones(idN) {
    this.equipamientoService.obtenerEquipamiento(idN).subscribe((result: any) => {
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
