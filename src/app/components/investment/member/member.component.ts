import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LiquidezService } from 'src/app/services/liquidez.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

formMember: FormGroup;
catTipoNegocio: any[] = [];
catTipoSocio: any[] = [];
catEstados:any[]=[];
catMunicipios:any[]=[];


myProducts: any;
  usuario: any;
  idNegocio: any;
  animales: negocios[] = [];
  todos: any[] = [];

  constructor(private _sLiqui: LiquidezService, private router: Router,
    private activatedRoute: ActivatedRoute, private traspasoService: TraspasosService,
    private equipamientoService: EquipamientosService,private usuariosService: UsuariosService,
    private estadosService: EsatdosService) { }


  ngOnInit(): void {
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    this.catTipoSocio = this.usuariosService.catTipoSocio
    this.formMembe();
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });
    this.activatedRoute.params.subscribe(resp => { this.idNegocio = resp.id })
      this.usuario = localStorage.getItem('idusu');
      this.obterPublicaciones();
      this.obterPublicacionesTraspasos();
      this.obterPublicacionesEquipamiento();
  }

  buscar=true;
  bliq: any[] = [];
  btras: any[] = [];
  bequip: any[] = [];

  formMembe(){
    this.formMember = new FormGroup({
      ubicacion : new FormControl( '' ),
      estado: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      tipoSocio: new FormControl( '', Validators.required ),
      tipoNegocio: new FormControl( '', Validators.required ),
      masSocio: new FormControl( '', Validators.required ),
      precioDesde: new FormControl( '', Validators.required ),
      precioHasta: new FormControl( '', Validators.required ),
      excluirAntinguedad: new FormControl( '', Validators.required ),
      antiguedadPubl : new FormControl( '', Validators.required )
    })
  }


  consultar(){
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

traspasos: any[] = [];
obterPublicacionesTraspasos() {
  this.traspasoService.obtenerTraspasoTodos().subscribe((result: any) => {
    this.myProducts = result.data;
    this.usuario = JSON.parse(this.usuario);
    this.traspasos = this.myProducts;
    for (let i = 0; i < this.traspasos.length; i++) {
      this.traspasos[i].descripcion = this.limitar(this.traspasos[i].descripcion);
    }
 })
}

equipamiento: any[] = [];
obterPublicacionesEquipamiento() {
  this.equipamientoService.obtenerEquipamientoTodos().subscribe((result: any) => {
    this.myProducts = result;
    this.usuario = JSON.parse(this.usuario);
    this.equipamiento = this.myProducts;
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
  if (termino == '') {
    /* this.heroes = []; */
    this.vacio = true;
  } else {
    this.vacio = false;
  }

  this.termino = termino;
  this.todos = this.buscarHeroes(termino);
  this.bliq=this.todos[0];

  
  this.btras=this.todos[1];
  this.bequip=this.todos[2];
  if (this.heroes.length == 0) {
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

obtenerMunicipios(){
  this.catMunicipios = [];
  this.estadosService.obtenerMunicipios(this.formMember.get('estado').value).subscribe(resp => {
    let municipio:any[]= resp.response.municipios
    municipio.forEach((elm, i)=> {
      let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
      this.catMunicipios.push(municipioObject)
    });
  })
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