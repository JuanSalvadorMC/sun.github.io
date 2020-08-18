import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-sale-equi',
  templateUrl: './sale-equi.component.html',
  styleUrls: ['./sale-equi.component.css']
})
export class SaleEquiComponent implements OnInit {

  formSaleEq: FormGroup;
  catTipoNegocio: any[] = [];

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    console.log(this.catTipoNegocio);
    this.formSale();
  }

  formSale(){
    this.formSaleEq = new FormGroup({
      ubicacion: new FormControl( null, Validators.required ),
      tipoNegocio: new FormControl( null, Validators.required ),
      montoDesde: new FormControl( null, Validators.required ),
      montoHasta: new FormControl( null, Validators.required ),
      sinAntiguedad: new FormControl( null, Validators.required ),
      antiguedad: new FormControl( null, Validators.required )
    })
  }



  consultar(){
    console.log(this.formSaleEq.value);
  }

}
