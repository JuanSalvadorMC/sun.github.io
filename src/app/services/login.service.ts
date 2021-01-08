import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NotificacionesService } from './notificaciones.service';
import { AuthService2 } from 'src/app/services/auth.service2';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { FormControl, FormGroup } from '@angular/forms';
import { resolve } from 'dns';
import { UsuariosService } from './usuarios.service';
import { log } from 'console';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { VistaloginService } from './vistalogin.service';

  



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /* FILES */
  loggedIn: boolean;
  private user: SocialUser;
  /*  rq ; */
  rq: any = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    isInversionista: true,
    apellidoPaterno: '',
    redSocialId: '',
  
        contador: 0,
  };

  /* FILES END */
  constructor(

    @Inject(DOCUMENT) public document: Document,
    private auth: AuthService,
    private notificacionesService: NotificacionesService,
    private authService: AuthService2,
    private authSocial: SocialAuthService,
    private usuarioService: UsuariosService,
    private router: Router,
    private ServicioLogin: VistaloginService,
    
  ) { }


  getDataUsuario() {
    this.notificacionesService.activarDesactivarLoader('activar')
    this.auth.loginWithRedirect();
  }

  registroLogin() {
    this.notificacionesService.activarDesactivarLoader('activar')
    this.auth.user$.subscribe((resp: any) => {
      resp.sub = this.getId(resp.sub);
      this.rq.nombre = resp.given_name;
      this.rq.apellidoPaterno = resp.family_name;
      this.rq.email = resp.email;
      this.rq.redSocialId = resp.sub;
      this.register(this.rq);
    })
  }
  register(rq) {
    this.usuarioService.registerUserRedSocial(rq).subscribe((resp: any) => {
      if (resp.exito == true) {
        console.log("Registro exitoso ");
       
       /*  this.statusSesion(resp); */
       this.notificacionesService.activarDesactivarLoader('desactivar');
        this.notificacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Se ha enviado un correo electronico a tu correo para confirmar el registro en el sitio', 'success');
        setTimeout(() => {
          this.login(rq);
        }, 4000);
        
      } else if (resp.exito == false) {
        console.log("Registro error ");
        console.log(resp.mensaje);
        if (resp.mensaje == "Ya existe un registro con ese email.") {
          this.login(rq);
        }
        this.notificacionesService.activarDesactivarLoader('desactivar')
      }
    })
  }

  login(data) {
    this.notificacionesService.activarDesactivarLoader('activar')
    let login = { redSocialId: data.id }
    if (typeof (login) != "undefined") {
      login = { redSocialId: data.redSocialId };
    }
    this.authService.loginRedSocial(login).subscribe((respLog: any) => {
      if (respLog.exito == true) {
        this.statusSesion(respLog);
        /*  this.actualizacionSesion(respLog);   */
     /*    window.location.href = '/#/investment'; */
      } else if (respLog.exito == false) {
       /*  this.registrar(data); */
       this.register(data);
        setTimeout(() => {
          this.notificacionesService.activarDesactivarLoader('desactivar');
        }, 500);

      }
    })

  }




 /*  enterloginFuncion() {
    console.log("entro");
    this.auth.user$.subscribe((resp: any) => {
      console.log(resp.sub);
      resp.sub = this.getId(resp.sub);
      this.rq.nombre = resp.given_name;
      this.rq.apellidoPaterno = resp.family_name;
      this.rq.email = resp.email;
      this.rq.redSocialId = resp.sub;
      this.rq.cp = "-----";
      console.log(this.rq);

      this.login(this.rq);
    })
  } */
  
/*   registrar(rqlocal) {
    console.log(rqlocal);
    rqlocal.isInversionista = true;
    localStorage.setItem('llego a rq local', 'asi es');
    this.usuarioService.registerUserRedSocial(rqlocal).subscribe((resp: any) => {
      console.log(resp.exito);

      if (resp.exito == true) {
        console.log("Registro exitoso ");
        this.statusSesion(resp);
        this.notificacionesService.activarDesactivarLoader('desactivar')
        this.notificacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Se ha enviado un correo electronico a tu correo para confirmar el registro en el sitio', 'success');

      } else if (resp.exito == false) {

        this.notificacionesService.activarDesactivarLoader('desactivar')
      }
    })
  } */



  /* OTROS */
  getId(texto: string) {
    let entrada: Boolean = false;
    const textoarray = Array.from(texto);
    texto = '';
    for (let i = 0; i < textoarray.length; i++) {
      if (entrada == true) { texto += textoarray[i]; }
      if (textoarray[i] == '|') { entrada = true; }
    }
    return texto;
  }

  statusSesion(respLog) {
    /*  this.spinnerService.show(); */
    this.notificacionesService.activarDesactivarLoader('activar')
    localStorage.setItem('SCtoken', respLog.data.token);
    localStorage.setItem('idusu', respLog.data.id);
    localStorage.setItem('isInversionista', respLog.data.isInversionista);
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    this.ServicioLogin.vistaNav$.emit(true);
    this.router.navigate([`/investment`]);

    /*  window.location.href = '/#/investment';  */
    /* window.location.href = '/investment'; */
    this.notificacionesService.activarDesactivarLoader('desactivar')
    setTimeout(() => {
      this.notificacionesService.activarDesactivarLoader('desactivar')
    }, 25000);


  }

}
