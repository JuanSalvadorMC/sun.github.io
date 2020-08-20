import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FileReaderPromiseLikeService } from 'fctrlx-angular-file-reader';
import { TraspasosService } from 'src/app/services/traspasos.service';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';
import { isNullOrUndefined } from 'util';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  formSale: FormGroup;
  resultado;
  imageError: string;
  catTipoNegocio: any[] = [];
  catEstados:any[]=[];
  catMunicipios:any[]=[];
  esConsulta: boolean=false;

  constructor(
    private _tras: TraspasosService,
    public promiseService: FileReaderPromiseLikeService,
    private usuariosService: UsuariosService,
    private estadosService: EsatdosService,
    public dialogRef: MatDialogRef<SaleComponent>,
    private _traspasoService :  TraspasosService,
    private notificacionesService : NotificacionesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    console.log(this.catTipoNegocio);
    this.formSaleTras();
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });
    
  }

  formSaleTras() {
    this.formSale = new FormGroup({
      nombre: new FormControl('', Validators.required),
      tipoNegocio: new FormControl('', Validators.required),
      monto: new FormControl(null, Validators.required),
      ventaMensualPromedio: new FormControl(200, Validators.required),
      gastosOperacionMensual: new FormControl(300, Validators.required),
      estado: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      ubicacion: new FormControl(''),
      descripcion: new FormControl('', Validators.required),
      competidores: new FormControl('', Validators.required),
      // imagenes: new FormControl('', Validators.required),
      imagenes: new FormArray([], Validators.required),
      creador: new FormControl(localStorage.getItem('idusu'), Validators.required),
    });
    
    
  }


  actualizar(){
    let rq = this.formSale.getRawValue();
    try {
      rq.monto = JSON.parse(rq.monto);
      rq.ventaMensualPromedio = JSON.parse(rq.ventaMensualPromedio);
      rq.gastosOperacionMensual = JSON.parse(rq.gastosOperacionMensual);
      rq.creador = JSON.parse(rq.creador);
      
      rq.imagenes = rq.imagenes.reduce((acc, value) => {
        acc.push(value.imgBase);
        return acc;
      }, []);    
    } catch(e) {
      return Swal.fire('Alerta', 'Campos incorrectos', 'error')
    }
   console.log(rq);

   /* ---------------------------------- */
   if (!isNullOrUndefined(rq.imagenes[1])) {
    let imagesArray={
      id:rq.id,
      url:rq.imagenes[0].imgBase,
      imagen:rq.imagenes[1].imgBase
    };
    
    console.log(imagesArray);
       this._traspasoService.actualizarImagenTraspaso(imagesArray).subscribe((resp:any) => {
  if (resp.exito) {
    this.notificacionesService.lanzarNotificacion('Registro Actualizado Correctamente','Registro correcto','success').then(( )=>this.dialogRef.close()); 
  }
 }, (err) =>    this.notificacionesService.lanzarNotificacion('Registro Actualizado Con Éxito','exitoso','success'));
     
  }
 
   

    this._traspasoService.actualizarTraspaso(rq).subscribe((resp:any) => {

      if (resp.exito) {
        Swal.fire('Alerta', resp.mensaje, 'success').then(( )=>this.dialogRef.close());
        this.formSale.reset();
        this.formSale.get('id').patchValue(localStorage.getItem('idusu'));
      }
      this.resultado = resp;
     /* console.log(this.resultado);  */
      
      (<FormArray>this.formSale.get('imagenes')).clear();

      this.reset(this.formSale);

    }, (err) => Swal.fire('Alerta', 'Ha ocurrido un error al registrarse', 'error'));
    
  }

  consultar() {
    let rq = this.formSale.getRawValue();

    try {
      rq.monto = JSON.parse(rq.monto);
      rq.ventaMensualPromedio = JSON.parse(rq.ventaMensualPromedio);
      rq.gastosOperacionMensual = JSON.parse(rq.gastosOperacionMensual);
  
      rq.imagenes = rq.imagenes.reduce((acc, value) => {
        acc.push(value.imgBase);
        return acc;
      }, []);   
    } catch(e) {
      return Swal.fire('Alerta', 'Campos incorrectos', 'error')
    }

    this._tras.registerTraspaso(rq).subscribe((resp: any) => {

      if (resp.exito) {
        Swal.fire('Alerta', resp.mensaje, 'success');
        this.formSale.reset();
        this.formSale.get('id').patchValue(localStorage.getItem('idusu'));
      }
      console.log(resp);

      
      (<FormArray>this.formSale.get('imagenes')).clear();

      this.reset(this.formSale);
      
    }, (err) => Swal.fire('Alerta', 'Ha ocurrido un error al registrarse', 'error'));
  }

  reset(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(
       field => {
          formGroup.get(field).setErrors(null);
       }
     );
 }

  onFileSelected(event: any) {
    const file:File  = event.target.files[0] ? event.target.files[0] : false;
    console.log(file);
    const name = file.name
    const type = file.type
    
    const max_size = 20971520;
    if (event.target.files[0].size > max_size) {
      this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';
      return false;
    }
    if (file) {
      this.promiseService.toBase64(file).then((result) => {
        const image = result.split(',')[1];
        const imgCreated = this.createImage(name, image, type);
        
        if (this.imagesArray.length === 3) return Swal.fire('Alerta', 'Solo puedes agregar 3 imágenes', 'warning');
        (<FormArray>this.formSale.get('imagenes')).push(imgCreated);
        console.log(this.formSale.getRawValue());
      });
    }
    this.fileInput.nativeElement.value = null;
  }

  createImage(name:string, imgBase: string, type: string): FormControl {
    return new FormControl({name, imgBase, type});
  }

  deleteImage(i:number): void {
    (<FormArray>this.formSale.get('imagenes')).removeAt(i);
  }

  get imagesArray(): Array<any> {
    return (<FormArray>this.formSale.get('imagenes')).value;
  }

  obtenerMunicipios(){
    this.catMunicipios = [];
    console.log(this.formSale.get('estado').value);
    this.estadosService.obtenerMunicipios(this.formSale.get('estado').value).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })
  }
}
