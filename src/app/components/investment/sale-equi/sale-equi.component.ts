import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';

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

  constructor(private usuariosService: UsuariosService, private estadosService: EsatdosService) { }

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
  consultar(){
    console.log(this.formSaleEq.value);
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
