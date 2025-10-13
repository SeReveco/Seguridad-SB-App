import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudPage } from './Solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudPageRoutingModule {}