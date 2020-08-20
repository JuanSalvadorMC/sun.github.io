import { Component, OnInit } from '@angular/core';
import { LiquidezService } from 'src/app/services/liquidez.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-resul-cliquidity',
  templateUrl: './resul-cliquidity.component.html',
  styleUrls: ['./resul-cliquidity.component.css']
})
export class ResulCLiquidityComponent implements OnInit {
  
  idNegocio: any;
  usuarioInfo: any;
  formContacto:FormGroup

  myProducts: any;
  resultados: any[] = [];
  mostrarDatosContacto= false;
  constructor(private _sLiqui: LiquidezService, private activatedRoute: ActivatedRoute,
              private usuarioService: UsuariosService, private notificacionesService:NotificacionesService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
    /*  console.log(this.idNegocio); */
    this.obterPublicaciones(this.idNegocio);
    this.crearFormulario();
    this.obtenerHistorialInversionista();
  }

  crearFormulario(){
    this.formContacto = new FormGroup({
      id: new FormControl(localStorage.getItem('idusu')),
      tipoPublicacion: new FormControl('L'),
      publicacion: new FormControl(this.idNegocio),
    })
  }

  obterPublicaciones(idN) {
    this._sLiqui.obtenerLiquidez(idN).subscribe((result: any) => {
      this.resultados.push(result.data);
      console.log(this.resultados);
    })
  }
  obtenerUsuario(){

  }
  obtenerHistorialInversionista(){
    let inver = { inversionista: this.formContacto.get('id').value }
    this.usuarioService.contactoHistorial(inver).subscribe((resp:any)=> {
      resp.data.forEach(elm => {
        console.log(this.idNegocio, elm.publicacion);
        if(elm.publicacion == this.idNegocio){
          
        }
      })
      

      
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

}
