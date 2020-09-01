import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-inver',
  templateUrl: './inver.component.html',
  styleUrls: ['./inver.component.css']
})
export class InverComponent implements OnInit {

  formRegister : FormGroup;
  resultado;
  user;
  loggedIn;
  catEstados:any[]=[];
  catMunicipios:any[]=[];
  catColonias:any[]=[];
  aceptoTerminos: boolean = false;

  constructor(private router: Router, private _us: UsuariosService,  private _NTS:NotificacionesService,
              private authSocial: SocialAuthService, private spinnerService:NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService, private estadosService: EsatdosService) { }

  ngAfterViewInit(): void {
    this.formRegister.get('cp').valueChanges.subscribe(resp=> {
      if(this.formRegister.get('cp').valid) this.obtenerInfoCp();
    });
  }

  ngOnInit(): void {
    this.formRegiste();
    this.formRegister.get('isInversionista').setValue(true);
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });
  }

  formRegiste(){
    this.formRegister = new FormGroup({
      nombre: new FormControl('', [Validators.required,Validators.minLength(4)]),
      apellidoPaterno: new FormControl('',[Validators.required,Validators.minLength(4)]),
      apellidoMaterno: new FormControl('',[Validators.required, Validators.minLength(4)]),
      dir1: new FormControl('',[Validators.required, Validators.minLength(4)]),
      dir2: new FormControl('',[Validators.required, Validators.minLength(4)]),
      estado: new FormControl('',[Validators.required]),
      municipio: new FormControl('',[Validators.required]),
      cp: new FormControl('',[Validators.required, Validators.minLength(5)]),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(8)]),
      redSocialId: new FormControl(''),
      telefono: new FormControl('',[Validators.required, Validators.minLength(10)]),
      isInversionista: new FormControl('',[Validators.required]),
      membresia: new FormControl(0),
    })
  }

  registrar() {
   /*  this.spinnerService.show(); */
    this.formRegister.removeControl('redSocialId');
    this.formRegister.removeControl('aceptoTerminos');
    this.formRegister.addControl('externo', new FormControl(false))  
    let rq = this.formRegister.getRawValue();
    rq.email = rq.email.toLowerCase();

    if(this.aceptoTerminos == false){
      this.spinnerService.hide();
     return this._NTS.lanzarNotificacion('Para continuar tienes que aceptar Términos y Condiciones','No haz aceptado Términos y Condiciones','warning')
    }
    this._us.registerUser(rq).subscribe((resp:any) => {
     if(resp.exito == true){
       this._NTS.lanzarNotificacion('Usuario registrado con éxito','Registro correcto', 'success')
       this.router.navigateByUrl('/user/login');
       this.spinnerService.hide()
     }else if (resp.exito == false){
      this._NTS.lanzarNotificacion(`Ha ocurrido un error "${resp.mensaje}"`, "Error", 'error');
      this.spinnerService.hide()
     }
     this.spinnerService.hide(); 
    })
  
  }
  registroGoogle(): void {
    if(this.aceptoTerminos == false){
      this._NTS.lanzarNotificacion('Para continuar tienes que aceptar Términos y Condiciones','No haz aceptado Términos y Condiciones','warning')
    }else if(this.aceptoTerminos == true) {
      this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then( (resp:any)=>{
        this.spinnerService.show();
        if(resp.id){
        this.spinnerService.hide();
        this.registrarRedSocial(resp);
        }
      });
    }
  }
 
  registroFacebook(): void {
    if(this.aceptoTerminos == false){
      this._NTS.lanzarNotificacion('Para continuar tienes que aceptar Términos y Condiciones','No haz aceptado Términos y Condiciones','warning')
    }else if(this.aceptoTerminos == true) {
      this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp =>{
        this.spinnerService.show();
        if(resp.id){
          this.spinnerService.hide();
          this.registrarRedSocial(resp);
          }
      });
    }
  }
  registrarRedSocial(data){
    this.spinnerService.show()
    let login = { redSocialId: data.id }
    this.authService.loginRedSocial(login).subscribe((respLog:any) => {
      if(respLog.exito == true){
        this._NTS.lanzarNotificacion('Ya existe una cuenta registrada con ese correo', 'Error', 'error').then(resp => {
          this.formRegister.get('isInversionista').setValue(true);
        });
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
    localStorage.setItem('SCtoken', respLog.data.token);
    localStorage.setItem('idusu', respLog.data.id );
    localStorage.setItem('isInversionista', respLog.data.isInversionista); 
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1500);
  }

  openDialog(value){
    let inversionistaInfo = {
      value,
      inversionista: "true"
    }
    const dialogRef = this.dialog.open(DatosRegistroRedSocialComponent, {
      data:inversionistaInfo
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  cancelar(){
    this.router.navigateByUrl('/user/login');
  }

  obtenerMunicipios(param?){
    this.catMunicipios = [];
    let parametro = !param ? this.formRegister.get('estado').value : param;
    this.estadosService.obtenerMunicipios(parametro).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })
  }

  obtenerColonias(){
    
    this.estadosService.obtenerColoniaPorCP(this.formRegister.get('cp').value).subscribe( (resp:any) => {
      let colonia:any [] =  resp.response.colonia
      colonia.forEach((elm, index) => {
        let coloniaObject = { nombreColonia:elm , idColonia: index+1}
        this.catColonias.push(coloniaObject)
      })
      console.log(this.catColonias);

    })
}

obtenerInfoCp(){
  this.estadosService.obtenerInfoPorCP(this.formRegister.get('cp').value).subscribe((resp:any) => {
    let estado = resp.response.estado
    let municipio = resp.response.municipio; 
    this.formRegister.get('estado').setValue(estado)
    this.obtenerMunicipios();
    this.formRegister.get('municipio').setValue(municipio);
    this.obtenerColonias();
  },err => {
    this._NTS.lanzarNotificacion('Intente con un códico postal válido', 'No se encontraron coincidencias', 'error');
    this.formRegister.get('estado').reset();
    this.formRegister.get('municipio').reset();
  })
  console.log(this.formRegister.value);
}

openModalTerminos(){
  const dialogRef = this.dialog.open(TerminosCondicionesComponent, {
    width: '750px',
    height: '500px',
  });
}

terminos(){
  this.aceptoTerminos = !this.aceptoTerminos
  console.log(this.aceptoTerminos);
}
}
