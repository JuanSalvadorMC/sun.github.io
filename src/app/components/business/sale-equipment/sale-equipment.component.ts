import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FileReaderPromiseLikeService } from 'fctrlx-angular-file-reader';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { isNullOrUndefined } from 'util';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Image {
  imgBase: string,
  name: string,
  nuevaImagen: boolean,
  type: string
}

@Component({
  selector: 'app-sale-equipment',
  templateUrl: './sale-equipment.component.html',
  styleUrls: ['./sale-equipment.component.css'],
})
export class SaleEquipmentComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputReemplazr') fileInputReemplazr: ElementRef<HTMLInputElement>;

  formSale: FormGroup;
  imageError: string;
  resultado;
  catTipoNegocio: any[] = [];
  catEstados:any[]=[];
  catMunicipios:any[]=[];
  esConsulta: boolean=false;
 
  $unsubscribe = new Subject(); 

  constructor(
    public promiseService: FileReaderPromiseLikeService,
    private _equip: EquipamientosService,
    private usuariosService: UsuariosService,
    public dialogRef: MatDialogRef<SaleEquipmentComponent>,
    private estadosService: EsatdosService,
    private notificacionesService: NotificacionesService,
    @Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(): void {

    console.log(this.data.id);
    
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    /* console.log(this.catTipoNegocio); */
    this.formEqui();
    this.estadosService.obtenerEstados().pipe(takeUntil(this.$unsubscribe)).subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });

    if(this.data?.id){
      this.obtenerMunicipios(this.data.id.estado);
      this.formSale.get('id').patchValue(this.data.id.id);
      this.obtenerValores();
      this.esConsulta=true;
    }else{
      this.formSale.get('id').patchValue(localStorage.getItem('idusu'));
    }    
  }
  ngAfterViewInit() {
    this.formSale.valueChanges.subscribe(resp => console.log(resp) )
  }

  ngOnDestroy() {
    this.$unsubscribe.next(true);
    this.$unsubscribe.complete();
  }

  obtenerValores() {
    this.formSale.patchValue(this.data.id);
    this.data.id.imagenes.map((value, i) => {
      const image = this.createImage(`imagen${i}`, value, '', false);
      console.log(image);
      (<FormArray>this.formSale.get('imagenes')).push(image);
    })
  }

  formEqui() {
    this.formSale = new FormGroup({
      id: new FormControl('', ),
      nombre: new FormControl('', Validators.required),
      tipoNegocio: new FormControl('', Validators.required),
      monto: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      ubicacion: new FormControl('',[Validators.required,Validators.minLength(3)]),
      descripcion: new FormControl('', [Validators.required,Validators.minLength(5)]),
      imagenes: new FormArray([]),
      creador: new FormControl(localStorage.getItem('idusu')),
    });
  }

  actualizar(editable?: boolean){
    if (this.imagesArray.length < 3) return Swal.fire('Alerta', 'Necesitas subir al menos 3 imagenes', 'error');
    if (this.imagesArray.length > 5) return Swal.fire('Alerta', 'No puedes subir mas de 5 imagenes', 'error');

    let rq = this.formSale.getRawValue();
    this.notificacionesService.activarDesactivarLoader('activar')
    try {
      rq.monto = JSON.parse(rq.monto);
      rq.creador = JSON.parse(rq.creador);
      rq.imagenes = rq.imagenes.reduce((acc, value) => {
        acc.push(value.imgBase);
        return acc;
      }, []);    
    } catch(e) {
      this.notificacionesService.activarDesactivarLoader('desactivar')
      return Swal.fire('Alerta', 'Campos incorrectos', 'error')
    }
    console.log(rq);

   /* ---------------------------------- */
 
     /* ---------------------------------- */


    this._equip.actualizarEquipamiento(rq).pipe(takeUntil(this.$unsubscribe)).subscribe((resp:any) => {
      this.notificacionesService.activarDesactivarLoader('activar')
    if (!editable) {
      if (resp.exito) {
        this.notificacionesService.activarDesactivarLoader('desactivar')
        Swal.fire('Registro actualizado', 'Registro actualizado con éxito', 'success').then(( )=>this.dialogRef.close());
        return this.formSale.reset();
      }
      this.notificacionesService.activarDesactivarLoader('desactivar')
      return Swal.fire('Error', 'Ha ocurrido un error al registrarse', 'error')
      }
    }, (err) => {
      this.notificacionesService.activarDesactivarLoader('desactivar')
      Swal.fire('Error', 'Ha ocurrido un error al registrarse', 'error')
    });
    
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
    this._equip.actualizarImagenEquipamiento(req).pipe(takeUntil(this.$unsubscribe)).subscribe((resp: any) => {
      this.notificacionesService.activarDesactivarLoader('activar')
      if (resp.exito) {
        this.notificacionesService.activarDesactivarLoader('desactivar')
        Swal.fire('Alerta', 'La imagen se actualizó correctamente', 'success').then(() => {
          this.dialogRef.close();
        })
      }
    }, (err) => {
      this.notificacionesService.activarDesactivarLoader('desactivar')
      Swal.fire('Alerta', 'No se pudo actualizar la imagen', 'error')
    })
    
  }

  consultar() {
    this.formSale.get('id').patchValue(localStorage.getItem('idusu'));
    this.formSale.get('creador').patchValue(localStorage.getItem('idusu'));
    if (this.imagesArray.length < 3) return Swal.fire('Alerta', 'Necesitas subir al menos 3 imagenes', 'error');
    if (this.imagesArray.length > 5) return Swal.fire('Alerta', 'No puedes subir mas de 5 imagenes', 'error');
    
    let rq = this.formSale.getRawValue();
    this.notificacionesService.activarDesactivarLoader('activar')
    try {
      rq.monto = JSON.parse(rq.monto);
      rq.imagenes = rq.imagenes.reduce((acc, value) => {
        acc.push(value.imgBase);
        return acc;
      }, []);
    } catch(e) {
      this.notificacionesService.activarDesactivarLoader('desactivar')
      return Swal.fire('Error', 'Campos incorrectos', 'error')
    }
    
    console.log(rq);

    this._equip.registerEquipamiento(rq).pipe(takeUntil(this.$unsubscribe)).subscribe((resp: any) => {
      this.notificacionesService.activarDesactivarLoader('activar')
      if (resp.exito) {
        this.notificacionesService.activarDesactivarLoader('desactivar')
        Swal.fire('Registro exitoso', 'Registro actualizado con éxito', 'success');
        this.formSale.reset();
        this.formSale.get('id').patchValue(localStorage.getItem('idusu'));
        this.formSale.get('creador').patchValue(localStorage.getItem('idusu'));
      }
      console.log(resp);
      
      (<FormArray>this.formSale.get('imagenes')).clear();
      this.reset(this.formSale);
    }, (err) => {
      this.notificacionesService.activarDesactivarLoader('desactivar')
      Swal.fire('Error', 'Ha ocurrido un error al registrarse', 'error')
    });
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
         // VALIDACION IMAGEN REPETIDA
         let imagenRepetida: Object = this.imagesArray.find(x => x.imgBase == image);        
         if (imagenRepetida) return Swal.fire('No puedes subir la misma imagen', 'La imagen que intentas subir ya existe','warning');
         ////////////////////////////
        const imgCreated = this.createImage(name, image, type, true);
        
        if (this.imagesArray.length >= 5) return Swal.fire('Alerta', 'No puedes subir mas de 5 imagenes', 'error');
        (<FormArray>this.formSale.get('imagenes')).push(imgCreated);

      });
    }
    this.fileInput.nativeElement.value = null;
  }

  createImage(name:string, imgBase: string, type: string, nuevaImagen: boolean = false): FormControl {
    return new FormControl({name, imgBase, type, nuevaImagen});
  }

  deleteImage(i:number): void {
    (<FormArray>this.formSale.get('imagenes')).removeAt(i);
  }

  get imagesArray(): Array<any> {
    return (<FormArray>this.formSale.get('imagenes')).value;
  }

  obtenerMunicipios(param?){
    this.catMunicipios = [];
    let parametro = !param ? this.formSale.get('estado').value : param;
    this.estadosService.obtenerMunicipios(parametro).pipe(takeUntil(this.$unsubscribe)).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })
  }
}
