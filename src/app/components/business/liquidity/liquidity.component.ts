import { FileReaderPromiseLikeService } from 'fctrlx-angular-file-reader';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { LiquidezService } from 'src/app/services/liquidez.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.css'],
})
export class LiquidityComponent implements OnInit {
 

  /* liquid: Liquid[]; */
  
  
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
  imageError: string;

  constructor(
    private _liquidezService: LiquidezService,
    public promiseService: FileReaderPromiseLikeService,
    /* @Inject(MAT_DIALOG_DATA) public data: any */
  ) {}

  ngOnInit() {
    
    
    this.formLiquidity();
  }

  formLiquidity() {
    this.formLiquid = new FormGroup({
      nombre: new FormControl('', Validators.required),
      tipoSocio: new FormControl('', Validators.required),
      tipoNegocio: new FormControl('', Validators.required),
      monto: new FormControl(null, Validators.required),
      ventaMensualEsperada: new FormControl(null, Validators.required),
      gastosOperacionMensual: new FormControl(null, Validators.required),
      porcentaje: new FormControl(null, [Validators.required, Validators.min(0) ,Validators.max(100)]),
      ubicacion: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      competidores: new FormControl('', Validators.required),
      imagenes: new FormArray([], Validators.required),
      creador: new FormControl(localStorage.getItem('idusu'), Validators.required),
    });
  }

  publicar() {
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

    this._liquidezService.registerLiquidez(rq).subscribe((resp:any) => {

      if (resp.exito) {
        Swal.fire('Alerta', resp.mensaje, 'success');
      }
      this.resultado = resp;
      console.log(this.resultado);
      this.formLiquid.reset();
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
        const imgCreated = this.createImage(name, image, type);
        
        if (this.imagesArray.length === 3) return Swal.fire('Alerta', 'Solo puedes agregar 3 imágenes', 'warning');
        (<FormArray>this.formLiquid.get('imagenes')).push(imgCreated);
      });
    }
    this.fileInput.nativeElement.value = null;
  }

  createImage(name:string, imgBase: string, type: string): FormControl {
    return new FormControl({name, imgBase, type});
  }

  deleteImage(i:number): void {
    (<FormArray>this.formLiquid.get('imagenes')).removeAt(i);
  }

  get imagesArray(): Array<any> {
    return (<FormArray>this.formLiquid.get('imagenes')).value;
  }

}
