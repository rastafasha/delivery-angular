import { Component } from '@angular/core';
import { OrderItemComponent } from "../order-item/order-item.component";

@Component({
  selector: 'app-order-list',
  imports: [OrderItemComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {

}
