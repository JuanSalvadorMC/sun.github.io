import { FileReaderPromiseLikeService } from 'fctrlx-angular-file-reader';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { LiquidezService } from 'src/app/services/liquidez.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { isNullOrUndefined } from 'util';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.css'],
})
export class LiquidityComponent implements OnInit {
 

  /* liquid: Liquid[]; */
  catTipoNegocio: any[] = [];
  catTipoSocio: any[] = [];
  
  respuesta;
  resultados: any[] = [];
  resultadosT: any[] = [];
  resultadosEquipamiento: any[] = [];
  myProducts: any;
  usuario: any;
  headElements = ['Id', 'Empresa', 'Ubicación', 'Descripción', 'Imagen', 'Tipo Socio',
    'Tipo Negocio', 'Monto Inversion', 'Competidores'];
  headElementsTras = ['Id', 'Empresa', 'Ubicación', 'Descripción', 'Imagen', '**GOM',
    'Tipo Negocio', '**VMP', 'Competidores'];
  headElementsEquipa = ['Id', 'Empresa', 'Ubicación', 'Descripción', 'Imagen', 'Tipo Negocio', 'Monto']


  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>
  formLiquid: FormGroup;
  resultado;
  esConsulta: boolean=false;
  imageError: string;
  catEstados:any[]=[];
  catMunicipios:any[]=[];

  constructor(
    private _liquidezService: LiquidezService,
    public promiseService: FileReaderPromiseLikeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LiquidityComponent>,
    private notificacionesService: NotificacionesService,
    private usuariosService: UsuariosService,
    private estadosService: EsatdosService
  ) {}


  /* ngAfterViewInit(): void {
    this.formLiquid.valueChanges.subscribe(
      resp => console.log(this.formLiquid.value)
    )
  } */

  ngOnInit() {
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    console.log(this.catTipoNegocio);
    this.catTipoSocio = this.usuariosService.catTipoSocio
    console.log(this.catTipoSocio);
    
    this.formLiquidity();
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });


    if(this.data?.id){
      this.formLiquid.get('id').patchValue(this.data.id.id);
      this.obtenerValores();
    }else{
      this.formLiquid.get('id').patchValue(localStorage.getItem('idusu'));
    }
    if (!isNullOrUndefined(this.data.esConsulta)) {
      this.esConsulta=true;
    }
    
  }

  obtenerValores() {
    this.formLiquid.patchValue(this.data.id);
    this.data.id.imagenes.map((value, i) => {
      const image = this.createImage(`imagen${i}`, value, '', false);
      console.log(image.value);
      (<FormArray>this.formLiquid.get('imagenes')).push(image);
    })
  }

  formLiquidity() {
    this.formLiquid = new FormGroup({
      id: new FormControl('', ),
      nombre: new FormControl('', Validators.required),
      tipoSocio: new FormControl('', Validators.required),
      tipoNegocio: new FormControl('', Validators.required),
      monto: new FormControl(null, Validators.required),
      ventaMensualEsperada: new FormControl(null, Validators.required),
      gastosOperacionMensual: new FormControl(null, Validators.required),
      porcentaje: new FormControl(null, [Validators.required, Validators.min(0) ,Validators.max(100)]),
      ubicacion: new FormControl(''),
      estado: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      competidores: new FormControl('', Validators.required),
      imagenes: new FormArray([], Validators.required),
      creador: new FormControl(localStorage.getItem('idusu'), Validators.required),
    });
  }
  actualizarImg() {
    let rq = this.formLiquid.getRawValue();
    try {
      rq.monto = JSON.parse(rq.monto);
      rq.porcentaje = JSON.parse(rq.porcentaje);
      rq.ventaMensualEsperada = JSON.parse(rq.ventaMensualEsperada);
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
       this._liquidezService.actualizarImagenLiquidez(imagesArray).subscribe((resp:any) => {
  if (resp.exito) {
    this.notificacionesService.lanzarNotificacion('Registro Actualizado Correctamente','Registro correcto','success').then(( )=>this.dialogRef.close()); 
  }
 }, (err) =>    this.notificacionesService.lanzarNotificacion('Registro Actualizado Con Éxito','exitoso','success'));
     
  }
 
     /* ---------------------------------- */

    this._liquidezService.actualizarLiquidez(rq).subscribe((resp:any) => {

      if (resp.exito) {
        Swal.fire('Alerta', resp.mensaje, 'success').then(( )=>this.dialogRef.close());
        this.formLiquid.reset();
        this.formLiquid.get('id').patchValue(localStorage.getItem('idusu'));
      }
      this.resultado = resp;
     console.log(this.resultado); 
      
      (<FormArray>this.formLiquid.get('imagenes')).clear();

      this.reset(this.formLiquid);

    }, (err) => Swal.fire('Alerta', 'Ha ocurrido un error al registrarse', 'error'));
    
  }
  publicar() {
    
    let rq = this.formLiquid.getRawValue();
    
   /* this.formLiquid.removeControl('id'); */
   
    
    try {
      rq.monto = JSON.parse(rq.monto);
      rq.porcentaje = JSON.parse(rq.porcentaje);
      rq.ventaMensualEsperada = JSON.parse(rq.ventaMensualEsperada);
      rq.gastosOperacionMensual = JSON.parse(rq.gastosOperacionMensual);
      rq.creador = JSON.parse(rq.creador);
      rq.imagenes = rq.imagenes.reduce((acc, value) => {
        acc.push(value.imgBase);
        return acc;
      }, []);    
    } catch(e) {
      return Swal.fire('Alerta', 'Campos incorrectos', 'error')
    }

    this._liquidezService.registerLiquidez(rq).subscribe((resp:any) => {

      if (resp.exito) {
        Swal.fire('Alerta', resp.mensaje, 'success');
        this.formLiquid.reset();
        this.formLiquid.get('id').patchValue(localStorage.getItem('idusu'));
      }
      this.resultado = resp;
      (<FormArray>this.formLiquid.get('imagenes')).clear();
      this.reset(this.formLiquid);
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
        const imgCreated = this.createImage(name, image, type, true);
        
        if (this.imagesArray.length === 3) return Swal.fire('Alerta', 'Solo puedes agregar 3 imágenes', 'warning');
        (<FormArray>this.formLiquid.get('imagenes')).push(imgCreated);
      });
    }
    this.fileInput.nativeElement.value = null;
  }

  createImage(name:string, imgBase: string, type: string, nuevaImagen: boolean = false): FormControl {
    return new FormControl({name, imgBase, type, nuevaImagen});
  }

  deleteImage(i:number): void {
    (<FormArray>this.formLiquid.get('imagenes')).removeAt(i);
  }

  get imagesArray(): Array<any> {
    return (<FormArray>this.formLiquid.get('imagenes')).value;
  }

  obtenerMunicipios(){
    this.catMunicipios = [];
    console.log(this.formLiquid.get('estado').value);
    this.estadosService.obtenerMunicipios(this.formLiquid.get('estado').value).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })
  }
}
