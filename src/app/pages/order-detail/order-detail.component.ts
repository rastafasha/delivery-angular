import { Component, inject } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { RouterLink } from "@angular/router";
import { AvisoComponent } from "../../shared/aviso/aviso.component";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgIf } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

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
  identity!: Usuario;

  private usuarioService = inject(UsuarioService);

  ngOnInit() {
    this.loadIdentity();
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

}
