import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-info-ivers',
  templateUrl: './info-ivers.component.html',
  styleUrls: ['./info-ivers.component.css']
})
export class InfoIversComponent implements OnInit {

  ocultarRegistro: boolean = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup : FormGroup;

 
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if(localStorage.getItem('idusu')){
      this.ocultarRegistro = false;
     
    }
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', ]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', ]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', ]
    });
  }
 


}
