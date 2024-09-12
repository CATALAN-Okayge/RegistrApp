import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  qrCodeImage: string | null = null;
  icono = 'oscuro'; // Define el icono inicial como oscuro

  ngOnInit() {
    // Aplica el tema oscuro al iniciar
    document.body.classList.add('dark-theme');
  }

  generarQR() {
    const qrData = `Asistencia-${new Date().getTime()}`;
    this.qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

    const button = document.querySelector('.qr-button') as HTMLIonButtonElement; 
    button.classList.add('pulse-animation');
    setTimeout(() => {
      button.classList.remove('pulse-animation');
    }, 500); 
  }

  cambiarTema() {
    if (this.icono === 'oscuro') {
      // Cambia los valores para el tema claro
      document.documentElement.style.setProperty('--fondo', '#ffffff');
      document.documentElement.style.setProperty('--fondo-input', '#f0f0f0');
      document.documentElement.style.setProperty('--icono', '#00bcd4');
      document.documentElement.style.setProperty('--textos', '#000000');
      this.icono = 'claro';
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      // Cambia los valores para el tema oscuro
      document.documentElement.style.setProperty('--fondo', '#000000');
      document.documentElement.style.setProperty('--fondo-input', '#333333');
      document.documentElement.style.setProperty('--icono', '#00bcd4');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      this.icono = 'oscuro';
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  }
}
