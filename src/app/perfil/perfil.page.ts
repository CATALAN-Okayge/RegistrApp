import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router'
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  nombreUsuario: string = '';
  email: string = '';  
  historialAsistencias: any[] = [];
  rol: string = '';
  qrCodeImage: string | null = null;
  fotoPerfil: string = 'assets/default-avatar.png';
  @ViewChild('fileInput') fileInput: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
    this.obtenerHistorialAsistencias();
  }

  obtenerDatosUsuario() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');

    if (usuarioActual) {
      this.nombreUsuario = usuarioActual.nombreUsuario || 'Usuario Desconocido';
      this.email = usuarioActual.email || 'Correo no disponible';
      this.rol = usuarioActual.rol || 'estudiante'; 
      
    } else {
      this.nombreUsuario = 'Usuario Desconocido';
      this.email = 'Correo no disponible';
      this.rol = 'estudiante';
    }
  }

  obtenerHistorialAsistencias() {
    const registros = localStorage.getItem('asistencias');
    this.historialAsistencias = registros ? JSON.parse(registros) : [];
  }
  
  generarQR() {
    const qrData = `Asistencia-${new Date().getTime()}`;
    this.qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
  }

  async cambiarFotoPerfil(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = () => {
        const imagenBase64 = reader.result as string;
        this.fotoPerfil = imagenBase64;

        
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
        usuarioActual.fotoPerfil = imagenBase64;
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
      };
      reader.readAsDataURL(archivo);
    }
  }

  seleccionarArchivo() {
    this.fileInput.nativeElement.click();
  }

  /*SECCION PARA CAMBIAR LA IMAGEN SEGUN EL USUARIO (TENER EN CUENTA YOOOOOO ATTE:CATALANNNNN)*/

  guardarImagenPerfil(imagen: string) {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
      const datosUsuario = JSON.parse(localStorage.getItem(usuarioActual) || '{}');
      datosUsuario.fotoPerfil = imagen;
      localStorage.setItem(usuarioActual, JSON.stringify(datosUsuario));
    }
  }

  cargarImagenPerfil() {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
      const datosUsuario = JSON.parse(localStorage.getItem(usuarioActual) || '{}');
      if (datosUsuario.fotoPerfil) {
        this.fotoPerfil = datosUsuario.fotoPerfil;
      }
    }
  }

  ionViewDidEnter() {
    this.cargarImagenPerfil();
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    
    this.router.navigate(['/home']);
  }
  
}
