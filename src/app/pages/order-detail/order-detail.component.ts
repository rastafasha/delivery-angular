import { Component } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { RouterLink } from "@angular/router";
import { AvisoComponent } from "../../shared/aviso/aviso.component";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports: [
    MenufooterComponent, RouterLink,
    LoadingComponent, NgIf
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  isLoading = false;

}
