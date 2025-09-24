import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { RegisterPageRoutingModule } from './Register-routing.module';
import { RegisterPage } from './Register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    RegisterPage   // ✅ importamos el standalone, no declaramos
  ]
})
export class RegisterPageModule {}
