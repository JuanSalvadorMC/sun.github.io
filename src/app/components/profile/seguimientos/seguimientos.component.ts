import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarService } from '../../../services/navbar.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosService } from '../../../services/usuarios.service';
import { TraspasosService } from '../../../services/traspasos.service';
import { EquipamientosService } from '../../../services/equipamientos.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ContactoService } from '../../../services/contacto.service';

@Component({
  selector: 'app-seguimientos',
  templateUrl: './seguimientos.component.html',
  styleUrls: ['./seguimientos.component.css']
})
export class SeguimientosComponent implements OnInit {

  formSeg: FormGroup;
  respuesta;
  resultados: any[] = [];
  resultadosTraspaso: any[] = [];
  resultadosEquipamientos: any[] = [];
  myProducts: any;
  usuario: any;
  headElementsseg = [ 'Empresa','Estado','Municipio', 'Calle', 'Descripción',  'Tipo Socio','Tipo Negocio', 'Monto Inversion', 'Competidores'];
  headElementsTrasseg = [ 'Empresa', 'Estado','Municipio', 'Calle', 'Descripción', '**GOM','Tipo Negocio', '**VMP', 'Competidores'];
  headElementsEquipaseg = [ 'Empresa', 'Estado','Municipio', 'Calle', 'Descripción',  'Tipo Negocio', 'Monto']

  constructor(private activatedRoute: ActivatedRoute, private contactoService : ContactoService,
    private _us: UsuariosService, private _tras: TraspasosService, private _equipa: EquipamientosService,
    public dialog: MatDialog, private nav: NavbarService, private router: Router) {

  }

  ngOnInit(): void {
    this.nav.visible;
    console.log(this.nav.visible);
    this.usuario = JSON.parse(localStorage.getItem('idusu'));
    this.formSeguimiento();
    this.obterPublicaciones();
    console.log(this.resultados);
  }

  limitar(value: string): string {
    
    
    let limit = 90;
    return value.length > limit ? value.substring(0, limit) + "..." : value;

  }

  formSeguimiento() {
    this.formSeg = new FormGroup({
      id: new FormControl(this.usuario)  
    })
  }
  
  irContacto(id){
    this.router.navigate([`/reult-complete-liquidity/${id}`]);
  }
  irContactoTras(id){
    this.router.navigate([`/contacto-traspaso/${id}`]);
  }
  irContactoEqui(id){
    this.router.navigate([`/contacto-equipamiento/${id}`]);
  }

  obterPublicaciones() {
    let invert = {inversionista:localStorage.getItem('idusu')}
    this._us.contactoHistorial(invert).subscribe( (seg : any) => {
      
      seg.data.forEach(elm => { 
        if (elm.tipoPublicacion == 'L'){
          this.resultados.push(elm.publicacionCompleta)
          console.log(elm);
        }
        if (elm.tipoPublicacion == 'T'){
          this.resultadosTraspaso.push(elm.publicacionCompleta)
        }
        if (elm.tipoPublicacion == 'E'){
          this.resultadosEquipamientos.push(elm.publicacionCompleta)
        }
        
       })
       
       console.log(this.resultados);
       console.log(this.resultadosEquipamientos);
       console.log(this.resultadosTraspaso);
    })
    /* this.contactoService.mostrarSeguimientos().subscribe((result: any) => {
      this.myProducts = result.data;
      console.log(this.usuario); 
        console.log(this.myProducts.creador);
   this.resultados = this.myProducts.filter(obtener => obtener.creador === this.usuario) 
     this.resultados = this.myProducts;
      console.log(this.resultados);
      for (let i = 0; i < this.resultados.length; i++) {
        this.resultados[i].descripcion= this.limitar(this.resultados[i].descripcion);
        
      }
    }) */
  }  
}
