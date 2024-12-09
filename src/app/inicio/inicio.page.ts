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
  escaneoActivo = false;
  rol: string = '';
  nombreUsuario: string = ''; // Nombre del usuario actualmente logueado
  email: string = ''; // Email del usuario actualmente logueado
  mostrarMensaje = true;

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  /**
   * Obtiene los datos del usuario actualmente logueado desde el almacenamiento local
   */
  obtenerDatosUsuario() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');

    if (usuarioActual) {
      this.nombreUsuario = usuarioActual.nombreUsuario;
      this.rol = usuarioActual.rol || 'estudiante'; // Valor por defecto si no se define
      this.email = usuarioActual.email || '';
    } else {
      this.nombreUsuario = 'Usuario';
      this.rol = '';
      this.email = '';
    }
  }

  /**
   * Escanea un código QR y registra la asistencia
   */
  async escanearQR() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        console.error('Permiso denegado para usar la cámara.');
        await this.mostrarToast('Permiso denegado para la cámara.');
        return;
      }

      this.escaneoActivo = true;
      this.mostrarMensaje = false;

      const ionContent = document.querySelector('ion-content');
      if (ionContent) {
        ionContent.style.setProperty('--ion-background-color', 'transparent');
      }

      await BarcodeScanner.hideBackground();
      document.querySelector('body')!.classList.add('scanner-active');

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        const codigoQR = result.content;
        this.registrarAsistencia(codigoQR);
        this.mostrarToast('Escaneo exitoso');
      } else {
        console.log('No se escaneó ningún código.');
      }
    } catch (error) {
      console.error('Error al escanear QR:', error);
      await this.mostrarToast('Error al escanear QR.');
    } finally {
      this.detenerEscaneo();
    }
  }

  /**
   * Detiene el escaneo del código QR
   */
  async detenerEscaneo() {
    this.escaneoActivo = false;
    this.mostrarMensaje = true;
    document.body.classList.remove('scanner-active');
    const ionContent = document.querySelector('ion-content');
    ionContent?.classList.remove('qr-active');

    await BarcodeScanner.showBackground();
    await BarcodeScanner.stopScan();
  }

  /**
   * Muestra un mensaje en un Toast
   */
  async mostrarToast(message: string) {
    const toast = await this.toastController.create({
      message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
      position: 'bottom',
    });
    await toast.present();
  }

  /**
   * Registra la asistencia del usuario actual utilizando el QR escaneado
   */
  registrarAsistencia(qrData: string) {
    if (!this.nombreUsuario || !this.rol) {
      this.mostrarToast('Error: Usuario no identificado.');
      return;
    }

    const asistencia = {
      codigo: qrData,
      usuario: this.nombreUsuario,
      email: this.email,
      rol: this.rol,
      fecha: new Date().toLocaleString(),
    };

    let registros = JSON.parse(localStorage.getItem('asistencias') || '[]');
    registros.push(asistencia);
    localStorage.setItem('asistencias', JSON.stringify(registros));

    console.log('Asistencia registrada:', asistencia);
  }
}
