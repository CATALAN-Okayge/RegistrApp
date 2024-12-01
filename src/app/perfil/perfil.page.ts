import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit() {
    this.obtenerDatosUsuario();
    this.obtenerHistorialAsistencias();
  }

  obtenerDatosUsuario() {
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario Desconocido';
    this.email = localStorage.getItem('email') || 'Correo no disponible';  
    this.rol = localStorage.getItem('rol') || '';
  }

  obtenerHistorialAsistencias() {
    const registros = localStorage.getItem('asistencias');
    this.historialAsistencias = registros ? JSON.parse(registros) : [];
  }
  
  generarQR() {
    const qrData = `Asistencia-${new Date().getTime()}`;
    this.qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
  }
}
