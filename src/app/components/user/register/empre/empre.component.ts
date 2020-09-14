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
import { EsatdosService } from '../../../../services/esatdos.service';
import { TerminosCondicionesComponent } from '../../terminos-condiciones/terminos-condiciones.component';

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
  catEstados:any[]=[];
  catMunicipios:any[]=[];
  catColonias:any[]=[];
  aceptoTerminos:boolean = false;

  constructor(private router: Router, private _us: UsuariosService,  private _NTS:NotificacionesService,
              private authSocial: SocialAuthService, private spinnerService:NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService, private estadosService: EsatdosService) { }

  ngAfterViewInit(): void {
    this.formRegisterEmpre.get('cp').valueChanges.subscribe(resp=> {
      if(this.formRegisterEmpre.get('cp').valid) this.obtenerInfoCp();
    });
    this.formRegisterEmpre.get('email').valueChanges.subscribe(resp => {
      this.formRegisterEmpre.get('email').setValue(resp.toLowerCase())
      console.log(resp.toLowerCase());
    })
  }

  ngOnInit(): void {
    this.crearFomulario()
    this.formRegisterEmpre.get('isInversionista').setValue(false);
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });
  }

  crearFomulario() {
    this.formRegisterEmpre = new FormGroup({
      nombre: new FormControl('', [Validators.required,Validators.minLength(4)]),
      apellidoPaterno: new FormControl('',[Validators.required,Validators.minLength(4)]),
      apellidoMaterno: new FormControl('',[Validators.required, Validators.minLength(4)]),
      dir1: new FormControl({value:'', disabled:true},[Validators.required, Validators.minLength(4)]),
      dir2: new FormControl({value:'', disabled:true},[Validators.required, Validators.minLength(4)]),
      estado: new FormControl({value:'', disabled:true},[Validators.required]),
      municipio: new FormControl({value:'', disabled:true},[Validators.required]),
      cp: new FormControl('',[Validators.required, Validators.minLength(5)]),
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
    this.formRegisterEmpre.addControl('externo', new FormControl(false));
    let rq = this.formRegisterEmpre.getRawValue();
    rq.email = rq.email.toLowerCase();
    if(this.aceptoTerminos == false){
      this.spinnerService.hide();
     return this._NTS.lanzarNotificacion('Para continuar tienes que aceptar Términos y Condiciones','No has aceptado Términos y Condiciones','warning')
    }
    this._us.registerUser(rq).subscribe((resp:any) => {
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
    if(this.aceptoTerminos == false){
      this._NTS.lanzarNotificacion('Para continuar tienes que aceptar Términos y Condiciones','No has aceptado Términos y Condiciones','info')
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
      this._NTS.lanzarNotificacion('Para continuar tienes que aceptar Términos y Condiciones','No has aceptado Términos y Condiciones','info')
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
        this._NTS.lanzarNotificacion('Ya existe una cuenta registrada con ese correo', 'Error', 'error');
        this.spinnerService.hide();
      } 
      else if (respLog.exito == false){
        setTimeout(() => {
          this.openDialog(data);
          this.spinnerService.hide();
        }, 1500);
       
      }
   })
  }

  statusSesion(respLog){
    this.spinnerService.show();
    
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
    let inversionistaInfo = {
      value,
      inversionista: "false"
    }
    const dialogRef = this.dialog.open(DatosRegistroRedSocialComponent, {
      data:inversionistaInfo,
     
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  cancelar(){
    this.router.navigateByUrl('/user/login');
  }

  obtenerMunicipios(param?){
    this.catMunicipios = [];
    let parametro = !param ? this.formRegisterEmpre.get('estado').value : param;
    this.estadosService.obtenerMunicipios(parametro).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })
  }

  obtenerColonias(){
    
      this.estadosService.obtenerColoniaPorCP(this.formRegisterEmpre.get('cp').value).subscribe( (resp:any) => {
        let colonia:any [] =  resp.response.colonia
        colonia.forEach((elm, index) => {
          let coloniaObject = { nombreColonia:elm , idColonia: index+1}
          this.catColonias.push(coloniaObject)
        })
      })
  }

  obtenerInfoCp(){
    this.estadosService.obtenerInfoPorCP(this.formRegisterEmpre.get('cp').value).subscribe((resp:any) => {
      if(resp.error == true)this._NTS.lanzarNotificacion('Intente con un códico postal válido', 'No se encontraron coincidencias', 'error');
      let estado = resp.response.estado
      let municipio = resp.response.municipio; 
      this.formRegisterEmpre.get('estado').setValue(estado)
      this.obtenerMunicipios();
      this.formRegisterEmpre.get('municipio').setValue(municipio);
      this.obtenerColonias();
      this.formRegisterEmpre.get('dir2').enable();
    },err => {
      this._NTS.lanzarNotificacion('Intente con un códico postal válido', 'No se encontraron coincidencias', 'error');
      this.formRegisterEmpre.get('estado').reset();
      this.formRegisterEmpre.get('municipio').reset();
    })
  }

  openModalTerminos(){
    const dialogRef = this.dialog.open(TerminosCondicionesComponent, {
      width: '770px',
    height: '800px',
    });
  }
  terminos(){
    this.aceptoTerminos = !this.aceptoTerminos
    console.log(this.aceptoTerminos);
  }
}