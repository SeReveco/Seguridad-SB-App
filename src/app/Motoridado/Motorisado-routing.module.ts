import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotorisadoPage } from './Motorisado.page';

const routes: Routes = [
  {
    path: '',
    component: MotorisadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotorisadoPageRoutingModule {}