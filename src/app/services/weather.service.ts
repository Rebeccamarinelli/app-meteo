import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http:HttpClient) {}

  getCoordinates(city:string):Observable<any>{
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    return this.http.get(geocodingUrl);
  } 

     
  getWeather(latitude: number, longitude: number): Observable<any> {
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
