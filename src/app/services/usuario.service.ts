import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../auth/interfaces/register-form.interface';
import { LoginForm } from '../auth/interfaces/login-form.interface';
import { CargarUsuario } from '../auth/interfaces/cargar-usuarios.interface';

import { tap, map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';
const base_url = environment.baseUrl;
// declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario | null = null;;
  public estaAutenticado = false;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    // this.googleInit();
    // this.user;
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'USER' | 'CHOFER' {
    return this.usuario?.role ?? 'USER';
  }

  get uid(): string {
    return this.usuario?.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }
  
  getLocalStorage() {
    const authStr = localStorage.getItem('estaAutenticado');
    this.estaAutenticado = authStr === 'true';


    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('usuario');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Create User instance from parsed data (match JSON shape)
        this.usuario = new Usuario(
          userData.first_name || '',
          userData.last_name || '',
          userData.pais || '',
          userData.telefono || '',
          userData.numdoc || '',
          userData.local || '',
          userData.email || '',
          userData.img || '',
          undefined,  // password not stored
          userData.google || false,
          userData.role,
          userData.uid,
        );
        this.currentUserSubject.next(this.usuario);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        this.usuario = null;
        this.currentUserSubject.next(null);
      }
    } else {
      this.usuario = null;
      this.currentUserSubject.next(null);
    }
    return this.usuario;
  }

  getEstaAutenticado(): boolean {
    return this.estaAutenticado;
  }

   guardarLocalStorage(token: string, userData: any){
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(userData));
    this.getLocalStorage();  // Populate service state and emit
  }



  googleInit() {
    // return new Promise<void>((resolve) =>{
    //   gapi.load('auth2', () =>{
    //     this.auth2 = gapi.auth2.init({
    //       client_id: environment.client_idGoogle,
    //       cookiepolicy: 'single_host_origin',
    //     });
    //     resolve();
    //   });
    // });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('estaAutenticado');
    this.router.navigateByUrl('/login');

    // this.auth2.signOut().then(() => {
    //   this.ngZone.run(() => {
    //     this.router.navigateByUrl('/login');
    //   });
    // });
  }

  validarToken(): Observable<boolean> {
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          const {
            first_name,
            last_name,
            pais,
            telefono,
            numdoc,
            email,
            google,
            role,
            img = '',
            uid,
          } = resp.usuario;

          this.usuario = new Usuario(
            first_name,
            last_name,
            pais,
            telefono,
            numdoc,
            email,
            '',
            img,
            google,
            role,
            uid
          );

          this.guardarLocalStorage(resp.token, resp.usuario);
          return true;
        }),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios/registro`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.usuario);
      })
    );
  }

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    // Ensure usuario is loaded from localStorage before accessing properties
    this.getLocalStorage();
    
    data = {
      ...data,
      role: this.usuario?.role ?? 'USER',
    };

    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  login(formData: any) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('estaAutenticado', 'true');
          this.guardarLocalStorage(resp.token, resp.user);
        })
      )
  }

  loginGoogle(token: any) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers).pipe(
      map((resp) => {
        const usuarios = resp.usuarios.map(
          (user) =>
            new Usuario(
              user.first_name,
              user.last_name,
              user.pais,
              user.ciudad,
              user.telefono,
              user.numdoc,
              user.local,
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uid
            )
        );

        return {
          total: resp.total,
          usuarios,
        };
      })
    );
  }

  borrarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }

  actualizarP(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/update/${usuario.uid}`,
      usuario,
      this.headers
    );
  }

  get_user(id: string): Observable<any> {
    const url = `${base_url}/usuarios/${id}`;
    return this.http.get(url, this.headers);
  }


  get_user_data(): Observable<any> {
    const url = `${base_url}/usuarios`;
    return this.http.get(url, this.headers);
  }

  set_recovery_token(email: any): Observable<any> {
    const url = `${base_url}/usuarios/user_token/set/${email}`;
    return this.http.get<any>(url, this.headers);
  }

  verify_token(email: any, codigo: any): Observable<any> {
    const url = `${base_url}/usuarios/user_verify/token/${email}/${codigo}`;
    return this.http.get<any>(url, this.headers);
  }

  change_password(email: any, data: any): Observable<any> {
    debugger;
    const url = `${base_url}/usuarios/user_password/change/${email}/${data}`;
    return this.http.put<any>(url, this.headers);
  }
}
