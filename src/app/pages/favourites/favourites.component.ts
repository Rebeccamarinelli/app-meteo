import { Component } from '@angular/core';
import { FavouritesService } from '../../services/favourites.service';
import { CommonModule } from '@angular/common';
import { UtilityMeteoService } from '../../services/utility-meteo.service';
import {trigger, transition, style, animate} from '@angular/animations'
import { WeatherService } from '../../services/weather.service';


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

  constructor(private favService: FavouritesService,
               private meteo:UtilityMeteoService,
              private weatherService: WeatherService) {}


  ngOnInit(): void {
    this.loadFavoriteCities();
    //this.updateFavoriteCitiesWeather();
  }

  // updateFavoriteCitiesWeather() {
  //   const storedCities = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
  //   this.favoriteCities = [];

  //   storedCities.forEach((cityData: any) => {
  //     this.weatherService.getWeather(cityData.latitude, cityData.longitude).subscribe(updatedWeatherData => {
  //       const updatedCityData = {
  //         ...cityData,
  //         temperature: updatedWeatherData.current_weather.temperature,
  //         windSpeed: updatedWeatherData.current_weather.windspeed,
  //         windDirection: updatedWeatherData.current_weather.winddirection,
  //         humidity: updatedWeatherData.hourly.relative_humidity_2m[0],
  //         weatherCode: updatedWeatherData.hourly.weathercode[0]
  //       };

  //       this.favoriteCities.push(updatedCityData);
  //     });
  //   });

  //   // Aggiorna il localStorage con i dati meteo aggiornati
  //   localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
  // }

  

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

   isAscending: boolean = true;

    toggleSortOrder(): void {
      this.isAscending = !this.isAscending;
      this.favoriteCities.sort((a, b) =>
      this.isAscending ? a.temperature - b.temperature : b.temperature - a.temperature
    );
}

}
