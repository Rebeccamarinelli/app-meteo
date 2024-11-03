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

  removeFavoriteCity(cityName: string) :void {
    const favoriteCities = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    
    const updatedCities = favoriteCities.filter((city: any) => city.name.toLowerCase() !== cityName.toLowerCase());
  
    localStorage.setItem(this.storageKey, JSON.stringify(updatedCities));
  }
 


}
