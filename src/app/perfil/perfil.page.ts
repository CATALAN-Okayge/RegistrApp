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

  constructor() {}

  ngOnInit() {
    this.obtenerDatosUsuario();
    this.obtenerHistorialAsistencias();
  }

  obtenerDatosUsuario() {
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario Desconocido';
    this.email = localStorage.getItem('email') || 'Correo no disponible';  // Asegúrate de usar 'email' aquí
  }

  obtenerHistorialAsistencias() {
    const registros = localStorage.getItem('asistencias');
    this.historialAsistencias = registros ? JSON.parse(registros) : [];
  }
}
