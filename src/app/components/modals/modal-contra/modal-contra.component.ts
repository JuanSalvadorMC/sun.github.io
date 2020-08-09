import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConditionalExpr } from '@angular/compiler';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modal-contra',
  templateUrl: './modal-contra.component.html',
  styleUrls: ['./modal-contra.component.css']
})
export class ModalContraComponent implements OnInit {

  formContraActual : FormGroup;
  hide = true;
  dataProducts;
  respuesta;
  resultado;
  imageError: string;


  constructor(public dialogRef: MatDialogRef<ModalContraComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,  private _us : UsuariosService, private notificacionesServie: NotificacionesService,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.formContraActualizar();
    this.getContra();
    this.dataProducts = this.data.item;
    this.formContraActual.get('id').setValue(this.data.id);
  }

  formContraActualizar(){
    this.formContraActual = new FormGroup ({
      id: new FormControl('',[Validators.required]),
      oldPassword: new FormControl('',[Validators.required]),
      newPassword: new FormControl('',[Validators.required]),
    })
  }

  getContra(){
    this.dataProducts = this._us.cambiarContra(this.dataProducts)
    console.log('get',this.dataProducts)
  }

  cambiarContra(): void {
    this._us.cambiarContra(this.formContraActual.value).subscribe((resp:any) => {
      console.log(resp);
      if(resp.exito == true){
        this.spinnerService.show();
      this.notificacionesServie.lanzarNotificacion('Se cambió correctamente la contraseña','Cambio de contraseña exitoso','success').then(exito =>{
        this.dialogRef.close();
      });
      setTimeout(() => {
          this.spinnerService.hide();
        
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
