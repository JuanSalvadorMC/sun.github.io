import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';
import { interval, Subject } from 'rxjs';
import { map, repeatWhen, takeUntil, timeout } from 'rxjs/operators';
import { AuthService2 } from 'src/app/services/auth.service2';
import { NavbarService } from 'src/app/services/navbar.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { RecuperarContraseniaComponent } from '../../modals/recuperar-contrasenia/recuperar-contrasenia.component';
import { SocialUser } from "angularx-social-login";
import { VistaloginService } from 'src/app/services/vistalogin.service';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})

export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('myVideo') myVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('buttonVideo') buttonVideo: ElementRef<HTMLButtonElement>;

  /* logn */
  private user: SocialUser;
  mostrarlogin: boolean = false;
  formLogin: FormGroup;
  hide = true;
  myModel = true;
  resultado;
  respuesta;
  loggedIn: boolean;
  idUsuario: any;
  estados: any[] = [];
  municipios: any[] = [];
  mensaje: string = "navbar";
  /*  login*/

  bgColor = 'primary';
  color = 'warn';
  ocultarRegistro: boolean = true;
  

  // SLIDER CONFIGURACION
  indice: number = 1;
  velocidad: number = 15000;

  $interval = interval(6000);
  private readonly _stop = new Subject<void>();
  private readonly _start = new Subject<void>();

  constructor(private _NTS: NotificacionesService, private router: Router, public dialog: MatDialog,
    private usService: AuthService2, private authSocial: SocialAuthService,
    private spinnerService: NgxSpinnerService, private nav: NavbarService, private ServicioLogin: VistaloginService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) public document: Document, 
     public auth: AuthService,
     private loginS: LoginService, ) { }

  ngOnInit(): void {

    this.auth.user$.subscribe((resp: any) => {
      if (resp) {this.loginS.enterloginFuncion(); 
      }else{console.log(resp);    }})

    /*  =localStorage.getItem("paswordBase" ); */


    /* 
     this.ret(); */

    this.crearFormulario();
    if (localStorage.getItem('idusu')) {
      this.ocultarRegistro = false;

    }
    /* OBSERVABLE */
    this.ServicioLogin.vistaLogin$.subscribe(valor => {
      this.mostrarlogin = valor;
    });


    this.muestraSlides(this.indice);
    this.iniciarContador();
    /* login */


    this.usService.getCurrentRol();
    this.nav.ocultarNavOpciones();
    /* login */


    /* this.router.navigate(['/info-invers']); */




  }

  ngAfterViewInit(): void {
    console.log("ViewChild");

    this.myVideo.nativeElement.src = "https://storage.googleapis.com/com-ies-sun-storage/presentacion3.mp4";
    this.myVideo.nativeElement.loop=true;
    this.myVideo.nativeElement.muted = true;
    this.myVideo.nativeElement.play();
  }

  // playVideo(){
  //   this.myVideo.nativeElement.play();
  // }

  viewVideo: boolean = false;

  ret() {

    this.mensaje = localStorage.getItem("redireccion");


    console.log("entro a rest  " + this.mensaje)

    if (this.mensaje == "false") {
      console.log("entro al if  " + this.mensaje)
      let redireccion: string = 'true';
      localStorage.setItem('redireccion', redireccion);
      this.mensaje = localStorage.getItem("redireccion");
      setTimeout(() => {
        /* this.router.navigate(['/load']); */
        /*  window.location.href = '/#/load';  */
        console.log('--');
      }, 4000);
    }



  }

 crearFormulario() {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
    })
  }

  /*LOGIN  */
 
  onLoginCorreo() {
    this._NTS.activarDesactivarLoader('activar');
    let rq = this.formLogin.getRawValue();
    rq.email = rq.email.toLowerCase();
    this.usService.onlogin(rq).subscribe((resp: any) => {
      if (resp.exito === true) {
        this.idUsuario = localStorage.getItem('idusu');
        if (resp.data.isInversionista == true && resp.data.isActivo == false) {
          this._NTS.activarDesactivarLoader('desactivar');
          this._NTS.lanzarNotificacion('Por favor revisa tu correo e inicia sesión desde el enlace enviado', 'No se ha verificado este correo', 'warning');
        }
        else if (resp.data.isInversionista == true && resp.data.isActivo == true) {
          this.usService.setId(resp.data.id);
          this.usService.setToken(resp.data.token)
          this.usService.setRol(resp.data.isInversionista)
          this.router.navigate([`investment`]);
        }
        if (resp.data.isInversionista == false && resp.data.isActivo == false) {
          this._NTS.activarDesactivarLoader('desactivar');
          this._NTS.lanzarNotificacion('Por favor revisa tu correo e inicia sesión desde el enlace enviado', 'No se ha verificado este correo', 'warning');
        }
        else if (resp.data.isInversionista == false && resp.data.isActivo == true) {
          this.usService.setId(resp.data.id);
          this.usService.setToken(resp.data.token)
          this.usService.setRol(resp.data.isInversionista)
          this.router.navigate([`business`]);
        }

        this._NTS.activarDesactivarLoader('desactivar');
        console.log(resp);
      }
      else if (resp.exito === false) {
        this._NTS.lanzarNotificacion(resp.mensaje, "Error", "error");
        console.log(resp);
        this._NTS.activarDesactivarLoader('desactivar');
      }
    }, err => {
      this._NTS.lanzarNotificacion("Inicia sesión con con tu proveedor de correo", "Atención", "info");
      this._NTS.activarDesactivarLoader('desactivar');

    });
  }
  validador;
  loginGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then((resp: any) => {
      this.registrarRedSocial(resp)
    });
  }

  loginFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp => {
      this.registrarRedSocial(resp)
    });
  }

  registrarRedSocial(data) {
    this._NTS.activarDesactivarLoader('activar')
    let login = { redSocialId: data.id }
    this.usService.loginRedSocial(login).subscribe((respLog: any) => {
      if (respLog.exito == true) {
        this.statusSesion(respLog);
      }
      else if (respLog.exito == false) {
        setTimeout(() => {
          this._NTS.lanzarNotificacion("Regitrate para poder iniciar sesion", "Usuario no encontrado", "warning");
          /*  this.openDialog(data); */
          this._NTS.activarDesactivarLoader('desactivar');

          this.router.navigate([`/user/register/investment`]);
        }, 1500);
        console.log("te tienes que registrar");
      }
    })
  }


  loginRedSocial(data) {
    this._NTS.activarDesactivarLoader('activar')
    let login = { redSocialId: data.id }
    this.usService.loginRedSocial(login).subscribe((respLog: any) => {
      if (respLog.exito == true) {
        this.statusSesionLogin(respLog);
      }
      else if (respLog.exito == false) {
        setTimeout(() => {
          this._NTS.lanzarNotificacion("Regitrate para poder iniciar sesion", "Usuario no encontrado", "warning");
          this.router.navigateByUrl('/user/register/investment');
          /* OBSERVABLE */

          this.router.navigate([`/user/register/investment`]);
          this.ServicioLogin.vistaLogin$.emit(false);


          /*  this.openDialog(data); */
          this._NTS.activarDesactivarLoader('desactivar');
        }, 1500);

      }
    })
  }
  statusSesionLogin(respLog) {
    this._NTS.activarDesactivarLoader('activar');
    console.log(respLog);
    this.usService.setId(respLog.data.id);
    this.usService.setToken(respLog.data.token)
    this.usService.setRol(respLog.data.isInversionista);
    this.idUsuario = localStorage.getItem('idusu');
    if (respLog.data.isInversionista == true) {
      this.router.navigate([`investment`]);
      /*  this.router.navigate([`investment`]);  */
    } else if (respLog.data.isInversionista == false) {
      /*  this.router.navigate([`business`]) */
      this.router.navigate([`investment`]);
    }
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    setTimeout(() => {
      this._NTS.activarDesactivarLoader('desactivar');
    }, 1500);
  }

  statusSesion(respLog) {
    this._NTS.activarDesactivarLoader('activar');
    console.log(respLog);
    this.usService.setId(respLog.data.id);
    this.usService.setToken(respLog.data.token)
    this.usService.setRol(respLog.data.isInversionista);
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
      this._NTS.activarDesactivarLoader('desactivar');
    }, 1500);
  }


  openModarRecuperarContra() {
    const dialogRef = this.dialog.open(RecuperarContraseniaComponent, {
      width: '350px',
      height: '350px',
      data: { id: localStorage.getItem('idusu') }
    });
  }

  /*LOGIN  */


















  limpiarInterval() {
    this._stop.next();
    this._start.next();
  }


  // SLIDER
  iniciarContador() {
    this.$interval.pipe(
      takeUntil(this._stop),
      repeatWhen(() => this._start),
      map((x) => {
        this.indice++;
        this.muestraSlides(this.indice);
        return x;
      }),
    ).subscribe(x => x)
  }

  avanzaSlide(n) {
    this.limpiarInterval();
    this.muestraSlides(this.indice += n);
  }

  posicionSlide(n) {
    this.limpiarInterval();
    this.muestraSlides(this.indice = n);
  }



  muestraSlides(n) {
    let i;
    let slides: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName('miSlider') as HTMLCollectionOf<HTMLDivElement>;
    let barras: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName('barra') as HTMLCollectionOf<HTMLDivElement>;

    if (n > slides.length) {
      this.indice = 1;
    }
    if (n < 1) {
      this.indice = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (i = 0; i < barras.length; i++) {
      barras[i].className = barras[i].className.replace(" active", "");
    }

    slides[this.indice - 1].style.display = 'block';
    barras[this.indice - 1].className += ' active';
  }

  /* OTROS */
  vistaRegistroScroll() {
   /*  if (this.vistaRegistro) { this.vistaRegistro = false; } else { this.vistaRegistro = true; } */
    document.getElementById("home").scrollIntoView();
   
      this.mostrarlogin=true;
      this.ServicioLogin.vistaLogin$.emit(true);
    
   }
   

}