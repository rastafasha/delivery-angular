import { Component, inject, Input } from '@angular/core';
import { OrderItemComponent } from "../order-item/order-item.component";
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from "../../shared/loading/loading.component";

@Component({
  selector: 'app-order-list',
  imports: [
    OrderItemComponent, CommonModule, NgFor, LoadingComponent,
    NgIf
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {

  @Input() identity!:string;
  @Input() identityD!:string;
  @Input() identityId!:string;
  @Input() driverId!:string;
  @Input() asignacion!: any;
  asignacions!: Asignacion [];

  isLoading: boolean = false;

  private asignacionDService = inject(AsignardeliveryService);

  ngOnInit(){
    
    this.identityId;
    console.log(this.identityId)
    setTimeout(() => {
      this.loadAsignaciones();
    }, 500);
  }

  loadAsignaciones(){
    this.isLoading = true;
    this.asignacionDService.getByDriverId(this.identityId).subscribe((resp:any)=>{  
      this.asignacions = resp;
       this.isLoading = false;
    });

  }


}
