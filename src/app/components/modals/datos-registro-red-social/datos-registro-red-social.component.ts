import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-registro-red-social',
  templateUrl: './datos-registro-red-social.component.html',
  styleUrls: ['./datos-registro-red-social.component.css']
})
export class DatosRegistroRedSocialComponent implements OnInit {

  formRegistrar: FormGroup;

  constructor(public dialogRef: MatDialogRef<DatosRegistroRedSocialComponent>, private notifiacionesService: NotificacionesService,
    @Inject(MAT_DIALOG_DATA) private data: any, private usuarioService: UsuariosService, private router: Router
    ) { }

  ngOnInit(): void {
  console.log(this.data);
  this.crearFormulario();

  }

  crearFormulario(){
    this.formRegistrar = new FormGroup({
      nombre: new FormControl('',[Validators.required]),
      apellidoPaterno: new FormControl('',[Validators.required]),
      apellidoMaterno: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required]),
      redSocialId: new FormControl('',[Validators.required]),
      telefono: new FormControl('',[Validators.required]),
      isInversionista: new FormControl('',[Validators.required])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registrar(){
   
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
            this.notifiacionesService.lanzarNotificacion('Usuario registrado con éxito', 'Registro correcto', 'success').then(resp => {
              this.router.navigate([`user/profile/id`]);
            });

          }
           else if (resp.extito == false){
            this.notifiacionesService.lanzarNotificacion(`Ha ocurrido un error "${resp.mensaje}"`, "Error", 'error');
           }
        })
        this.dialogRef.close();
  }


}
