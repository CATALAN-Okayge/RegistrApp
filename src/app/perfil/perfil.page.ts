import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  nombreUsuario: string = '';
  correoUsuario: string = '';
  fotoUsuario: string = ''; // Foto de perfil

  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar si el usuario está autenticado
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (!nombreUsuario) {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/home']);
    } else {
      // Si el usuario está autenticado, cargar los datos
      this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'No disponible';
      this.correoUsuario = localStorage.getItem('correoUsuario') || 'No disponible';
      this.fotoUsuario = localStorage.getItem('fotoUsuario') || 'https://via.placeholder.com/150'; // Imagen por defecto
    }
  }

  cambiarFoto() {
    alert('Función para cambiar foto aún no implementada.');
  }
}
