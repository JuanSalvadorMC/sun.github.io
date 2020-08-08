import { UsuariosService } from './../../../services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    this.consultar();
    this.formProfil();
    this.buscar();
  }

  formProfil(){
    this.formProfile = new FormGroup({
      nombre: new FormControl(  ''),
      apellidoPaterno: new FormControl(  ''),
      apellidoMaterno: new FormControl(  ''),
      email: new FormControl(''),
      password: new FormControl(''),
      telefono: new FormControl(''),
      membresia: new FormControl({value: 'Membresia', disabled: true}),
      contador:  new FormControl({value: 'Contador de Membresia', disabled: true}),
      fechaInicio:  new FormControl({value: 'Fecha inicio', disabled: true}),
      fechaFin:  new FormControl({value: 'Fecha de termino', disabled: true}),
      id: new FormControl(this.nav.obtenerId())
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
  .subscribe(respEditar => {
    this.respuesta = respEditar;
    this.respBack =this.respuesta.exito;
    console.log(this.respuesta);
    console.log(this.respBack);

    
  });  
}

}
