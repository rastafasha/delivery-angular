import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { TiendaService } from '../../services/tienda.service';
import { Tienda } from '../../models/tienda.model';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';
import { environment } from '../../../environments/environment';
import { PwaNotifInstallerComponent } from '../../shared/pwa-notif-installer/pwa-notif-installer.component';
import { ToastrService } from 'ngx-toastr';

// declare const gapi: any;


@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    PwaNotifInstallerComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formSumitted = false;
  public auth2: any;

  loginForm: FormGroup;
  tiendaSelected!: Tienda;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private tiendaService: TiendaService,
    private ngZone: NgZone,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  ngOnInit() {
    // this.renderButton();
    this.usuarioService.getLocalStorage();
  }


  login() {
  this.formSumitted = true;
  if (this.loginForm.invalid) { return; }

  this.usuarioService.login(this.loginForm.value).subscribe({
    next: (resp: any) => { // 💡 Le agregamos : any para poder leer las propiedades con comodidad
      console.log('Respuesta exitosa del backend:', resp);

      // 1. CLAVE DEFINITIVA: Extraemos el token y el objeto 'usuario' del payload y los guardamos
      if (resp.token && resp.usuario) {
        this.usuarioService.guardarLocalStorage(resp.token, resp.usuario);
      } else {
        console.error('Error: El servidor no envió el token o la propiedad de usuario esperada.', resp);
      }

      // 2. Manejo de la opción de recordar correo
      if (this.loginForm.get('remember')?.value) {
        localStorage.setItem('email', this.loginForm.get('email')?.value);
      } else {
        localStorage.removeItem('email');
      }

      // 3. Forzamos la redirección basándonos de forma segura en los datos que acabamos de validar
      if (resp.usuario && resp.usuario !== 'undefined') {
        this.toastr.success(`¡Bienvenido de vuelta, ${resp.usuario.first_name}!`);
        
        setTimeout(() => {
          this.router.navigateByUrl('/myprofile');
        }, 500);
      } else {
        this.toastr.error('Los datos de usuario recibidos están corruptos.');
        this.router.navigateByUrl('/login');
      }
    },
    error: (err) => {
      console.error('Error en petición de Login:', err);
      this.toastr.error(`Error al iniciar sesión.  ${err.error.msg}`);
    }
  });
}

  



  // renderButton() {
  //   gapi.signin2.render('my-signin2', {
  //     'scope': 'profile email',
  //     'width': 240,
  //     'height': 50,
  //     'longtitle': true,
  //     'theme': 'dark',
  //   });
  //   this.startApp();
  // }

  async startApp() {
    this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    // this.attachSignin(document.getElementById('my-signin2'));
  }

  // attachSignin(element) {
  //   this.auth2.attachClickHandler(element, {},
  //       (googleUser) =>{
  //         const id_token = googleUser.getAuthResponse().id_token;

  //         this.usuarioService.loginGoogle(id_token).subscribe(
  //           resp=>{

  //             this.ngZone.run(()=>{
  //               this.router.navigateByUrl('/app/my-account');
  //             })
  //           }
  //         );


  //       }, (error) =>{
  //         alert(JSON.stringify(error, undefined, 2));
  //       });
  // }

}
