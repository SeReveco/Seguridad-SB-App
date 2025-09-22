import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SolicitudPage } from './Solicitud.page';

import { SolicitudPageRoutingModule } from './Solicitud-routing.module';


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
