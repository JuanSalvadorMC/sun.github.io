import { UsuariosService } from './../../../services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { NavbarService } from '../../../services/navbar.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
  usuario: {};
  

  constructor( private _us: UsuariosService,private activatedRoute: ActivatedRoute, private nav: NavbarService, private spinnerService: NgxSpinnerService ) { }
  
  ngOnInit(): void {
    this.formProfil();
    this.buscar();
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
      membresia: new FormControl(''),
      contador:  new FormControl(''),
      fechaInicio:  new FormControl(''),
      fechaFin:  new FormControl(''),
      id: new FormControl(localStorage.getItem('idusu'))
    })
  }


  consultar(){
    this.activatedRoute.params.subscribe (params => {
       this._us.consultUserId(this.nav.obtenerId()).subscribe(dataus=>{
       this.usuario = dataus['idusu'];
       this.spinnerService.hide()
       });  
   });
}

buscar() {
  this.spinnerService.show();
  this._us.consultUserId(this.nav.id).subscribe(data => {
    this.usuario = data['data'];
    this.spinnerService.hide()
    console.log(this.usuario);
  });

}

guardar(){
   this._us.editarPerfil(this.formProfile.value)
  .subscribe((respEditar : any) => {
    if (respEditar.exito === true){
    this.buscar();  
    }
    else if(respEditar.exito === false){
      //this._NTS.lanzarNotificacion(respEditar.mensaje, "Error", "error");
      console.log(respEditar);
    }
  },err => {
    //this._NTS.lanzarNotificacion("Ingrese un correo o contraseña validos", "Error", "error")
  
  });

}

}
