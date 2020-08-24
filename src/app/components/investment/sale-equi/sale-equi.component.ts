import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sale-equi',
  templateUrl: './sale-equi.component.html',
  styleUrls: ['./sale-equi.component.css']
})
export class SaleEquiComponent implements OnInit {

  formSaleEq: FormGroup;
  catTipoNegocio: any[] = [];
  catEstados:any[]=[];
  catMunicipios:any[]=[];

  BDRegistros: any[] = [];
  usuario: any;
  myProducts: any;
  resultadoBusquedaLiquidez: any[] = [];
  mostrar = false;
  vacio = true;

  constructor(private usuariosService: UsuariosService, private estadosService: EsatdosService,
     private traspasoService: TraspasosService,private router: Router,) { }

  ngOnInit(): void {
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    this.formSale();
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });
  }

  formSale(){
    this.formSaleEq = new FormGroup({
      ubicacion: new FormControl( ''),
      estado: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      tipoNegocio: new FormControl( '', Validators.required ),
      montoDesde: new FormControl( '', Validators.required ),
      montoHasta: new FormControl( '', Validators.required ),
      sinAntiguedad: new FormControl( '', Validators.required ),
      antiguedad: new FormControl( '', Validators.required )
    })
  }
  buscarResultadosLiquidez(){
  

      this.formSaleEq.get('municipio').valid;
  
      this.resultadoBusquedaLiquidez = [];
      this.vacio = false;
      this.mostrar = true;
  
      let rq = this.formSaleEq.getRawValue();
  
      console.log(rq);
      console.log(this.BDRegistros);
      if (!rq.tipoNegocio && !rq.tipoSocio && !rq.estado && !rq.municipio && !rq.antiguedadPubl && !rq.precioHasta && !rq.ubicacion) {
        this.vacio = true;
        console.log('busqueda vacia');
      } else {
        this.vacio = false
        this.formSaleEq.get('municipio').valid;
  
        this.BDRegistros.forEach((element, index) => {
          /* console.log('arreglo bd', element); */
          /* BAJADA DE DATOS */
          /*  let buscar=this.formSaleEq.get('tipoNegocio').value; */
  
          let local: any[] = [];
          let bd: any[] = [];
  
         
  
          local[0] = rq.tipoNegocio;
          local[1]= rq.tipoSocio;
          local[2] = rq.precioHasta;
          local[3] = rq.estado;
          local[4] = rq.municipio;
          local[5] = rq.ubicacion;
  
         
          bd[0] = element.tipoNegocio;
          bd[1]   = element.tipoSocio;
          bd[2]    = element.monto;
          bd[3]   = element.estado;
          bd[4]    = element.nunicipio;
          bd[5]    = element.ubicacion;
          /* BAJADA DE DATOS */
  
          /*   COMPARACION */
          let todosLosCampos=true;
         for (let i = 0; i < bd.length; i++) {
          if (local[i]!='') {
            if (local[i] != bd[i]  ) {
            todosLosCampos=false;
            if (bd[2]<=local[2]) {
              todosLosCampos=true;
            }     
            } 
          }  
         } 
         if (todosLosCampos) {
          this.resultadoBusquedaLiquidez.push(element)
         } 
  
        })
  
      }
      this.formSaleEq.get('municipio').valid;
      return this.resultadoBusquedaLiquidez;
      this.formSaleEq.get('municipio').valid;
      console.log(this.vacio);
  
    }
    obterPublicacionesTraspasos() {
      this.traspasoService.obtenerTraspasoTodos().subscribe((result: any) => {
        this.myProducts = result.data;
        this.usuario = JSON.parse(this.usuario);
        this.BDRegistros = this.myProducts;
       
        /* console.log(this.traspasos); */
      })
    }
    perfil(idN) {
      this.router.navigate([`/contacto-traspaso/${idN}`])
    }
  

  obtenerMunicipios(){
    this.catMunicipios = [];
    this.estadosService.obtenerMunicipios(this.formSaleEq.get('estado').value).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })
  }
}
