import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  nombreUsuario: string = '';
  correoUsuario: string = '';

  constructor() {}

  ngOnInit() {
    // Recuperamos los datos actuales del usuario
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';
    this.correoUsuario = localStorage.getItem('correoUsuario') || '';
  }

  guardarCambios() {
    // Guardamos los nuevos datos en localStorage
    localStorage.setItem('nombreUsuario', this.nombreUsuario);
    localStorage.setItem('correoUsuario', this.correoUsuario);
    alert('Cambios guardados correctamente.');
  }
}
