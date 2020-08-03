import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-empre',
  templateUrl: './empre.component.html',
  styleUrls: ['./empre.component.css']
})
export class EmpreComponent implements OnInit {

  formRegisterEmpre: FormGroup;
  resultado;

  constructor(private router: Router, private _us: UsuariosService) { }

  ngOnInit(): void {
    this.formRegisteEmpre()
  }

  formRegisteEmpre() {
    this.formRegisterEmpre = new FormGroup({
      nombre: new FormControl(''),
      apellidoPaterno: new FormControl(''),
      apellidoMaterno: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      telefono: new FormControl(''),
      isInversionista: new FormControl(false)
    })
  }

  registrar() {
    this._us.registerUser(this.formRegisterEmpre.value).subscribe(resp => {
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