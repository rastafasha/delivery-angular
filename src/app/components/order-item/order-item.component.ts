import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Asignacion } from '../../models/asignaciondelivery.model';

@Component({
  selector: 'app-order-item',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.css'
})
export class OrderItemComponent {
  @Input() status!:string;
  @Input() statustText!:string;
  @Input() asignacion!:Asignacion;

  @Output() selectedAsignacion: EventEmitter<any> = new EventEmitter<any>();
  @Output() onVerDetalles = new EventEmitter<any>();

   verDetalles() {
    // Le enviamos este producto al componente padre
    this.onVerDetalles.emit(this.asignacion);
  }
  
}
