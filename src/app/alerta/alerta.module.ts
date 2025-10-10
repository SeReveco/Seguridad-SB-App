import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AlertaPage } from './alerta.page';

import { AlertaPageRoutingModule } from './alerta-routing.module';


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
