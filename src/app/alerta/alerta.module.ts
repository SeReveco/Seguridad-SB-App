import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AlertaPage } from './Alerta.page';

import { AlertaPageRoutingModule } from './Alerta-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertaPageRoutingModule
  ],
  declarations: [AlertaPage]
})
export class AlertaPageModule {}
