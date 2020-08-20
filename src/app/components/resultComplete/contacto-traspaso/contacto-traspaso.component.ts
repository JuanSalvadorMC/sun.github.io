import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-contacto-traspaso',
  templateUrl: './contacto-traspaso.component.html',
  styleUrls: ['./contacto-traspaso.component.css']
})
export class ContactoTraspasoComponent implements OnInit {

  constructor( private activatedRoute: ActivatedRoute, private usuarioService: UsuariosService,
               private notificacionesService:NotificacionesService, private traspasosService: TraspasosService) { }

  idNegocio: any;
  usuarioInfo: any[] = [];
  myProducts: any;
  resultados: any[] = [];
  mostrarDatosContacto= false;
  formContacto:FormGroup;


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
    this.obterPublicaciones(this.idNegocio);
    this.crearFormulario();
    this.obtenerHistorialInversionista();
  }

  crearFormulario(){
    this.formContacto = new FormGroup({
      id: new FormControl(localStorage.getItem('idusu')),
      tipoPublicacion: new FormControl('T'),
      publicacion: new FormControl(this.idNegocio),
    })
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

  confirmarContacto(){
    this.notificacionesService.confirmarAccion('Al aceptar se consumirá un contador de su membresía',`¿Desea contactar el negocio ${this.resultados['nombre']}?`, 'Aceptar', 'Cancelar' ,'info').then(() => {
      this.usuarioService.contactarUsuario(this.formContacto.value).subscribe((resp:any) => {
        if(resp.exito == true){
          this.usuarioInfo = resp.data
          this.mostrarDatosContacto = true;
        }
        else{
          this.notificacionesService.lanzarNotificacion('Si no ha intentado contactar a este negocio anteriormente, intente más tarde','Ocurrió un error','error')
        }
      })
    })
  }
  
  obtenerHistorialInversionista(){
    let inver = { inversionista: this.formContacto.get('id').value }
    this.usuarioService.contactoHistorial(inver).subscribe((resp:any)=> {
      resp.data.forEach(elm => {
        let tipoPublicacion = elm.tipoPublicacion
        let idPublicacion = JSON.parse(this.idNegocio)
        if(this.idNegocio == elm.publicacion && tipoPublicacion == "T"){
          this.mostrarDatosContacto = true;
        }
      })
    })
}
}
