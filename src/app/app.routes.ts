import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'favorites', component: FavouritesComponent }
];
