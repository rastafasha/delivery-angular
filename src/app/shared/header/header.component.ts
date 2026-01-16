import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() identity!:Usuario;
  ngOnInit(){
    
  }
}

