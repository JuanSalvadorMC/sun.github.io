import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FileReaderPromiseLikeService } from 'fctrlx-angular-file-reader';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { isNullOrUndefined } from 'util';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sale-equipment',
  templateUrl: './sale-equipment.component.html',
  styleUrls: ['./sale-equipment.component.css'],
})
export class SaleEquipmentComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  formSale: FormGroup;
  imageError: string;
  resultado;
  catTipoNegocio: any[] = [];
  catEstados:any[]=[];
  catMunicipios:any[]=[];
  esConsulta: boolean=false;
 

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
    console.log(this.catTipoNegocio);
    this.formEqui();
    this.estadosService.obtenerEstados().subscribe(resp => {
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
    }else{
      this.formSale.get('id').patchValue(localStorage.getItem('idusu'));
    }
    if (!isNullOrUndefined(this.data.esConsulta)) {
      this.esConsulta=true;
    }
    
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

  actualizar(){
    if (this.imagesArray.length !== 3) return Swal.fire('Error', 'Necesitas subir 3 imagenes', 'error');

    let rq = this.formSale.getRawValue();
    try {
      rq.monto = JSON.parse(rq.monto);
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
       this._equip.actualizarImagenEquipamiento(imagesArray).subscribe((resp:any) => {
  if (resp.exito) {
    this.notificacionesService.lanzarNotificacion('Registro Actualizado Correctamente','Registro correcto','success').then(( )=>this.dialogRef.close()); 
  }
 }, (err) =>    this.notificacionesService.lanzarNotificacion('Registro Actualizado Con Éxito','exitoso','success'));
     
  }
 
     /* ---------------------------------- */

    this._equip.actualizarEquipamiento(rq).subscribe((resp:any) => {

      if (resp.exito) {
        Swal.fire('Registro actualizado', 'Registro actualizado con exito', 'success').then(( )=>this.dialogRef.close());
        this.formSale.reset();
        this.formSale.get('id').patchValue(localStorage.getItem('idusu'));
      }
      this.resultado = resp;
     console.log(this.resultado); 
      
      (<FormArray>this.formSale.get('imagenes')).clear();

      this.reset(this.formSale);

    }, (err) => Swal.fire('Error', 'Ha ocurrido un error al registrarse', 'error'));
    
    
  }

  
 

  consultar() {
    if (this.imagesArray.length !== 3) return Swal.fire('Error', 'Necesitas subir 3 imagenes', 'error');
    
    let rq = this.formSale.getRawValue();
    try {
      rq.monto = JSON.parse(rq.monto);
      rq.imagenes = rq.imagenes.reduce((acc, value) => {
        acc.push(value.imgBase);
        return acc;
      }, []);
    } catch(e) {
      return Swal.fire('Error', 'Campos incorrectos', 'error')
    }
    
    console.log(rq);

    this._equip.registerEquipamiento(rq).subscribe((resp: any) => {
      if (resp.exito) {
        Swal.fire('Registro exitoso', 'Registro actualizado con éxito', 'success');
        this.formSale.reset();
        this.formSale.get('id').patchValue(localStorage.getItem('idusu'));
      }
      console.log(resp);
      
      (<FormArray>this.formSale.get('imagenes')).clear();
      this.reset(this.formSale);
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
        const imgCreated = this.createImage(name, image, type, true);
        
        if (this.imagesArray.length === 3) return Swal.fire('Alerta', 'Solo puedes agregar 3 imágenes', 'warning');
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
    this.estadosService.obtenerMunicipios(parametro).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })
  }
}
