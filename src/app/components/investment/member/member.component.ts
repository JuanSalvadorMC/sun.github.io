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


  myProducts: any;
  usuario: any;
  idNegocio: any;
  animales: negocios[] = [];
  todos: any[] = [];

  /* @Output() mostarTabla = new EventEmitter <string>(); */

  constructor(private _sLiqui: LiquidezService, private router: Router,
    private activatedRoute: ActivatedRoute, private traspasoService: TraspasosService,
    private equipamientoService: EquipamientosService, private usuariosService: UsuariosService,
    private estadosService: EsatdosService, private matt: MatInputModule) { }


  ngOnInit(): void {
    /* console.log('respuesta',this.mostrar); */
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
    });
    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
    this.usuario = localStorage.getItem('idusu');
    this.obterPublicaciones();
    this.obterPublicacionesTraspasos();
    this.obterPublicacionesEquipamiento();



  }

  mostrar = false;
  vacio = true;
  bliq: any[] = [];
  btras: any[] = [];
  bequip: any[] = [];
  traspasos: any[] = [];

  resultadoBusquedaLiquidez: any[] = [];

  criteriosDeBusqueda: any[] = [];
 
  heroes: any[] = [];
  termino: string;

  formMembe() {
    this.formMember = new FormGroup({
      ubicacion: new FormControl(''),
      estado: new FormControl(''),
      municipio: new FormControl(''),
      tipoSocio: new FormControl(''),
      tipoNegocio: new FormControl(''),
      masSocio: new FormControl(''),
      precioDesde: new FormControl(''),
      precioHasta: new FormControl(''),
      excluirAntinguedad: new FormControl(''),
      antiguedadPubl: new FormControl('')
    })
  }


  consultar() {
  }




  /*  ------------------------- BUSCADOR LIQUIDEZ */



  buscarResultadosLiquidez() {
    this.resultadoBusquedaLiquidez = [];
    this.vacio = false;

    let rq = this.formMember.getRawValue();
    this.mostrar = true;

    console.log(rq);
    if (!rq.tipoNegocio && !rq.tipoSocio && !rq.estado && !rq.municipio && !rq.antiguedadPubl && !rq.precioHasta) {
      this.vacio = true;
      console.log('busqueda vacia');
    } else {
      this.vacio = false


      this.animales.forEach((element, index) => {
        /* console.log('arreglo bd', element); */
        /* BAJADA DE DATOS */
        /*  let buscar=this.formMember.get('tipoNegocio').value; */



        let local: any[] = [];
        let bd: any[] = [];

        /* let negocioABuscar = rq.tipoNegocio;
        let socioABuscar = rq.tipoSocio;
        let cantidadMaxima = rq.precioHasta;
        let estadoABuscar = rq.estado;
        let municipioABuscar = rq.municipio;

        let antiguedadABuscar = rq.antiguedadPubl;


        let bdNegocios = element.tipoNegocio;
        let bdSocios    = element.tipoSocio;
        let bdMonto    = element.monto;
        let bdEstado    = element.estado;
        let bdMunicipio    = element.nunicipio;

        let bdUbicacion    = element.ubicacion;
        let bdAntiguedad   = null; */

        local[0] = rq.tipoNegocio;
        local[1]= rq.tipoSocio;
        local[2] = rq.precioHasta;
        local[3] = rq.estado;
        local[4] = rq.municipio;

       


        bd[0] = element.tipoNegocio;
        bd[1]   = element.tipoSocio;
        bd[2]    = element.monto;
        bd[3]   = element.estado;
        bd[4]    = element.nunicipio;

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


  /*       console.log(local[1]);
  */
  
 



        /* if (bdNegocios === negocioABuscar && bdSocios ===socioABuscar ) {
          console.log('animales', this.animales[index]);
          this.resultadoBusquedaLiquidez.push(element)
        } */

      })

    }

    return this.resultadoBusquedaLiquidez;
    console.log(this.vacio);

  }


  /*   TERMINO BUSQUEDA */



  buscarEnLiquidez(buscar: any): negocios[] {


    console.log(buscar);
    let todos: any[] = [];
    let tras: negocios[] = [];

    let heroesArr: negocios[] = [];
    let equi: negocios[] = [];


    console.log(this.animales);


    this.animales.forEach(element => {


      let buscar = this.formMember.get('tipoNegocio').value;
      buscar = buscar.toLowerCase();

      let base = element.tipoNegocio.toLowerCase();

      if (base === buscar) {

        console.log('entro a la comparacion');

      }

    })
    for (let i = 0; i < this.animales.length; i++) {

      let heroe = this.animales[i];
      let nombre = heroe.nombre.toLowerCase();
      let tipoNegocio = heroe.tipoNegocio.toLowerCase();



      console.log('tipo de negocio (', tipoNegocio, ')== busqueda=(', buscar, ')');

      if (tipoNegocio == buscar) {
        console.log('entro a la comparacion');
      }

      if (nombre.indexOf(buscar) >= 0 || tipoNegocio.indexOf(buscar) >= 0) {

        heroe.idx = i;
        heroesArr.push(heroe)
        console.log('entro');
      }

    }
    todos.push(heroesArr)


    return todos;


  }






  obterPublicaciones() {
    this._sLiqui.obtenerLiquidezTodos().subscribe((result: any) => {
      this.myProducts = result.data;
      this.usuario = JSON.parse(this.usuario);
      this.animales = this.myProducts;
      for (let i = 0; i < this.animales.length; i++) {
        this.animales[i].descripcion = this.limitar(this.animales[i].descripcion);
      }
    })
  }


  obterPublicacionesTraspasos() {
    this.traspasoService.obtenerTraspasoTodos().subscribe((result: any) => {
      this.myProducts = result.data;
      this.usuario = JSON.parse(this.usuario);
      this.traspasos = this.myProducts;
      for (let i = 0; i < this.traspasos.length; i++) {
        this.traspasos[i].descripcion = this.limitar(this.traspasos[i].descripcion);
      }
      /* console.log(this.traspasos); */
    })
  }

  equipamiento: any[] = [];
  obterPublicacionesEquipamiento() {
    /*  this.equipamientoService.obtenerEquipamientoTodos().subscribe((result: any) => {
       this.myProducts = result;
       this.usuario = JSON.parse(this.usuario);
       this.equipamiento = this.myProducts;
       console.log(this.myProducts);
       
       for (let i = 0; i < this.equipamiento.length; i++) {
         this.equipamiento[i].descripcion = this.limitar(this.equipamiento[i].descripcion);
 
       }
       
     }) */
  }




  limitar(value: string): string {
    let limit = 100;
    return value.length > limit ? value.substring(0, limit) + "..." : value;

  }



  vaciar() {

    console.log('entro');
  }

  buscarHeroe(termino: string) {


    if (termino == '') {
      this.vacio = true;
    } else {
      this.vacio = false;
    }

    this.termino = termino;
    this.todos = this.buscarHeroes(termino);
    this.bliq = this.todos[0];

    this.btras = this.todos[1];
    this.bequip = this.todos[2];

    console.log(this.todos);
    if (this.heroes.length == 0) {
      console.log('Esta limpio weon');
    }

  }




  buscarHeroes(termino: string): negocios[] {
    termino = termino.toLowerCase();
    console.log(termino);
    let todos: any[] = [];
    let tras: negocios[] = [];

    let heroesArr: negocios[] = [];
    let equi: negocios[] = [];


    console.log(this.animales);


    this.animales.forEach(element => {
      console.log('1', element.tipoNegocio);
      console.log('2', this.formMember.get('tipoNegocio').value);
      let buscar = this.formMember.get('tipoNegocio').value;
      buscar = buscar.toLowerCase();
      let base = element.tipoNegocio.toLowerCase();

      if (base === buscar) {

        console.log('entro a la comparacion');

      }

    })
    for (let i = 0; i < this.animales.length; i++) {

      let heroe = this.animales[i];
      let nombre = heroe.nombre.toLowerCase();
      let tipoNegocio = heroe.tipoNegocio.toLowerCase();



      console.log('tipo de negocio (', tipoNegocio, ')== busqueda=(', termino, ')');

      if (tipoNegocio == termino) {
        console.log('entro a la comparacion');
      }

      if (nombre.indexOf(termino) >= 0 || tipoNegocio.indexOf(termino) >= 0) {

        heroe.idx = i;
        heroesArr.push(heroe)
        console.log('entro');
      }

    }
    todos.push(heroesArr)
    for (let i = 0; i < this.traspasos.length; i++) {

      let heroe = this.traspasos[i];
      let nombre = heroe.nombre.toLowerCase();
      let tipoNegocio = heroe.tipoNegocio.toLowerCase();

      if (nombre.indexOf(termino.toLowerCase()) >= 0 || tipoNegocio.indexOf(termino.toLowerCase()) >= 0) {
        heroe.idx = i;
        tras.push(heroe)
      }



    }
    todos.push(tras)

    for (let i = 0; i < this.equipamiento.length; i++) {

      let heroe = this.equipamiento[i];
      let nombre = heroe.nombre.toLowerCase();
      let tipoNegocio = heroe.tipoNegocio.toLowerCase();

      if (nombre.indexOf(termino.toLowerCase()) >= 0 || tipoNegocio.indexOf(termino.toLowerCase()) >= 0) {
        heroe.idx = i;
        equi.push(heroe)
      }

    }
    todos.push(equi)

    return todos;


  }
  perfil(idN) {
    this.router.navigate([`/reult-complete-liquidity/${idN}`])
  }

  enviarTraspaso(idN) {
    this.router.navigate([`/contacto-traspaso/${idN}`])
  }
  enviarEquipamento(idN) {
    this.router.navigate([`/contacto-equipamiento/${idN}`])
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
  }


}



export interface negocios {
  tipoNegocio: string;
  tipoSocio: string;
  estado: string;
  nunicipio: string;
  monto: string;
  nombre: string;
  descripcion: string;
  idx?: number;
  id: number;
  ubicacion: string;
};
  /*
}dhjdhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
 */


