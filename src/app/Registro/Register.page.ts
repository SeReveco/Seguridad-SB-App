import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  // Campos para ciudadano
  rut_ciudadano = '';
  nombre_ciudadano = '';
  apellido_pat_ciudadano = '';
  apellido_mat_ciudadano = '';
  correo_electronico_ciudadano = '';
  telefono_movil_ciudadano = '';
  password_ciudadano = '';
  confirmPassword = '';
  error = '';
  loading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async register() {
    this.error = '';
    
    // Validación de contraseñas
    if (this.password_ciudadano !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    
    // Validación de RUT
    const rutValido = /^\d{7,8}-[\dkK]$/.test(this.rut_ciudadano);
    if (!rutValido) {
      this.error = 'El RUT debe tener formato: 12345678-9';
      return;
    }
    
    // Validación de teléfono
    const telefonoValido = /^\+?56?9?\d{8}$/.test(this.telefono_movil_ciudadano);
    if (!telefonoValido) {
      this.error = 'El teléfono debe tener formato: +56912345678 o 912345678';
      return;
    }
    
    // Validación de email
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo_electronico_ciudadano);
    if (!emailValido) {
      this.error = 'Por favor ingresa un correo electrónico válido';
      return;
    }

    this.loading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Registrando cuenta...'
    });
    await loading.present();

    // Preparar datos según el modelo Ciudadano de Django
    const ciudadanoData = {
      rut_ciudadano: this.rut_ciudadano,
      nombre_ciudadano: this.nombre_ciudadano,
      apellido_pat_ciudadano: this.apellido_pat_ciudadano,
      apellido_mat_ciudadano: this.apellido_mat_ciudadano,
      correo_electronico_ciudadano: this.correo_electronico_ciudadano,
      telefono_movil_ciudadano: this.telefono_movil_ciudadano,
      password_ciudadano: this.password_ciudadano
    };
    
    try {
      const response: any = await this.apiService.registerCiudadano(ciudadanoData).toPromise();
      
      if (response.success) {
        await loading.dismiss();
        
        const toast = await this.toastCtrl.create({
          message: 'Cuenta creada exitosamente! Ahora puedes iniciar sesión.',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        
        this.router.navigate(['/login']);
      } else {
        await loading.dismiss();
        this.error = response.error || 'Error al registrar ciudadano';
      }
      
    } catch (error: any) {
      await loading.dismiss();
      console.error('Error en registro:', error);
      
      if (error.error) {
        const errorData = error.error;
        if (errorData.error) {
          this.error = errorData.error;
        } else if (errorData.rut_ciudadano) {
          this.error = `RUT: ${errorData.rut_ciudadano[0]}`;
        } else if (errorData.correo_electronico_ciudadano) {
          this.error = `Correo: ${errorData.correo_electronico_ciudadano[0]}`;
        } else if (errorData.telefono_movil_ciudadano) {
          this.error = `Teléfono: ${errorData.telefono_movil_ciudadano[0]}`;
        } else if (errorData.non_field_errors) {
          this.error = errorData.non_field_errors[0];
        } else {
          this.error = 'Error al registrar ciudadano. Verifique los datos.';
        }
      } else {
        this.error = 'Error de conexión con el servidor';
      }
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}