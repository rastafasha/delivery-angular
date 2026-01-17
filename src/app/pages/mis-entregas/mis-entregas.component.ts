import { Component } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { OrderItemComponent } from "../../components/order-item/order-item.component";
import { CommonModule, NgIf } from '@angular/common';
import { OrderListComponent } from "../../components/order-list/order-list.component";

@Component({
  selector: 'app-mis-entregas',
  imports: [
    MenufooterComponent, CommonModule,
    OrderListComponent
],
  templateUrl: './mis-entregas.component.html',
  styleUrl: './mis-entregas.component.scss'
})
export class MisEntregasComponent {
option_selectedd: number = 1;
  solicitud_selectedd: any = null;

    optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      // this.ngOnInit();
    }
    if (this.option_selectedd === 2) {
      this.solicitud_selectedd = null;
    }
  }
}
