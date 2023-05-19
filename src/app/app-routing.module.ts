import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamListComponent } from './components/team-list/team-list.component';

const routes: Routes = [
  {
    path : '',
    component : TeamListComponent
  },
  {
    path : 'teams',
    component : TeamListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
