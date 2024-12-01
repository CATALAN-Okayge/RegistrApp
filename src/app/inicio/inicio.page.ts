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
  nombreUsuario: string = ''; 
  escaneando: boolean = false;

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';
    this.rol = localStorage.getItem('rol') || ''; 
  }

 

  async escanearQR() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        console.error('Permiso denegado para usar la cámara.');
        await this.mostrarToast('Permiso denegado para la cámara.');
        return;
      }

      this.escaneoActivo = true;
  
      
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

  async detenerEscaneo() {
    // Restablecer los estilos y detener el escaneo
    this.escaneoActivo = false;
    document.body.classList.remove('scanner-active');
    const ionContent = document.querySelector('ion-content');
    ionContent?.classList.remove('qr-active');

    await BarcodeScanner.showBackground();
    await BarcodeScanner.stopScan();
  }

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
