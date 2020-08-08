import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-datos-registro-red-social',
  templateUrl: './datos-registro-red-social.component.html',
  styleUrls: ['./datos-registro-red-social.component.css']
})
export class DatosRegistroRedSocialComponent implements OnInit {

  formRegistrar: FormGroup;
  loggedIn;
  user;
  inversionista: boolean = false;

  constructor(public dialogRef: MatDialogRef<DatosRegistroRedSocialComponent>, private notifiacionesService: NotificacionesService, private spinnerService: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: any, private usuarioService: UsuariosService, private router: Router, 
              private authService:AuthService, private authSocial: SocialAuthService) { }

  
  ngOnInit(): void {
    console.log(this.data);
      this.crearFormulario();
  }

  crearFormulario(){
    this.formRegistrar = new FormGroup({
      nombre: new FormControl(''),
      apellidoPaterno: new FormControl(''),
      apellidoMaterno: new FormControl('',[Validators.required]),
      email: new FormControl(''),
      redSocialId: new FormControl(''),
      telefono: new FormControl('',[Validators.required]),
      isInversionista: new FormControl('',[Validators.required])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registrarInversionsiita(event){
    this.formRegistrar.addControl('tipoMembresia', new FormControl('', Validators.required))
    this.inversionista = event.isTrusted;
  }

  cambiarTipoUusario(){
    this.inversionista = false
    this.formRegistrar.removeControl('tipoMembresia');
  }

  registrar(){
    this.spinnerService.hide();
   let rq = this.formRegistrar.getRawValue();
   rq.redSocialId = this.data.id
   rq.nombre = this.data.firstName
   rq.apellidoPaterno = this.data.lastName
   rq.email = this.data.email
   rq.isInversionista = JSON.parse(rq.isInversionista);
      console.log(rq);

        this.usuarioService.registerUserRedSocial(rq).subscribe((resp:any) => {
          console.log(resp);
           if(resp.exito == true){
            this.notifiacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Registro correcto', 'success').then(any => {
              let login = { redSocialId: resp.data.id }
              this.authService.loginRedSocial(login).subscribe(respLog => {
                this.statusSesion(respLog);
                this.router.navigate([`user/profile/id`]).then(()=> window.location.reload());
                this.spinnerService.hide();
              })
            })
          }
           else if (resp.exito == false){
            this.notifiacionesService.lanzarNotificacion(`Ha ocurrido un error "${resp.mensaje}"`, "Error", 'error');
            this.spinnerService.hide();
           }
        })
        this.dialogRef.close();   
  } 

  statusSesion(respLog){
    this.spinnerService.show();
    console.log(respLog);
    localStorage.setItem('SCtoken', respLog.data.token);
    localStorage.setItem('idusu', respLog.data.id );
    localStorage.setItem('isInversionista', respLog.data.isInversionista);
    this.router.navigate([`user/profile/id`]); 
    this.authSocial.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1500);
  }


}
