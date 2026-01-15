import { Component } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-order-detail',
  imports: [MenufooterComponent, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {

}
