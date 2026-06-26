import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { OrderItemComponent } from "../order-item/order-item.component";
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { Usuario } from '../../models/usuario.model';
import { DriverpService } from '../../services/driverp.service';
import { Driver } from '../../models/driverp.model';
import { OrderDetailComponent } from '../../pages/order-detail/order-detail.component';
import { AvisoComponent } from '../../shared/aviso/aviso.component';
declare var bootstrap: any;
@Component({
  selector: 'app-order-list',
  imports: [
    OrderItemComponent, CommonModule, NgFor, LoadingComponent,
    NgIf, OrderDetailComponent, AvisoComponent
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {

  @Input() identity!: string;
  @Input() identityD!: string;
  @Input() identityId!: string;
  @Input() driverId!: any;
  @Input() asignacion!: any;
  @Input() status!: any;
  asignacions!: Asignacion[];
  selectedAsignacion: any | null

  aviso = 'No tienes entregas disponibles';

  isLoading: boolean = false;
  user!: Usuario
  userId!: any;
  statusreqest!: string;
  iduserstatus!: string;
  driver!: Driver;

  private asignacionDService = inject(AsignardeliveryService);
  private driverService = inject(DriverpService);
  private cdr = inject(ChangeDetectorRef);






  ngOnInit() {
    this.identityId;
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER || '{}');
    this.userId = this.user.uid;
    this.loadDriverId();

  }

  loadDriverId() {
    this.driverService.getByUserId(this.userId).subscribe((resp: any) => {
      this.driver = resp;
      this.driverId = this.driver._id
      this.statusreqest = this.status;
      this.driverId
      this.loadAsignacionesByStatus();
    })
  }

  loadAsignaciones() {
    this.isLoading = true;
    this.asignacionDService.getByDriverId(this.driverId).subscribe((resp: any) => {
      this.asignacions = resp;
      this.isLoading = false;
    });

  }


  loadAsignacionesByUser() {
    this.isLoading = true;
    this.asignacionDService.getByUserId(this.user.uid).subscribe((resp: any) => {
      this.asignacions = resp;
      this.isLoading = false;
    });
  }

  loadAsignacionesByStatus() {
    this.isLoading = true;
    this.asignacionDService.getByStatus(this.driverId, this.statusreqest).subscribe((resp: any) => {
      this.asignacions = resp;
      this.isLoading = false;
    });
  }


  openModal(asignacion: any) {
    this.selectedAsignacion = asignacion;
    console.log('Asignación cargada en el modal:', asignacion._id);

    // Forzamos a Angular a pasarle el objeto de la Andrés Bello al hijo
    this.cdr.detectChanges();

    setTimeout(() => {
      const element = document.getElementById('modalAsignacionDetalleUnico');
      const bootstrap = (window as any).bootstrap;

      if (element && bootstrap) {
        const myOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(element, {
          backdrop: true,
          keyboard: true,
          scroll: true
        });

        // 👇 AGREGA ESTAS DOS LÍNEAS PARA ROMPER EL CONGELAMIENTO VISUAL 👇
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.classList.add('show'); // Forzamos la clase de animación nativa de Bootstrap
        // 👆 ----------------------------------------------------------- 👆

        myOffcanvas.show();
        this.cdr.detectChanges();
      } else {
        console.error('Error crítico: No se encontró el elemento HTML.');
      }
    }, 50);

  }







}
