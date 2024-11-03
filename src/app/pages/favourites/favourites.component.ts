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
  updateInterval: any;
  

  constructor(private favService: FavouritesService,
               private meteo:UtilityMeteoService,
              private weatherService: WeatherService) {}


// ngOnInit(): void {
//  // this.loadFavoriteCitiesAndUpdateWeather()
//   this.favoriteCities = this.favService.getFavoriteCities();
// }

// async loadFavoriteCitiesAndUpdateWeather() {
//   try {
//     const storedCities = this.favService.getFavoriteCities();
//     const updatedCities = [];

//     for (const cityData of storedCities) {
//       const updatedWeatherData = await lastValueFrom(
//         this.weatherService.getWeather(cityData.latitude, cityData.longitude)
//       );

//       updatedCities.push({
//         ...cityData,
//         temperature: parseFloat(updatedWeatherData.current_weather.temperature.toFixed(1)),
//         windSpeed: parseFloat(updatedWeatherData.current_weather.windspeed.toFixed(1)),
//         windDirection: updatedWeatherData.current_weather.winddirection,
//         humidity: updatedWeatherData.hourly.relative_humidity_2m[0],
//         weatherCode: updatedWeatherData.hourly.weathercode[0],
//         longitude: updatedWeatherData.longitude,
//         latitude: updatedWeatherData.latitude,
//       });
//     }

//     this.favoriteCities = updatedCities;
//     console.log('Updated Cities:', updatedCities);

//     if (typeof localStorage !== "undefined") {
//       localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
//     }
//   } catch (error) {
//     this.error = 'Errore durante l\'aggiornamento dei dati meteo delle città preferite.';
//     console.error(error);
//   }
// }



// loadFavoriteCitiesAndUpdateWeather():void {
 
//   const storedCities = this.favService.getFavoriteCities();

  
//   const updatePromises = storedCities.map((cityData: any) =>
//     lastValueFrom(this.weatherService.getWeather(cityData.latitude, cityData.longitude))
//       .then((updatedWeatherData) => {
        
//         return {
//           ...cityData,
//           temperature: updatedWeatherData.current_weather.temperature,
//           windSpeed: updatedWeatherData.current_weather.windspeed,
//           windDirection: updatedWeatherData.current_weather.winddirection,
//           humidity: updatedWeatherData.hourly.relative_humidity_2m[0],
//           weatherCode: updatedWeatherData.hourly.weathercode[0],
//           longitude: updatedWeatherData.longitude,
//           latitude: updatedWeatherData.latitude
//         };
//       })
//   );

  
//   Promise.all(updatePromises)
//     .then((updatedCities) => {
//       this.favoriteCities = updatedCities;
//       console.log('Updated Cities:', updatedCities);

//       localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
//     })
//     .catch(error => {
//       this.error = 'Errore durante l\'aggiornamento dei dati meteo delle città preferite.';
//       console.error(error);
//     });
// }

// async ngOnInit() {
//   try {
//     // Carica i dati dal localStorage e aggiorna tramite API
//     this.favoriteCities = await this.favService.loadFavoriteCitiesAndUpdateWeather();
//   } catch (error) {
//     this.error = 'Errore durante il caricamento dei dati meteo dei preferiti.';
//     console.error(error);
//   }
// }

async ngOnInit() {
  // Carica i dati iniziali dal localStorage
  this.favoriteCities = this.favService.getFavoriteCities();

  // Esegui l'aggiornamento immediatamente
  //await this.updateWeatherData();

  // Imposta l'aggiornamento ogni 10 minuti (600000 ms)
  this.updateInterval = setInterval(() => {
    this.updateWeatherData();
  }, 600000);  // Intervallo di aggiornamento di 10 minuti
}

async updateWeatherData() {
  try {
    this.favoriteCities = await this.favService.loadFavoriteCitiesAndUpdateWeather();
  } catch (error) {
    this.error = 'Errore durante l\'aggiornamento dei dati meteo dei preferiti.';
  }
}

ngOnDestroy() {
  // Cancella il timer quando il componente viene distrutto
  if (this.updateInterval) {
    clearInterval(this.updateInterval);
  }
}




removeCity(cityName: string) {
  
  this.favService.removeFavoriteCity(cityName);

  this.favoriteCities = this.favoriteCities.filter(city => city.name.toLowerCase() !== cityName.toLowerCase());
  
  localStorage.setItem(this.favService.storageKey, JSON.stringify(this.favoriteCities));

  this.favService.loadFavoriteCitiesAndUpdateWeather();
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
