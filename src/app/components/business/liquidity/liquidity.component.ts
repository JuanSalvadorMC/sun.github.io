import { FileReaderPromiseLikeService } from 'fctrlx-angular-file-reader';
import { Component, OnInit } from '@angular/core';
import { FormGroup,  Validators, FormControl, FormArray } from '@angular/forms';
import { LiquidezService } from 'src/app/services/liquidez.service';


@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.css']
})
export class LiquidityComponent implements OnInit {

  formLiquid : FormGroup;
  resultado;
  imageError: string;

  constructor( private _creaLi : LiquidezService, public promiseService : FileReaderPromiseLikeService  ) {}

  ngOnInit() {
    this.formLiquidity();
  }

  formLiquidity(){
    this.formLiquid = new FormGroup ({
      nombre : new FormControl('' ),
      tipoSocio : new FormControl('' ),
      tipoNegocio : new FormControl('' ),
      monto : new FormControl('' ),
      ventaMensualEsperada : new FormControl('' ),
      gastosOperacionMensual : new FormControl('' ),
      porcentaje: new FormControl('' ),
      ubicacion: new FormControl('' ),
      descripcion: new FormControl('' ),
      competidores: new FormControl('' ),
      imagenes: new FormArray([]),
      // imagenes: new FormControl( ''),
      creador: new FormControl(localStorage.getItem('idusu'))
    });
}

  publicar(){
    let rq = this.formLiquid.getRawValue();
    rq.monto = JSON.parse(rq.monto);
    rq.porcentaje = JSON.parse(rq.porcentaje);
    rq.ventaMensualEsperada = JSON.parse(rq.ventaMensualEsperada);
    rq.gastosOperacionMensual = JSON.parse(rq.gastosOperacionMensual);
    rq.creador = JSON.parse(rq.creador)
    console.log(rq);
    
  this._creaLi.registerLiquidez(rq).subscribe(resp => {
   this.resultado = resp;
   console.log(this.resultado)
   this.formLiquid.reset();
   this.formLiquid.get('imagenes').reset();
   }
   )
}

onFileSelected(event: any)
{
  const file = event.target.files[0] ? event.target.files[0] : false;
  const max_size = 20971520;
  if (event.target.files[0].size > max_size) {
   this.imageError =
       'Maximum size allowed is ' + max_size / 1000 + 'Mb';
   return false;
}
  if(file){
    this.promiseService.toBase64(file).then((result) => {
    const image = result.split(',')[1];
    const imag = new FormControl(image);
    if((<FormArray>this.formLiquid.get('imagenes')).length <=2){
      (<FormArray>this.formLiquid.get('imagenes')).push(imag);
    }  else {
      console.log('son mas de 3 registros ');
      
    }
      });
    }
}


//onFileSelected(event: any) {
//   const file = event.target.files[0] ? event.target.files[0] : false;
//   const max_size = 20971520;
//   if (event.target.files[0].size > max_size) {
//     this.imageError =
//       'Maximum size allowed is ' + max_size / 1000 + 'Mb';
//     return false;
//   }
//   if (file) {
//     this.promiseService.toBase64(file).then((result) => {
//       const image = result.split(',')[1];
//       this.formLiquid.get('imagenes').setValue(image)
//     });
//   }
// }


}
