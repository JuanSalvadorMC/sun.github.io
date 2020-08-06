import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-inver',
  templateUrl: './inver.component.html',
  styleUrls: ['./inver.component.css']
})
export class InverComponent implements OnInit {

  formRegister : FormGroup;
  resultado;

  constructor( private router : Router, private _us : UsuariosService) { }

  ngOnInit(): void {
    this.formRegiste();
  }

  formRegiste(){
    this.formRegister = new FormGroup({
      nombre: new FormControl(  '' ),
      apellidoPaterno: new FormControl( '' ),
      apellidoMaterno: new FormControl( '' ),
      email: new FormControl( '' ),
      password: new FormControl ( '' ),
      telefono: new FormControl( '' ),
      isInversionista: new FormControl( true ),
      membresia : new FormControl( '2' )
    })
  }

  registrar() {
    this._us.registerUser(this.formRegister.value).subscribe(resp => {
      this.resultado = resp;
      if (this.resultado.data != true) {
        this.router.navigateByUrl('/user/login')
      //   .then(dato=>{
      //     location.reload()
      //    });
      }
    }
    )
  }

}
