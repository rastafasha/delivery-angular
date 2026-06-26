import { Component, inject, Input } from '@angular/core';
import { Detalle } from '../../models/ventas.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';
import { TranslateService } from '@ngx-translate/core';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-item-list',
  imports: [
    CommonModule,
    RouterModule,
    ImagenPipe
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {

  @Input() producto!:Producto;
  public translate = inject(TranslateService);

  
  

}
