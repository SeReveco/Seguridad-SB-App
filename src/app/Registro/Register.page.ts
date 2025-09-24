import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './Register.page.html',
  styleUrls: ['./Register.page.scss'],
  standalone: true,                  // ✅ marca como standalone
  imports: [CommonModule, FormsModule, IonicModule] // ✅ módulos necesarios
})
export class RegisterPage {
  username = '';
  password = '';
  email = '';
  first_name = '';
  last_name = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.error = '';
    this.http.post('http://localhost:8000/api/register/', {
      username: this.username,
      password: this.password,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name
    }).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Error al registrar usuario';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
