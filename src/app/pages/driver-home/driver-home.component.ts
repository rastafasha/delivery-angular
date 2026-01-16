import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenufooterComponent } from '../../shared/menufooter/menufooter.component';
import { OrderListComponent } from "../../components/order-list/order-list.component";
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { AvisoComponent } from "../../shared/aviso/aviso.component";

@Component({
  selector: 'app-driver-home',
  imports: [
    HeaderComponent,
    MenufooterComponent,
    RouterModule,
    OrderListComponent,
    AvisoComponent
],
  templateUrl: './driver-home.component.html',
  styleUrl: './driver-home.component.css'
})
export class DriverHomeComponent {
  identity!:Usuario;
  private usuarioService = inject(UsuarioService);
  
  ngOnInit(){
    this.loadIdentity();
  }

  loadIdentity(){
    let USER = localStorage.getItem("user");
    if(USER){
      let user = JSON.parse(USER);
      this.usuarioService.get_user(user.uid).subscribe((resp:any)=>{
        this.identity = resp.usuario;
      })
    }
  }
}
