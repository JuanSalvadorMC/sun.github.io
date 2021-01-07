import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NotificacionesService } from './notificaciones.service';
import { AuthService2 } from 'src/app/services/auth.service2';
import { SocialAuthService,SocialUser } from 'angularx-social-login';
import { FormControl, FormGroup } from '@angular/forms';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /* FILES */
  loggedIn: boolean;
  private user: SocialUser;
 /*  rq ; */
  rq :any = {
    nombre: '',
    email: '',
    password: '' ,
    telefono: '' ,
    isInversionista:'' ,
    apellidoPaterno:'',
    redSocialId :'',
  };
  
  /* FILES END */
  constructor( 
    
    @Inject(DOCUMENT) public document: Document, 
    private auth: AuthService,
    private notificacionesService: NotificacionesService,
    private authService: AuthService2,
    private authSocial: SocialAuthService,
    ) { }
   

  loginFuncion(): void {
  this.notificacionesService.activarDesactivarLoader('activar')
  this.auth.loginWithRedirect();
  this.enterloginFuncion();
  }
  /* enterloginFuncion1(){
    localStorage.setItem('inprobable', "sip");
    console.log("inprobable");
  } */

  getId(texto :string){
    let entrada:Boolean = false;
    const textoarray = Array.from(texto);
    texto='';
    for (let i = 0; i <  textoarray.length; i++){
      if ( entrada ==true) { texto+=textoarray[i] ; }
      if (textoarray[i] =='|') { entrada=true; } 
      }
    console.log(texto);
    
    return texto;
  }

  enterloginFuncion(){
    console.log("entro");
    
    this.auth.user$.subscribe((resp: any) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      resp.sub=this.getId(resp.sub);
     /*  this.idGoogle = resp.id;
      this.datosRegistro = resp; */
      this.rq.nombre = resp.given_name;
      this.rq.apellidoPaterno = resp.family_name;
      this.rq.email = resp.email;
      this.rq.redSocialId =  resp.sub;
      this.rq.cp = "-----";
      console.log(this.rq);
      
      this.loginServicio2( this.rq);
     /* 

        
     /*  this.loginServicio2( this.rq); */
   
        })
     
        
        console.log(this.rq);
       
        
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
           
          
           setTimeout(() => {
             this.notificacionesService.activarDesactivarLoader('desactivar');     
           }, 1500);
                  
         }
       }) 
      
      
  }

  statusSesion(respLog) {
   /*  this.spinnerService.show(); */
   this.notificacionesService.activarDesactivarLoader('activar')
    console.log(respLog);
    localStorage.setItem('SCtoken', respLog.data.token);
    localStorage.setItem('idusu', respLog.data.id);
    localStorage.setItem('isInversionista', respLog.data.isInversionista);
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    setTimeout(() => {
      this.notificacionesService.activarDesactivarLoader('desactivar')
    }, 1500);
  }

}
