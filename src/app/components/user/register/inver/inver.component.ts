import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SocialAuthService } from 'angularx-social-login';
import { NotificacionesService } from '../../../../services/notificaciones.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { DatosRegistroRedSocialComponent } from '../../../modals/datos-registro-red-social/datos-registro-red-social.component';

@Component({
  selector: 'app-inver',
  templateUrl: './inver.component.html',
  styleUrls: ['./inver.component.css']
})
export class InverComponent implements OnInit {

  formRegister : FormGroup;
  resultado;
  user;
  loggedIn;

  constructor(private router: Router, private _us: UsuariosService,  private _NTS:NotificacionesService,
              private authSocial: SocialAuthService, private spinnerService:NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.formRegiste();
    this.formRegister.get('isInversionista').setValue(true);
  }

  formRegiste(){
    this.formRegister = new FormGroup({
      nombre: new FormControl('', [Validators.required,Validators.minLength(4)]),
      apellidoPaterno: new FormControl('',[Validators.required,Validators.minLength(4)]),
      apellidoMaterno: new FormControl('',[Validators.required, Validators.minLength(4)]),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(8)]),
      redSocialId: new FormControl(''),
      telefono: new FormControl('',[Validators.required, Validators.minLength(10)]),
      isInversionista: new FormControl('',[Validators.required]),
      membresia : new FormControl( '',[Validators.required])
    })
  }

  registrar() {
    this.spinnerService.show()
    console.log(this.formRegister.value);
    this.formRegister.removeControl('redSocialId')
    
    this._us.registerUser(this.formRegister.value).subscribe((resp:any) => {
     if(resp.exito == true){
       this._NTS.lanzarNotificacion('Usuario registrado con éxito','Registro correcto', 'success')
       this.router.navigateByUrl('/user/login');
       this.spinnerService.hide()
     }else if (resp.exito == false){
      this._NTS.lanzarNotificacion(`Ha ocurrido un error "${resp.mensaje}"`, "Error", 'error');
      this.spinnerService.hide()
     }
     this.spinnerService.hide();
    })
  
  }
  registroGoogle(): void {
    this.authSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then( (resp:any)=>{
      if(resp.id){
      this.registrarRedSocial(resp);
      }
    });
  }

  
 
  registroFacebook(): void {
    this.authSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(resp =>{
      if(resp.id){
        this.registrarRedSocial(resp);
        }
    });
  }
  registrarRedSocial(data){
    this.spinnerService.show()
    let login = { redSocialId: data.id }
    this.authService.loginRedSocial(login).subscribe((respLog:any) => {
      if(respLog.exito == true){
        this._NTS.lanzarNotificacion('Ya existe una cuenta registrada con ese correo', 'Error', 'error').then(resp => {
          this.formRegister.get('isInversionista').setValue(true);
        });
        this.spinnerService.hide();
      } 
      else if (respLog.exito == false){
        setTimeout(() => {
          this.openDialog(data);
          this.spinnerService.hide();
        }, 1500);
        console.log("te tienes que registrar");
      }
   })
  }

  statusSesion(respLog){
    this.spinnerService.show();
    console.log(respLog);
    localStorage.setItem('SCtoken', respLog.data.token);
    localStorage.setItem('idusu', respLog.data.id );
    localStorage.setItem('isInversionista', respLog.data.isInversionista); 
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1500);
  }

  openDialog(value){
    let inversionistaInfo = {
      value,
      inversionista: "true"
    }
    const dialogRef = this.dialog.open(DatosRegistroRedSocialComponent, {
      data:inversionistaInfo
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  cancelar(){
    this.router.navigateByUrl('/user/login');
  }


}
