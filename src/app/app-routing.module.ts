import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClienteCrudComponent } from './views/cliente-crud/cliente-crud.component';
import { ClienteAddComponent } from './componentes/cliente/cliente-add/cliente-add.component';

import { MovimentacaoComponent } from './componentes/movimentacao/movimentacao.component';

const routes: Routes = [
  { path: '', redirectTo: '/cliente', pathMatch: 'full' },
  { path: 'cliente', component: ClienteCrudComponent },
  { path: 'cliente-add', component: ClienteAddComponent },
  { path: 'cliente/update/:id', component: ClienteAddComponent },

  { path: 'movimentacao/:clienteId', component: MovimentacaoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
