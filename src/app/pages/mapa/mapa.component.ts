import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { WaGeolocationService } from '@ng-web-apis/geolocation';
import { BehaviorSubject, take } from 'rxjs';
import { Subscription } from 'rxjs';
import { MenufooterComponent } from '../../shared/menufooter/menufooter.component';
import * as L from 'leaflet';
import { NgIf } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-mapa',
  imports: [
    MenufooterComponent,
    RouterModule, NgIf
  ],
  providers: [WaGeolocationService],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  private readonly geolocation$ = inject(WaGeolocationService);
  private map: L.Map | null = null;
  private driverMarker: L.Marker | null = null;
  private deliveryMarker: L.Marker | null = null;
  private routeLine: L.Polyline | null = null;
  private locationSubscription: Subscription | null = null;

  // Estado para mostrar coordenadas
  driverPosition: { lat: number; lng: number } | null = null;
  deliveryPosition: { lat: number; lng: number } | null = null;
  loading = true;
  errorMessage = '';

  identity!:Usuario;

   private usuarioService = inject(UsuarioService);

  // Configuración de iconos personalizados
  private driverIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  private deliveryIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  ngOnInit() {
    // Suscripción continua a la ubicación
    this.locationSubscription = this.geolocation$.subscribe({
      next: (position) => {
        console.log('Posición actualizada:', position);
        this.driverPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.loading = false;
        this.errorMessage = '';
        
        // Actualizar mapa si ya está inicializado
        if (this.map) {
          this.updateMap();
        }
      },
      error: (error) => {
        console.error('Error de geolocalización:', error);
        this.loading = false;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.errorMessage = 'Permiso de geolocalización denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            this.errorMessage = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            this.errorMessage = 'Tiempo de espera agotado';
            break;
          default:
            this.errorMessage = 'Error desconocido';
        }
        // Usar ubicación por defecto para demo
        this.driverPosition = { lat: -33.4489, lng: -70.6693 }; // Santiago, Chile
        this.loading = false;
        if (this.map) {
          this.updateMap();
        }
      }
    });

    this.loadIdentity();
  }

  ngAfterViewInit() {
    this.initMap();
    
  }

  ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    // Esperar a tener posición del conductor
    if (!this.driverPosition) {
      // Posición por defecto mientras carga
      this.driverPosition = { lat: -33.4489, lng: -70.6693 };
    }

    // Inicializar mapa centrado en posición del conductor
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.driverPosition.lat, this.driverPosition.lng],
      zoom: 15,
      zoomControl: true
    });

    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Simular coordenadas de entrega (200-500 metros alejados)
    this.simulateDeliveryLocation();

    // Actualizar marcadores y ruta
    this.updateMap();
  }

  private simulateDeliveryLocation(): void {
    if (!this.driverPosition) return;

    // Simular entrega a 200-500 metros del conductor
    const latOffset = (Math.random() - 0.5) * 0.01; // ~500 metros
    const lngOffset = (Math.random() - 0.5) * 0.01; // ~500 metros

    this.deliveryPosition = {
      lat: this.driverPosition.lat + latOffset,
      lng: this.driverPosition.lng + lngOffset
    };

    console.log('Entrega simulada en:', this.deliveryPosition);
  }

  private updateMap(): void {
    if (!this.map || !this.driverPosition) return;

    // Actualizar o crear marcador del repartidor
    if (this.driverMarker) {
      this.driverMarker.setLatLng([this.driverPosition.lat, this.driverPosition.lng]);
    } else {
      this.driverMarker = L.marker([this.driverPosition.lat, this.driverPosition.lng], { icon: this.driverIcon })
        .addTo(this.map)
        .bindPopup('<b>Tu ubicación</b><br>Repartidor');
    }

    // Actualizar o crear marcador de entrega
    if (this.deliveryPosition) {
      if (this.deliveryMarker) {
        this.deliveryMarker.setLatLng([this.deliveryPosition.lat, this.deliveryPosition.lng]);
      } else {
        this.deliveryMarker = L.marker([this.deliveryPosition.lat, this.deliveryPosition.lng], { icon: this.deliveryIcon })
          .addTo(this.map)
          .bindPopup('<b>Entrega</b><br>Destino');
      }

      // Dibujar línea de ruta
      if (this.routeLine) {
        this.routeLine.setLatLngs([
          [this.driverPosition.lat, this.driverPosition.lng],
          [this.deliveryPosition.lat, this.deliveryPosition.lng]
        ]);
      } else {
        this.routeLine = L.polyline([
          [this.driverPosition.lat, this.driverPosition.lng],
          [this.deliveryPosition.lat, this.deliveryPosition.lng]
        ], {
          color: 'blue',
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10'
        }).addTo(this.map);
      }

      // Ajustar vista para mostrar ambos puntos
      const bounds = L.latLngBounds([
        [this.driverPosition.lat, this.driverPosition.lng],
        [this.deliveryPosition.lat, this.deliveryPosition.lng]
      ]);
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
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

