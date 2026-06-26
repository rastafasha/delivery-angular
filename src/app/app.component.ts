import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { NotificacionService } from './models/notificacion.service';
import { ConectividadService } from './services/conectividad.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'deliveryapp';
  private swPush = inject(SwPush);
  private router = inject(Router);
  private connectivity = inject(ConectividadService);
  private notificacionService = inject(NotificacionService);


  ngOnInit() {
    this.configurarNotificaciones();
  }

  private configurarNotificaciones() {
    this.notificacionService.checkUnreadNotifications();

    this.swPush.notificationClicks.subscribe(({ notification }) => {
      console.log('Notificación clickeada:', notification);
      const targetUrl = notification.data?.url;

      if (targetUrl) {
        this.router.navigateByUrl(targetUrl);
      } else {
        this.router.navigate(['/home']);
      }
    });

    this.swPush.messages.subscribe(msg => {
      console.log('Mensaje recibido con la app abierta:', msg);
    });
  }
}
