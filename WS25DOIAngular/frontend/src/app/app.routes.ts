import { Routes } from '@angular/router';
import { ArticlesListComponent } from './components/articles-list/articles-list.component';

export const routes: Routes = [
  { path: '', component: ArticlesListComponent },
  { path: '**', redirectTo: '' }
];
