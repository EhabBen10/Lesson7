# Copilot Instructions for Car List Angular Application

## Architecture Overview

This is an Angular 14 application showcasing a car listing system with filtering capabilities. The app uses lazy-loaded modules and reactive state management patterns.

### Key Components Structure
- **AppModule**: Root module with routing to lazy-loaded `ListModule`
- **ListModule**: Feature module containing car listing functionality (`src/app/list/`)
  - `ListComponent`: Main container displaying car list
  - `FilterComponent`: Reactive form for filtering cars by make
  - `ItemComponent`: Individual car display with remove functionality

### State Management Pattern
The app uses **BehaviorSubject-based state management** via `CarService`:
- `data$` is the single source of truth for car data
- All filtering/removal operations update this central observable
- Components subscribe to reactive streams rather than holding local state

```typescript
// CarService pattern - always mutate data$ for state changes
getCarsByMake(make: string) {
  this.data$.next(DATA.filter(c => c.make.toLowerCase() === make.toLowerCase()))
}
```

## Development Workflows

### Running the Application
```bash
ng serve -o          # Start dev server and open browser
ng test              # Run unit tests with Karma
ng build             # Production build
```

### Testing Patterns
When testing components that depend on `CarService` or use `ReactiveFormsModule`:

```typescript
// Required imports for form-based components
import { ReactiveFormsModule } from '@angular/forms';
import { CarService } from 'src/app/car.service';

// Mock CarService in tests
const mockCarService = jasmine.createSpyObj('CarService', ['getAllCars', 'getCarsByMake', 'clear']);
mockCarService.getAllCars.and.returnValue(of(mockCarObject));

TestBed.configureTestingModule({
  imports: [ReactiveFormsModule], // Always needed for components using FormBuilder
  providers: [{ provide: CarService, useValue: mockCarService }]
});
```

## Project-Specific Conventions

### Import Paths
- Use `src/app/` prefix for service imports: `import { CarService } from 'src/app/car.service'`
- Relative imports for same-module components: `import { FilterComponent } from './filter.component'`

### Data Flow Pattern
1. **FilterComponent** triggers filtering via form changes
2. **CarService** updates `data$` BehaviorSubject
3. **ListComponent** reactively displays filtered results
4. **ItemComponent** emits removal events back to parent

### Mock Data
- `MOCK_DATA.ts` contains 1000+ car records with realistic data
- Each car has: `id`, `make`, `model`, `year`, `vin`
- Used as the base dataset for all filtering operations

### Key Files to Understand
- `src/app/car.service.ts` - Central state management
- `src/app/list/list.module.ts` - Feature module configuration
- `src/app/MOCK_DATA.ts` - Static data source
- `src/app/app-routing.module.ts` - Lazy loading setup

## Common Patterns

### Reactive Forms
All forms use `FormBuilder` and reactive patterns:
```typescript
selectMakeForm = this.fb.group({
  make: ['']
})
```

### Observable Data Streams
Components subscribe to observables rather than holding state:
```typescript
cars$: Observable<ReadonlyArray<Car>> = this.carService.getCars()
```

### Event Communication
Parent-child communication uses `@Input()` and `@Output()` patterns:
```typescript
@Input() car!: Car
@Output() remove = new EventEmitter<string>()
```
