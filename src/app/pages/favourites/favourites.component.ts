import { Component } from '@angular/core';
import { FavouritesService } from '../../services/favourites.service';
import { CommonModule } from '@angular/common';
import { UtilityMeteoService } from '../../services/utility-meteo.service';
import {trigger, transition, style, animate} from '@angular/animations'
import { WeatherService } from '../../services/weather.service';
import { lastValueFrom } from 'rxjs';


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
  error: string = '';
  isAscending: boolean = true;
  

  constructor(private favService: FavouritesService,
               private meteo:UtilityMeteoService,
              private weatherService: WeatherService) {}


ngOnInit(): void {
  this.loadFavoriteCitiesAndUpdateWeather()
}

loadFavoriteCitiesAndUpdateWeather():void {

  const storedCities = this.favService.getFavoriteCities();


  const updatePromises = storedCities.map((cityData: any) =>
    lastValueFrom(this.weatherService.getWeather(cityData.latitude, cityData.longitude))
      .then((updatedWeatherData) => {
      
        return {
          ...cityData,
          temperature: parseFloat(updatedWeatherData.current_weather.temperature.toFixed(0)),
          windSpeed: updatedWeatherData.current_weather.windspeed,
          windDirection: updatedWeatherData.current_weather.winddirection,
          humidity: updatedWeatherData.hourly.relative_humidity_2m[0],
          weatherCode: updatedWeatherData.hourly.weathercode[0],
          longitude: updatedWeatherData.longitude,
          latitude: updatedWeatherData.latitude
        };
      })
  );


  Promise.all(updatePromises)
    .then((updatedCities) => {
      this.favoriteCities = updatedCities;
      console.log('Updated Cities:', updatedCities);

      localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
    })
    .catch(error => {
      this.error = 'Errore durante l\'aggiornamento dei dati meteo delle città preferite.';
      console.error(error);
    });
}


removeCity(cityName: string):void {
  
  this.favService.removeFavoriteCity(cityName);

  this.favoriteCities = this.favoriteCities.filter(city => city.name.toLowerCase() !== cityName.toLowerCase());
  
  localStorage.setItem(this.favService.storageKey, JSON.stringify(this.favoriteCities));

  this.loadFavoriteCitiesAndUpdateWeather();
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

toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.favoriteCities.sort((a, b) =>
    this.isAscending ? a.temperature - b.temperature : b.temperature - a.temperature
  );
}

}
