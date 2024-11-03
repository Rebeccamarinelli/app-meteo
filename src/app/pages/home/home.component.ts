import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { FavouritesService } from '../../services/favourites.service';
import { Chart } from 'chart.js/auto';
import { UtilityMeteoService } from '../../services/utility-meteo.service';
import { PopUpComponent } from '../../components/pop-up/pop-up.component';
import { ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';





@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,PopUpComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent {


  city: string = '';
  weatherData: any = null;
  error: string = '';
  chart: any;
  h2Text = 'Weather App';
  @ViewChild('popup') popup!: PopUpComponent;



  constructor(
    private weatherService: WeatherService,
    private favService:FavouritesService,
    private meteo: UtilityMeteoService){
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

    getWeather(){
      this.weatherService.getCoordinates(this.city).subscribe((res)=>{
    
        if(res.results && res.results.length > 0){
          const latitude = res.results[0].latitude;
          const longitude = res.results[0].longitude;
          this.weatherService.getWeather(latitude, longitude).subscribe((res)=>{
            this.weatherData = res.current_weather;
            this.error = '';
            const hourlyData = res.hourly;
            const labels = hourlyData.time.slice(0, 24); 
            const temperatures = hourlyData.temperature_2m.slice(0, 24);
        
            setTimeout(() => this.createChart(labels, temperatures), 10);
            console.log(this.weatherData)
            this.weatherData = {
              name: this.city, 
              temperature: res.current_weather.temperature,
              windSpeed: res.current_weather.windspeed,
              windDirection: res.current_weather.winddirection,
              humidity: res.hourly.relative_humidity_2m[0],  
              weatherCode: res.hourly.weathercode[0] ,
              description: this.getWeatherDescription(res.hourly.weathercode[0]),
              longitude: res.longitude,
              latitude: res.latitude     
            };
            console.log(this.weatherData)
          }),
          (error:any) => {
            this.error = 'Errore durante il recupero dei dati meteo';
          }
        }else {
          this.error = 'Città non trovata';
        }
      }),
      (error:any) => {
        this.error = 'Errore durante il recupero delle coordinate';
      }
    }

    // addFavoriteCity() {
    //   if (this.weatherData) {
    //     const favoriteCities = JSON.parse(localStorage.getItem(this.favService.storageKey) || '[]');
        
    //     const cityExists = favoriteCities.some((existingCity: { name: string; }) => 
    //       existingCity.name.toLowerCase() === this.weatherData.name.toLowerCase()
    //     );
    
    //     if (!cityExists) {
    //       this.favService.addFavoriteCity(this.weatherData);
    //       this.popup.open(`${this.capitalizeFirstLetter(this.weatherData.name)} è stata aggiunta alle città preferite!`);
    //     } else {
    //       this.popup.open(`${this.capitalizeFirstLetter(this.weatherData.name)} è già nelle città preferite.`);
    //     }
        
    //     console.log(this.weatherData);
    //   } else {
    //     this.popup.open('Inserisci una città valida.');
    //   }
    // }

    addFavoriteCity() {
      if (this.weatherData) {
        const favoriteCities = JSON.parse(localStorage.getItem(this.favService.storageKey) || '[]');
        
        const cityExists = favoriteCities.some((existingCity: { name: string; }) => 
          existingCity.name.toLowerCase() === this.weatherData.name.toLowerCase()
        );
    
        if (!cityExists) {
          this.favService.addFavoriteCity(this.weatherData);
          this.popup.open(`${this.capitalizeFirstLetter(this.weatherData.name)} è stata aggiunta alle città preferite!`);
        } else {
          this.popup.open(`${this.capitalizeFirstLetter(this.weatherData.name)} è già nelle città preferite.`);
        }
        
        console.log(this.weatherData);
      } else {
        this.popup.open('Inserisci una città valida.');
      }
    }
    

    resetSearch() {
      this.weatherData = null;  
      this.city = '';          
      this.error = ''; 
      if (this.chart) {
        this.chart.destroy();
      }     
    }


    createChart(labels: string[], data: number[]) {
      if (this.chart) {
        this.chart.destroy(); 
      }

      this.chart = new Chart('tempChart', {
        type: 'line',
        data: {
          labels: labels.map((label) => label.split('T')[1]), 
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: data,
              fill: true,
              borderColor: '#eea653',
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Ora',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Temperatura (°C)',
              },
            },
          },
        },
      });
    }

  

    onInputFocus() {
      this.h2Text = "Search for your favourite city";
    }

    onInputBlur() {
      this.h2Text = 'Weather App';
    }

}
