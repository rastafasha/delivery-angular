import { Component, inject, Input } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { OrderItemComponent } from "../../components/order-item/order-item.component";
import { CommonModule, NgIf } from '@angular/common';
import { OrderListComponent } from "../../components/order-list/order-list.component";
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { DriverpService } from '../../services/driverp.service';

@Component({
  selector: 'app-mis-entregas',
  imports: [
    MenufooterComponent, CommonModule,
    OrderListComponent
  ],
  templateUrl: './mis-entregas.component.html',
  styleUrl: './mis-entregas.component.scss'
})
export class MisEntregasComponent {
  @Input() identityId!: string;
  
  option_selectedd: number = 1;
  identity!: any;
  user!: any;
  solicitud_selectedd: any = null;

  isLoading = false;

  private driverService = inject(DriverpService);
  private router = inject(Router);


  ngOnInit() {
    this.loadIdentity();
    // setTimeout(() => {
    // }, 500);
  }


  loadIdentity() {
    this.isLoading = true;
    let USER = localStorage.getItem("user");
    if (!USER) {
      this.router.navigateByUrl('/login')
    }
    if (USER) {
      let user = JSON.parse(USER);
      // console.log(user)
      this.user = user;

      this.driverService.getByUserId(this.user.uid).subscribe((resp: any) => {
        this.identity = resp
        this.identityId = resp._id;
        // console.log(this.identity)
        this.isLoading = false;

        
      })
    }
  }


   optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      // this.ngOnInit();
    }
    if (this.option_selectedd === 2) {
      this.solicitud_selectedd = null;
    }
  }

}
