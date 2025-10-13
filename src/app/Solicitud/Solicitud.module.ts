import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudPageRoutingModule } from './Solicitud-routing.module';
import { SolicitudPage } from './Solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudPageRoutingModule
  ],
  declarations: [SolicitudPage]
})
export class SolicitudPageModule {}