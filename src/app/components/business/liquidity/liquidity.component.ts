import { FileReaderPromiseLikeService } from 'fctrlx-angular-file-reader';
import { Component, OnInit } from '@angular/core';
import { FormGroup,  Validators, FormControl, FormArray } from '@angular/forms';
import { LiquidezService } from 'src/app/services/liquidez.service';
import { ActivatedRoute } from '@angular/router';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Liquid } from './liquidity';
import { ModalLiquidezComponent } from '../../modals/modal-liquidez/modal-liquidez.component';


@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.css']
})
export class LiquidityComponent implements OnInit {
 

  liquid: Liquid[];
  
  
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


  formLiquid : FormGroup;
  resultado;
  imageError: string;

  constructor( private _creaLi : LiquidezService, public promiseService : FileReaderPromiseLikeService, 
    private activatedRoute: ActivatedRoute, private _sLiqui: LiquidezService,
    private _us: UsuariosService, private _tras: TraspasosService, private _equipa: EquipamientosService
    ,  public dialog: MatDialog  
    
    
    ) {}

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
eliminarLiquidez(liqui: Liquid) {
  Swal.fire({
    title: '¿Està seguro?',
    text: "¿Seguro de eliminar tu negocio? ",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, deseo eliminar!'
  }).then((result) => {
    if (result.value) {
      this._sLiqui.eliminarLiquidez(liqui.id).subscribe(
        response => {
          this.obterPublicaciones()
          this.formLiquid.reset()
          Swal.fire(
            'Eliminar!',
            'Eliminado con éxito.',
            'success'
          )
        }
      )
    }
  })
  this.formLiquid.reset()
}

obterPublicaciones() {
  this._sLiqui.obtenerLiquidezTodos().subscribe((result: any) => {
    this.myProducts = result.data;
    this.usuario = JSON.parse(this.usuario);
    this.resultados = this.myProducts.filter(obtener => obtener.creador === this.usuario)
    console.log(this.resultados)
  })
}

openDialog(value){
  const dialogRef = this.dialog.open(ModalLiquidezComponent, {
    width: '900px',
    height: '500px',
    data: { id : value }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (!result){
      return this.obterPublicaciones();;
    }
    value = result
    this.obterPublicaciones();
    
  });
}

}
