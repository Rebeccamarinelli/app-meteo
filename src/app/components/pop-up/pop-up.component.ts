import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpComponent {

  @Input() message: string = '';
  isVisible: boolean = false;

  open(message: string):void {
    this.message = message;
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
    setTimeout(()=>{
      this.isVisible = false;
      document.body.style.overflow = '';
    }, 2000)
   
  }

}
