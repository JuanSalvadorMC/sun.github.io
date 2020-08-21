import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

declare const SrPago: any;
SrPago.setLiveMode(false);
SrPago.setPublishableKey('pk_dev_5f35d48a7cbe46KJKW');

declare const RSAImplement: Function;
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
  ]

  constructor(public paymentService: PaymentService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formPays();
  }

  formPays() {
    this.formPay = this.fb.group({
      plan: [null, Validators.required],
      numeroTarjeta: [null, Validators.required],
      vencimiento: [null, Validators.required],
      ccv: [null, Validators.required],
      nombre: [null, Validators.required],
      calle: [null, Validators.required],
      numExt: [null, Validators.required],
      numInt: [null, Validators.required],
      colonia: [null, Validators.required],
      cp: [null, Validators.required],
      delegacion: [null, Validators.required],
      ciudad: [null, Validators.required],
      estado: [null, Validators.required],
      pais: [null, Validators.required]
    });
  }

  consulta() {
    console.log(this.formPay.value);
  }

  tokenizar() {
    // let req = this.formPay.getRawValue();

    let card = {
      number: '4485531263748329',
      holder_name: 'Jared de la o',
      cvv: '236',
      exp_month: '08',
      exp_year: '2022',
    };

    SrPago.token.create(
      card,
      (resp) => {
        // console.log(resp);

        const token = resp.token;

        console.log(token);

        // let request = {
        //   key: token,
        //   data: 'message',
        //   metadata: {
        //     billing: {
        //       billingEmailAddress: 'user@mail.com',
        //       'billingFirstName-D': 'Juan',
        //       'billingLastName-D': 'Perez',
        //       'billingAddress-D': 'Amanalco sur',
        //       'billingPhoneNumber-D': 'Amanalco sur',
        //     },
        //     member: {
        //       memberFullName: 'Juan Perez',
        //       memberFirstName: 'Juan',
        //       memberLastName: 'Perez',
        //       memberEmailAddress: 'user@mail.com',
        //       memberAdressLine1: '123 Main St',
        //       memberAdressLine2: 'main',
        //       memberCity: 'Cuautla',
        //       memberState: 'MOR',
        //       memberCountry: 'MEX',
        //       memberPostalCode: '52977',
        //     },
        //     items: {
        //       item: [
        //         {
        //           itemNumber: '1235847',
        //           itemDescription: 'iphone 6 32gb',
        //           itemPrice: '1',
        //           itemQuantity: '1',
        //         },
        //       ],
        //     },
        //   },
        // };

        // const RSA = RSAImplement();
        // console.log(RSA);

        // this.paymentService.pay(request).subscribe((resp) => {
        //   console.log(resp);
        // });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  Error(name: string) {
    return this.formPay.get('plan'); 
  }

}
