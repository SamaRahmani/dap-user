
// import { CommonModule } from '@angular/common';
// import { finalize } from 'rxjs';
// import {
//   Component,
//   OnInit,
//   inject,
//   ChangeDetectorRef
// } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, RouterLink } from '@angular/router';

// import {
//   Vehicle,
//   VehicleService
// } from '../../core/service/vehicle.service';

// import {
//   State,
//   City,
//   Rto,
//   LocationService
// } from '../../core/service/location.service';

// import {
//   Insurance,
//   InsuranceService
// } from '../../core/service/insurance.service';

// import {
//   DapCalculationService,
//   DapCalculationRequest,
//   DapCalculationResponse
// } from '../../core/service/dap-calculation.service';

// type CalculationMode = 'vehicle' | 'manual';
// type FormStep = 'details' | 'review';

// @Component({
//   selector: 'app-calculation',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './calculation.html',
//   styleUrl: './calculation.css'
// })
// export class Calculation implements OnInit {

//   private route = inject(ActivatedRoute);
//   private vehicleService = inject(VehicleService);
//   private locationService = inject(LocationService);
//   private insuranceService = inject(InsuranceService);
//   private dapCalculationService = inject(DapCalculationService);
//   private cdr = inject(ChangeDetectorRef);

//   mode: CalculationMode = 'vehicle';
//   step: FormStep = 'details';

//   vehicleId = '';
//   exShowroomPrice: number | null = null;

//   stateCode = '';
//   cityId: number | null = null;
//   rtoCode = '';
//   insuranceId = '';

//   vehicles: Vehicle[] = [];
//   states: State[] = [];
//   cities: City[] = [];
//   rtos: Rto[] = [];
//   insuranceProviders: Insurance[] = [];

//   loadingVehicles = false;
//   loadingStates = false;
//   loadingCities = false;
//   loadingRtos = false;
//   loadingInsurance = false;

//   vehicleError = '';
//   stateError = '';
//   cityError = '';
//   rtoError = '';
//   insuranceError = '';

//   // DAP calculation
//   isCalculating = false;
//   calculationError = '';
//   calculationResult: DapCalculationResponse | null = null;

//   ngOnInit(): void {
//     const routeMode = this.route.snapshot.paramMap.get('mode');

//     this.mode = routeMode === 'manual' ? 'manual' : 'vehicle';

//     if (this.mode === 'vehicle') {
//       this.loadVehicles();
//     }

//     this.loadStates();
//     this.loadInsuranceProviders();
//   }

//   // VEHICLES

//   loadVehicles(): void {
//     this.loadingVehicles = true;
//     this.vehicleError = '';

