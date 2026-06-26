import { Component, inject } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { DriverpService } from '../../services/driverp.service';
import { Driver } from '../../models/driverp.model';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { CommonModule, NgIf } from '@angular/common';
import { AvisoComponent } from "../../shared/aviso/aviso.component";
import { RouterModule } from '@angular/router';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';
import { DireccionesComponent } from "./direcciones/direcciones.component";
import { BackComponent } from "../../shared/back/back.component";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PushNotificationService } from '../../models/push-notification.service';
import { TiendaService } from '../../services/tienda.service';
import { Tienda } from '../../models/tienda.model';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-profile',
  imports: [
    MenufooterComponent,
    LoadingComponent, NgIf,
    CommonModule,
    RouterModule,
    ImagenPipe,
    AvisoComponent,
    DireccionesComponent,
    TranslatePipe,
    HeaderComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
identity!:Usuario;
driver!:Driver;
identityId!:any;
isLoading = false;
isLoadingDr = false;
pageTitle = 'Mi Perfil';
user_id:any;
  
  public activeLang = 'es';
    flag = false;
    is_visible: boolean = false;
    langs: string[] = [];
    tiendaSelected!:Tienda;

  private usuarioService = inject(UsuarioService);
  private driverpService = inject(DriverpService);
   public translate= inject(TranslateService)
   public pushService= inject(PushNotificationService)
   public tiendaService= inject(TiendaService)
  
  ngOnInit(){
    this.loadIdentity();
    // 1. Comenzamos a escuchar el observable del servicio
    this.escucharTiendaActiva();

    // 2. Disparamos la petición inicial (usa el slug automático 'pizzeria')
    // Esto llenará el BehaviorSubject interno de tu servicio
    this.tiendaService.getTiendaByNameCached().subscribe();
  }

  loadIdentity(){
    this.isLoading = true;
    let USER = localStorage.getItem("user");
    if(USER){
      let user = JSON.parse(USER);
      this.usuarioService.get_user(user.uid).subscribe((resp:any)=>{
        this.identity = resp.usuario;
        this.identityId = this.identity.uid;
        this.isLoading = false;
        setTimeout(()=>{
          this.loadDriverProfile();
        }, 1000)
      })
    }
  }

  loadDriverProfile(){
     this.isLoadingDr = true;
    this.driverpService.getByUserId(this.identityId).subscribe((resp:any)=>{
        this.driver = resp;
        this.isLoadingDr = false;
      })
  }

   logout(){
    this.usuarioService.logout()
  }

   getUser(){
    this.usuarioService.get_user(this.user_id).subscribe((resp:any)=>{
      this.identity = resp.usuario;
      // console.log(this.identity)
     
    })
  }

  escucharTiendaActiva() {
    this.tiendaService.selectedTiendaObservable$.subscribe(tienda => {
      // Al principio será null, pero en cuanto getTiendaByNameCached responda, 
      // el tap del servicio emitirá la tienda real aquí.
      if (tienda) {
        this.tiendaSelected = tienda;
        
      }
    });
}



  async togglePush() {
    this.pushService.isProcessing$.next(true); // Activa el cargando

    try {
      const estaSuscrito = this.pushService.isSubscribed$.value;
      if (estaSuscrito) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          // Llamada opcional a tu backend para limpiar
          this.pushService.setSubscriptionStatus(false);
        }
      } else {
        await this.pushService.subscribeToNotifications();
      }
    } finally {
      this.pushService.isProcessing$.next(false); // Desactiva el cargando
    }
  }

  

  // 🌐 Función para alternar el idioma con el Switch
toggleLanguageSwitch(event: Event) {
  const input = event.target as HTMLInputElement;
  
  // Si está marcado (true) cambiamos a inglés ('en'), si no, a español ('es')
  this.activeLang = input.checked ? 'en' : 'es';
  
  // Actualizamos el flag por si lo usas en otra parte de la vista
  this.flag = input.checked; 

  // Ejecutamos el cambio en la librería ngx-translate
  this.translate.use(this.activeLang);
  
  // Guardamos la preferencia en el almacenamiento local
  localStorage.setItem('lang', this.activeLang);
}

}
