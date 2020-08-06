import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialUser } from "angularx-social-login";
import { NotificacionesService } from '../../../../services/notificaciones.service';

@Component({
  selector: 'app-empre',
  templateUrl: './empre.component.html',
  styleUrls: ['./empre.component.css']
})
export class EmpreComponent implements OnInit {

  formRegisterEmpre: FormGroup;
  resultado;
  user;
  loggedIn;

  constructor(private router: Router, private _us: UsuariosService,  private _NTS:NotificacionesService,private authSocial: SocialAuthService) { }

  ngOnInit(): void {
    this.crearFomulario()
  }

  crearFomulario() {
    this.formRegisterEmpre = new FormGroup({
      nombre: new FormControl(''),
      apellidoPaterno: new FormControl(''),
      apellidoMaterno: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      redSocialId: new FormControl(''),
      telefono: new FormControl(''),
      isInversionista: new FormControl('')
    })
  }

  registrar() {
    console.log(this.formRegisterEmpre.value);
    this._us.registerUser(this.formRegisterEmpre.value).subscribe(resp => {
      this.resultado = resp;
      this.router.navigateByUrl('/user/login');
    })
  }

  loginGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then( (resp:any)=>{
      if(resp.id){
        this.statusSesion(resp.id, resp.authToken);
        this.formRegisterEmpre.removeControl('password')
        let rq = this.formRegisterEmpre.getRawValue();
        rq.redSocialId = this.user.id
        rq.nombre = this.user.firstName
        rq.apellidoPaterno = this.user.lastName
        rq.apellidoMaterno = "Validar front"
        rq.email = this.user.email
        rq.telefono = '1112224446'
        rq.isInversionista = false;
        console.log(rq); 
        this._us.registerUserRedSocial(rq).subscribe((resp:any) => {
          if(resp.exito ==  true){
          this._NTS.lanzarNotificacion("Se ha registrado correctamente", "Registro éxitoso", 'success').then( resp => {
            setTimeout(() => {
              this.router.navigateByUrl('user/login');
            });
          });
          }
          else if(resp.exito == false){
            return this._NTS.lanzarNotificacion(`Ha ocurrido un error "${resp.mensaje}"`, "Error", 'error');
          }
        })
      }
    });
  }
 
  loginFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp =>{
      this.statusSesion(resp.id, resp.authToken);
      this.formRegisterEmpre.removeControl('password')
      let rq = this.formRegisterEmpre.getRawValue();
      rq.redSocialId = this.user.id
      rq.nombre = this.user.firstName
      rq.apellidoPaterno = this.user.lastName
      rq.apellidoMaterno = "Validar front"
      rq.email = this.user.email
      rq.telefono = '1112224445'
      rq.isInversionista = false;
      console.log(rq); 
      this._us.registerUserRedSocial(rq).subscribe((resp:any) => {
        if(resp.exito ==  true){
        this._NTS.lanzarNotificacion("Se ha registrado correctamente", "Registro éxitoso", 'success').then( resp => {
          setTimeout(() => {
            this.router.navigateByUrl('user/login');
          });
        });
        }
        else if(resp.exito == false){
          return this._NTS.lanzarNotificacion(`Ha ocurrido un error "${resp.mensaje}"`, "Error", 'error');
        }
      })
    });
  }

  statusSesion(id, token){
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      localStorage.setItem('SCtoken', token);
      localStorage.setItem('idusu', id );
      localStorage.setItem('isInversionista', "true");
      this.loggedIn = (user != null);
    });
  }
  
  cancelar(){
    this.router.navigateByUrl('/user/login');
  }


}