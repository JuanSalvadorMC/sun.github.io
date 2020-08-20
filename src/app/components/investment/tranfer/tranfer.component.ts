import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';

@Component({
  selector: 'app-tranfer',
  templateUrl: './tranfer.component.html',
  styleUrls: ['./tranfer.component.css']
})
export class TranferComponent implements OnInit {

  formTranfer: FormGroup;
  catTipoNegocio: any[] = [];
  catEstados:any[]=[];
  catMunicipios:any[]=[];

  constructor( private usuariosService: UsuariosService, private estadosService: EsatdosService ) { }

  ngOnInit(): void {
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });
    this.formTranfe()
  }

  formTranfe(){
    this.formTranfer = new FormGroup({
      ubicacion: new FormControl( null),
      estado: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      tipoNegocio: new FormControl( null, Validators.required ),
      precioDesde: new FormControl( null, Validators.required ),
      precioHasta: new FormControl( null, Validators.required ),
      sinAntiguedad: new FormControl( null, Validators.required ),
      antiguedadPubl: new FormControl( null, Validators.required )
    })
  }

  consultar(){
    console.log(this.formTranfer.value);
  }

  obtenerMunicipios(){
    this.catMunicipios = [];
    this.estadosService.obtenerMunicipios(this.formTranfer.get('estado').value).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })

}
}