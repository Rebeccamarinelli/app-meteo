import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { WrongRouteComponent } from './pages/wrong-route/wrong-route.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'favorites', component: FavouritesComponent },
    {path : '**', component: WrongRouteComponent}
];
