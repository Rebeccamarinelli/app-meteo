import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityMeteoService {

  constructor() { }

  getWeatherDescription(code: number): string {
    const weatherDescriptions: { [key: number]: string } = {
      0: 'Cielo sereno',
      1: 'Parzialmente nuvoloso',
      2: 'Nuvoloso',
      3: 'Pioggia leggera',
      45: 'Nebbia',
    };
    return weatherDescriptions[code] || 'Condizione meteo sconosciuta';
  }

  // Restituisce l'icona meteo in base al codice
  getWeatherIcon(code: number): string {
    const weatherIcons: { [key: number]: string } = {
      0: 'https://img.icons8.com/color/100/sun--v1.png',
      1: 'https://img.icons8.com/color/100/partly-cloudy-day--v1.png',
      2: 'https://img.icons8.com/color/100/clouds.png',
      3: 'https://img.icons8.com/color/100/rain--v1.png',
      45: 'https://img.icons8.com/color/100/fog-day--v1.png',
    };
    return weatherIcons[code] || 'https://img.icons8.com/color/100/rainbow--v1.png';
  }

  // Capitalizza la prima lettera di una stringa
  capitalizeFirstLetter(text: string): string { 
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

}
