import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-contacto-equipamiento',
  templateUrl: './contacto-equipamiento.component.html',
  styleUrls: ['./contacto-equipamiento.component.css']
})
export class ContactoEquipamientoComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuariosService, private router: Router,
              private equipamientoService: EquipamientosService, private notificacionesService:NotificacionesService) { }

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
      tipoPublicacion: new FormControl('E'),
      publicacion: new FormControl(this.idNegocio),
    })
  }

  obterPublicaciones(idN) {
    this.equipamientoService.obtenerEquipamiento(idN).subscribe((result: any) => {
      let idCreador = result.data.creador;
      this.resultados.push(result.data);
      console.log(this.resultados);
      this.obtenerUsuario(idCreador);
    })
  }
  obtenerUsuario(id) {
    this.usuarioService.consultarUsuario(id).subscribe((result: any) => {
      this.usuarioInfo.push(result.data);
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
          this.notificacionesService.confirmarAccion('No cuentas con créditos disponibles para solicitar contacto','Ocurrió un error', 'Ir a Membrsías', 'Cancelar', 'warning').then(confirm=>
          confirm.isConfirmed == true ? this.router.navigateByUrl('/membership'): false
          )}
      })
    }else{
      return false;
    }
    })
  }
  
  obtenerHistorialInversionista(){
    let inver = { inversionista: this.formContacto.get('id').value }
    this.usuarioService.contactoHistorial(inver).subscribe((resp:any)=> {
      resp.data.forEach(elm => {
        let tipoPublicacion = elm.tipoPublicacion
        let idPublicacion = JSON.parse(this.idNegocio)
        if(this.idNegocio == elm.publicacion && tipoPublicacion == "E"){
          this.mostrarDatosContacto = true;
        }
      })
    })
}

}
