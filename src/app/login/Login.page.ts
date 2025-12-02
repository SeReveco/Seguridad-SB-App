import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})

export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };
  
  loading = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async login() {
  console.log('🔐 Intentando login con:', this.credentials.email);
  
  this.loading = true;
  const loading = await this.loadingCtrl.create({
    message: 'Iniciando sesión...'
  });
  await loading.present();

  this.apiService.login(this.credentials.email, this.credentials.password).subscribe({
    next: async (response) => {
      console.log('✅ Respuesta COMPLETA del servidor:', response);
      await loading.dismiss();
      this.loading = false;
      
      if (response.success) {
        console.log('✅ Login exitoso en el frontend');
        console.log('✅ Datos del usuario:', response.user);
        
        if (this.apiService.canAccessApp()) {
          const user = this.apiService.getCurrentUser();
          console.log('✅ Usuario en auth service:', user);
          
          if (user?.user_type === 'ciudadano') {
            this.router.navigate(['/home']);
          } else if (user?.user_type === 'trabajador') {
            this.router.navigate(['/trabajador']);
          }
          
          const toast = await this.toastCtrl.create({
            message: `Bienvenido ${user?.nombre}`,
            duration: 2000,
            color: 'success'
          });
          toast.present();
          
        } else {
          console.log('❌ Usuario sin acceso a la app');
          this.errorMessage = 'Tu rol no tiene acceso a la aplicación móvil.';
          this.apiService.logout();
        }
      } else {
        console.log('❌ Login falló en el servidor');
        this.errorMessage = response.error || 'Error en las credenciales';
      }
    },
    error: async (error) => {
      console.error('❌ Error completo en login:', error);
      console.error('❌ Error status:', error.status);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error details:', error.error);
      
      await loading.dismiss();
      this.loading = false;
      
      if (error.status === 0) {
        this.errorMessage = 'Error de conexión. Verifica tu internet.';
      } else if (error.status === 401) {
        this.errorMessage = 'Credenciales inválidas';
      } else {
        this.errorMessage = error.error?.error || 'Error al iniciar sesión';
      }
      
      const toast = await this.toastCtrl.create({
        message: this.errorMessage,
        duration: 4000,
        color: 'danger'
      });
      toast.present();
    }
  });
}

  onInputChange() {
    this.errorMessage = '';
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}