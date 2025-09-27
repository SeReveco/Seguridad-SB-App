import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'alerta',
    loadChildren: () => import('./alerta/Alerta.module').then(m => m.AlertaPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/Login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./Registro/Register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'solicitud',
    loadChildren: () => import('./Solicitud/Solicitud.module').then(m => m.SolicitudPageModule)
  },  
  {
    path: 'motorisado',
    loadChildren: () => import('./Motoridado/Motorisado.module').then(m => m.MotorisadoPageModule)
  },
  {
    path: 'movil',
    loadChildren: () => import('./Movil/Movil.module').then(m => m.MovilPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    //De donde se inicia la aplicacion
    path: '',
    redirectTo: 'login',
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
