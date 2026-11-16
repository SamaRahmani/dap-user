import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';
import { CalculatorHome } from './features/calculator-home/calculator-home';
import { Calculation } from './features/calculation/calculation';

import { authGuard } from './core/service/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  {
    path: 'calculator',
    component: CalculatorHome,
    canActivate: [authGuard]
  },
  {
    path: 'calculator/:mode',
    component: Calculation,
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: '' }
];