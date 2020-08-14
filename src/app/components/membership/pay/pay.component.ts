import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

declare const SrPago: any;
SrPago.setLiveMode(false);
SrPago.setPublishableKey("pk_dev_5f35d48a7cbe46KJKW");
@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

formPay: FormGroup;

  constructor(public paymentService: PaymentService) { }

  ngOnInit(): void {
    this.formPays();
  }

  formPays(){
    this.formPay = new FormGroup({
      numeroTarjeta: new FormControl(),
      vencimiento: new FormControl(),
      ccv: new FormControl(),
      nombre: new FormControl(),
      calle: new FormControl(),
      numExt: new FormControl(),
      numInt: new FormControl(),
      colonia: new FormControl(),
      cp: new FormControl(),
      delegacion: new FormControl(),
      ciudad: new FormControl(),
      estado: new FormControl(),
      pais: new FormControl()
    })
  }

  consulta(){
    console.log(this.formPay.value)
  }

  tokenizar() {
    // let req = this.formPay.getRawValue();

    let card = {
      number: '4485531263748329',
      holder_name: 'Jared de la o',
      cvv: '236',
      exp_month: '08',
      exp_year: '2022'
    };

    SrPago.token.create(card, (resp) => {
      // console.log(resp);

      const token = resp.token;

      console.log(token);
      

      let request = {
        "key": token,
        "data": "message",
        "metadata": {
          "billing": {
            "billingEmailAddress": "user@mail.com",
            "billingFirstName-D": "Juan",
            "billingLastName-D": "Perez",
            "billingAddress-D": "Amanalco sur",
            "billingPhoneNumber-D": "Amanalco sur",
          },
          "member": {
            "memberFullName": "Juan Perez",
            "memberFirstName": "Juan",
            "memberLastName": "Perez",
            "memberEmailAddress": "user@mail.com",
            "memberAdressLine1": "123 Main St",
            "memberAdressLine2": "main",
            "memberCity": "Cuautla",
            "memberState": "MOR",
            "memberCountry": "MEX",
            "memberPostalCode": "52977",
          },
          "items": {
            "item": [
              {
                "itemNumber": "1235847",
                "itemDescription": "iphone 6 32gb",
                "itemPrice": "1",
                "itemQuantity": "1",
              }
            ]
          }
        }
      }

      this.paymentService.pay(request).subscribe((resp) => {
        console.log(resp);
        
      })

    }, (err) => {
      console.log(err);
    });

    
    
  }
}
