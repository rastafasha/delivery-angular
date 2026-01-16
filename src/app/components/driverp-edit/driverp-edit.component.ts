import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Driver } from '../../models/driverp.model';
import { Usuario } from '../../models/usuario.model';
import { DriverpService } from '../../services/driverp.service';
import { FileUploadService } from '../../services/file-upload.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';

// Initialize with empty object to prevent undefined errors
const defaultDriver: Driver = {
  user: {} as Usuario,
  tipo_vehiculo: '',
  placa: '',
  color: '',
  year: '',
  marca: '',
  modelo: '',
  asignaciones: {} as any,
  status: '',
  licencianum: '',
  img: ''
};

@Component({
  selector: 'app-driverp-edit',
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImagenPipe
  ],
  templateUrl: './driverp-edit.component.html',
  styleUrls: ['./driverp-edit.component.css']
})
export class DriverpEditComponent implements OnInit {

  @Input() identity!: Usuario;

  public driverProfileForm!: FormGroup;
  public usuario: Usuario;
  public driver!: Driver;
  public driverSeleccionado: any;
  public imagenSubir!: File;
  public imgTemp: any = null;
  uid!: string;
  pageTitle!: string;

  user: any = [];
  user_id: any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private driverService: DriverpService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    console.log('user: ', this.identity);
    this.user_id = this.identity.uid
    this.cargardriver();
  }

  cargardriver() {
    this.driverService.getByUserId(this.user_id).subscribe(
      (resp: any) => {
        // this.listIcons = resp.iconos;
        this.driverSeleccionado = resp;
        console.log('driver: ', this.driverSeleccionado)

        this.driverProfileForm.setValue({
          marca: this.driverSeleccionado.marca,
          modelo: this.driverSeleccionado.modelo,
          color: this.driverSeleccionado.color,
          year: this.driverSeleccionado.year,
          tipo_vehiculo: this.driverSeleccionado.tipo_vehiculo,
          placa: this.driverSeleccionado.placa,
          licencianum: this.driverSeleccionado.licencianum,
          status: this.driverSeleccionado.status,
          user: this.driverSeleccionado.user,
        });
      }
    )
    // this.validarFormulario();
  }

  validarFormulario() {
    this.driverProfileForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: [''],
      year: ['', Validators.required],
      tipo_vehiculo: ['', Validators.required],
      placa: ['', Validators.required],
      licencianum: ['', Validators.required],
      asignaciones: [''],
      status: ['PENDING'],
      user: [this.identity?.uid || ''],
    });
  }


  
  actualizar() {
    if (this.driverSeleccionado) {
      //actualizar
      const data = {
        ...this.driverProfileForm.value,
        _id: this.driverSeleccionado._id,
      };
      this.driverService.actualizar(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `Actualizado correctamente`, 'success');
        }
      );
    } else {
      //crear
      const data = {
        ...this.driverProfileForm.value,
      };
      this.driverService.create(data)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `Creado correctamente`, 'success');
          // this.router.navigateByUrl(`/dashboard/producto`);
        });
    }
  }



  cambiarImagen(file: File) {
    this.imagenSubir = file;

    // if (!file) {
    //   return this.imgTemp = null;
    // }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'drivers', this.user.uid)
      .then(img => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');
      }).catch(err => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })
  }

}
