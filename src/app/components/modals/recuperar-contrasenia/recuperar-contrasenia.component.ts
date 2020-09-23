import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConditionalExpr } from '@angular/compiler';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css']
})
export class RecuperarContraseniaComponent implements OnInit {

  formRecuperarContra : FormGroup;

  constructor(public dialogRef: MatDialogRef<RecuperarContraseniaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,  private _us : UsuariosService, private notificacionesServie: NotificacionesService,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(){
    this.formRecuperarContra = new FormGroup ({
      email: new FormControl('',[Validators.required]),
    })
  }

  recuperarContrasenia(): void {
    let rq = this.formRecuperarContra.getRawValue();
    rq.email = rq.email = rq.email.toLowerCase();
    this._us.restablecerContra(rq).subscribe((resp:any) => {
      console.log(resp);
      if(resp.exito == true){
        this.spinnerService.show();
      setTimeout(() => {
          this.spinnerService.hide();
          this.notificacionesServie.lanzarNotificacion('Se envió un correo de recuperación de contraseña','Correo enviado con éxito','success').then(exito =>{
            this.dialogRef.close();
          });
      }, 1500);
    }
    else if(resp.exito == false){
      this.notificacionesServie.lanzarNotificacion(`Ha ocurrido un error ${resp.mensaje}`, 'Error', 'error')
    }
  }, err => {
    this.notificacionesServie.lanzarNotificacion('Hubo un error interno', 'Error', 'error');
  });
 }

 onNoClick(): void {
  this.dialogRef.close();
}

}