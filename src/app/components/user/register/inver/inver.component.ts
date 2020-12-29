import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SocialAuthService } from 'angularx-social-login';
import { NotificacionesService } from '../../../../services/notificaciones.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { DatosRegistroRedSocialComponent } from '../../../modals/datos-registro-red-social/datos-registro-red-social.component';
import { EsatdosService } from '../../../../services/esatdos.service';
import { TerminosCondicionesComponent } from '../../terminos-condiciones/terminos-condiciones.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VistaloginService } from 'src/app/services/vistalogin.service';

@Component({
  selector: 'app-inver',
  templateUrl: './inver.component.html',
  styleUrls: ['./inver.component.css']
})
export class InverComponent implements OnInit {

  mostrarlogin:boolean=false;
  idGoogle;
  datosRegistro;
  rq;
  idUsuario;
  formRegister: FormGroup;
  resultado;
  user;
  loggedIn;
  catEstados: any[] = [];
  catMunicipios: any[] = [];
  catColonias: any[] = [];
  aceptoTerminos: boolean = true;

  constructor(private router: Router, private _us: UsuariosService, private _NTS: NotificacionesService,
    private authSocial: SocialAuthService, private spinnerService: NgxSpinnerService, private usuarioService: UsuariosService,
    public dialog: MatDialog, private authService: AuthService, private estadosService: EsatdosService,private vistaLogin:VistaloginService,) { }

  ngAfterViewInit(): void {
    this.formRegister.get('cp').valueChanges.subscribe(resp => {
      if (this.formRegister.get('cp').valid) this.obtenerInfoCp();
    });
  }

  ngOnInit(): void {
    this.formRegiste();
    this.formRegister.get('isInversionista').setValue(true);
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado: any[] = resp.response.estado
      estado.forEach((elm, i) => {
        let estadoObject = { nombreEstado: elm, idEstado: i + 1 }
        this.catEstados.push(estadoObject)
      })
    });

    /* OBSERVABLE */
