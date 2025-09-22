import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MotorisadoPage } from './Motorisado.page';

import { MotorisadoPageRoutingModule } from './Motorisado-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MotorisadoPageRoutingModule
  ],
  declarations: [MotorisadoPage]
})
export class MotorisadoPageModule {}
