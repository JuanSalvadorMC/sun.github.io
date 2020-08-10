import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiquidezService } from 'src/app/services/liquidez.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import { Liquid } from '../../business/liquidity/liquidity';
import Swal from 'sweetalert2';
import { Sales } from '../../business/sale/sale';
import { Equipamients } from '../../business/sale-equipment/equipament';
import { ModalLiquidezComponent } from '../../modals/modal-liquidez/modal-liquidez.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalTraspasoComponent } from '../../modals/modal-traspaso/modal-traspaso.component';
import { ModalEquiposComponent } from '../../modals/modal-equipos/modal-equipos.component';
import { NavbarService } from '../../../services/navbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LiquidityComponent } from '../../business/liquidity/liquidity.component';



@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css']
})
export class PublicacionComponent implements OnInit {

  equip: Equipamients[];
  liquid: Liquid[];
  sale: Sales[];
  formLiquid: FormGroup;
  respuesta;
  resultados: any[] = [];
  resultadosT: any[] = [];
  resultadosEquipamiento: any[] = [];
  myProducts: any;
  usuario: any;
  headElements = [ 'Imagen','Empresa', 'Ubicación', 'Descripción',  'Tipo Socio',
    'Tipo Negocio', 'Monto Inversion', 'Competidores'];
  headElementsTras = [ 'Imagen','Empresa', 'Ubicación', 'Descripción', '**GOM',
    'Tipo Negocio', '**VMP', 'Competidores'];
  headElementsEquipa = [ 'Imagen','Empresa', 'Ubicación', 'Descripción',  'Tipo Negocio', 'Monto']

  constructor(private activatedRoute: ActivatedRoute, private _sLiqui: LiquidezService,
    private _us: UsuariosService, private _tras: TraspasosService, private _equipa: EquipamientosService
    ,  public dialog: MatDialog, private nav: NavbarService, private spinnerService: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.nav.visible;
    console.log(this.nav.visible);
    this.usuario = JSON.parse(localStorage.getItem('idusu'));
    this.formLiduids();
    this.obterPublicaciones();
    this.obterPublicacionesT();
    this.obterPublicacionesEqui();
   
  }

  limitar(value: string): string {
    console.log("ENtro");
    
    let limit = 90;
    return value.length > limit ? value.substring(0, limit) + "..." : value;

  }

  formLiduids() {
    this.formLiquid = new FormGroup({
      nombre: new FormControl(''),
      descripcion: new FormControl(''),
      ubicacion: new FormControl(''),
      tipoNegocio: new FormControl(''),
      tipoSocio: new FormControl(''),
      monto: new FormControl(''),
      ventaMensualEsperada: new FormControl(''),
      gastosOperacionMensual: new FormControl(''),
      competidores: new FormControl(''),
      porcentaje: new FormControl(''),
      imagenes: new FormControl(''),
      id: new FormControl(this.usuario)
    })
  }

  obterPublicaciones() {
    this._sLiqui.obtenerLiquidezTodos().subscribe((result: any) => {
      this.myProducts = result.data;
      console.log(this.usuario); 
        console.log(this.myProducts.creador);
   this.resultados = this.myProducts.filter(obtener => obtener.creador === this.usuario) 
     /* this.resultados = this.myProducts; */
      console.log(this.resultados);
      
      for (let i = 0; i < this.resultados.length; i++) {
        this.resultados[i].descripcion= this.limitar(this.resultados[i].descripcion);
        
      }
    })
  }
  obterPublicacionesT() {
    this._tras.obtenerTraspasoTodos().subscribe((result: any) => {
      this.myProducts = result.data;
      this.resultadosT = this.myProducts.filter(obtener => obtener.creador === this.usuario)


      for (let i = 0; i < this.resultadosT.length; i++) {
        this.resultadosT[i].descripcion= this.limitar(this.resultadosT[i].descripcion);
        
      }
    })
  }
  obterPublicacionesEqui() {
    this._equipa.obtenerEquipamientoTodos().subscribe((result: any) => {
      this.myProducts = result.data;
      this.resultadosEquipamiento = this.myProducts.filter(obtener => obtener.creador === this.usuario)
      for (let i = 0; i < this.resultadosEquipamiento.length; i++) {
        this.resultadosEquipamiento[i].descripcion= this.limitar(this.resultadosEquipamiento[i].descripcion);
        
      }

    })
  }

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

  eliminarTraspaso(sal: Sales) {
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
        this._tras.eliminarTraspaso(sal.id).subscribe(
          response => {
            this.obterPublicacionesT()
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

  eliminarEquipamiento(equip: Equipamients) {
    Swal.fire({
      title: '¿Està seguro?',
      text: "¿Seguro de eliminar tus equipos? ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deseo eliminar!'
    }).then((result) => {
      if (result.value) {
        this._equipa.eliminarTraspaso(equip.id).subscribe(
          response => {
            this.obterPublicacionesEqui()
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

// ACTUALIZAR LIQUIDACIONES
openDialog(value){
  const dialogRef = this.dialog.open(LiquidityComponent, {
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

// ACTUALIZAR TRASPASO
openDialogTras(value){
  const dialogRef = this.dialog.open(LiquidityComponent, {
    width: '900px',
    height: '500px',
    data: { id : value }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (!result){
      return this.obterPublicacionesT();;
    }
    value = result
    this.obterPublicacionesT();
    
  });
}
// ACTUALIZAR EQUIPAMIENTO
openDialogEquipa(value){
  const dialogRef = this.dialog.open(LiquidityComponent, {
    width: '900px',
    height: '500px',
    data: { id : value }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (!result){
      return this.obterPublicacionesEqui();;
    }
    value = result
    this.obterPublicacionesEqui();
    
  });
}


}
