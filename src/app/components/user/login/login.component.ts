import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  hide = true;
  resultado;
  respuesta;

  constructor(  private router : Router, private usService : AuthService, private authSocial: SocialAuthService ) { }

  ngOnInit(): void {
    this.formLogi();
  }

  formLogi(){
    this.formLogin = new FormGroup ({
      email: new FormControl( '' ),
      password: new FormControl ( '' ),
      creador: new FormControl(localStorage.getItem('idusu'))

    })
  }

  onLoginCorreo($creador){
    this.usService.onlogin(this.formLogin.value).subscribe ( resp => {
        this.resultado = resp;
        if( this.resultado.data.isInversionista === true ){
          localStorage.setItem('idusu', this.resultado.data.id);
          localStorage.setItem('SCtoken', this.resultado.data.token);
          localStorage.setItem('isInversionista', this.resultado.data.isInversionista);
          this.router.navigate([`user/profile/id`])
          .then(dato=>{
            location.reload()
           });
        }   else
        if( this.resultado.data.isInversionista === false){
          localStorage.setItem('idusu', this.resultado.data.id);
          localStorage.setItem('SCtoken', this.resultado.data.token);
          localStorage.setItem('isInversionista', this.resultado.data.isInversionista);
          this.router.navigate([`user/profile/id`])
          .then(dato=>{
            location.reload()
           });
        }

      });
  }

  loginGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
 
  loginFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
