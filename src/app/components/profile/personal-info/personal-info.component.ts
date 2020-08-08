import { UsuariosService } from './../../../services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  usuario: {};
  idUsuario;
  

  constructor( private _us: UsuariosService,private activatedRoute: ActivatedRoute, private nav: NavbarService, private spinnerService: NgxSpinnerService,
               private router: Router, private _NTS:NotificacionesService, public dialog: MatDialog ) { }
  
  ngOnInit(): void {
    this.formProfil();
    this.activatedRoute.params.subscribe(resp => {this.idUsuario = resp.id})
    this.buscar();
    if (localStorage.getItem('isInversionista') === "true") {
      this.vermembresia = true;
    } else if(localStorage.getItem('isInversionista') === "false"){
      this.vermembresia = false;
    }
  }

  formProfil(){
    this.formProfile = new FormGroup({
      nombre: new FormControl(''),
      apellidoPaterno: new FormControl(''),
      apellidoMaterno: new FormControl(''),
      email: new FormControl(''),
      telefono: new FormControl(''),
      externo: new FormControl(''),
      isInversionista: new FormControl(''),
      membresia: new FormControl({value:'', disabled:true}),
      contador:  new FormControl({value:'', disabled:true}),
      fechaInicio:  new FormControl({value:'', disabled:true}),
      fechaFin:  new FormControl({value:'', disabled:true}),
      id: new FormControl(localStorage.getItem('idusu'))
    })
  }
 
  

buscar() {
  this.spinnerService.show();
  this._us.consultUserId(this.idUsuario).subscribe(data => {
    this.usuario = data['data'];
    this.spinnerService.hide();
    console.log(data);
    console.log(this.usuario);
  });

}



guardar(){
   this._us.editarPerfil(this.formProfile.value)
  .subscribe((respEditar : any) => {
    if (respEditar.exito === true){
    
      this._NTS.lanzarNotificacion(respEditar.mensaje, "Registro actualizado con exito", "success");
      console.log(respEditar);
    }
  },err => {
    this._NTS.lanzarNotificacion("Ingrese un correo o contraseña validos", "Error", "error")
  
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
