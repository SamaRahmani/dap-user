import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calculator-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './calculator-home.html',
  styleUrl: './calculator-home.css'
})
export class CalculatorHome {}