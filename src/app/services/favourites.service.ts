import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { WeatherService } from './weather.service';



@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  constructor(private weatherService: WeatherService) {}

 storageKey = 'favoriteCities';

  getFavoriteCities(): any[] {
    const cities = localStorage.getItem(this.storageKey);
    return cities ? JSON.parse(cities) : [];
  }


  // addFavoriteCity(city: any): void {
  //   const cities = this.getFavoriteCities();
  
  //   const cityExists = cities.some(existingCity => 
  //     existingCity.name.toLowerCase() === city.name.toLowerCase()
  //   );
  
  //   if (!cityExists) {
  //     cities.push(city);
  //     localStorage.setItem(this.storageKey, JSON.stringify(cities));
      
  //   }
  // }

  addFavoriteCity(cityData: any) {
    const storedCities = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    storedCities.push(cityData);
    localStorage.setItem(this.storageKey, JSON.stringify(storedCities));
  }

  removeFavoriteCity(cityName: string) :void {
    const favoriteCities = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    
    const updatedCities = favoriteCities.filter((city: any) => city.name.toLowerCase() !== cityName.toLowerCase());
  
    localStorage.setItem(this.storageKey, JSON.stringify(updatedCities));
  }
 
  // In FavoriteService
async loadFavoriteCitiesAndUpdateWeather() {
  try {
    const storedCities = this.getFavoriteCities();
    const updatedCities = [];

    for (const cityData of storedCities) {
      const updatedWeatherData = await lastValueFrom(
        this.weatherService.getWeather(cityData.latitude, cityData.longitude)
      );

      const updatedCityData = {
        ...cityData,
        temperature: parseFloat(updatedWeatherData.current_weather.temperature.toFixed(1)),
        windSpeed: parseFloat(updatedWeatherData.current_weather.windspeed.toFixed(1)),
        windDirection: updatedWeatherData.current_weather.winddirection,
        humidity: updatedWeatherData.hourly.relative_humidity_2m[0],
        weatherCode: updatedWeatherData.hourly.weathercode[0],
        longitude: updatedWeatherData.longitude,
        latitude: updatedWeatherData.latitude,
      };

      updatedCities.push(updatedCityData);
    }

    // Aggiorna il localStorage con i dati aggiornati
    localStorage.setItem(this.storageKey, JSON.stringify(updatedCities));
    
    return updatedCities;
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dei dati meteo:', error);
    throw error;
  }
}

  

}
