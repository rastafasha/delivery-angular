import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CommonModule, CurrencyPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { Tienda } from '../../models/tienda.model';
import { Detalle } from '../../models/ventas.model';
import { ItemListComponent } from "../../components/item-list/item-list.component";
import { Driver } from '../../models/driverp.model';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';
import { DireccionService } from '../../services/direccion.service';
import { Direccion } from '../../models/direccion.model';
import { PedidomenuService } from '../../services/pedidomenu.service';

declare var bootstrap: any;
@Component({
  selector: 'app-order-detail',
  imports: [
    RouterLink,
    LoadingComponent, NgIf, SlicePipe, CurrencyPipe,
    NgFor, CommonModule, ImagenPipe,
    ItemListComponent
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit, OnDestroy, AfterViewInit{
  // Capturamos el elemento HTML usando la referencia local que pusimos en el HTML
  @ViewChild('offcanvasElement', { static: false }) offcanvasElement!: ElementRef;
  @Output() modalClosed = new EventEmitter<void>();
  
  @Input() detalles!: Detalle[];
  @Input() selectedAsignacion: any;

  isLoading = false;
  identity!: Usuario;
  asignacion!: Asignacion;
  tienda!: Tienda;
  pedido!: any;
  driver!: Driver;
  driverId!: any;
  userDriver!: Usuario;
  userCliente!: Usuario;
  direccion!: string;
  direccionAddres!: Direccion;


  private usuarioService = inject(UsuarioService);
  private asignacionDServices = inject(AsignardeliveryService);
  private direccionService = inject(DireccionService);
  private pedidoService = inject(PedidomenuService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadIdentity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    

    if (
      changes['selectedAsignacion'] &&
      changes['selectedAsignacion'].currentValue
    ) {
      this.isLoading = true;
       this.asignacionDServices.getById(this.selectedAsignacion._id).subscribe((resp: any) => {
      this.asignacion = resp
      this.tienda = resp.tienda;
      this.pedido = resp.pedido;
      this.driver = resp.driver;
      this.direccion = resp.pedido.direccion;
      this.driverId = this.driver.user;
      this.isLoading = false;
      this.getUsuarioDriver();
      this.getDireccion();

    });
      
    } 
  }

  loadIdentity() {
    let USER = localStorage.getItem("usuario")
    if (USER) {
      let user = JSON.parse(USER);
      this.usuarioService.get_user(user.uid).subscribe((resp: any) => {
        this.identity = resp.usuario;
      })
    }
  }

  


  // 🚀 ESTA FUNCIÓN ES LA MAGIA: Se ejecuta AUTOMÁTICAMENTE cuando el HTML ya existe en el DOM
  ngAfterViewInit() {
    if (this.offcanvasElement && this.offcanvasElement.nativeElement) {
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(this.offcanvasElement.nativeElement);
      offcanvas.show();

      // 🚀 ESCUCHA CUANDO LA ANIMACIÓN DE CIERRE TERMINA POR COMPLETO
      this.offcanvasElement.nativeElement.addEventListener('hidden.bs.offcanvas', () => {
        // Ejecutamos la limpieza interna
        document.querySelectorAll('.offcanvas-backdrop').forEach(el => el.remove());
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';

        // Ahora sí, le avisamos al padre que ponga la variable en null
        this.modalClosed.emit();
      });
    }
  }

  ngOnDestroy(): void {
    // Cleanup orphan Bootstrap backdrops (fixes stuck backdrop issue)
    const backdrops = document.querySelectorAll('.offcanvas-backdrop');
    backdrops.forEach((backdrop: Element) => backdrop.remove());
  }

  getDireccion() {
    this.direccionService.get_direccion(this.direccion).subscribe((resp: any) => {
      this.direccionAddres = resp;
      this.getUsuarioCliente();
    })
  }

  getUsuarioCliente() {
    this.usuarioService.get_user(this.direccionAddres.user).subscribe((resp: any) => {
      this.userCliente = resp.usuario;
    });
  }


  getUsuarioDriver() {
    this.usuarioService.get_user(this.driverId).subscribe((resp: any) => {
      this.userDriver = resp.usuario;
    });
  }

  //actualizamos es status de la asignacion a 'EN PROCESO' cuando el chofer aplica para entregar el pedido
  activarDelivery() {

    this.asignacionDServices.activar(this.asignacion._id).subscribe((resp: any) => {
      // console.log(resp);
      this.asignacion = resp.asignacion;
      this.ngOnInit();
    });
  }

  marcarEntregado() {
    this.asignacionDServices.entregado(this.asignacion._id).subscribe((resp: any) => {
      // console.log(resp);
      this.asignacion = resp.asignacion;
      this.updatePedidoEntregado();
      this.ngOnInit();
    });
  }

  updatePedidoEntregado() {
    const data = {
      id: this.asignacion.pedido,
      status: 'DELIVERED'
    }
    this.pedidoService.actualizarStatusPedido(data).subscribe((resp: any) => {
      this.pedido = resp
    })
  }

  marcarRecibido() {

    this.asignacionDServices.recibido(this.asignacion._id).subscribe((resp: any) => {
      // console.log(resp);
      this.asignacion = resp.asignacion;
      this.ngOnInit();
    });
  }

  // Modificamos la función de la "X" para que NO emita directo, sino que use el JS de Bootstrap
  onModalHidden(): void {
    if (this.offcanvasElement && this.offcanvasElement.nativeElement) {
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(this.offcanvasElement.nativeElement);
      offcanvas.hide(); // 👈 Esto dispara la animación nativa de Bootstrap primero
    }
  }



}
