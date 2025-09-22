import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovilPage } from './Movil.page';

const routes: Routes = [
  {
    path: '',
    component: MovilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovilPageRoutingModule {}