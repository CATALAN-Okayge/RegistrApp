import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { AlertController} from '@ionic/angular'; // Importa Router
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  icono = 'night_mode'; 
  nombreUsuario: string = ''; // Nombre de usuario para login/registro
  contrasena: string = '';    // Contraseña para login/registro


  constructor(private alertController: AlertController, private router: Router, private anim: AnimationController) {}



  ngOnInit() {
    
    document.body.classList.add('dark-theme');

    this.anim.create()
      .addElement(document.querySelector("#logo")!)
      .duration(2000)
      .iterations(Infinity)
      .direction("alternate")
      .fromTo("color", "#6FDB97", "#50CAF0")
      .play();
  }

   // Método para registrar usuario en localStorage
   registrarUsuario() {
    if (this.nombreUsuario && this.contrasena) {
      localStorage.setItem('nombreUsuario', this.nombreUsuario);
      localStorage.setItem('contrasena', this.contrasena);
      this.mostrarAlerta('Registro Exitoso', 'Te has registrado correctamente.');
    } else {
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
    }
  }

  // Método para iniciar sesión
iniciarSesion() {
  const storedUsername = localStorage.getItem('nombreUsuario');
  const storedPassword = localStorage.getItem('contrasena');

  // Validamos si el nombre de usuario y la contraseña coinciden con los datos guardados
  if (this.nombreUsuario === storedUsername && this.contrasena === storedPassword) {
    this.mostrarAlerta('Inicio de Sesión', 'Has iniciado sesión correctamente.').then(() => {
      this.router.navigate(['/inicio']); // Redirige a la página 'inicio'
    });
  } else {
    this.mostrarAlerta('Error', 'Nombre de usuario o contraseña incorrectos.');
  }
}

  // Método para mostrar una alerta
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }


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

 


  cambiarTema() {
    if (this.icono === 'night_mode') {
      
      document.documentElement.style.setProperty('--fondo', '#ffffff');
      document.documentElement.style.setProperty('--fondo-input', '#f0f0f0');
      document.documentElement.style.setProperty('--icono', '#00bcd4');
      document.documentElement.style.setProperty('--textos', '#000000');
      this.icono = 'light_mode';
    } else {
      
      document.documentElement.style.setProperty('--fondo', '#000000');
      document.documentElement.style.setProperty('--fondo-input', '#333333');
      document.documentElement.style.setProperty('--icono', '#00bcd4');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      this.icono = 'night_mode';
    }
  }
}

