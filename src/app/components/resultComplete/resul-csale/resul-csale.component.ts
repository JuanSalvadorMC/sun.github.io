import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resul-csale',
  templateUrl: './resul-csale.component.html',
  styleUrls: ['./resul-csale.component.css']
})
export class ResulCSaleComponent implements OnInit {

  constructor(private router : Router,) { }

  ngOnInit(): void {
 this.ret(); 
  }
  ret(){
    setTimeout(()=>{
      window.location.href = '/#/home'; 
        
      console.log('--');
    },1);
    
  }

}
