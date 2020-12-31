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

  regRapido: boolean = false;
  secuencia: boolean = false;
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
      apellidoPaterno: new FormControl("-----"),

    })
  }
  /* FORMULARIO END */
  /* LOGIN */
  loginFacebook2(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp => {
      if (resp.id) {
        this.rq = this.formLogin.getRawValue();
        this.spinnerService.hide();
        this.idGoogle = resp.id;
        this.datosRegistro = resp;
        this.rq.nombre = resp.firstName;
        this.rq.apellidoPaterno = resp.lastName;
        this.rq.email = resp.email;
        this.rq.redSocialId = resp.id;
        this.rq.cp = "-----";
        this.spinnerService.show();
      
        this.loginServicio2( this.rq);
      }
    });
  }
  loginGoogle2() {
    this.spinnerService.hide();
 
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then((resp: any) => {
      console.log("entro al login");

      if (resp.id) {

        this.rq = this.formLogin.getRawValue();
        this.spinnerService.hide();
        this.idGoogle = resp.id;
        this.datosRegistro = resp;
        this.rq.nombre = resp.firstName;
        this.rq.apellidoPaterno = resp.lastName;
        this.rq.email = resp.email;
        this.rq.redSocialId = resp.id;
        this.rq.cp = "-----";
        this.spinnerService.show();

      
      }
      this.loginServicio2( this.rq);
    });

  }
  loginServicio2(data) {
    console.log(data);
    this.notificacionesService.activarDesactivarLoader('activar')
    let login = { redSocialId: data.id }
    console.log(login);
    if (typeof (login) != "undefined") {
      login = { redSocialId: data.redSocialId } ;
      console.log(login);
    }   
       this.authService.loginRedSocial(login).subscribe((respLog: any) => {
         if (respLog.exito == true) {
          this.statusSesion(respLog);
          /*  this.actualizacionSesion(respLog);   */     
             window.location.href = '/#/investment'; 
         }
         else if (respLog.exito == false) {
           console.log("3");
           
           this.secuencia=true;
           console.log(this.secuencia);
           this.registroServicio2(data);  
           setTimeout(() => {
             this.notificacionesService.activarDesactivarLoader('desactivar');     
           }, 1500);
                  
         }
       }) 
       console.log(this.secuencia);
       
       if (this.secuencia) {
         this.registroServicio2(data);  
       }
  }
  registroServicio2(datos) {
    this.secuencia=false;
    console.log(datos);
    this.spinnerService.show();
    this.datosRegistro = datos;
    this.usuarioService.registerUserRedSocial(this.datosRegistro).subscribe((resp: any) => {
      console.log("entroO " + resp.exito);
      let login = this.idGoogle;
      if (resp.exito == true) {
        console.log("exito");
        this.loginServicio(datos, "google");
        this.spinnerService.hide();
        this.notificacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Se ha enviado un correo electronico a tu correo para confirmar el registro en el sitio', 'success');
        /*  this.notificacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Un correo electronico llegara a tu bandeja de entrada para confirmar el registro en el sitio', 'success').then(any => {
          */
        this.authService.loginRedSocial(login).subscribe((respLog: any) => {
         /*  this.statusSesion(respLog); */
          this.idUsuario = resp.data.id
          if (respLog.data.isInversionista == true) {
            this.router.navigate([`investment`]);
          } else if (respLog.data.isInversionista == false) {
            this.router.navigate([`business`]);
          }
          this.spinnerService.hide();
        })

        /*  })  */

        this.mostrarlogin = true;
        setTimeout(() => {
          /*  window.location.href = '/#/home';  */
          console.log("paso");

        /*   this.loginServicio(resp, "google"); */

        }, 1500);

      }
      else if (resp.exito == false) {
        this.spinnerService.hide();
        setTimeout(() => {
          console.log("paso");
         /*  this.loginServicio(resp, "google"); */
          window.location.href = '/#/home';
          console.log("paso");



        }, 1500);
        /*    if (resp.mensaje == "Ya existe un registro con ese email.") {
             this.spinnerService.hide();
             this.notificacionesService.lanzarNotificacion(`"${resp.mensaje}"`, "Inicio de Sesión", 'success');
             this.loginGoogle();
           } */
        this.spinnerService.hide();
      }
    })
  }
 
 
  /*  ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ */
 loginGoogle() {
    this.spinnerService.hide();
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then((resp: any) => {
      console.log("entroallogin");
      if (resp.id) {
        this.rq = this.formLogin.getRawValue();
        this.spinnerService.hide();
        this.idGoogle = resp.id;
        this.datosRegistro = resp;
        this.rq.nombre = resp.firstName;
        this.rq.apellidoPaterno = resp.lastName;
        this.rq.email = resp.email;
        this.rq.redSocialId = resp.id;
        this.rq.cp = "-----";
        this.spinnerService.show();
        /*   this.registroServicio(this.rq); */
      }
      this.loginServicio(this.rq,"google");
    });
  }
  loginFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp => {
      this.loginServicio(resp, "facebook")
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

  loginServicio(data, rq2) {
    console.log(data);

    this.notificacionesService.activarDesactivarLoader('activar')
    let login = { redSocialId: data.id }
    if (typeof (login) != "undefined") {
      login = { redSocialId: data.redSocialId } ;
      console.log(login);
    } 
    this.authService.loginRedSocial(login).subscribe((respLog: any) => {
      if (respLog.exito == true) {
        this.actualizacionSesion(respLog);

        window.location.href = '/#/investment';
      }
      else if (respLog.exito == false) {
        setTimeout(() => {


          this.notificacionesService.activarDesactivarLoader('desactivar');

        }, 1500);

        this.registroServicio(rq2);




      }
    })
    this.regRapido = true;
  }

  actualizacionSesion(respLog) {
    this.notificacionesService.activarDesactivarLoader('activar');
    console.log(respLog);
    this.authService.setId(respLog.data.id);
    this.authService.setToken(respLog.data.token)
    this.authService.setRol(respLog.data.isInversionista);
    this.idUsuario = localStorage.getItem('idusu');
    if (respLog.data.isInversionista == true) {
      window.location.href = '/#/investment';
    /*   this.router.navigate([`investment`]); */
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
        if (resp.mensaje == "Ya existe un registro con ese email.") {
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
      console.log("entroO");

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

        this.registroServicio(this.rq);
      }
    });
  }

  registroServicio(datos) {
    console.log(datos);
    this.spinnerService.show();
    this.datosRegistro = datos;
    this.usuarioService.registerUserRedSocial(this.datosRegistro).subscribe((resp: any) => {
      console.log("entroO " + resp.exito);
      let login = this.idGoogle;
      if (resp.exito == true) {
        console.log("exito");
        this.loginServicio(datos, "google");
        this.spinnerService.hide();
        /*  this.notificacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Un correo electronico llegara a tu bandeja de entrada para confirmar el registro en el sitio', 'success').then(any => {
          */
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

        /*  })  */

        this.mostrarlogin = true;
        setTimeout(() => {
          /*  window.location.href = '/#/home';  */
          console.log("paso");

          this.loginServicio(resp, "google");

        }, 1500);

      }
      else if (resp.exito == false) {
        this.spinnerService.hide();
        setTimeout(() => {
          console.log("paso");
          this.loginServicio(resp, "google");
          window.location.href = '/#/home';
          console.log("paso");



        }, 1500);
        /*    if (resp.mensaje == "Ya existe un registro con ese email.") {
             this.spinnerService.hide();
             this.notificacionesService.lanzarNotificacion(`"${resp.mensaje}"`, "Inicio de Sesión", 'success');
             this.loginGoogle();
           } */
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
  vistaRegistroScroll() {
    if (this.vistaRegistro) { this.vistaRegistro = false; } else { this.vistaRegistro = true; }
    document.getElementById("home").scrollIntoView();
  }


  openModarRecuperarContra() {
    const dialogRef = this.matDialog.open(RecuperarContraseniaComponent, {
      width: '750px', height: '450px', data: { id: localStorage.getItem('idusu') }
    });
  }

}
