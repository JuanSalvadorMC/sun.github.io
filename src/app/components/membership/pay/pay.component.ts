import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { IpService } from 'src/app/services/ip.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

declare const SrPago: any;
SrPago.setLiveMode(true);
SrPago.setPublishableKey('pk_live_5f590148badf9RH4cU');

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
})
export class PayComponent implements OnInit {
  formPay: FormGroup;

  planes: Array<any> = [
    {id: 1, nombre: 'Estándar'},
    {id: 2, nombre: 'Destacado'},
    {id: 3, nombre: 'Premium'},
  ];


  meses: Array<{id: number, nombre:string}> = [
    {id: 1, nombre: '01'},
    {id: 2, nombre: '02'},
    {id: 3, nombre: '03'},
    {id: 4, nombre: '04'},
    {id: 5, nombre: '05'},
    {id: 6, nombre: '06'},
    {id: 7, nombre: '07'},
    {id: 8, nombre: '08'},
    {id: 9, nombre: '09'},
    {id: 10, nombre: '10'},
    {id: 11, nombre: '11'},
    {id: 12, nombre: '12'},
  ]

  anios: Array<{id: number, nombre:string}> = [
    {id: 1, nombre: '2020'},
    {id: 2, nombre: '2021'},
    {id: 3, nombre: '2022'},
    {id: 4, nombre: '2023'},
    {id: 5, nombre: '2024'},
    {id: 6, nombre: '2025'},
    {id: 7, nombre: '2026' },
  ]

  constructor(public paymentService: PaymentService, private fb: FormBuilder, public ipService: IpService, private router: Router) {}

  ngOnInit(): void {
    this.formPays();
  }

  formPays() {
    this.formPay = this.fb.group({
      plan: [null, Validators.required],
      numeroTarjeta: [null, Validators.required], // 4485 5312 6374 8329
      mes: [null, Validators.required], // 08
      anio: [null, Validators.required], //2022
      ccv: [null, Validators.required], //238
      nombre: [null, Validators.required],
      aPaterno: [null, Validators.required],
      aMaterno: [null, Validators.required],
      calle: [null, Validators.required],
      numExt: [null, Validators.required],
      numInt: [null, Validators.required],
      colonia: [null, Validators.required],
      cp: [null, Validators.required],
      delegacion: [null, Validators.required],
      ciudad: [null, Validators.required],
      estado: [null, Validators.required],
      telefono: [null, Validators.required],
      mail: [null, Validators.required]
    });
  }
  mensaje;
  consulta() {
    console.log(this.formPay.value);
  }

  async tokenizar() {
    

    let card = {
      number: this.formPay.get('numeroTarjeta').value,
      holder_name: `${this.formPay.get('nombre').value} ${this.formPay.get('aPaterno').value} ${this.formPay.get('aMaterno').value}`,
      cvv: this.formPay.get('ccv').value,
      exp_month: this.formPay.get('mes').value,
      exp_year: this.formPay.get('anio').value,
    };

    SrPago.token.create(card,
      (resp) => {
        // console.log(resp);
        const token = resp.token;

        this.ipService.getIpAddress().subscribe(resp => {

          let form = this.formPay.getRawValue();
          let direccion1 = `${form.calle} ${form.numInt} ${form.numExt}`;
          let direccion2 = `${form.colonia} ${form.delegacion}`;

          let req = {
            id: localStorage.getItem('idusu'),
            membresia: this.formPay.get('plan').value,
            ip: resp.ip,
            token,
            metadata: {
              billing: {
                "billingEmailAddress": form.mail,
                "billingFirstName-D": form.nombre,
                "billingMiddleName-D": form.aPaterno,
                "billingLastName-D": form.aMaterno,
                "billingAddress-D": direccion1,
                "billingAddress2-D": direccion2,
                "billingCity-D": form.ciudad,
                "billingState-D": form.estado,
                "billingPostalCode-D": form.cp,
                "billingPhoneNumber-D": form.telefono,
              },
            }
          }

          console.log(req);
      
          this.paymentService.payment(req).subscribe(resp => {
            if (resp.exito) {
             
              return Swal.fire('Alerta', 'El pago se ha completado exitosamente', 'success').then(() => {
                this.formPay.reset();
                this.router.navigate(['/'])
              })
            }
            
          }, (err) => {
            
            this.formPay.get('numeroTarjeta').invalid;
            return Swal.fire('Favor de verificar sus datos de tarjeta',this. mensaje , 'error');
          })
     
          
        })

      },
      (err) => {
        console.log(err);
        console.log(err.message);
        this.formPay.get('numeroTarjeta').invalid;
        Swal.fire('Favor de verificar sus datos de tarjeta',  this.mensaje, 'error');
      }
    );
  }
 

  Error(name: string) {
    return this.formPay.get('plan'); 
  }

}
