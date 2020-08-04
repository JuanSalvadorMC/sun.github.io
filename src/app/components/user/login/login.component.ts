import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialUser } from "angularx-social-login";
import { NotificacionesService } from '../../../services/notificaciones.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private user: SocialUser;
  formLogin: FormGroup;
  hide = true;
  resultado;
  respuesta;
  loggedIn: boolean;

  constructor( private _NTS:NotificacionesService, private router : Router, private usService : AuthService, private authSocial: SocialAuthService ) { }

  ngOnInit(): void {
    this.crearFormulario();
    
  }

  crearFormulario(){
    this.formLogin = new FormGroup ({
      email: new FormControl( '', [Validators.required, Validators.email] ),
      password: new FormControl ( '', [Validators.required, Validators.minLength(8)]),
    })
  }

  onLoginCorreo(){
    this.usService.onlogin(this.formLogin.value).subscribe ( (resp:any) => {
        if (resp.exito === true){
          localStorage.setItem('idusu', resp.data.id);
          localStorage.setItem('SCtoken', resp.data.token);
          localStorage.setItem('isInversionista', resp.data.isInversionista);
          this.router.navigate([`user/profile/id`]).then(dato=>{
            location.reload()
           });
        }
        else if(resp.exito === false){
          this._NTS.lanzarNotificacion(resp.mensaje, "Error", "error");
          console.log(resp);
        }
      },err => {
        this._NTS.lanzarNotificacion("Ingrese un correo o contraseña validos", "Error", "error")
      });
  }

  loginGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then( (resp:any)=>{
      if(resp.id){
        this.statusSesion(resp.id, resp.idToken);
      }
    });
  }
 
  loginFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp =>{
      this.statusSesion(resp.id, resp.authToken)
    });
  }

  statusSesion(id, token){
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      localStorage.setItem('SCtoken', token);
      localStorage.setItem('idusu', id );
      localStorage.setItem('isInversionista', "true");
      this.loggedIn = (user != null);
      this.router.navigate([`user/profile/id`]).then(dato=>{
        location.reload()
       });
    });
  }
}
