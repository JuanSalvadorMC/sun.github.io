import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { RecuperarContraseniaComponent } from '../../modals/recuperar-contrasenia/recuperar-contrasenia.component';






import { NgxSpinnerService } from "ngx-spinner";


import { DatosRegistroRedSocialComponent } from '../../modals/datos-registro-red-social/datos-registro-red-social.component';
import { NavbarService } from '../../../services/navbar.service';

import { EsatdosService } from '../../../services/esatdos.service';
import { TerminosCondicionesComponent } from '../terminos-condiciones/terminos-condiciones.component';
import { VistaloginService } from 'src/app/services/vistalogin.service';
import { log } from 'console';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css']
})
export class ModalLoginComponent implements OnInit {

  /* FILES */
  private user: SocialUser;
  formLogin: FormGroup;
  idUsuario: any;
  vistaRegistro: boolean = false;
  loggedIn: boolean;
  hide = true;


  /* FILES REGITER */
  rq;
  idGoogle;
  datosRegistro;
  mostrarlogin: boolean = false;
  /* FILES REGISTER END */

  /* FILES END */

  constructor(
    private authSocial: SocialAuthService,
    private notificacionesService: NotificacionesService,
    private authService: AuthService,
    private router: Router,
    public matDialog: MatDialog,
    private spinnerService: NgxSpinnerService,

    private usuarioService: UsuariosService,

  ) { }

