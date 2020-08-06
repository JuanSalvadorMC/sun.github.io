import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialUser } from "angularx-social-login";
import { NotificacionesService } from '../../../services/notificaciones.service';
import { MatDialog } from '@angular/material/dialog';
import { DatosRegistroRedSocialComponent } from '../../modals/datos-registro-red-social/datos-registro-red-social.component';


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
 

  constructor( private _NTS:NotificacionesService, private router : Router, public dialog: MatDialog,
               private usService : AuthService, private authSocial: SocialAuthService ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.usService.getCurrentRol()
    
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
          setTimeout(resp=> { this.router.navigate([`user/profile/id`]); }, 1500);
          console.log(resp);
        }
        else if(resp.exito === false){
          this._NTS.lanzarNotificacion(resp.mensaje, "Error", "error");
          console.log(resp);
        }
      },err => {
        this._NTS.lanzarNotificacion("Ingrese un correo o contraseña validos", "Error", "error");
      });
  }

  loginGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then( (resp:any)=>{
      let login = { redSocialId: resp.id }
     this.usService.loginRedSocial(login).subscribe((respLog:any) => {
        if(respLog.exito == true){
          console.log("login correcto");
        }
        else if (respLog.exito == false){
          this.openDialog(resp);
          console.log("te tienes que registrar");
        }
     })
      
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
     this.router.navigate([`user/profile/id`]); 
    });
  }

  openDialog(value){
    const dialogRef = this.dialog.open(DatosRegistroRedSocialComponent, {
      data:value
    });
    dialogRef.afterClosed().subscribe(result => {
      
      
    });
  }
}
