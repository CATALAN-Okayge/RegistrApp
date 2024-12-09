import { Component, OnInit,ViewChild } from '@angular/core';
import { AnimationController, PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  usuarios: any[] = [];
  usuarioActual: any = null;

  icono = 'night_mode';
  nombreUsuario: string = '';
  contrasena: string = '';
  email: string = '';
  rol: string = '';
  tooltipMensaje: string = '';


  @ViewChild('popover') popover: any;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private anim: AnimationController,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    this.cargarUsuarios(); // Cargar usuarios del LocalStorage
    this.usuarioActual = this.obtenerUsuarioActual(); // Cargar usuario actual
  }

  // Cargar usuarios desde LocalStorage
  cargarUsuarios() {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    this.usuarios = usuariosGuardados;
  }

  // Guardar un nuevo usuario
  async registrarUsuario() {
    if (!this.nombreUsuario || !this.email || !this.contrasena) {
      await this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = this.usuarios.some((u) => u.email === this.email);
    if (usuarioExiste) {
      await this.mostrarAlerta('Error', 'El usuario ya está registrado.');
      return;
    }

    
    if (this.email.endsWith('@profduocuc.cl')) {
      this.rol = 'profesor';
    } else {
      this.rol = 'estudiante';
    }

    // Crear el nuevo usuario
    const nuevoUsuario = {
      nombreUsuario: this.nombreUsuario,
      email: this.email,
      contrasena: this.contrasena,
      rol: this.rol,
    };

    // Guardar el usuario en el array y en LocalStorage
    this.usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));

    await this.mostrarAlerta('Registro Exitoso', 'Usuario registrado correctamente.');
    this.nombreUsuario = '';
    this.email = '';
    this.contrasena = '';
  }

  
  async iniciarSesion() {
    if (!this.nombreUsuario || !this.contrasena || !this.email) {
      await this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Buscar el usuario en la lista de usuarios
    const usuario = this.usuarios.find(
      (u) =>
        u.nombreUsuario === this.nombreUsuario &&
        u.contrasena === this.contrasena &&
        u.email === this.email
    );

    if (usuario) {
      this.usuarioActual = usuario;
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));

    
      if (usuario.rol === 'profesor') {
        await this.mostrarAlerta('Bienvenido', 'Bienvenido Profesor.');
        this.router.navigate(['/inicio']); 
      } else {
        await this.mostrarAlerta('Bienvenido', 'Bienvenido Estudiante.');
        this.router.navigate(['/inicio']); 
      }
    } else {
      await this.mostrarAlerta('Error', 'Credenciales incorrectas.');
    }
  }

 
  cerrarSesion() {
    this.usuarioActual = null;
    localStorage.removeItem('usuarioActual');
    this.router.navigate(['/home']);
  }

 
  obtenerUsuarioActual() {
    return JSON.parse(localStorage.getItem('usuarioActual') || 'null');
  }

 
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  
  recuperarContrasena() {
    const apiUrl = 'https://myths.cl/api/reset_password.php';
    const data = {
      nombre: this.nombreUsuario,
      app: 'RegistrApp',
      clave: this.contrasena,
      email: this.email,
    };

    this.http.post(apiUrl, data).subscribe(
      (response: any) => {
        if (response.success) {
          this.mostrarAlerta(
            'Éxito',
            response.message || 'Se ha enviado un correo para recuperar la contraseña.'
          );
        } else {
          this.mostrarAlerta(
            'Error',
            response.message || 'Hubo un problema al intentar recuperar la contraseña.'
          );
        }
      },
      (error) => {
        this.mostrarAlerta(
          'Error',
          'Hubo un problema al intentar recuperar la contraseña. Por favor, inténtalo de nuevo.'
        );
      }
    );
  }

  async mostrarTooltip(event: any, mensaje: string) {
    this.tooltipMensaje = mensaje;
    const popover = await this.popoverCtrl.create({
      event,
      component: 'ion-popover',
      componentProps: { message: mensaje },
      translucent: true,
    });
    await popover.present();
  }


  animarError(index: number) {
    this.anim
      .create()
      .addElement(document.querySelectorAll('input')[index]!)
      .duration(100)
      .iterations(3)
      .keyframes([
        { offset: 0, transform: 'translateX(0px)', border: '1px transparent solid' },
        { offset: 0.25, transform: 'translateX(-5px)', border: '1px red solid' },
        { offset: 0.5, transform: 'translateX(0px)', border: '1px transparent solid' },
        { offset: 0.75, transform: 'translateX(5px)', border: '1px red solid' },
        { offset: 1, transform: 'translateX(0px)', border: '1px transparent solid' },
      ])
      .play();
  }
}
