import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { Car, CarService } from '../car.service';

import { ListComponent } from './list.component';
import { FilterComponent } from './filter/filter.component';
import { ItemComponent } from './item/item.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let carServiceSpy: jasmine.SpyObj<CarService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CarService', ['getCars', 'remove', 'getAllCars', 'getCarsByMake', 'clear']);

    await TestBed.configureTestingModule({
      declarations: [
        ListComponent,
        FilterComponent,
        ItemComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [{
        provide: CarService, useValue: spy
      }]
    })
      .compileComponents();

    carServiceSpy = TestBed.inject(CarService) as jasmine.SpyObj<CarService>;
  });

  beforeEach(() => {
    // Set up mock return values
    carServiceSpy.getCars.and.returnValue(new BehaviorSubject<ReadonlyArray<Car>>([]));
    carServiceSpy.getAllCars.and.returnValue(of({ id: '1', make: 'Toyota', model: 'Camry', year: 2020, vin: 'ABC123' }));

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call carService.remove when remove is called', () => {
    const testId = "12";

    component.remove(testId);

    expect(carServiceSpy.remove).toHaveBeenCalledWith(testId);
  });

  it('should display "Available cars" heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h2');

    expect(heading?.textContent).toBe('Available cars');
  });

  it('should render app-filter component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const filterComponent = compiled.querySelector('app-filter');

    expect(filterComponent).toBeTruthy();
  });

  it('should render no app-item components when cars list is empty', () => {
    // cars$ is already set to empty array in beforeEach
    const compiled = fixture.nativeElement as HTMLElement;
    const itemComponents = compiled.querySelectorAll('app-item');

    expect(itemComponents.length).toBe(0);
  });

  it('should render correct number of app-item components when cars are present', () => {
    // Create mock cars
    const mockCars: Car[] = [
      { id: '1', make: 'Toyota', model: 'Camry', year: 2020, vin: 'ABC123' },
      { id: '2', make: 'Honda', model: 'Civic', year: 2021, vin: 'DEF456' },
      { id: '3', make: 'Ford', model: 'Mustang', year: 2022, vin: 'GHI789' }
    ];

    // Update the mock to return cars
    carServiceSpy.getCars.and.returnValue(new BehaviorSubject<ReadonlyArray<Car>>(mockCars));

    // Recreate component with new data
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const itemComponents = compiled.querySelectorAll('app-item');

    expect(itemComponents.length).toBe(3);
  });

  it('should pass correct car data to app-item components', () => {
    const mockCars: Car[] = [
      { id: '1', make: 'Toyota', model: 'Camry', year: 2020, vin: 'ABC123' },
      { id: '2', make: 'Honda', model: 'Civic', year: 2021, vin: 'DEF456' }
    ];

    carServiceSpy.getCars.and.returnValue(new BehaviorSubject<ReadonlyArray<Car>>(mockCars));

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const makeElements = compiled.querySelectorAll('.make');
    const modelElements = compiled.querySelectorAll('.model');

    expect(makeElements.length).toBe(2);
    expect(makeElements[0]?.textContent?.trim()).toBe('Toyota');
    expect(makeElements[1]?.textContent?.trim()).toBe('Honda');
    expect(modelElements[0]?.textContent?.trim()).toBe('Camry');
    expect(modelElements[1]?.textContent?.trim()).toBe('Civic');
  });
});