//     this.vehicleService.getVehicles().subscribe({
//       next: (data) => {
//         this.vehicles = data;
//         this.loadingVehicles = false;
//         this.cdr.markForCheck();
//       },
//       error: (error) => {
//         console.error('Unable to load vehicles:', error);
//         this.vehicleError = 'Unable to load vehicles. Please try again.';
//         this.loadingVehicles = false;
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   get selectedVehicle(): Vehicle | undefined {
//     return this.vehicles.find(
//       vehicle => vehicle.vehicleId === this.vehicleId
//     );
//   }

//   // STATES

//   loadStates(): void {
//     this.loadingStates = true;
//     this.stateError = '';

//     this.locationService.getStates().subscribe({
//       next: (data) => {
//         this.states = data;
//         this.loadingStates = false;
//         this.cdr.markForCheck();
//       },
//       error: (error) => {
//         console.error('Unable to load states:', error);
//         this.stateError = 'Unable to load states. Please try again.';
//         this.loadingStates = false;
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   get selectedState(): State | undefined {
//     return this.states.find(
//       state => state.stateCode === this.stateCode
//     );
//   }

//   // CITIES

//   onStateChange(stateCode: string): void {
//     this.stateCode = stateCode;

//     this.cityId = null;
//     this.rtoCode = '';

//     this.cities = [];
//     this.rtos = [];

//     this.loadingCities = false;
//     this.loadingRtos = false;

//     this.cityError = '';
//     this.rtoError = '';

//     if (stateCode) {
//       this.loadCities(stateCode);
//     }

//     this.cdr.markForCheck();
//   }

//   loadCities(stateCode: string): void {
//     this.loadingCities = true;
//     this.cityError = '';
//     this.cdr.markForCheck();

//     this.locationService.getCities(stateCode).subscribe({
//       next: (data) => {
//         this.cities = data;
//         this.loadingCities = false;
//         this.cdr.markForCheck();
//       },
//       error: (error) => {
//         console.error('Unable to load cities:', error);
//         this.cityError = 'Unable to load cities. Please try again.';
//         this.loadingCities = false;
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   get selectedCity(): City | undefined {
//     return this.cities.find(
//       city => city.cityId === this.cityId
//     );
//   }

//   // RTOS

//   onCityChange(cityId: number | null): void {
//     this.cityId = cityId;
//     this.rtoCode = '';

//     this.rtos = [];
//     this.loadingRtos = false;
//     this.rtoError = '';

//     if (cityId !== null) {
//       this.loadRtos(cityId);
//     }

//     this.cdr.markForCheck();
//   }

//   loadRtos(cityId: number): void {
//     this.loadingRtos = true;
//     this.rtoError = '';
//     this.cdr.markForCheck();

//     this.locationService.getRtos(cityId).subscribe({
//       next: (data) => {
//         this.rtos = data;
//         this.loadingRtos = false;
//         this.cdr.markForCheck();
//       },
//       error: (error) => {
//         console.error('Unable to load RTOs:', error);
//         this.rtoError = 'Unable to load RTOs. Please try again.';
//         this.loadingRtos = false;
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   get selectedRto(): Rto | undefined {
//     return this.rtos.find(
//       rto => rto.rtoCode === this.rtoCode
//     );
//   }

//   // INSURANCE

//   loadInsuranceProviders(): void {
//     this.loadingInsurance = true;
//     this.insuranceError = '';

//     this.insuranceService.getInsuranceProviders().subscribe({
//       next: (data) => {
//         this.insuranceProviders = data;
//         this.loadingInsurance = false;
//         this.cdr.markForCheck();
//       },
//       error: (error) => {
//         console.error('Unable to load insurance providers:', error);
//         this.insuranceError =
//           'Unable to load insurance providers. Please try again.';
//         this.loadingInsurance = false;
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   get selectedInsurance(): Insurance | undefined {
//     return this.insuranceProviders.find(
//       insurance => insurance.insuranceId === this.insuranceId
//     );
//   }

//   // PRICE AND VALIDATION

//   get displayedPrice(): number | null {
//     return this.mode === 'manual'
//       ? this.exShowroomPrice
//       : this.selectedVehicle?.exShowroomPrice ?? null;
//   }

//   get isFormValid(): boolean {
//     const vehicleValid = this.mode === 'vehicle'
//       ? !!this.vehicleId
//       : this.exShowroomPrice !== null && this.exShowroomPrice > 0;

//     return vehicleValid
//       && !!this.stateCode
//       && this.cityId !== null
//       && !!this.rtoCode
//       && !!this.insuranceId;
//   }

//   // REVIEW

//   continueToReview(): void {
//     if (!this.isFormValid) return;

//     this.step = 'review';
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     this.cdr.markForCheck();
//   }

//   editDetails(): void {
//     this.step = 'details';
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     this.cdr.markForCheck();
//   }

//   // DAP CALCULATION

  
// calculateDap(): void {
//   if (!this.isFormValid || this.isCalculating) {
//     return;
//   }

//   const state = this.selectedState;
//   const city = this.selectedCity;
//   const insurance = this.selectedInsurance;
//   const rto = this.selectedRto;
//   const vehicle = this.selectedVehicle;

//   if (!state || !city || !insurance || !rto) {
//     this.calculationError =
//       'Some selected information is missing. Please review your details.';
//     return;
//   }

//   if (this.mode === 'vehicle' && !vehicle) {
//     this.calculationError =
//       'Please select a valid vehicle before calculating.';
//     return;
//   }

//   const request: DapCalculationRequest = {
//     vehicle: this.mode === 'vehicle'
//       ? {
//           modelName: vehicle!.modelName,
//           variantName: vehicle!.variantName
//         }
//       : null,

//     exShowroomPrice: this.mode === 'manual'
//       ? this.exShowroomPrice
//       : null,

//     location: {
//       state: state.stateName,
//       city: city.cityName,
//       rtoCode: rto.rtoCode
//     },

//     insuranceProvider: insurance.providerName
//   };

//   this.isCalculating = true;
//   this.calculationError = '';
//   this.calculationResult = null;

//   console.log('DAP calculation started:', request);

//   this.dapCalculationService.calculateDap(request)
//     .pipe(
//       finalize(() => {
//         this.isCalculating = false;
//         this.cdr.detectChanges();

//         console.log('DAP calculation finished.');
//       })
//     )
//     .subscribe({
//       next: (response) => {
//         console.log('DAP API response:', response);

//         this.calculationResult = response;

//         this.cdr.detectChanges();

//         console.log('Calculation result updated:', this.calculationResult);
//       },

//       error: (error) => {
//         console.error('DAP calculation failed:', error);

//         this.calculationError =
//           error?.error?.message ||
//           error?.error?.detail ||
//           error?.error?.error ||
//           'Unable to calculate Drive Away Price. Please try again.';

//         this.cdr.detectChanges();
//       }
//     });
// }


//   startOver(): void {
//     this.vehicleId = '';
//     this.exShowroomPrice = null;

//     this.stateCode = '';
//     this.cityId = null;
//     this.rtoCode = '';
//     this.insuranceId = '';

//     this.cities = [];
//     this.rtos = [];

//     this.calculationResult = null;
//     this.calculationError = '';
//     this.isCalculating = false;

//     this.loadingCities = false;
//     this.loadingRtos = false;

//     this.step = 'details';
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     this.cdr.markForCheck();
//   }
// }


import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  Vehicle,
  VehicleService
} from '../../core/service/vehicle.service';

import {
  State,
  City,
  Rto,
  LocationService
} from '../../core/service/location.service';

import {
  Insurance,
  InsuranceService
} from '../../core/service/insurance.service';

import {
  DapCalculationService,
  DapCalculationRequest,
  DapCalculationResponse
} from '../../core/service/dap-calculation.service';

type CalculationMode = 'vehicle' | 'manual';
type FormStep = 'details' | 'review';

@Component({
  selector: 'app-calculation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './calculation.html',
  styleUrl: './calculation.css'
})
export class Calculation implements OnInit {

  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private locationService = inject(LocationService);
  private insuranceService = inject(InsuranceService);
  private dapCalculationService = inject(DapCalculationService);
  private cdr = inject(ChangeDetectorRef);

  // CALCULATION MODE AND STEP

  mode: CalculationMode = 'vehicle';
  step: FormStep = 'details';

  // FORM VALUES

  vehicleId = '';
  exShowroomPrice: number | null = null;

  stateCode = '';
  cityId: number | null = null;
  rtoCode = '';
  insuranceId = '';

  // MASTER DATA

  vehicles: Vehicle[] = [];
  states: State[] = [];
  cities: City[] = [];
  rtos: Rto[] = [];
  insuranceProviders: Insurance[] = [];

  // LOADING STATES

  loadingVehicles = false;
  loadingStates = false;
  loadingCities = false;
  loadingRtos = false;
  loadingInsurance = false;

  // ERROR STATES

  vehicleError = '';
  stateError = '';
  cityError = '';
  rtoError = '';
  insuranceError = '';

  // DAP CALCULATION

  isCalculating = false;
  calculationError = '';
  calculationResult: DapCalculationResponse | null = null;

  // INITIALIZATION

  ngOnInit(): void {
    const routeMode = this.route.snapshot.paramMap.get('mode');

    this.mode = routeMode === 'manual' ? 'manual' : 'vehicle';

    if (this.mode === 'vehicle') {
      this.loadVehicles();
    }

    this.loadStates();
    this.loadInsuranceProviders();
  }

  // VEHICLES

  loadVehicles(): void {
    this.loadingVehicles = true;
    this.vehicleError = '';

    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loadingVehicles = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Unable to load vehicles:', error);

        this.vehicleError =
          'Unable to load vehicles. Please try again.';

        this.loadingVehicles = false;
        this.cdr.markForCheck();
      }
    });
  }

  get selectedVehicle(): Vehicle | undefined {
    return this.vehicles.find(
      vehicle => vehicle.vehicleId === this.vehicleId
    );
  }

  // STATES

  loadStates(): void {
    this.loadingStates = true;
    this.stateError = '';

    this.locationService.getStates().subscribe({
      next: (data) => {
        this.states = data;
        this.loadingStates = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Unable to load states:', error);

        this.stateError =
          'Unable to load states. Please try again.';

        this.loadingStates = false;
        this.cdr.markForCheck();
      }
    });
  }

  get selectedState(): State | undefined {
    return this.states.find(
      state => state.stateCode === this.stateCode
    );
  }

  // CITIES

  onStateChange(stateCode: string): void {
    this.stateCode = stateCode;

    this.cityId = null;
    this.rtoCode = '';

    this.cities = [];
    this.rtos = [];

    this.loadingCities = false;
    this.loadingRtos = false;

    this.cityError = '';
    this.rtoError = '';

    this.clearCalculationResult();

    if (stateCode) {
      this.loadCities(stateCode);
    }

    this.cdr.markForCheck();
  }

  loadCities(stateCode: string): void {
    this.loadingCities = true;
    this.cityError = '';

    this.cdr.markForCheck();

    this.locationService.getCities(stateCode).subscribe({
      next: (data) => {
        this.cities = data;
        this.loadingCities = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Unable to load cities:', error);

        this.cityError =
          'Unable to load cities. Please try again.';

        this.loadingCities = false;
        this.cdr.markForCheck();
      }
    });
  }

  get selectedCity(): City | undefined {
    return this.cities.find(
      city => city.cityId === this.cityId
    );
  }

  // RTO

  onCityChange(cityId: number | null): void {
    this.cityId = cityId;
    this.rtoCode = '';

    this.rtos = [];
    this.loadingRtos = false;
    this.rtoError = '';

    this.clearCalculationResult();

    if (cityId !== null) {
      this.loadRtos(cityId);
    }

    this.cdr.markForCheck();
  }

  loadRtos(cityId: number): void {
    this.loadingRtos = true;
    this.rtoError = '';

    this.cdr.markForCheck();

    this.locationService.getRtos(cityId).subscribe({
      next: (data) => {
        this.rtos = data;
        this.loadingRtos = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Unable to load RTOs:', error);

        this.rtoError =
          'Unable to load RTOs. Please try again.';

        this.loadingRtos = false;
        this.cdr.markForCheck();
      }
    });
  }

  get selectedRto(): Rto | undefined {
    return this.rtos.find(
      rto => rto.rtoCode === this.rtoCode
    );
  }

  // INSURANCE

  loadInsuranceProviders(): void {
    this.loadingInsurance = true;
    this.insuranceError = '';

    this.insuranceService.getInsuranceProviders().subscribe({
      next: (data) => {
        this.insuranceProviders = data;
        this.loadingInsurance = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Unable to load insurance providers:', error);

        this.insuranceError =
          'Unable to load insurance providers. Please try again.';

        this.loadingInsurance = false;
        this.cdr.markForCheck();
      }
    });
  }

  get selectedInsurance(): Insurance | undefined {
    return this.insuranceProviders.find(
      insurance => insurance.insuranceId === this.insuranceId
    );
  }

  // PRICE AND VALIDATION

  get displayedPrice(): number | null {
    return this.mode === 'manual'
      ? this.exShowroomPrice
      : this.selectedVehicle?.exShowroomPrice ?? null;
  }

  get isFormValid(): boolean {
    const vehicleValid = this.mode === 'vehicle'
      ? !!this.vehicleId
      : this.exShowroomPrice !== null &&
        this.exShowroomPrice > 0;

    return vehicleValid
      && !!this.stateCode
      && this.cityId !== null
      && !!this.rtoCode
      && !!this.insuranceId;
  }

  // REVIEW

  continueToReview(): void {
    if (!this.isFormValid) {
      return;
    }

    this.step = 'review';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.cdr.markForCheck();
  }

  editDetails(): void {
    this.step = 'details';

    this.clearCalculationResult();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.cdr.markForCheck();
  }

  // CLEAR PREVIOUS CALCULATION

  private clearCalculationResult(): void {
    this.calculationResult = null;
    this.calculationError = '';
  }

  // DAP CALCULATION

  calculateDap(): void {

    if (!this.isFormValid || this.isCalculating) {
      return;
    }

    const state = this.selectedState;
    const city = this.selectedCity;
    const insurance = this.selectedInsurance;
    const rto = this.selectedRto;
    const vehicle = this.selectedVehicle;

    if (!state || !city || !insurance || !rto) {
      this.calculationError =
        'Some selected information is missing. Please review your details.';

      return;
    }

    if (this.mode === 'vehicle' && !vehicle) {
      this.calculationError =
        'Please select a valid vehicle before calculating.';

      return;
    }

    const request: DapCalculationRequest = {

      vehicle: this.mode === 'vehicle'
        ? {
            modelName: vehicle!.modelName,
            variantName: vehicle!.variantName
          }
        : null,

      exShowroomPrice: this.mode === 'manual'
        ? this.exShowroomPrice
        : null,

      location: {
        state: state.stateName,
        city: city.cityName,
        rtoCode: rto.rtoCode
      },

      insuranceProvider: insurance.providerName
    };

    this.isCalculating = true;
    this.calculationError = '';

    // Keep the previous result until a new response arrives.
    console.log('DAP calculation started:', request);

    this.dapCalculationService.calculateDap(request)
      .pipe(
        finalize(() => {
          this.isCalculating = false;
          this.cdr.detectChanges();

          console.log('DAP calculation finished.');
        })
      )
      .subscribe({
        next: (response) => {

          console.log('DAP API response:', response);

          this.calculationResult = response;

          this.cdr.detectChanges();

          console.log(
            'Calculation result updated:',
            this.calculationResult
          );
        },

        error: (error) => {

          console.error('DAP calculation failed:', error);

          this.calculationError =
            error?.error?.message ||
            error?.error?.detail ||
            error?.error?.error ||
            'Unable to calculate Drive Away Price. Please try again.';

          this.cdr.detectChanges();
        }
      });
  }

  // AMOUNT IN INDIAN WORDS

  getDapAmountInWords(amount: number): string {

    if (!Number.isFinite(amount) || amount < 0) {
      return 'Amount unavailable';
    }

    let rupees = Math.floor(amount);
    let paise = Math.round((amount - rupees) * 100);

    if (paise === 100) {
      rupees++;
      paise = 0;
    }

    const ones = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen'
    ];

    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety'
    ];

    const belowThousand = (num: number): string => {

      let words = '';

      if (num >= 100) {
        words += ones[Math.floor(num / 100)] + ' Hundred';

        num %= 100;

        if (num > 0) {
          words += ' ';
        }
      }

      if (num >= 20) {
        words += tens[Math.floor(num / 10)];

        if (num % 10 > 0) {
          words += ' ' + ones[num % 10];
        }
      } else if (num > 0) {
        words += ones[num];
      }

      return words;
    };

    const indianNumberToWords = (num: number): string => {

      if (num === 0) {
        return 'Zero';
      }

      const parts: string[] = [];

      const crore = Math.floor(num / 10000000);
      num %= 10000000;

      const lakh = Math.floor(num / 100000);
      num %= 100000;

      const thousand = Math.floor(num / 1000);
      num %= 1000;

      if (crore > 0) {
        parts.push(
          belowThousand(crore) + ' Crore'
        );
      }

      if (lakh > 0) {
        parts.push(
          belowThousand(lakh) + ' Lakh'
        );
      }

      if (thousand > 0) {
        parts.push(
          belowThousand(thousand) + ' Thousand'
        );
      }

      if (num > 0) {
        parts.push(
          belowThousand(num)
        );
      }

      return parts.join(' ');
    };

    let result = indianNumberToWords(rupees);

    if (paise > 0) {
      result +=
        ' and ' + indianNumberToWords(paise) + ' Paise';
    }

    return result + ' Only';
  }

  // START OVER

  startOver(): void {

    this.vehicleId = '';
    this.exShowroomPrice = null;

    this.stateCode = '';
    this.cityId = null;
    this.rtoCode = '';
    this.insuranceId = '';

    this.cities = [];
    this.rtos = [];

    this.calculationResult = null;
    this.calculationError = '';
    this.isCalculating = false;

    this.loadingCities = false;
    this.loadingRtos = false;

    this.cityError = '';
    this.rtoError = '';

    this.step = 'details';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.cdr.markForCheck();
  }
}


