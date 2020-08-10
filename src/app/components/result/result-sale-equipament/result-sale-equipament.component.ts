import { Component, OnInit } from '@angular/core';
import { EquipamientosService } from 'src/app/services/equipamientos.service';
import Swal from 'sweetalert2';
import { SaleEquipamentResp } from 'src/app/interfaces/equipaments.model';

@Component({
  selector: 'app-result-sale-equipament',
  templateUrl: './result-sale-equipament.component.html',
  styleUrls: ['./result-sale-equipament.component.css']
})
export class ResultSaleEquipamentComponent implements OnInit {

  equipaments: SaleEquipamentResp[] = [];

  constructor(private _equipamentService: EquipamientosService) { }

  ngOnInit(): void {
    this.obtenerEquipamientos();
  }

  obtenerEquipamientos() {
    this._equipamentService.obtenerEquipamientoTodos().subscribe((resp) => {

      // Error Handler
      if (resp.length <= 0) {
        return Swal.fire('Alerta', 'No se han encontrado resultados', 'warning');
      }
      
      this.equipaments = resp;


    })
  }

}
