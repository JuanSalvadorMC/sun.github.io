import { Component, OnInit, ɵConsole } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { LiquidezService } from 'src/app/services/liquidez.service';

@Component({
  selector: 'app-contacto-traspaso',
  templateUrl: './contacto-traspaso.component.html',
  styleUrls: ['./contacto-traspaso.component.css']
})
export class ContactoTraspasoComponent implements OnInit {
  idNegocio: any;
  usuarioInfo: any;
  formContacto:FormGroup
  creador: any;
  myProducts: any;
  resultados: any[] = [];
  imagenesId: any[] = [];
  mostrarDatosContacto= false;
  constructor(private _sLiqui: LiquidezService,private serviceTraspaso: TraspasosService, private activatedRoute: ActivatedRoute, private router:Router,
              private usuarioService: UsuariosService, private notificacionesService:NotificacionesService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id
    console.log(resp);
    
    })
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
    this.serviceTraspaso.obtenerTraspaso(idN).subscribe((result: any) => {
      this.resultados.push(result.data);
      console.log(this.resultados);
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
          this.mostrarDatosContacto = true;
        }
        else if(resp.exito == false){
          this.notificacionesService.confirmarAccion('No cuentas con créditos disponibles para solicitar contacto','Ocurrió un error', 'Ir a Membresías', 'Cancelar', 'warning').then(confirm=>
          confirm.isConfirmed == true ? this.router.navigateByUrl('/membership'): false
          )}
      })
    }else{
      return false;
    }
    })
  }
}
