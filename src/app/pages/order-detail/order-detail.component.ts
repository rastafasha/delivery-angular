import { Component, inject, Input } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CommonModule, CurrencyPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { Tienda } from '../../models/tienda.model';
import { Detalle, Venta } from '../../models/ventas.model';
import { VentaService } from '../../services/venta.service';
import { ItemListComponent } from "../../components/item-list/item-list.component";

@Component({
  selector: 'app-order-detail',
  imports: [
    MenufooterComponent, RouterLink,
    LoadingComponent, NgIf, SlicePipe, CurrencyPipe, 
    NgFor, CommonModule,
    ItemListComponent
],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  isLoading = false;
  identity!: Usuario;
  asignacion!: Asignacion;
  tienda!: Tienda;
  venta!: Venta;
  @Input() detalles!: Detalle[];

  private usuarioService = inject(UsuarioService);
  private activatedRoute = inject(ActivatedRoute);
  private asignacionDServices = inject(AsignardeliveryService);
  private ventaServices = inject(VentaService);

  ngOnInit() {
    this.loadIdentity();
    this.activatedRoute.params.subscribe(params => {
      let orderId = params['id'];
      // console.log(orderId);
      this.getAsignacionById(orderId);
    });
  }

  loadIdentity() {
    let USER = localStorage.getItem("user");
    if (USER) {
      let user = JSON.parse(USER);
      this.usuarioService.get_user(user.uid).subscribe((resp: any) => {
        this.identity = resp.usuario;

      })
    }
  }

  getAsignacionById(id: string) {
    this.isLoading = true;
    this.asignacionDServices.getById(id).subscribe((resp: any) => {
      // console.log(resp);
      this.asignacion = resp
      this.tienda = resp.tienda;
      this.venta = resp.venta;
      this.isLoading = false;
      this.getVentaDetails(this.venta._id);
    });
  }

  getVentaDetails(id: string) {
    this.isLoading = true;
    this.ventaServices.detalle(id).subscribe((resp: any) => {
      console.log(resp);
      this.venta = resp.venta;
      this.detalles = resp.detalle;
      this.isLoading = false;
    });
  }

}
