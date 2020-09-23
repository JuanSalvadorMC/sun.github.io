import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css']
})
export class TerminosCondicionesComponent implements OnInit {
  porNav=true;
  constructor(  public dialogRef: MatDialogRef<TerminosCondicionesComponent>,
    private activatedRouter: ActivatedRoute,
    ) { }
  
  ngOnInit(): void {
   
   /* 
   document.getElementById("terminos").scrollIntoView();  */

    this.activatedRouter.queryParams.subscribe(resp => {
if (resp.navi) {
  this.porNav=JSON.parse(resp.navi);  
}else{
  this.porNav=false;
}
    });
    console.log(this.porNav);
  
  
  }
 

  


  onNoClick(): void {
    this.dialogRef.close();
  }
}

