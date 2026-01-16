import { Component } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { RouterLink } from "@angular/router";
import { AvisoComponent } from "../../shared/aviso/aviso.component";

@Component({
  selector: 'app-order-detail',
  imports: [MenufooterComponent, RouterLink, AvisoComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {

}
