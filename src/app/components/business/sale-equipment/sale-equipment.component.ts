import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FileReaderPromiseLikeService } from 'fctrlx-angular-file-reader';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import Swal from 'sweetalert2';

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

  constructor(
    public promiseService: FileReaderPromiseLikeService,
    private _equip: EquipamientosService
  ) {}

  ngOnInit(): void {
    this.formEqui();
  }

  formEqui() {
    this.formSale = new FormGroup({
      nombre: new FormControl('', Validators.required),
      tipoNegocio: new FormControl('', Validators.required),
      monto: new FormControl('', Validators.required),
      ubicacion: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      imagenes: new FormArray([]),
      creador: new FormControl(localStorage.getItem('idusu')),
    });
  }

  consultar() {
    let rq = this.formSale.getRawValue();
    try {
      rq.monto = JSON.parse(rq.monto);
      rq.imagenes = rq.imagenes.reduce((acc, value) => {
        acc.push(value.imgBase);
        return acc;
      }, []);
    } catch(e) {
      return Swal.fire('Alerta', 'Campos incorrectos', 'error')
    }
    
    console.log(rq);

    this._equip.registerEquipamiento(rq).subscribe((resp: any) => {
      if (resp.exito) {
        Swal.fire('Alerta', resp.mensaje, 'success');
      }
      console.log(resp);
      this.formSale.reset();
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
}
