import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComponent } from './item.component';
import { Car } from 'src/app/car.service';
import { first } from 'rxjs/operators';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let expectedCar: Car;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    expectedCar = {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      vin: 'ABC123'
    };
    component.car = expectedCar;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit car id when removeClicked is called', () => {
    let emittedId: string | undefined;
    component.remove.subscribe((id: string) => {
      emittedId = id;
    });

    component.removeClicked();

    expect(emittedId).toBe(expectedCar.id);
  });

  it('should display the right items in the html', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const makeElement = compiled.querySelector('.make');
    const modelElement = compiled.querySelector('.model');
    const yearElement = compiled.querySelector('.year');
    const vinElement = compiled.querySelector('.vin');


    expect(makeElement?.textContent).toBe(expectedCar.make);
    expect(modelElement?.textContent).toBe(expectedCar.model);
    expect(yearElement?.textContent).toBe(expectedCar.year.toString());
    expect(vinElement?.textContent).toBe(expectedCar.vin.toString());
  });
});
