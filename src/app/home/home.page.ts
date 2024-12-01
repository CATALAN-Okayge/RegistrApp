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
  rol: string = '';

  constructor(private alertController: AlertController, private router: Router, private anim: AnimationController, private http: HttpClient, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    

    
  }

  // Función para registrar usuario
  async registrarUsuario() {
    // Verificar si todos los campos están completos
    if (!this.nombreUsuario || !this.email || !this.contrasena) {
      await this.mostrarAlerta('Error', 'Por favor, completa todos los campos');
      return;
    }

    // Asignar rol basado en el correo electrónico
    if (this.email.endsWith('@profduocuc.cl')) {
      this.rol = 'profesor';
    } else {
      this.rol = 'estudiante';
    }

    // Guardar datos en localStorage
    localStorage.setItem('nombreUsuario', this.nombreUsuario);
    localStorage.setItem('email', this.email);
    localStorage.setItem('contrasena', this.contrasena);
    localStorage.setItem('rol', this.rol);

    // Redirigir al perfil del usuario
    await this.mostrarAlerta('Registro Exitoso', 'Usuario registrado correctamente');
    this.router.navigate(['/inicio']);
  }

  // Función para iniciar sesión
  async iniciarSesion() {
    // Obtener datos guardados en localStorage
    const storedUsername = localStorage.getItem('nombreUsuario');
    const storedPassword = localStorage.getItem('contrasena');
    const storedEmail = localStorage.getItem('email');
    const storedRol = localStorage.getItem('rol');

    // Validación de campos obligatorios
    if (!this.nombreUsuario || !this.contrasena || !this.email) {
      await this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Verificar si las credenciales coinciden
    if (this.nombreUsuario === storedUsername && this.contrasena === storedPassword && this.email === storedEmail) {
      // Guardar rol en localStorage si es correcto
      localStorage.setItem('rol', storedRol!);

      // Redirigir según el rol
      if (storedRol === 'profesor') {
        await this.mostrarAlerta('Bienvenido', 'Bienvenido Profesor.');
        this.router.navigate(['/inicio']); // Redirigir a perfil del profesor
      } else {
        await this.mostrarAlerta('Bienvenido', 'Bienvenido Estudiante.');
        this.router.navigate(['/inicio']); // Redirigir a perfil del estudiante
      }
    } else {
      await this.mostrarAlerta('Error', 'Nombre de usuario, contraseña o email incorrectos.');
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


