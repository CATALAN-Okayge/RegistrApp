import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  qrCodeImage: string | null = null;
  icono = 'oscuro'; 

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    document.body.classList.add('dark-theme');
  }

  generarQR() {
    const qrData = `Asistencia-${new Date().getTime()}`;
    this.qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
  }

  async escanearQR() {
    try {
      // Solicitar permisos de la cámara
      await BarcodeScanner.checkPermission({ force: true });

      // Iniciar el escáner
      const result = await BarcodeScanner.startScan();

      // Verificar si se escaneó un código
      if (result.hasContent) {
        const codigoQR = result.content;
        this.registrarAsistencia(codigoQR);

        // Mostrar mensaje de éxito
        this.mostrarMensajeExito();
      } else {
        console.log('No se escaneó ningún código.');
      }
    } catch (error) {
      console.error('Error al escanear QR:', error);
    }
  }

  // Función para mostrar un mensaje de éxito con botón OK
  async mostrarMensajeExito() {
    const toast = await this.toastController.create({
      message: 'Escaneo exitoso',
      buttons: [
        {
          text: 'OK',
          role: 'cancel' // El botón cierra el toast cuando se presiona
        }
      ],
      position: 'bottom' // Posición del mensaje
    });
    await toast.present();
  }

  registrarAsistencia(qrData: string) {
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Desconocido'; // Obtener el nombre del localStorage
    const asistencia = {
      codigo: qrData,
      usuario: nombreUsuario,
      fecha: new Date().toLocaleString(),
    };

    let registros = JSON.parse(localStorage.getItem('asistencias') || '[]');
    registros.push(asistencia);
    localStorage.setItem('asistencias', JSON.stringify(registros));

    console.log("Asistencia registrada: ", asistencia);
  }

  cambiarTema() {
    // Cambiar entre temas claro y oscuro
    if (this.icono === 'oscuro') {
      document.documentElement.style.setProperty('--fondo', '#ffffff');
      document.documentElement.style.setProperty('--fondo-input', '#f0f0f0');
      document.documentElement.style.setProperty('--icono', '#00bcd4');
      document.documentElement.style.setProperty('--textos', '#000000');
      this.icono = 'claro';
      document.body.classList.remove('dark-theme');
    } else {
      document.documentElement.style.setProperty('--fondo', '#000000');
      document.documentElement.style.setProperty('--fondo-input', '#333333');
      document.documentElement.style.setProperty('--icono', '#00bcd4');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      this.icono = 'oscuro';
      document.body.classList.add('dark-theme');
    }
  }
}
