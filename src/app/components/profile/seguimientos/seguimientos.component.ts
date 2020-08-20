import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarService } from '../../../services/navbar.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosService } from '../../../services/usuarios.service';
import { TraspasosService } from '../../../services/traspasos.service';
import { LiquidezService } from '../../../services/liquidez.service';
import { EquipamientosService } from '../../../services/equipamientos.service';

@Component({
  selector: 'app-seguimientos',
  templateUrl: './seguimientos.component.html',
  styleUrls: ['./seguimientos.component.css']
})
export class SeguimientosComponent implements OnInit {

 /*  equip: Equipamients[];
  liquid: Liquid[];
  sale: Sales[];
  formLiquid: FormGroup; */
  respuesta;
  resultados: any[] = [];
  resultadosT: any[] = [];
  resultadosEquipamiento: any[] = [];
  myProducts: any;
  usuario: any;
  headElementsseg = [ 'Empresa', 'Calle', 'Descripción',  'Tipo Socio','Tipo Negocio', 'Monto Inversion', 'Competidores'];
  headElementsTrasseg = [ 'Empresa', 'Calle', 'Descripción', '**GOM','Tipo Negocio', '**VMP', 'Competidores'];
  headElementsEquipaseg = [ 'Empresa', 'Calle', 'Descripción',  'Tipo Negocio', 'Monto']

  constructor(private activatedRoute: ActivatedRoute, private _sLiqui: LiquidezService,
    private _us: UsuariosService, private _tras: TraspasosService, private _equipa: EquipamientosService
    ,  public dialog: MatDialog, private nav: NavbarService) {

  }

  ngOnInit(): void {
    this.nav.visible;
    console.log(this.nav.visible);
    this.usuario = JSON.parse(localStorage.getItem('idusu'));
    /* this.formLiduids(); */
    this.obterPublicaciones();
    this.obterPublicacionesT();
    this.obterPublicacionesEqui();
   
  }

  limitar(value: string): string {
    
    
    let limit = 90;
    return value.length > limit ? value.substring(0, limit) + "..." : value;

  }

  /* formLiduids() {
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
  } */

  obterPublicaciones() {
    this._sLiqui.obtenerLiquidezTodos().subscribe((result: any) => {
      this.myProducts = result.data;
/*       console.log(this.usuario); 
        console.log(this.myProducts.creador); */
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

      console.log('Empresas en traspaso ',this.resultados);
      for (let i = 0; i < this.resultadosT.length; i++) {
        this.resultadosT[i].descripcion= this.limitar(this.resultadosT[i].descripcion);
        
      }
    })
  }
  obterPublicacionesEqui() {
    this._equipa.obtenerEquipamientoTodos().subscribe((result: any) => {
      this.myProducts = result;
      this.usuario = JSON.parse(this.usuario);
      this.resultadosEquipamiento = this.myProducts.filter(obtener => obtener.creador === this.usuario)
      for (let i = 0; i < this.resultadosEquipamiento.length; i++) {
        this.resultadosEquipamiento[i].descripcion= this.limitar(this.resultadosEquipamiento[i].descripcion);
        
      }

    })
  }

  
}
