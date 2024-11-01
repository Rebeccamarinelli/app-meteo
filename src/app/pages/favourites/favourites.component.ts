import { Component } from '@angular/core';
import { FavouritesService } from '../../services/favourites.service';
import { CommonModule } from '@angular/common';
import { UtilityMeteoService } from '../../services/utility-meteo.service';
import {trigger, transition, style, animate} from '@angular/animations'


@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss',
  animations: [    
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])   
  ]
})
export class FavouritesComponent {
  favoriteCities: any[] = [];

  constructor(private favService: FavouritesService, private meteo:UtilityMeteoService) {}


  ngOnInit(): void {
    this.loadFavoriteCities();
  }

  loadFavoriteCities() {
    this.favoriteCities = this.favService.getFavoriteCitiesSortedByTemperature();
  }

   removeCity(city: string) {
     this.favService.removeFavoriteCity(city);
     this.loadFavoriteCities();
   }

   
   getWeatherIcon(code: number): string {
     return this.meteo.getWeatherIcon(code);
   }
 
   getWeatherDescription(code: number): string {
     return this.meteo.getWeatherDescription(code);
   }
 
   capitalizeFirstLetter(text: string): string {
     return this.meteo.capitalizeFirstLetter(text);
   }


}
