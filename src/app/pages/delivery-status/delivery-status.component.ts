import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenufooterComponent } from '../../shared/menufooter/menufooter.component';

@Component({
  selector: 'app-delivery-status',
  imports: [
     MenufooterComponent
  ],
  templateUrl: './delivery-status.component.html',
  styleUrl: './delivery-status.component.css'
})
export class DeliveryStatusComponent {

}
