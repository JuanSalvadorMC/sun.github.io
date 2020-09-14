import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SocialAuthService } from 'angularx-social-login';
import { EsatdosService } from '../../../services/esatdos.service';

@Component({
  selector: 'app-datos-registro-red-social',
  templateUrl: './datos-registro-red-social.component.html',
  styleUrls: ['./datos-registro-red-social.component.css']
})
export class DatosRegistroRedSocialComponent implements OnInit {

  formRegistrar: FormGroup;
  loggedIn;
  user;
  rq
  idUsuario;
  inversionista: boolean = false;
  catEstados:any[]=[];
  catMunicipios:any[]=[];
  catColonias:any[]=[];

  constructor(public dialogRef: MatDialogRef<DatosRegistroRedSocialComponent>, private notifiacionesService: NotificacionesService, private spinnerService: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: any, private usuarioService: UsuariosService, private router: Router, 
              private authService:AuthService, private authSocial: SocialAuthService,private estadosService: EsatdosService) { }

  ngAfterViewInit(): void {
    this.formRegistrar.get('cp').valueChanges.subscribe(resp=> {
      if(this.formRegistrar.get('cp').valid) this.obtenerInfoCp();
    });
  }
  
  ngOnInit(): void {
    console.log(this.data);
    this.crearFormulario();
    console.log(this.data.inversionista);
      if(this.data.inversionista == "false"){
        this.inversionista = JSON.parse(this.data.inversionista)
        this.formRegistrar.get('isInversionista').disabled
        this.formRegistrar.get('isInversionista').patchValue(this.data.inversionista);
        this.formRegistrar.removeControl('membresia');
    }
      else if(this.data.inversionista == "true"){
        this.inversionista = JSON.parse(this.data.inversionista)
        this.formRegistrar.get('isInversionista').disabled
        this.formRegistrar.get('isInversionista').patchValue(this.data.inversionista);
        this.registrarInversionsiita(this.inversionista)
        this.inversionista = true
    }

    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    }); 
  }

  crearFormulario(){
    this.formRegistrar = new FormGroup({
      nombre: new FormControl(''),
      apellidoPaterno: new FormControl(''),
      apellidoMaterno: new FormControl('',[Validators.required]),
      dir1: new FormControl({value:'', disabled:true},[Validators.required, Validators.minLength(4)]),
      dir2: new FormControl('',[Validators.required, Validators.minLength(4)]),
      estado: new FormControl({value:'', disabled:true},[Validators.required]),
      municipio: new FormControl({value:'', disabled:true},[Validators.required]),
      cp: new FormControl('',[Validators.required, Validators.minLength(5)]),
      email: new FormControl(''),
      redSocialId: new FormControl(''),
      externo: new FormControl(true),
      telefono: new FormControl('',[Validators.required, Validators.minLength(10)]),
      isInversionista: new FormControl('',[Validators.required]),
      membresia: new FormControl(0)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registrarInversionsiita(event){
    this.formRegistrar.addControl('membresia', new FormControl(0, Validators.required))
    this.inversionista = event.isTrusted;
  }

  cambiarTipoUusario(){
    this.inversionista = false
    this.formRegistrar.removeControl('membresia');
  }

  registrar(){
    let login;

    this.spinnerService.hide();
    if(this.data?.id){
      this.rq = this.formRegistrar.getRawValue();
      this.rq.redSocialId = this.data.id
      this.rq.nombre = this.data.firstName
      this.rq.apellidoPaterno = this.data.lastName
      this.rq.email = this.data.email
      this.rq.isInversionista = JSON.parse(this.rq.isInversionista);
      login = { redSocialId: this.data.id }
    }
    else {
      this.rq = this.formRegistrar.getRawValue();
      this.rq.redSocialId = this.data.value.id
      this.rq.nombre = this.data.value.firstName
      this.rq.apellidoPaterno = this.data.value.lastName
      this.rq.email = this.data.value.email
      this.rq.isInversionista = JSON.parse(this.rq.isInversionista);
      login = { redSocialId: this.data.value.id }
    }

        this.usuarioService.registerUserRedSocial(this.rq).subscribe((resp:any) => {
          
           if(resp.exito == true){
            this.notifiacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Registro correcto', 'success').then(any => {
              this.authService.loginRedSocial(login).subscribe((respLog:any) => {
                this.statusSesion(respLog);
                this.idUsuario = resp.data.id
                if(respLog.data.isInversionista == true){
                  this.router.navigate([`investment`]); 
                }else if(respLog.data.isInversionista == false){
                  this.router.navigate([`business`]); 
                } 
                this.spinnerService.hide();
              })
            })
          }
           else if (resp.exito == false){
            this.notifiacionesService.lanzarNotificacion(`Ha ocurrido un error "${resp.mensaje}"`, "Error", 'error');
            this.spinnerService.hide();
           }
        })
        this.dialogRef.close();   
  } 

  statusSesion(respLog){
    this.spinnerService.show();
    localStorage.setItem('SCtoken', respLog.data.token);
    localStorage.setItem('idusu', respLog.data.id );
    localStorage.setItem('isInversionista', respLog.data.isInversionista);
    if(respLog.data.isInversionista == true){
      this.router.navigate([`investment`]); 
    }else if(respLog.data.isInversionista == false){
      this.router.navigate([`business`]); 
    }  
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1500);
  }

  obtenerMunicipios(param?){
    this.catMunicipios = [];
    let parametro = !param ? this.formRegistrar.get('estado').value : param;
    this.estadosService.obtenerMunicipios(parametro).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })
  }

  obtenerColonias(){
      this.estadosService.obtenerColoniaPorCP(this.formRegistrar.get('cp').value).subscribe( (resp:any) => {
        let colonia:any [] =  resp.response.colonia
        colonia.forEach((elm, index) => {
          let coloniaObject = { nombreColonia:elm , idColonia: index+1}
          this.catColonias.push(coloniaObject)
        })
      })
  }

  obtenerInfoCp(){
    this.estadosService.obtenerInfoPorCP(this.formRegistrar.get('cp').value).subscribe((resp:any) => {
      if(resp.error == true)this.notifiacionesService.lanzarNotificacion('Intente con un códico postal válido', 'No se encontraron coincidencias', 'error');
      let estado = resp.response.estado
      let municipio = resp.response.municipio; 
      this.formRegistrar.get('estado').setValue(estado)
      this.obtenerMunicipios();
      this.formRegistrar.get('municipio').setValue(municipio);
      this.obtenerColonias();
      this.formRegistrar.get('dir1').enable();
    },err => {
      this.notifiacionesService.lanzarNotificacion('Intente con un códico postal válido', 'No se encontraron coincidencias', 'error');
      this.formRegistrar.get('estado').reset();
      this.formRegistrar.get('municipio').reset();
    })
  }


}
