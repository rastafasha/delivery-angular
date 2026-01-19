import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenufooterComponent } from '../../shared/menufooter/menufooter.component';
import { OrderListComponent } from "../../components/order-list/order-list.component";
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { AvisoComponent } from "../../shared/aviso/aviso.component";
import { LoadingComponent } from "../../shared/loading/loading.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-driver-home',
  imports: [
    HeaderComponent,
    MenufooterComponent,
    RouterModule,
    OrderListComponent,
    AvisoComponent,
    LoadingComponent,
    NgIf
],
  templateUrl: './driver-home.component.html',
  styleUrl: './driver-home.component.css'
})
export class DriverHomeComponent {
  identity!:Usuario;
  isLoading= false;

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  
  ngOnInit(){
    setTimeout(() => {
      this.loadIdentity();
    }, 500);
  }

  loadIdentity(){
    this.isLoading= true;
    let USER = localStorage.getItem("user");
    if(!USER){
      this.router.navigateByUrl('/login')
    }
    if(USER){
      let user = JSON.parse(USER);
      this.usuarioService.get_user(user.uid).subscribe((resp:any)=>{
        this.identity = resp.usuario;
        this.isLoading= false;

         if( this.identity.role !== 'CHOFER'){
          this.router.navigateByUrl('/home-customer');
        }
      })
    }
  }
}
