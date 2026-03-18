import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Driver } from '../../models/driverp.model';
import { Usuario } from '../../models/usuario.model';
import { DriverpService } from '../../services/driverp.service';
import { FileUploadService } from '../../services/file-upload.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';
import { environment } from '../../../environments/environment';
import { LoadingComponent } from '../../shared/loading/loading.component';
declare var jQuery: any;
declare var $: any;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-driverp-edit',
  imports: [
    CommonModule,
    LoadingComponent,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ImagenPipe,
  ],
  templateUrl: './driverp-edit.component.html',
  styleUrls: ['./driverp-edit.component.css']
})
export class DriverpEditComponent implements OnInit {

  @Input() identity!: Usuario;

  public driverProfileForm!: FormGroup;
  public usuario!: Usuario;
  public driver!: Driver;
  public driverSeleccionado!: Driver;
  public imagenSubir!: File;
  public imgTemp: any = null;
  uid!: string;
  pageTitle!: string;


  public url;
  public paises: any;
  public file !: File;
  public imgSelect !: String | ArrayBuffer;
  public data_paises: any = [];
  public msm_error = false;
  public msm_success = false;
  public pass_error = false;
  public isLoading = false;
  public isDriver = false;

  public user!: Usuario;
  public user_id: any;
  public driver_id!: string;

  public driverForm!: FormGroup;

  option_selectedd: number = 1;
  solicitud_selectedd: any = null;

  public FILE_AVATAR!: HTMLInputElement;
  public IMAGE_PREVISUALIZA: string | null = null;


  //DATA
  public new_password = '';
  public comfirm_password = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private driverService: DriverpService,
    private fileUploadService: FileUploadService
  ) {
    // this.usuario = usuarioService.usuario;

    this.url = environment.baseUrl;

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.identity;
    this.user_id = this.identity.uid;
    this.user_id = this.identity.uid;
    this.getDriver();
    this.iniciarFormulario();

  }

  getDriver() {
    this.driverService.getByUserId(this.user_id).subscribe((resp: any) => {
      this.driverSeleccionado = resp;
      this.driver_id = resp._id;
      console.log(this.driverSeleccionado)



      if (this.driverSeleccionado) {
        this.driverForm.setValue({
          marca: this.driverSeleccionado.marca,
          modelo: this.driverSeleccionado.modelo,
          color: this.driverSeleccionado.color,
          year: this.driverSeleccionado.year,
          tipo_vehiculo: this.driverSeleccionado.tipo_vehiculo,
          placa: this.driverSeleccionado.placa,
          licencianum: this.driverSeleccionado.licencianum,
          status: this.driverSeleccionado.status,
          user: this.driverSeleccionado.user,
          img: this.driverSeleccionado.img || null,
        });
      }

    })
  }



  iniciarFormulario() {
    this.driverForm = this.fb.group({
      marca: ['', Validators.required],
      tipo_vehiculo: ['', Validators.required],
      placa: ['', Validators.required],
      color: ['', Validators.required],
      year: ['', Validators.required],
      modelo: ['', Validators.required],
      licencianum: ['', Validators.required],
      user: [this.user_id],
      status: ['PENDING'],
      img: [''],
    });

  }



  close_alert() {
    this.msm_success = false;
    this.msm_error = false;
  }


  onUserSave() {
    this.isLoading = true;

    if (this.driver) {
      //actualizar
      const data = {
        ...this.driverForm.value,
        _id: this.driver._id,
      };
      this.driverService.actualizar(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `Actualizado correctamente`, 'success');
          this.isLoading = false;
          this.getDriver()
        }
      );
    } else {
      //crear
      const data = {
        ...this.driverForm.value,
      };
      this.driverService.create(data)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `Creado correctamente`, 'success');
          this.isLoading = false;
          this.getDriver()
          // this.router.navigateByUrl(`/dashboard/producto`);
        });
    }
  }

  cambiarImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.imagenSubir = file;
    this.FILE_AVATAR = input;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.IMAGE_PREVISUALIZA = reader.result as string;
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    this.isLoading = true;
    if (!this.imagenSubir) {
      Swal.fire('Error', 'No hay imagen seleccionada', 'warning');
      return;
    }

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'drivers', this.driverSeleccionado._id || '')
      .then(img => {
        this.driverSeleccionado.img = img;
        // Reset preview
        this.isLoading = false;
        this.IMAGE_PREVISUALIZA = img ? `${environment.baseUrl}/uploads/drivers/${img}` : 'assets/images/no-image.png';
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');
      }).catch(err => {
        this.isLoading = false;
        console.error(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })
  }


}
