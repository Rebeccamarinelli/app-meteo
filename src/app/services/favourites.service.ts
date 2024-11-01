import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  constructor() {}

 storageKey = 'favoriteCities';

  getFavoriteCities(): any[] {
    const cities = localStorage.getItem(this.storageKey);
    return cities ? JSON.parse(cities) : [];
  }

  // addFavoriteCity(city:any): void {
  //   const cities = this.getFavoriteCities();
  //   if (!cities.includes(city)) {
  //     cities.push(city);
  //     localStorage.setItem(this.storageKey, JSON.stringify(cities));
  //   }
  // }

  addFavoriteCity(city: any): void {
    const cities = this.getFavoriteCities();
  
    const cityExists = cities.some(existingCity => 
      existingCity.name.toLowerCase() === city.name.toLowerCase()
    );
  
    if (!cityExists) {
      cities.push(city);
      localStorage.setItem(this.storageKey, JSON.stringify(cities));
      
    }
  }

  removeFavoriteCity(city: any): void {
    const cities = this.getFavoriteCities().filter(c => c.name !== city);
    localStorage.setItem(this.storageKey, JSON.stringify(cities));
  }

  getFavoriteCitiesSortedByTemperature(): any[] {
    const cities = this.getFavoriteCities(); // Recupera tutte le città preferite
    return cities.sort((a: any, b: any) => a.temperature - b.temperature); // Ordina per temperatura (crescente)
  }
}
