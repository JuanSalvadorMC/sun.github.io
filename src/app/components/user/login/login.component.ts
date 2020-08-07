import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";

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
               private usService : AuthService, private authSocial: SocialAuthService,
               private spinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.usService.getCurrentRol();
  }

  crearFormulario(){
    this.formLogin = new FormGroup ({
      email: new FormControl( '', [Validators.required, Validators.email] ),
      password: new FormControl ( '', [Validators.required, Validators.minLength(8)]),
    })
  }

  onLoginCorreo(){
    this.spinnerService.show();
    this.usService.onlogin(this.formLogin.value).subscribe ( (resp:any) => {
        if (resp.exito === true){
          this.spinnerService.show()
          localStorage.setItem('idusu', resp.data.id);
          localStorage.setItem('SCtoken', resp.data.token);
          localStorage.setItem('isInversionista', resp.data.isInversionista);
          this.spinnerService.hide();
          this.router.navigate([`user/profile/id`]);
          this.spinnerService.hide();
          console.log(resp);
        }
        else if(resp.exito === false){
          this._NTS.lanzarNotificacion(resp.mensaje, "Error", "error");
          console.log(resp);
          this.spinnerService.hide();
        }
      },err => {
        this._NTS.lanzarNotificacion("Ingrese un correo o contraseña validos", "Error", "error");
        this.spinnerService.hide();

      });
  }

  loginGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then( (resp:any)=>{
      
    this.registrarRedSocial(resp)
      
    });
}
 
  loginFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp =>{
     this.registrarRedSocial(resp)
    });
  }

  registrarRedSocial(data){
    this.spinnerService.show()
    let login = { redSocialId: data.id }
    this.usService.loginRedSocial(login).subscribe((respLog:any) => {
      if(respLog.exito == true){
        this.statusSesion(respLog);
      } 
      else if (respLog.exito == false){
        setTimeout(() => {
          this.openDialog(data);
          this.spinnerService.hide();
        }, 1500);
        console.log("te tienes que registrar");
      }
   })
  }

  statusSesion(respLog){
    this.spinnerService.show();
    console.log(respLog);
    localStorage.setItem('SCtoken', respLog.data.token);
    localStorage.setItem('idusu', respLog.data.id );
    localStorage.setItem('isInversionista', respLog.data.isInversionista);
    this.router.navigate([`user/profile/id`]); 
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1500);
  }

  openDialog(value){
    const dialogRef = this.dialog.open(DatosRegistroRedSocialComponent, {
      data:value
    });
    dialogRef.afterClosed().subscribe(result => {
      
      
    });
  }
}
