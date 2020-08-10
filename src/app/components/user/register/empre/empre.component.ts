import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialUser } from "angularx-social-login";
import { NotificacionesService } from '../../../../services/notificaciones.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DatosRegistroRedSocialComponent } from '../../../modals/datos-registro-red-social/datos-registro-red-social.component';
import { AuthService } from '../../../../services/auth.service';

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

  constructor(private router: Router, private _us: UsuariosService,  private _NTS:NotificacionesService,
              private authSocial: SocialAuthService, private spinnerService:NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.crearFomulario()
    this.formRegisterEmpre.get('isInversionista').setValue(false);
  }

  crearFomulario() {
    this.formRegisterEmpre = new FormGroup({
      nombre: new FormControl('', [Validators.required,Validators.minLength(4)]),
      apellidoPaterno: new FormControl('',[Validators.required,Validators.minLength(4)]),
      apellidoMaterno: new FormControl('',[Validators.required, Validators.minLength(4)]),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(8)]),
      redSocialId: new FormControl(''),
      isInversionista: new FormControl(''),
      telefono: new FormControl('',[Validators.required, Validators.minLength(10)]),
    })
  }

  registrar() {
    this.spinnerService.show();
    this.formRegisterEmpre.removeControl('redSocialId');
    console.log(this.formRegisterEmpre.value);
    this._us.registerUser(this.formRegisterEmpre.value).subscribe((resp:any) => {
     if(resp.exito == true){
       this._NTS.lanzarNotificacion('Usuario registrado con éxito','Registro correcto', 'success')
       this.router.navigateByUrl('/user/login');
     }else if (resp.exito == false){
      this._NTS.lanzarNotificacion(`Ha ocurrido un error "${resp.mensaje}"`, "Error", 'error');
      this.formRegisterEmpre.get('isInversionista').setValue(false);
      this.spinnerService.hide(); 
     }
     this.spinnerService.hide();
    })
  }

  registroGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then( (resp:any)=>{
      if(resp.id){
      this.registrarRedSocial(resp);
      }
    });
  } 
 
  registroFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp =>{
      if(resp.id){
        this.registrarRedSocial(resp);
        }
    });
  }
  registrarRedSocial(data){
    this.spinnerService.show()
    let login = { redSocialId: data.id }
    this.authService.loginRedSocial(login).subscribe((respLog:any) => {
      if(respLog.exito == true){
        this._NTS.lanzarNotificacion('Ya existe una cuenta registrada con ese correo', 'Error', 'error');
        this.spinnerService.hide();
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
    this.authService.setId(respLog.data.token);
    this.authService.setToken(respLog.data.isInversionista)
    this.authService.setRol(respLog.data.isInversionista)
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
  
  cancelar(){
    this.router.navigateByUrl('/user/login');
  }


}