import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { DireccionService } from '../../../../services/direccion.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { LoadingComponent } from '../../../../shared/loading/loading.component';
import { PaisService } from '../../../../services/pais.service';
import { Pais } from '../../../../models/pais.model';

@Component({
  selector: 'app-direccion-edit',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    RouterModule
  ],
  templateUrl: './direccion-edit.component.html',
  styleUrls: ['./direccion-edit.component.css']
})
export class DireccionEditComponent implements OnInit {

  identity!:any;
  // public direccion: Direccion;
  public direccionForm!: FormGroup;
  public direccion_id:any;
  public nombres_completos:any;
  public direccion:any;
  public referencia:any;
 public pais!: Pais;
  public ciudad:any;
  public zip:any;
  public direccion_selected:any;
  pageTitle!:string;
  public url!:any;
  public paises!  :any;
  public direccion_data : any = {};
  public data_paises : any = [];

  isLoading = false;

  constructor(
    private usuarioService: UsuarioService,
    private _direccionService: DireccionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
   private paisService: PaisService,
    private fb: FormBuilder,
  ) {
    // this.usuario = usuarioService.usuario;
   }

  ngOnInit(): void {

    
    this.loadIdentity();
    if(this.identity){
      this.direccion_data = {};
      this.url = environment.baseUrl;
    }
    this.getPaises();
    this.activatedRoute.params.subscribe( ({id}) => this.getDireccion(id));
  }

  loadIdentity(){
    this.isLoading = true;
    let USER = localStorage.getItem("user");
    if(USER){
      let user = JSON.parse(USER);
      this.usuarioService.get_user(user.uid).subscribe((resp:any)=>{
        this.identity = resp.usuario;
        this.iniciarFormulario();
        this.isLoading = false;
      })
    }
  }

   iniciarFormulario(){
    this.direccionForm = this.fb.group({
      nombres_completos: ['',Validators.required],
      direccion: ['',Validators.required],
      referencia: ['',Validators.required],
      pais: [''],
      ciudad: [''],
      zip: [''],
      user: [this.identity.uid],
    })
  }

  getDirecction(){
    this._direccionService.get_direccion(this.direccion_id).subscribe((resp:any)=>{
      console.log(resp);
      this.direccion_selected = resp;
      
    })
  }


  getDireccion(id:any){


    if(!id !== null && id !== undefined){
      this.pageTitle = 'Editing';
      this._direccionService.get_direccion(id).subscribe(
        res => {
          this.direccionForm.patchValue({
            id: this.direccion_id,
            nombres_completos: res.nombres_completos,
            direccion: res.direccion,
            referencia: res.referencia,
            pais: res.pais,
            ciudad: res.ciudad,
            zip: res.zip,
            user: this.identity.uid,
          });
          this.direccion = res;
          console.log(this.direccion);
        }
      );

  }else{
    this.pageTitle = 'Creating ';
  }

  }

 



  onSubmit(){
    const {nombres_completos, direccion,referencia, pais,
      ciudad,zip, user } = this.direccionForm.value;

    if(this.direccion){
      //actualizar
      const data = {
        ...this.direccionForm.value,
        _id: this.direccion._id
      }
      this._direccionService.update(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${nombres_completos}  actualizado correctamente`, 'success');
          console.log(this.direccion);
        });

    }else{
      //crear
      this._direccionService.registro(this.direccionForm.value)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${nombres_completos} creado correctamente`, 'success');
        this.router.navigateByUrl(`/myprofile`);
      })
    }
  }
getPaises() {
    this.paisService.getPaises().subscribe(
      (resp:any) => {
        this.paises = resp;
      }
    )
  }

}
