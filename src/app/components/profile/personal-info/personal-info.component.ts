import { UsuariosService } from './../../../services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalContraComponent } from '../../modals/modal-contra/modal-contra.component';
import { NavbarService } from '../../../services/navbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { MatDialog } from '@angular/material/dialog';
import { EsatdosService } from '../../../services/esatdos.service';
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  
  formProfile :  FormGroup;
  users;
  resultados;
  respuesta;
  respBack;
  vermembresia: boolean = false;
  usuario:any[]=[];
  idUsuario;
  catEstados:any[]=[];
  catMunicipios:any[]=[];
  catColonias:any[]=[];
  

  constructor( private _us: UsuariosService,private activatedRoute: ActivatedRoute, private nav: NavbarService, private spinnerService: NgxSpinnerService,
               private router: Router, private notificacionesService:NotificacionesService, public dialog: MatDialog, private estadosService: EsatdosService ) { }
  
   ngAfterViewInit(): void {
    this.formProfile.get('cp').valueChanges.subscribe(resp=> {
      if(this.formProfile.get('cp').valid) this.obtenerInfoCp();
    });
  }

  ngOnInit(): void {
   /*  this.spinnerService.show(); */
   this.spinnerService.hide()
    this.crearFormulario();
    this.activatedRoute.params.subscribe(resp => {this.idUsuario = resp.id})
    
    if (localStorage.getItem('isInversionista') === "true") {
      this.vermembresia = true;
      this.spinnerService.hide()

    } else if(localStorage.getItem('isInversionista') === "false"){
      this.vermembresia = false;
      this.spinnerService.hide()
    }
   
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });
    this.buscar();
  }

  crearFormulario(){
    this.formProfile = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
      apellidoPaterno: new FormControl('', [Validators.required, Validators.minLength(4)]),
      apellidoMaterno: new FormControl('', [Validators.required, Validators.minLength(4)]),
      cp: new FormControl('', [Validators.required, Validators.minLength(4)]),
      estado: new FormControl('', [Validators.required, Validators.minLength(4)]),
      municipio: new FormControl('', [Validators.required, Validators.minLength(4)]),
      dir1: new FormControl('', [Validators.required, Validators.minLength(4)]),
      dir2: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(10)]),
      externo: new FormControl(''),
      isInversionista: new FormControl('', [Validators.required, Validators.required]),
      membresia: new FormControl({value:'', disabled:true}),
      contador:  new FormControl({value:'', disabled:true}),
      fechaInicio:  new FormControl({value:'', disabled:true}),
      fechaFin:  new FormControl({value:'', disabled:true}),
      id: new FormControl(localStorage.getItem('idusu'))
    })
  }
 
buscar() {
  this._us.consultUserId(this.idUsuario).subscribe((resp:any) => {
    this.usuario = resp.data;
    console.log(this.usuario);
    
    let nombreMmebresia:any;
    this.formProfile.get('dir2').setValue(this.usuario[0].dir2)
   
    this.formProfile.patchValue(this.usuario[0]);
    this.usuario[0].membresia == 0 ? nombreMmebresia = "Membresía Gratuita": null;
    this.usuario[0].membresia == 1 ? nombreMmebresia = "Plan Estándar": null;
    this.usuario[0].membresia == 2 ? nombreMmebresia = "Plan Destacado": null;
    if(this.usuario[0].membresia == 3){
      nombreMmebresia = "Plan Premuim";
      this.formProfile.get('contador').setValue('Ilimitado')
    }
    this.formProfile.get('membresia').setValue(nombreMmebresia)
    
  });
}

guardar(){
   this.spinnerService.show();
   this._us.editarPerfil(this.formProfile.value)
   .subscribe((respEditar : any) => {
    if (respEditar.exito === true){
      this.notificacionesService.lanzarNotificacion(respEditar.mensaje, "Registro actualizado con exito", "success");
      this.spinnerService.hide()
    }
  },err => {
    this.notificacionesService.lanzarNotificacion("Hubo un error al actualizar los datos, intente más tarde", "Error", "error")
    this.spinnerService.hide()
  
  });
}

openDialogEquipa(){
  const dialogRef = this.dialog.open(ModalContraComponent, {
    width: '350px',
    height: '350px',
    data: { id : localStorage.getItem('idusu') }
  });
  
}

obtenerMunicipios(param?){
  this.catMunicipios = [];
  let parametro = !param ? this.formProfile.get('estado').value : param;
  this.estadosService.obtenerMunicipios(parametro).subscribe(resp => {
    let municipio:any[]= resp.response.municipios
    municipio.forEach((elm, i)=> {
      let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
      this.catMunicipios.push(municipioObject)
    });
  })
}

obtenerColonias(){
  
    this.estadosService.obtenerColoniaPorCP(this.formProfile.get('cp').value).subscribe( (resp:any) => {
      let colonia:any [] =  resp.response.colonia
      colonia.forEach((elm, index) => {
        let coloniaObject = { nombreColonia:elm , idColonia: index+1}
        this.catColonias.push(coloniaObject)
      })
    })
}

obtenerInfoCp(){
  this.estadosService.obtenerInfoPorCP(this.formProfile.get('cp').value).subscribe((resp:any) => {
    if(resp.error == true)this.notificacionesService.lanzarNotificacion('Intente con un códico postal válido', 'No se encontraron coincidencias', 'error');
    let estado = resp.response.estado
    let municipio = resp.response.municipio; 
    this.formProfile.get('estado').setValue(estado)
    this.obtenerMunicipios();
    this.formProfile.get('municipio').setValue(municipio);
    this.obtenerColonias();
  },err => {
    this.notificacionesService.lanzarNotificacion('Intente con un códico postal válido', 'No se encontraron coincidencias', 'error');
    this.formProfile.get('estado').reset();
    this.formProfile.get('municipio').reset();
  })
}

}
