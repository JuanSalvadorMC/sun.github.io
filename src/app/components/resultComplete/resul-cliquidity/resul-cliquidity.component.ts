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
  creador: any;
  myProducts: any;
  resultados: any[] = [];
  mostrarDatosContacto= false;
  constructor(private _sLiqui: LiquidezService, private activatedRoute: ActivatedRoute, private router:Router,
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
      let creador = this.resultados[0].creador;
      this.usuarioService.consultUserId(creador).subscribe((resp:any) => {
        this.usuarioInfo = resp.data
      })
    })
  }
  obtenerHistorialInversionista(){
    let inver = { inversionista: this.formContacto.get('id').value }
    this.usuarioService.contactoHistorial(inver).subscribe((resp:any)=> {
      resp.data.forEach(elm => {
        let tipoPublicacion = elm.tipoPublicacion
        let idPublicacion = JSON.parse(this.idNegocio)
        if(this.idNegocio == elm.publicacion && tipoPublicacion == "L"){
          this.mostrarDatosContacto = true;
        }
      })
    })
  }

  confirmarContacto(){
    this.notificacionesService.confirmarAccion('Al aceptar se consumirá un contador de su membresía',`¿Desea contactar este negocio?`, 'Aceptar', 'Cancelar' ,'info').then(confirm => {
      if(confirm.isConfirmed == true){ 
      this.usuarioService.contactarUsuario(this.formContacto.value).subscribe((resp:any) => {
          if(resp.exito == true){
            this.mostrarDatosContacto= true;
            this.usuarioInfo = resp.data;
          }else if(resp.exito == false){
            this.notificacionesService.confirmarAccion('Ya no cuentas con créditos disponibles para solicitar contacto','Ocurrió un error', 'Ir a Membrsías', 'Cancelar', 'warning').then(confirm=>
                confirm.isConfirmed == true ? this.router.navigateByUrl('/membership'): false
              )}
      })
    }else{
      return false;
    }
    })
  }

}
