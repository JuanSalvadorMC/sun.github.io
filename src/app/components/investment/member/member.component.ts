import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

formMember: FormGroup;
catTipoNegocio: any[] = [];
catTipoSocio: any[] = [];

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.catTipoNegocio = this.usuariosService.catTipoNegocio
    console.log(this.catTipoNegocio);
    this.catTipoSocio = this.usuariosService.catTipoSocio
    console.log(this.catTipoSocio);
    this.formMembe();
  }

  formMembe(){
    this.formMember = new FormGroup({
      ubicacion : new FormControl( null, Validators.required ),
      tipoSocio: new FormControl( null, Validators.required ),
      tipoNegocio: new FormControl( null, Validators.required ),
      masSocio: new FormControl( null, Validators.required ),
      precioDesde: new FormControl( null, Validators.required ),
      precioHasta: new FormControl( null, Validators.required ),
      excluirAntinguedad: new FormControl( null, Validators.required ),
      antiguedadPubl : new FormControl( null, Validators.required )
    })
  }


  consultar(){
    console.log(this.formMember.value);
  }

}
