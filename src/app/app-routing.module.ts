import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'alerta',
    loadChildren: () => import('./alerta/alerta.module').then(m => m.AlertaPageModule)
  },
  {
    path: 'Login',
    loadChildren: () => import('./login/Login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'Register',
    loadChildren: () => import('./Registro/Register.module').then(m => m.RegisterPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