this.vistaLogin.vistaLogin$.subscribe(valor =>{
  this.mostrarlogin=valor;
  });


  }

  

  formRegiste() {
    this.formRegister = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
      apellidoPaterno: new FormControl('', [Validators.required, Validators.minLength(4)]),
      apellidoMaterno: new FormControl('', [Validators.required, Validators.minLength(4)]),
      dir2: new FormControl('', [Validators.required, Validators.minLength(4)]),
      dir1: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(4)]),
      estado: new FormControl({ value: '', disabled: true }, [Validators.required]),
      municipio: new FormControl({ value: '', disabled: true }, [Validators.required]),
      cp: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      redSocialId: new FormControl(''),
      telefono: new FormControl('', [Validators.required, Validators.minLength(10)]),
      isInversionista: new FormControl('', [Validators.required]),
      membresia: new FormControl(0),
    })
  }

  registrar() {
    this.spinnerService.show();
    this.formRegister.removeControl('redSocialId');
    this.formRegister.removeControl('aceptoTerminos');
    this.formRegister.addControl('externo', new FormControl(false))
    let rq = this.formRegister.getRawValue();
    rq.email = rq.email.toLowerCase();

    if (this.aceptoTerminos == false) {
      this.spinnerService.hide();
      return this._NTS.lanzarNotificacion('Para continuar tienes que aceptar Términos y Condiciones', 'No has aceptado Términos y Condiciones', 'warning')
    }
    this.spinnerService.show();
    this._us.registerUser(rq).subscribe((resp: any) => {
      if (resp.exito == true) {
        this._NTS.lanzarNotificacion('Usuario registrado con éxito', 'Te llegara un correo electronico a tu bandeja de entrada para notificar el registro en el sitio.', 'success')
        this.router.navigateByUrl('/user/login');
        this.spinnerService.hide()
      } else if (resp.exito == false) {
        if (resp.mensaje=="Ya existe un registro con ese email.") {
          this.spinnerService.hide();
          this._NTS.lanzarNotificacion(`"${resp.mensaje}"`, "Inicio de Sesión", 'success');
          console.log("entro");

          
        }
        
        
      }
      this.spinnerService.hide();
    })

  }
  registroGoogle(): void {
    this.rq = this.formRegister.getRawValue();
   /*  this.rq.telefono = this.generadortelefono(); */
  
    if (this.aceptoTerminos == false) {
      this._NTS.lanzarNotificacion('Para continuar tienes que aceptar Términos y Condiciones', 'No has aceptado Términos y Condiciones', 'warning')
    } else if (this.aceptoTerminos == true) {

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

       this.registroServicio(this.rq);
 
        }
      });
    }
  }
  registroServicio(resp) {
    this.spinnerService.show();
    this.datosRegistro = resp;
    this.usuarioService.registerUserRedSocial(this.rq).subscribe((resp: any) => {
      let login = this.idGoogle;
      if (resp.exito == true) {
        this.spinnerService.hide();
        this._NTS.lanzarNotificacion('Usuario registrado con éxito', 'Un correo electronico llegara a tu bandeja de entrada para confirmar el registro en el sitio', 'success').then(any => {
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
        this.mostrarlogin=true;
      }
      else if (resp.exito == false) {
        /* this._NTS.lanzarNotificacion(`Ha ocurrido un error "${resp.mensaje}"`, "Error", 'error');
 */
        if (resp.mensaje=="Ya existe un registro con ese email.") {
          this.spinnerService.hide();
          this._NTS.lanzarNotificacion(`"${resp.mensaje}"`, "Inicio de Sesión", 'success');
          this.loginGoogle();       
        }
        this.spinnerService.hide();
      }
    })
  }

  generadortelefono(){return Math.floor(Math.random()*(9999999999 - 1000000000) + 1000000000);}

  registroFacebook(): void {
    this.spinnerService.show();
    this.rq = this.formRegister.getRawValue();
    if (this.aceptoTerminos == false) {
      this.spinnerService.hide();
      this._NTS.lanzarNotificacion('Para continuar tienes que aceptar Términos y Condiciones', 'No has aceptado Términos y Condiciones', 'warning')
    } else if (this.aceptoTerminos == true) {
  
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
  }
  registrarRedSocial(data) {
    this.spinnerService.show()
    let login = { redSocialId: data.id }
    this.authService.loginRedSocial(login).subscribe((respLog: any) => {
      if (respLog.exito == true) {
        this._NTS.lanzarNotificacion('Ya existe una cuenta registrada con ese correo', 'Error', 'error').then(resp => {
          this.formRegister.get('isInversionista').setValue(true);
        });
        this.spinnerService.hide();
      }
      else if (respLog.exito == false) {
        setTimeout(() => {
          this.openDialog(data);
          this.spinnerService.hide();
        }, 1500);
      
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

  openDialog(value) {
    let inversionistaInfo = {
      value,
      inversionista: "true"
    }
    const dialogRef = this.dialog.open(DatosRegistroRedSocialComponent, {
      data: inversionistaInfo
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  cancelar() {
    this.router.navigateByUrl('/user/login');
  }

  obtenerMunicipios(param?) {
    this.catMunicipios = [];
    let parametro = !param ? this.formRegister.get('estado').value : param;
    this.estadosService.obtenerMunicipios(parametro).subscribe(resp => {
      let municipio: any[] = resp.response.municipios
      municipio.forEach((elm, i) => {
        let municipioObject = { nombreMunicipio: elm, idMunicipio: i + 1 }
        this.catMunicipios.push(municipioObject)
      });
    })
  }

  obtenerColonias() {

    this.estadosService.obtenerColoniaPorCP(this.formRegister.get('cp').value).subscribe((resp: any) => {
      let colonia: any[] = resp.response.colonia
      colonia.forEach((elm, index) => {
        let coloniaObject = { nombreColonia: elm, idColonia: index + 1 }
        this.catColonias.push(coloniaObject)
      })
  

    })
  }

  obtenerInfoCp() {
    this.estadosService.obtenerInfoPorCP(this.formRegister.get('cp').value).subscribe((resp: any) => {
      if (resp.error == true) this._NTS.lanzarNotificacion('Intente con un códico postal válido', 'No se encontraron coincidencias', 'error');
      let estado = resp.response.estado
      let municipio = resp.response.municipio;
      this.formRegister.get('estado').setValue(estado)
      this.obtenerMunicipios();
      this.formRegister.get('municipio').setValue(municipio);
      this.obtenerColonias();
      this.formRegister.get('dir1').enable();
    }, err => {
      this._NTS.lanzarNotificacion('Intente con un códico postal válido', 'No se encontraron coincidencias', 'error');
      this.formRegister.get('estado').reset();
      this.formRegister.get('municipio').reset();
    })
  
  }

 /*  openModalTerminos() {
    this._NTS.terminosSubject.next(false);
    const dialogRef = this.dialog.open(TerminosCondicionesComponent, {
      width: '770px',
      height: '800px',
    });
  }

  terminos() {
    this.aceptoTerminos = !this.aceptoTerminos
    console.log(this.aceptoTerminos);
  } */

  loginFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp =>{
      this.loginRedSocial(resp)
    });
  }

  loginGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then( (resp:any)=>{
    this.loginRedSocial(resp)
      
    });
}
loginRedSocial(data){
  this._NTS.activarDesactivarLoader('activar')
  let login = { redSocialId: data.id }
  this.authService.loginRedSocial(login).subscribe((respLog:any) => {
    if(respLog.exito == true){
      this.statusSesionLogin(respLog);
    } 
    else if (respLog.exito == false){
      setTimeout(() => {
        this._NTS.lanzarNotificacion("Regitrate para poder iniciar sesion", "Usuario no encontrado", "error");
        /* OBSERVABLE */

        this.router.navigate([`/user/register/investment`]);
        this.vistaLogin.vistaLogin$.emit(false);


       /*  this.openDialog(data); */
        this._NTS.activarDesactivarLoader('desactivar');
      }, 1500);
  
    }
 })
}

statusSesionLogin(respLog){
  this._NTS.activarDesactivarLoader('activar');
  console.log(respLog);
  this.authService.setId(respLog.data.id);
  this.authService.setToken(respLog.data.token)
  this.authService.setRol(respLog.data.isInversionista);
  this.idUsuario = localStorage.getItem('idusu');
  if(respLog.data.isInversionista == true){
    this.router.navigate([`investment`]); 
   /*  this.router.navigate([`investment`]);  */
  }else if(respLog.data.isInversionista == false){
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


}
