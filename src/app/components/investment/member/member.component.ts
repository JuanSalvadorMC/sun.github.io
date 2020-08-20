import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LiquidezService } from 'src/app/services/liquidez.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  formMember: FormGroup;
  catTipoNegocio: any[] = [];
  catTipoSocio: any[] = [];


  myProducts: any;
  usuario: any;
  idNegocio: any;
  animales: negocios[] = [];
  todos: any[] = [];

  /* @Output() mostarTabla = new EventEmitter <string>(); */

  constructor(private _sLiqui: LiquidezService, private router: Router,
    private activatedRoute: ActivatedRoute, private traspasoService: TraspasosService,
    private equipamientoService: EquipamientosService, private usuariosService: UsuariosService) { }


  ngOnInit(): void {
    /* console.log('respuesta',this.mostrar); */
    
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    console.log(this.catTipoNegocio);
    this.catTipoSocio = this.usuariosService.catTipoSocio
    console.log(this.catTipoSocio);
    this.formMembe();

    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
    /*   console.log(this, this.idNegocio); */
    this.usuario = localStorage.getItem('idusu');
    this.obterPublicaciones();
    console.log(this.bequip);

    this.obterPublicacionesTraspasos();
    this.obterPublicacionesEquipamiento();
  }

  mostrar = false;
  bliq: any[] = [];
  btras: any[] = [];
  bequip: any[] = [];

  formMembe() {
    this.formMember = new FormGroup({
      ubicacion: new FormControl(null, Validators.required),
      tipoSocio: new FormControl(null, Validators.required),
      tipoNegocio: new FormControl(null, Validators.required),
      masSocio: new FormControl(null, Validators.required),
      precioDesde: new FormControl(null, Validators.required),
      precioHasta: new FormControl(null, Validators.required),
      excluirAntinguedad: new FormControl(null, Validators.required),
      antiguedadPubl: new FormControl(null, Validators.required)
    })
  }


  mostrarEnBusqueda() {
    /*  console.log(this.formMember.value); */
    console.log(this.mostrar);
    this.mostrar = true;
    console.log(this.mostrar);


    
    


  }
  /* 
  }dhjdhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
   */





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

  traspasos: any[] = [];
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
    this.equipamientoService.obtenerEquipamientoTodos().subscribe((result: any) => {
      this.myProducts = result;
      this.usuario = JSON.parse(this.usuario);
      this.equipamiento = this.myProducts;
      console.log(this.myProducts);
      for (let i = 0; i < this.equipamiento.length; i++) {
        this.equipamiento[i].descripcion = this.limitar(this.equipamiento[i].descripcion);

      }

    })
  }




  limitar(value: string): string {
    let limit = 100;
    return value.length > limit ? value.substring(0, limit) + "..." : value;

  }

  vacio = true;
  heroes: any[] = [];
  termino: string;


  buscarHeroe(termino: string) {

    console.log(termino);
    if (termino == '') {
      /* this.heroes = []; */
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

  /*  getHeroes(): negocios[] {
    return this.animales;
  
  }
  getHeroe(idx: string) {
    return this.animales[idx];
  } */


  buscarHeroes(termino: string): negocios[] {


    let todos: any[] = [];
    let tras: negocios[] = [];

    let heroesArr: negocios[] = [];
    let equi: negocios[] = [];


    for (let i = 0; i < this.animales.length; i++) {

      let heroe = this.animales[i];
      let nombre = heroe.nombre.toLowerCase();
      let tipoNegocio = heroe.ubicacion.toLowerCase();

      if (nombre.indexOf(termino.toLowerCase()) >= 0 || tipoNegocio.indexOf(termino.toLowerCase()) >= 0) {
        heroe.idx = i;
        heroesArr.push(heroe)
      }

    }
    todos.push(heroesArr)
    for (let i = 0; i < this.traspasos.length; i++) {

      let heroe = this.traspasos[i];
      let nombre = heroe.nombre.toLowerCase();
      let tipoNegocio = heroe.ubicacion.toLowerCase();

      if (nombre.indexOf(termino.toLowerCase()) >= 0 || tipoNegocio.indexOf(termino.toLowerCase()) >= 0) {
        heroe.idx = i;
        tras.push(heroe)
      }



    }
    todos.push(tras)

    for (let i = 0; i < this.equipamiento.length; i++) {

      let heroe = this.equipamiento[i];
      let nombre = heroe.nombre.toLowerCase();
      let tipoNegocio = heroe.ubicacion.toLowerCase();

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

}


export interface negocios {
  tipoNegocio: string;
  nombre: string;
  descripcion: string;
  idx?: number;
  id: number;
  ubicacion: string;
};