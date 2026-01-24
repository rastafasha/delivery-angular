import { Component, inject } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { AvisoComponent } from "../../shared/aviso/aviso.component";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CurrencyPipe, NgIf, SlicePipe } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { Tienda } from '../../models/tienda.model';
import { Venta } from '../../models/ventas.model';

@Component({
  selector: 'app-order-detail',
  imports: [
    MenufooterComponent, RouterLink,
    LoadingComponent, NgIf, SlicePipe, CurrencyPipe
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

  private usuarioService = inject(UsuarioService);
  private activatedRoute = inject(ActivatedRoute);
  private asignacionDServices = inject(AsignardeliveryService);

  ngOnInit() {
    this.loadIdentity();
    this.activatedRoute.params.subscribe(params => {
      let orderId = params['id'];
      console.log(orderId);
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
      console.log(resp);
      this.asignacion = resp
      this.tienda = resp.tienda;
      this.venta = resp.venta;
      this.isLoading = false;
    });
  }

}
