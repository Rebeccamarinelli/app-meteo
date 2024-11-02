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
  error: string = '';
  
  

  constructor(private favService: FavouritesService,
               private meteo:UtilityMeteoService,
              private weatherService: WeatherService) {}


  ngOnInit(): void {
    //this.loadFavoriteCities();
    //this.updateFavoriteCitiesWeather();
  this.loadFavoriteCitiesAndUpdateWeather()
  }

   loadFavoriteCitiesAndUpdateWeather() {
     // Carica le città preferite dalla memoria locale
     const storedCities = this.favService.getFavoriteCities();
     const updatedCities: any[] = [];
  
   // Per ciascuna città preferita, richiedi i dati meteo aggiornati
    storedCities.forEach((cityData: any, index: number) => {
      this.weatherService.getWeather(cityData.latitude, cityData.longitude).subscribe(
        (updatedWeatherData) => {
          console.log(updatedWeatherData)
          const updatedCityData = {
            ...cityData,
            temperature: updatedWeatherData.current_weather.temperature,
            windSpeed: updatedWeatherData.current_weather.windspeed,
            windDirection: updatedWeatherData.current_weather.winddirection,
            humidity: updatedWeatherData.hourly.relative_humidity_2m[0],
            weatherCode: updatedWeatherData.hourly.weathercode[0]
          };
  
          updatedCities.push(updatedCityData);
  
           // Quando tutte le città sono state aggiornate, aggiorna `favoriteCities` e `localStorage`
          if (updatedCities.length === storedCities.length) {
            this.favoriteCities = updatedCities;
  
            // Aggiorna il `localStorage` con i dati meteo aggiornati
             localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
           }
         },
         (error) => {
           this.error = 'Errore durante l\'aggiornamento dei dati meteo delle città preferite.';
         }
       );
     });
   }

    // loadFavoriteCities() {
    //   this.favoriteCities = this.favService.getFavoriteCitiesSortedByTemperature();
    // }

    removeCity(cityName: string) {
      // Rimuovi la città dal servizio preferiti
      this.favService.removeFavoriteCity(cityName);
    
      // Aggiorna la lista di città preferite dopo la rimozione
      this.favoriteCities = this.favoriteCities.filter(city => city.name.toLowerCase() !== cityName.toLowerCase());
    
      // Salva la lista aggiornata nel local storage
      localStorage.setItem(this.favService.storageKey, JSON.stringify(this.favoriteCities));
    
      // Ricarica le città per assicurare che la lista si aggiorni
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

   isAscending: boolean = true;

    toggleSortOrder(): void {
      this.isAscending = !this.isAscending;
      this.favoriteCities.sort((a, b) =>
      this.isAscending ? a.temperature - b.temperature : b.temperature - a.temperature
    );
}

}
