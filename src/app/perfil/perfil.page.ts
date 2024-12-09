import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  nombreUsuario: string = '';
  email: string = '';  // Usar 'email' en lugar de 'correoElectronico'
  historialAsistencias: any[] = [];
  rol: string = '';
  qrCodeImage: string | null = null;

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
      this.rol = usuarioActual.rol || 'estudiante'; // Valor por defecto si no se especifica
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

  cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    
    this.router.navigate(['/home']);
  }
  
}
