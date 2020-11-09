import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LiquidezService } from 'src/app/services/liquidez.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';
import { element } from 'protractor';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  formMember: FormGroup;
  catTipoNegocio: any[] = [];
  catTipoSocio: any[] = [];
  catEstados: any[] = [];
  catMunicipios: any[] = [];
  busqueda=false;
  mos= "oculto";
 

  resultadoBusquedaLiquidez: any[] = [];
  liquidezTodos: any[] = [];
  mostrar = false;
  vacio = true;
  myProducts: any;
  usuario: any;
  BDRegistros: negocios[] = [];
  idNegocio: any;

  todos: any[] = [];
  value = 'Clear me';

  /* @Output() mostarTabla = new EventEmitter <string>(); */

  constructor(private _sLiqui: LiquidezService, private router: Router,
    private activatedRoute: ActivatedRoute, private traspasoService: TraspasosService,
    private equipamientoService: EquipamientosService, private usuariosService: UsuariosService,
    private estadosService: EsatdosService, private matt: MatInputModule) { }




    async ngOnInit() {  
      await this.obtenerPublicaciones();
   
    this.mostrar = false;
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    this.catTipoSocio = this.usuariosService.catTipoSocio
    this.formMembe();


     this.estadosService.obtenerEstados().subscribe(resp => {
      let estado: any[] = resp.response.estado
      estado.forEach((elm, i) => {
        let estadoObject = { nombreEstado: elm, idEstado: i + 1 }
        this.catEstados.push(estadoObject)
      })
      this.catMunicipios.push('Ninguno');
    });


    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
    this.usuario = localStorage.getItem('idusu');
  /*   this.obterPublicaciones();
  */
 /* await this.obtenerPublicaciones(); */
  }
  
  bliq: any[] = [];
  btras: any[] = [];
  bequip: any[] = [];
  traspasos: any[] = [];
  criteriosDeBusqueda: any[] = [];
  heroes: any[] = [];
  termino: string;
  formMembe() {
    this.formMember = new FormGroup({
      ubicacion: new FormControl(''),
      estado: new FormControl(''),
      municipio: new FormControl('', ),
      tipoSocio: new FormControl(''),
      tipoNegocio: new FormControl(''),
      masSocio: new FormControl(''),
      precioDesde: new FormControl(''),
      precioHasta: new FormControl(''),
      excluirAntinguedad: new FormControl(''),
      antiguedadPubl: new FormControl('')
    })
  }
 /*  validarCampo() {
    if (this.formMember.get('estado').touched==false) {
      console.log('adhjadghjadgjadgj');
      this.formMember.get('municipio').invalid
    }
  } */

  /*  ------------------------- BUSCADOR LIQUIDEZ */
  buscarTodosLiquidez() {
    this.obtenerPublicaciones();
   /*  console.log(this.BDRegistros); */
    

  }

  buscarResultadosLiquidez() {
    this.obtenerPublicaciones();
    /* console.log(this.BDRegistros); */
 /*    this.formMember.get('municipio').valid; */
    this.resultadoBusquedaLiquidez = [];
   
    this.vacio = false;
    this.mostrar = true;
    let rq = this.formMember.getRawValue();
    console.log(rq);
    /* 
    console.log(this.BDRegistros); */

    if (!rq.tipoNegocio  && !rq.estado && !rq.municipio  && !rq.precioHasta && !rq.ubicacion && !rq.precioDesde && !rq.tipoSocio) {
      this.vacio = true;
      
      console.log('Busqueda vacia');
    }else{
      this.vacio = false;
      this.mostrar = true;
      console.log('Busqueda parametros');
    }
    
     /*  this.formMember.get('municipio').valid; */
      this.BDRegistros.forEach((element, index) => {
        /* BAJADA DE DATOS */
        /*  let buscar=this.formMember.get('tipoNegocio').value; */
        let local: any[] = [];
        let bd: any[] = [];

        local[0] = rq.tipoNegocio;
        local[1]= rq.tipoSocio;
        local[2] = rq.estado;
        local[3] = rq.municipio;
        local[4] = rq.ubicacion.toLowerCase();
        local[5] = rq.precioHasta;
       
        bd[0] = element.tipoNegocio;
        bd[1]   = element.tipoSocio;
        bd[2]   = element.estado;
        bd[3]    = element.municipio;
        bd[4]    = element.ubicacion.toLowerCase();
        bd[5]    = element.monto;
        /* BAJADA DE DATOS */

        /*   COMPARACION */

        bd[4]=this.removeAccents(bd[4]);
        local[4]=this.removeAccents(local[4]);

        
       


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

    
    this.formMember.get('municipio').valid;
    return this.resultadoBusquedaLiquidez;
    this.formMember.get('municipio').valid;
  }

  /*   TERMINO BUSQUEDA */

  obtenerPublicaciones() {
    this._sLiqui.obtenerLiquidezTodos().subscribe((result: any) => {
     
      this.BDRegistros= result.data;
    /*   console.log(result.data);
      console.log(this.resultadoBusquedaLiquidez); */

     /*  for (let i = 0; i < this.BDRegistros.length; i++) {
        this.BDRegistros[i].descripcion = this.limitar(this.BDRegistros[i].descripcion);
      } */
      this.liquidezTodos=this.BDRegistros;
    })
 

    
  }
  removeAccents (str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 

  limitar(value: string): string {
    let limit = 100;
    return value.length > limit ? value.substring(0, limit) + "..." : value;
  }

  perfil(idN) {
    this.router.navigate([`/contacto-liquidez/${idN}`])
  }
 

  obtenerMunicipios() {
    this.catMunicipios = [];
    this.estadosService.obtenerMunicipios(this.formMember.get('estado').value).subscribe(resp => {
      let municipio: any[] = resp.response.municipios
      municipio.forEach((elm, i) => {
        let municipioObject = { nombreMunicipio: elm, idMunicipio: i + 1 }
        this.catMunicipios.push(municipioObject)
      });
    })
    this.catMunicipios.push('Ninguno');
  }
}

export interface negocios {
  tipoNegocio: string;
  tipoSocio: string;
  estado: string;
  municipio: string;
  monto: string;
  nombre: string;
  descripcion: string;
  idx?: number;
  id: number;
  ubicacion: string;
};



