import { UsuariosService } from './../../../services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalContraComponent } from '../../modals/modal-contra/modal-contra.component';
import { NavbarService } from '../../../services/navbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  
  formProfile :  FormGroup;
  users;
  resultados;
  respuesta;
  respBack;
  vermembresia: boolean = false;
  usuario:any[]=[];
  idUsuario;
  

  constructor( private _us: UsuariosService,private activatedRoute: ActivatedRoute, private nav: NavbarService, private spinnerService: NgxSpinnerService,
               private router: Router, private notificacionesService:NotificacionesService, public dialog: MatDialog ) { }
  
  ngOnInit(): void {
    this.spinnerService.show();
    this.crearFormulario();
    this.activatedRoute.params.subscribe(resp => {this.idUsuario = resp.id})
    this.buscar();
    if (localStorage.getItem('isInversionista') === "true") {
      this.vermembresia = true;
      this.spinnerService.hide()

    } else if(localStorage.getItem('isInversionista') === "false"){
      this.vermembresia = false;
      this.spinnerService.hide()
    }
  }

  crearFormulario(){
    this.formProfile = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
      apellidoPaterno: new FormControl('', [Validators.required, Validators.minLength(4)]),
      apellidoMaterno: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(10)]),
      externo: new FormControl(''),
      isInversionista: new FormControl('', [Validators.required, Validators.required]),
      membresia: new FormControl({value:'', disabled:true}),
      contador:  new FormControl({value:'', disabled:true}),
      fechaInicio:  new FormControl({value:'', disabled:true}),
      fechaFin:  new FormControl({value:'', disabled:true}),
      id: new FormControl(localStorage.getItem('idusu'))
    })
  }
 
buscar() {
  this._us.consultUserId(this.idUsuario).subscribe((resp:any) => {
    this.usuario = resp.data;
    console.log(this.usuario);
    this.formProfile.patchValue(this.usuario[0])
    console.log(this.formProfile.value);
  });
}

guardar(){
   this.spinnerService.show();
   this._us.editarPerfil(this.formProfile.value)
   .subscribe((respEditar : any) => {
    if (respEditar.exito === true){
      this.notificacionesService.lanzarNotificacion(respEditar.mensaje, "Registro actualizado con exito", "success");
      this.spinnerService.hide()
      console.log(respEditar);
    }
  },err => {
    this.notificacionesService.lanzarNotificacion("Hubo un error al actualizar los datos, intente más tarde", "Error", "error")
    this.spinnerService.hide()
  
  });
}

openDialogEquipa(){
  const dialogRef = this.dialog.open(ModalContraComponent, {
    width: '350px',
    height: '350px',
    data: { id : localStorage.getItem('idusu') }
  });
  
}


}