  ngOnInit(): void {
    this.crearFormulario();
  }
  /* FORMULARIO */
  crearFormulario() {
    this.formLogin = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(10)]),
      isInversionista: new FormControl(true),
      apellidoPaterno:new FormControl("-----"),

    })
  }
  /* FORMULARIO END */
  /* LOGIN */
  loginGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then((resp: any) => {
      this.loginServicio(resp)
    });
  }

  loginFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp => {
      this.loginServicio(resp)
    });
  }
  loginForUsuario() {
    this.notificacionesService.activarDesactivarLoader('activar');
    let rq = this.formLogin.getRawValue();
    rq.email = rq.email.toLowerCase();
    console.log(rq);
    
     this.authService.onlogin(rq).subscribe((resp: any) => {
      if (resp.exito === true) {
        this.idUsuario = localStorage.getItem('idusu');
        if (resp.data.isInversionista == true && resp.data.isActivo == false) {
          this.notificacionesService.activarDesactivarLoader('desactivar');
          this.notificacionesService.lanzarNotificacion('Por favor revisa tu correo e inicia sesión desde el enlace enviado', 'No se ha verificado este correo', 'warning');
        }
        else if (resp.data.isInversionista == true && resp.data.isActivo == true) {
          this.authService.setId(resp.data.id);
          this.authService.setToken(resp.data.token)
          this.authService.setRol(resp.data.isInversionista)
          this.router.navigate([`investment`]);
        }
        if (resp.data.isInversionista == false && resp.data.isActivo == false) {
          this.notificacionesService.activarDesactivarLoader('desactivar');
          this.notificacionesService.lanzarNotificacion('Por favor revisa tu correo e inicia sesión desde el enlace enviado', 'No se ha verificado este correo', 'warning');
        }
        else if (resp.data.isInversionista == false && resp.data.isActivo == true) {
          this.authService.setId(resp.data.id);
          this.authService.setToken(resp.data.token)
          this.authService.setRol(resp.data.isInversionista)
          this.router.navigate([`/business`]);
        }

        this.notificacionesService.activarDesactivarLoader('desactivar');
        console.log(resp);
      }
      else if (resp.exito === false) {
        this.notificacionesService.lanzarNotificacion(resp.mensaje, "Error", "error");
        console.log(resp);
        this.notificacionesService.activarDesactivarLoader('desactivar');
      }
    }, err => {
      this.notificacionesService.lanzarNotificacion("Inicia sesión con con tu proveedor de correo", "Atención", "info");
      this.notificacionesService.activarDesactivarLoader('desactivar');

    }); 
  }

  loginServicio(data) {
    console.log(data);
    
    this.notificacionesService.activarDesactivarLoader('activar')
    let login = { redSocialId: data.id }
    this.authService.loginRedSocial(login).subscribe((respLog: any) => {
      if (respLog.exito == true) {
        this.actualizacionSesion(respLog);
      }
      else if (respLog.exito == false) {
        setTimeout(() => {
          this.notificacionesService.lanzarNotificacion("Regitrate para poder iniciar sesion", "Usuario no encontrado", "warning");
          /*  this.openDialog(data); */
          this.notificacionesService.activarDesactivarLoader('desactivar');
          this.router.navigate([`/home`]);
        }, 1500);

      }
    })
  }

  actualizacionSesion(respLog) {
    this.notificacionesService.activarDesactivarLoader('activar');
    console.log(respLog);
    this.authService.setId(respLog.data.id);
    this.authService.setToken(respLog.data.token)
    this.authService.setRol(respLog.data.isInversionista);
    this.idUsuario = localStorage.getItem('idusu');
    if (respLog.data.isInversionista == true) {
      this.router.navigate([`investment`]);
    } else if (respLog.data.isInversionista == false) {
      /*   this.router.navigate([`business`]) */
      this.router.navigate([`investment`]);
    }
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    setTimeout(() => {
      this.notificacionesService.activarDesactivarLoader('desactivar');
    }, 1500);
  }

  /* LOGIN END */
  /* REGISTER */
  registroForUsuario() {
    this.spinnerService.show();
    this.formLogin.removeControl('redSocialId');
    this.formLogin.addControl('externo', new FormControl(false))
    let rq = this.formLogin.getRawValue();
    console.log(rq);
    
    rq.email = rq.email.toLowerCase();
    this.spinnerService.show();
    this.usuarioService.registerUser(rq).subscribe((resp: any) => {
      if (resp.exito == true) {
        this.notificacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Te llegara un correo electronico a tu bandeja de entrada para notificar el registro en el sitio.', 'success')
        this.router.navigateByUrl('/home');
        this.spinnerService.hide()
      } else if (resp.exito == false) {
        if (resp.mensaje=="Ya existe un registro con ese email.") {
          this.spinnerService.hide();
          this.notificacionesService.lanzarNotificacion(`"${resp.mensaje}"`, "Inicio de Sesión", 'success');  
        }    
      }
      this.spinnerService.hide();
    })
  }

  registroFacebook(): void {
    this.spinnerService.show();
    this.rq = this.formLogin.getRawValue();
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp => {
      this.spinnerService.show();
      if (resp.id) {
        this.spinnerService.hide();
        this.rq.nombre = resp.firstName;
        this.rq.apellidoPaterno = resp.lastName;
        this.rq.email = resp.email;
        this.rq.redSocialId = resp.id;
        this.rq.cp = "-----";
        this.registroServicio(this.rq);
        /* this.registrarRedSocial(resp); */
      }
    });
  }
  registroGoogle(): void {
    this.rq = this.formLogin.getRawValue();
    console.log(this.rq);
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then((resp: any) => {
      this.spinnerService.show();
      if (resp.id) {
        this.spinnerService.hide();
        this.idGoogle = resp.id;
        this.datosRegistro = resp;
        this.rq.nombre = resp.firstName;
        this.rq.apellidoPaterno = resp.lastName;
        this.rq.email = resp.email;
        this.rq.redSocialId = resp.id;
        this.rq.cp = "-----";
        this.spinnerService.show();
        console.log(this.rq);
        this.registroServicio(this.rq);
      }
    });
  }

  registroServicio(resp) {
    this.spinnerService.show();
    this.datosRegistro = resp;
    this.usuarioService.registerUserRedSocial(this.rq).subscribe((resp: any) => {
      let login = this.idGoogle;
      if (resp.exito == true) {
        this.spinnerService.hide();
        this.notificacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Un correo electronico llegara a tu bandeja de entrada para confirmar el registro en el sitio', 'success').then(any => {
          this.authService.loginRedSocial(login).subscribe((respLog: any) => {
            this.statusSesion(respLog);
            this.idUsuario = resp.data.id
            if (respLog.data.isInversionista == true) {
              this.router.navigate([`investment`]);
            } else if (respLog.data.isInversionista == false) {
              this.router.navigate([`business`]);
            }
            this.spinnerService.hide();
          })
        })
        this.mostrarlogin = true;
      }
      else if (resp.exito == false) {
        if (resp.mensaje == "Ya existe un registro con ese email.") {
          this.spinnerService.hide();
          this.notificacionesService.lanzarNotificacion(`"${resp.mensaje}"`, "Inicio de Sesión", 'success');
          this.loginGoogle();
        }
        this.spinnerService.hide();
      }
    })
  }

  statusSesion(respLog) {
    this.spinnerService.show();
    console.log(respLog);
    localStorage.setItem('SCtoken', respLog.data.token);
    localStorage.setItem('idusu', respLog.data.id);
    localStorage.setItem('isInversionista', respLog.data.isInversionista);
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1500);
  }

  /* REGISTER END */
  vistaRegistroF() {
    if (this.vistaRegistro) {this.vistaRegistro = false;} else {this.vistaRegistro = true;}
    document.getElementById("home").scrollIntoView();
  }


  openModarRecuperarContra() {
    const dialogRef = this.matDialog.open(RecuperarContraseniaComponent, {
      width: '750px',height: '450px', data: { id: localStorage.getItem('idusu') }
    });
  }

}
