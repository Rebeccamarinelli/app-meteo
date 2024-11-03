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
  
  

  constructor(private favService: FavouritesService,
               private meteo:UtilityMeteoService,
              private weatherService: WeatherService) {}


  ngOnInit(): void {
  this.loadFavoriteCitiesAndUpdateWeather()
  console.log('ciao')
  }



loadFavoriteCitiesAndUpdateWeather() {
  // Carica le città preferite dalla memoria locale
  const storedCities = this.favService.getFavoriteCities();

  // Crea un array di Promesse per aggiornare ciascuna città
  const updatePromises = storedCities.map((cityData: any) =>
    lastValueFrom(this.weatherService.getWeather(cityData.latitude, cityData.longitude))
      .then((updatedWeatherData) => {
        // Aggiorna i dati della città con le informazioni meteo
        return {
          ...cityData,
          temperature: updatedWeatherData.current_weather.temperature,
          windSpeed: updatedWeatherData.current_weather.windspeed,
          windDirection: updatedWeatherData.current_weather.winddirection,
          humidity: updatedWeatherData.hourly.relative_humidity_2m[0],
          weatherCode: updatedWeatherData.hourly.weathercode[0],
          longitude: updatedWeatherData.longitude,
          latitude: updatedWeatherData.latitude
        };
      })
  );

  // Usa Promise.all per attendere che tutte le chiamate siano completate
  Promise.all(updatePromises)
    .then((updatedCities) => {
      // Assegna i dati aggiornati a favoriteCities
      this.favoriteCities = updatedCities;
      console.log('Updated Cities:', updatedCities);

      // Aggiorna il `localStorage` con i dati meteo aggiornati
      localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
    })
    .catch(error => {
      this.error = 'Errore durante l\'aggiornamento dei dati meteo delle città preferite.';
      console.error(error);
    });
}



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
