import { FileReaderPromiseLikeService } from 'fctrlx-angular-file-reader';
import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { LiquidezService } from 'src/app/services/liquidez.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { isNullOrUndefined } from 'util';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Image {
  imgBase: string,
  name: string,
  nuevaImagen: boolean,
  type: string
}

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.css'],
})
export class LiquidityComponent implements OnInit, OnDestroy {
 

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
  @ViewChild('fileInputReemplazr') fileInputReemplazr: ElementRef<HTMLInputElement>;

  formLiquid: FormGroup;
  resultado;
  esConsulta: boolean=false;
  imageError: string;
  catEstados:any[]=[];
  catMunicipios:any[]=[];

  $unsubscribe = new Subject();

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
    this.catTipoNegocio = this.usuariosService.catTipoNegocio;
    this.catTipoSocio = this.usuariosService.catTipoSocio
    
    this.formLiquidity();
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });


    if(this.data?.id){
      
      this.obtenerMunicipios(this.data.id.estado);
      this.formLiquid.get('id').patchValue(this.data.id.id);
      this.obtenerValores();
      this.esConsulta=true;
    }else{
      this.formLiquid.get('id').patchValue(localStorage.getItem('idusu'));
    }
    // if (!isNullOrUndefined(this.data.esConsulta)) {
    // }
  }

  ngOnDestroy() {
    this.$unsubscribe.next(true);
    this.$unsubscribe.complete();
  }

  obtenerValores() {
    this.formLiquid.patchValue(this.data.id);
    this.data.id.imagenes.map((value, i) => {
      const image = this.createImage(`imagen${i}`, value, '', false);
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
      ubicacion: new FormControl('',[Validators.required,Validators.minLength(3)]),
      estado: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      descripcion: new FormControl('', [Validators.required,Validators.minLength(5)]),
      competidores: new FormControl('', [Validators.required,Validators.minLength(5)]),
      imagenes: new FormArray([], Validators.required),
      creador: new FormControl(localStorage.getItem('idusu'), Validators.required),
    });
  }
  actualizarImg(editable?: boolean) {
    if (this.imagesArray.length !== 5) return Swal.fire('Error', 'Necesitas subir 5 imagenes', 'error');
    
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
      
   this._liquidezService.actualizarLiquidez(rq).pipe(
    takeUntil(this.$unsubscribe)
    ).subscribe((resp:any) => {

      if (!editable) {
        if (resp.exito) {
          Swal.fire('Registro actualizado', 'Registro actualizado con éxito', 'success').then(( )=>this.dialogRef.close());
          return this.formLiquid.reset();
        }
        return Swal.fire('Error', 'Ha ocurrido un error al registrarse', 'error')
      }
      }, (err) => Swal.fire('Error', 'Ha ocurrido un error al registrarse', 'error'));
    
 
     /* ---------------------------------- */
  }

  onFileSelectedReemplazar(oldImage: Image, event) {
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

        this.reemplazarImagen(oldImage, image)
        
      });
    }
    this.fileInputReemplazr.nativeElement.value = null;
  }

  reemplazarImagen(oldImage: Image, newImage: string) {
    console.log(oldImage);
    let req = {
      id: this.data.id.id,
      url: oldImage.imgBase,
      imagen: newImage
    }

    // this.actualizar(true);
    this._liquidezService.actualizarImagenLiquidez(req).pipe(takeUntil(this.$unsubscribe)).subscribe((resp: any) => {
      if (resp.exito) {
        Swal.fire('Alerta', 'La imagen se actualizó correctamente', 'success').then(() => {
          this.dialogRef.close();
        })
      }
    }, (err) => Swal.fire('Alerta', 'No se pudo actualizar la imagen', 'error'))
    
  }


  publicar() {
    if (this.imagesArray.length !== 5){
      return Swal.fire('Alerta', 'Necesitas subir 5 imagenes', 'error');
    } 
    
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
      return Swal.fire('Error', 'Campos incorrectos', 'error')
    }

    this._liquidezService.registerLiquidez(rq).pipe(takeUntil(this.$unsubscribe)).subscribe((resp:any) => {

      if (resp.exito) {
        Swal.fire('Registro exitoso', 'Registro creado con éxito', 'success');
        this.formLiquid.reset();
        this.formLiquid.get('id').patchValue(localStorage.getItem('idusu'));
      }
      this.resultado = resp;
      (<FormArray>this.formLiquid.get('imagenes')).clear();
      this.reset(this.formLiquid);
    }, (err) => Swal.fire('Error', 'Ha ocurrido un error al registrarse', 'error'));
    
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
        
        if (this.imagesArray.length === 5) return Swal.fire('Advertencia', 'Solo puedes agregar 5 imágenes', 'warning');
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

  obtenerMunicipios(param?){
    this.catMunicipios = [];
    let parametro = !param ? this.formLiquid.get('estado').value : param;
    this.estadosService.obtenerMunicipios(parametro).pipe(takeUntil(this.$unsubscribe)).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })
  }
}
