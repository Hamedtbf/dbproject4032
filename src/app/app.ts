import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  // This 'imports' array is the crucial part. It makes the RouterOutlet available.
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // The title property is just a simple string, not a function.
  title = 'frontend';
}
