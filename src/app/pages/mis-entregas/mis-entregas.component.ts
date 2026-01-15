import { Component } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { OrderItemComponent } from "../../components/order-item/order-item.component";

@Component({
  selector: 'app-mis-entregas',
  imports: [MenufooterComponent, OrderItemComponent],
  templateUrl: './mis-entregas.component.html',
  styleUrl: './mis-entregas.component.css'
})
export class MisEntregasComponent {

}
