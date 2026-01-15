import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenufooterComponent } from '../../shared/menufooter/menufooter.component';
import { RouterModule } from '@angular/router';
import { OrderListComponent } from '../../components/order-list/order-list.component';
@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    MenufooterComponent,
    RouterModule,
    OrderListComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
