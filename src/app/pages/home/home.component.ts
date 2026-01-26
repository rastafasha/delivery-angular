import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenufooterComponent } from '../../shared/menufooter/menufooter.component';
import { Router, RouterModule } from '@angular/router';
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { NgIf } from '@angular/common';
import { AvisoComponent } from '../../shared/aviso/aviso.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    MenufooterComponent,
    RouterModule,
    OrderListComponent,
    AvisoComponent,
    LoadingComponent,
    NgIf
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  identity!:Usuario;
  userId!:string;
    isLoading= false;
    asignacion!: Asignacion;
  
    private usuarioService = inject(UsuarioService);
    private asignacionDServices = inject(AsignardeliveryService);
    private router = inject(Router);
    
    ngOnInit(){
      this.loadIdentity();

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
        })
      }
    }

    

}
