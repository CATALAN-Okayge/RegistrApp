import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { AlertController} from '@ionic/angular'; 
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  icono = 'night_mode'; 
  nombreUsuario: string = ''; 
  contrasena: string = '';    
  email: string = ''; 

  constructor(private alertController: AlertController, private router: Router, private anim: AnimationController, private http: HttpClient, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    

    
  }

  // Función para registrar usuario
  registrarUsuario() {
    if (this.nombreUsuario && this.contrasena) {
      localStorage.setItem('nombreUsuario', this.nombreUsuario);
      localStorage.setItem('contrasena', this.contrasena);
      
      if (this.email) {
        localStorage.setItem('email', this.email); // Guardar el email opcional
      }
  
      this.mostrarAlerta('Registro Exitoso', 'Te has registrado correctamente.');
    } else {
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
    }
  }

  // Función para iniciar sesión
  iniciarSesion() {
    const storedUsername = localStorage.getItem('nombreUsuario');
    const storedPassword = localStorage.getItem('contrasena');

    if (this.nombreUsuario === storedUsername && this.contrasena === storedPassword) {
      this.mostrarAlerta('Inicio de Sesión', 'Has iniciado sesión correctamente.').then(() => {
        this.router.navigate(['/inicio']);
      });
    } else {
      this.mostrarAlerta('Error', 'Nombre de usuario o contraseña incorrectos.');
    }
  }

  // Método para mostrar alertas
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Función para recuperar contraseña
  recuperarContrasena() {
    const apiUrl = 'https://myths.cl/api/reset_password.php'; 
    const storedUsername = localStorage.getItem('nombreUsuario');
    const storedEmail = this.email; 

    const data = {
      nombre: storedUsername, 
      app: 'RegistrApp', 
      clave: this.contrasena, 
      email: storedEmail 
    };

    this.http.post(apiUrl, data).subscribe(
      (response: any) => { 
        if (response.success) { 
          this.mostrarAlerta('Éxito', response.message || 'Se ha enviado un correo para recuperar la contraseña.');
        } else {
          this.mostrarAlerta('Error', response.message || 'Hubo un problema al intentar recuperar la contraseña.');
        }
      },
      (error) => {
        this.mostrarAlerta('Error', 'Hubo un problema al intentar recuperar la contraseña. Por favor, inténtalo de nuevo.');
      }
    );
  }

  // Función para animar errores en campos
  animarError(index: number) {
    this.anim.create()
      .addElement(document.querySelectorAll("input")[index]!)
      .duration(100)
      .iterations(3)
      .keyframes([
        { offset: 0, transform: "translateX(0px)", border: "1px transparent solid" },
        { offset: 0.25, transform: "translateX(-5px)", border: "1px red solid" },
        { offset: 0.5, transform: "translateX(0px)", border: "1px transparent solid" },
        { offset: 0.75, transform: "translateX(5px)", border: "1px red solid" },
        { offset: 1, transform: "translateX(0px)", border: "1px transparent solid" },
      ])
      .play();
  }
}


