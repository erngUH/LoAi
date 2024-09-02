import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TipComponent } from './tip/tip.component';
import { MainComponent } from './main/main.component';
import { AllComponent } from './all/all.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TipComponent,
    MainComponent,
/*     AllComponent, */
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: '../styles.css'
})
export class AppComponent {
}


