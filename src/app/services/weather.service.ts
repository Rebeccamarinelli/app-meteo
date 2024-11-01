import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http:HttpClient) {}

    //funzione per la codifica delle coordinate
    getCoordinates(city:string):Observable<any>{
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
      return this.http.get(geocodingUrl);
    } 

     // Ottengo le previsioni meteo in base a longitudine e latitudine
    getWeather(latitude: number, longitude: number): Observable<any> {
      // const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      // return this.http.get(weatherUrl);
      return this.http.get(this.apiUrl, {
        params: {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          current_weather: 'true',
          hourly: 'temperature_2m,relative_humidity_2m,weathercode',
          timezone: 'Europe/Rome'
        }
      });
  }

}
