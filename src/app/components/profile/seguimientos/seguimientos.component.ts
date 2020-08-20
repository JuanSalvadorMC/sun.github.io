import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarService } from '../../../services/navbar.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosService } from '../../../services/usuarios.service';
import { TraspasosService } from '../../../services/traspasos.service';
import { LiquidezService } from '../../../services/liquidez.service';
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
  headElementsseg = [ 'Empresa', 'Calle', 'Descripción',  'Tipo Socio','Tipo Negocio', 'Monto Inversion', 'Competidores'];
  headElementsTrasseg = [ 'Empresa', 'Calle', 'Descripción', '**GOM','Tipo Negocio', '**VMP', 'Competidores'];
  headElementsEquipaseg = [ 'Empresa', 'Calle', 'Descripción',  'Tipo Negocio', 'Monto']

  constructor(private activatedRoute: ActivatedRoute, private contactoService : ContactoService,
    private _us: UsuariosService, private _tras: TraspasosService, private _equipa: EquipamientosService
    ,  public dialog: MatDialog, private nav: NavbarService, private router: Router) {

  }

  ngOnInit(): void {
    this.nav.visible;
    console.log(this.nav.visible);
    this.usuario = JSON.parse(localStorage.getItem('idusu'));
    this.formSeguimiento();
    this.obterPublicaciones();
    console.log(this.usuario);
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
  
  irContacto(){
    this.router.navigate([`/reult-complete-liquidity/${localStorage.getItem('idPublicacion')}`]);
  }

  obterPublicaciones() {
    let invert = {inversionista:localStorage.getItem('idusu')}
    this._us.contactoHistorial(invert).subscribe( (seg : any) => {
      console.log(seg);
      seg.data.forEach(elm => { 
        if (elm.tipoPublicacion == 'L'){
          this.resultados.push(elm.publicacionCompleta)
          
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
