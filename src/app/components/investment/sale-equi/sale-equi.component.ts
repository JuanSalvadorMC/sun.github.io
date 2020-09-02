import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipamientosService } from 'src/app/services/equipamientos.service';

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
     private traspasoService: TraspasosService,private router: Router,private equipamientoService: EquipamientosService,) { }

  ngOnInit(): void {
    this.obterPublicacionesEquipamiento()
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
      estado: new FormControl('', ),
      municipio: new FormControl('', ),
      tipoNegocio: new FormControl( '',  ),
      precioDesde: new FormControl( '',  ),
      precioHasta: new FormControl( '',  ),
      
    })
  }
 
  buscarResultadosEquipamiento() {

    console.log(this.BDRegistros);
    
    this.formSaleEq.get('municipio').valid;

    this.resultadoBusquedaLiquidez = [];
    this.vacio = false;
    this.mostrar = true;

    let rq = this.formSaleEq.getRawValue();

    console.log(rq);
    console.log(this.BDRegistros);
    if (!rq.tipoNegocio  && !rq.estado && !rq.municipio  && !rq.precioHasta && !rq.ubicacion && !rq.precioDesde ) {
      this.vacio = true;
      console.log('Busqueda vacia');
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
        local[2] = rq.estado;
        local[3] = rq.municipio;
        local[4] = rq.ubicacion;
        local[5] = rq.precioHasta;

       
        bd[0] = element.tipoNegocio;
        bd[1]   = element.tipoSocio;
        bd[2]   = element.estado;
        bd[3]    = element.municipio;
        bd[4]    = element.ubicacion;
        bd[5]    = element.monto;
        /* BAJADA DE DATOS */

        /*   COMPARACION */
        let todosLosCampos=true;
       

        for (let i = 0; i < bd.length-1; i++) {
          if (local[i]   ) {
            if (local[i] != bd[i]  ) {
            todosLosCampos=false;
               
            } 
          }  
         } 
  
          if (rq.precioHasta) {
            let hasta =parseInt(rq.precioHasta, 10)+1;        
           if (bd[bd.length-1]>=hasta) {
            todosLosCampos=false;
           }
          } 
          if (rq.precioDesde) {
            let desde =parseInt(rq.precioDesde, 10)-1;      
           if (bd[bd.length-1]<=desde) {
            todosLosCampos=false;
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
  perfil(idN) {
    this.router.navigate([`/contacto-traspaso/${idN}`])
  }
  obterPublicacionesEquipamiento() {
    this.equipamientoService.obtenerEquipamientoTodos().subscribe((result: any) => {
      this.myProducts = result.data;
      console.log(result);
      
      this.usuario = localStorage.getItem('idusu');
      this.usuario = JSON.parse(this.usuario);
      this.BDRegistros = this.myProducts;
    })
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
