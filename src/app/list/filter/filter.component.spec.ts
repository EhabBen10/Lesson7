import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { FilterComponent } from './filter.component';
import { CarService, Car } from 'src/app/car.service';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let userServiceStub: Partial<CarService>;

  beforeEach(async () => {
    const mockCar: Car = {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      vin: 'ABC123'
    };

    userServiceStub = {
      getAllCars: jasmine.createSpy('getAllCars').and.returnValue(of(mockCar)),
      getCarsByMake: jasmine.createSpy('getCarsByMake'),
      clear: jasmine.createSpy('clear')
    };

    await TestBed.configureTestingModule({
      declarations: [FilterComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: CarService, useValue: userServiceStub }],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call carService.getCarsByMake when makeSelected is called', () => {
    const mockEvent = {
      target: {
        value: 'Toyota'
      }
    };

    component.makeSelected(mockEvent);

    expect(userServiceStub.getCarsByMake).toHaveBeenCalledWith('Toyota');
  });

  it('should reset form and call carService.clear when clear is called', () => {
    // First set a value to the form to test reset
    component.selectMakeForm.patchValue({ make: 'Toyota' });
    expect(component.selectMakeForm.get('make')?.value).toBe('Toyota');

    // Call the clear method
    component.clear();

    // Verify form is reset
    expect(component.selectMakeForm.get('make')?.value).toBeNull();

    // Verify service clear method was called
    expect(userServiceStub.clear).toHaveBeenCalled();
  });


});
