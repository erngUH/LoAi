import { MainComponent } from './main/main.component';
import { AllComponent } from './all/all.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', component: MainComponent, title: 'LoAi'},
    { path: '**', redirectTo: '' }
/*     ,
    {
      path: 'all',
      component: AllComponent,
      title: 'All User Generations'
    } */
];
export default routes;
