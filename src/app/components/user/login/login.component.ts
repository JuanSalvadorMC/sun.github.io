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
import { NavbarService } from '../../../services/navbar.service';
import { RecuperarContraseniaComponent } from '../../modals/recuperar-contrasenia/recuperar-contrasenia.component';


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
  idUsuario:any;

  constructor( private _NTS:NotificacionesService, private router : Router, public dialog: MatDialog,
               private usService : AuthService, private authSocial: SocialAuthService,
               private spinnerService: NgxSpinnerService, private nav: NavbarService ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.usService.getCurrentRol();
    this.nav.ocultarNavOpciones();
    
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
          this.usService.setId(resp.data.id);
          this.usService.setToken(resp.data.token)
          this.usService.setRol(resp.data.isInversionista)
          this.idUsuario = localStorage.getItem('idusu');
          this.router.navigate([`user/profile/${this.idUsuario}`])
          this.spinnerService.hide();
          console.log(resp);
        }
        else if(resp.exito === false){
          this._NTS.lanzarNotificacion(resp.mensaje, "Error", "error");
          console.log(resp);
          this.spinnerService.hide();
        }
      },err => {
        this._NTS.lanzarNotificacion("Inicia sesión con con tu proveedor de correo", "Atención", "info");
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
    this.usService.setId(respLog.data.id);
    this.usService.setToken(respLog.data.token)
    this.usService.setRol(respLog.data.isInversionista);
    this.idUsuario = localStorage.getItem('idusu');
    this.router.navigate([`user/profile/${this.idUsuario}`]); 
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

  openModarRecuperarContra(){
    const dialogRef = this.dialog.open(RecuperarContraseniaComponent, {
      width: '350px',
      height: '350px',
      data: { id : localStorage.getItem('idusu') }
    });
  }
  
}
