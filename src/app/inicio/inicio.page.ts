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
      await BarcodeScanner.checkPermission({ force: true });
      BarcodeScanner.hideBackground(); // Oculta el fondo de la app

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        const codigoQR = result.content;
        this.registrarAsistencia(codigoQR);

      
        this.mostrarMensajeExito();
      } else {
        console.log('No se escaneó ningún código.');
      }
    } catch (error) {
      console.error('Error al escanear QR:', error);
    }
  }


  async mostrarMensajeExito() {
    const toast = await this.toastController.create({
      message: 'Escaneo exitoso',
      buttons: [
        {
          text: 'OK',
          role: 'cancel' 
        }
      ],
      position: 'bottom' 
    });
    await toast.present();
  }

  registrarAsistencia(qrData: string) {
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Desconocido'; 
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

}
