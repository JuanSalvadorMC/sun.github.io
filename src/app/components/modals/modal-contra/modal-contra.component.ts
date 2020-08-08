import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConditionalExpr } from '@angular/compiler';

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
    @Inject(MAT_DIALOG_DATA) public data: any,  private _us : UsuariosService ) { }

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
  this._us.cambiarContra(this.formContraActual.value).subscribe(resp => {
  this.resultado = resp;
  console.log(this.resultado);
  this.dialogRef.close(this.formContraActual.value)
  }
  )
 }

 onNoClick(): void {
  this.dialogRef.close();
}

}
