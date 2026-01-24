import { Component, inject, Input } from '@angular/core';
import { OrderItemComponent } from "../order-item/order-item.component";
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { VentaService } from '../../services/venta.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

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
  user!:Usuario
  userId!:any;

  private asignacionDService = inject(AsignardeliveryService);
  private ventaService = inject(VentaService);
  private userService = inject(UsuarioService);

  ngOnInit(){
    this.identityId;
    console.log(this.identityId)

    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER || '{}');

    this.userId = this.user.uid;
    
    if(this.user.role == 'CHOFER'){
        this.loadAsignaciones();
      } else {
        this.getVentaByUser();
      }
  
    
    // setTimeout(() => {
    // }, 500);
  }

  loadAsignaciones(){
    this.isLoading = true;
    this.asignacionDService.getByDriverId(this.identityId).subscribe((resp:any)=>{  
      this.asignacions = resp;
       this.isLoading = false;
    });

  }

  getVentaByUser(){
    this.ventaService.listarporUser(this.userId).subscribe((resp:any)=>{
      console.log(resp);
    });
  }


}
