import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { CarService, Car } from './car.service';
import { DATA } from './MOCK_DATA';

describe('CarService', () => {
  let service: CarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with mock data', () => {
    service.getCars().pipe(take(1)).subscribe(cars => {
      expect(cars).toEqual(DATA);
      expect(cars.length).toBeGreaterThan(0);
    });
  });

  describe('getCars', () => {
    it('should return BehaviorSubject with car data', () => {
      const result = service.getCars();

      expect(result).toBeDefined();
      result.pipe(take(1)).subscribe(cars => {
        expect(Array.isArray(cars)).toBe(true);
        expect(cars.length).toBe(DATA.length);
      });
    });
  });

  describe('clear', () => {
    it('should reset data$ to original DATA', () => {
      // First modify the data
      service.getCarsByMake('Toyota');

      // Verify data is filtered
      service.getCars().pipe(take(1)).subscribe(cars => {
        expect(cars.length).toBeLessThan(DATA.length);
      });

      // Clear the data
      service.clear();

      // Verify data is reset to original
      service.getCars().pipe(take(1)).subscribe(cars => {
        expect(cars).toEqual(DATA);
        expect(cars.length).toBe(DATA.length);
      });
    });
  });

  describe('getCarsByMake', () => {
    it('should filter cars by make (case insensitive)', () => {
      const targetMake = 'Toyota';

      service.getCarsByMake(targetMake);

      service.getCars().pipe(take(1)).subscribe(cars => {
        expect(cars.length).toBeGreaterThan(0);
        cars.forEach(car => {
          expect(car.make.toLowerCase()).toBe(targetMake.toLowerCase());
        });
      });
    });

    it('should handle case insensitive search', () => {
      service.getCarsByMake('TOYOTA');

      service.getCars().pipe(take(1)).subscribe(cars => {
        expect(cars.length).toBeGreaterThan(0);
        cars.forEach(car => {
          expect(car.make.toLowerCase()).toBe('toyota');
        });
      });
    });

    it('should return empty array for non-existent make', () => {
      service.getCarsByMake('NonExistentMake');

      service.getCars().pipe(take(1)).subscribe(cars => {
        expect(cars.length).toBe(0);
      });
    });
  });

  describe('getAllCars', () => {
    it('should return distinct cars by make', (done) => {
      const receivedMakes: string[] = [];

      service.getAllCars().subscribe(car => {
        receivedMakes.push(car.make);
      }, null, () => {
        // Check that all makes are unique
        const uniqueMakes = [...new Set(receivedMakes)];
        expect(receivedMakes.length).toBe(uniqueMakes.length);
        done();
      });
    });

    it('should emit individual car objects', (done) => {
      let carCount = 0;

      service.getAllCars().subscribe(car => {
        expect(car.id).toBeDefined();
        expect(car.make).toBeDefined();
        expect(car.model).toBeDefined();
        expect(car.year).toBeDefined();
        expect(car.vin).toBeDefined();
        expect(typeof car.id).toBe('string');
        expect(typeof car.make).toBe('string');
        expect(typeof car.model).toBe('string');
        expect(typeof car.year).toBe('number');
        carCount++;
      }, null, () => {
        expect(carCount).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('remove', () => {
    it('should remove car by id and update data$', () => {
      const initialLength = DATA.length;
      const carToRemove = DATA[0];

      service.remove(carToRemove.id);

      service.getCars().pipe(take(1)).subscribe(cars => {
        expect(cars.length).toBe(initialLength - 1);
        expect(cars.find(car => car.id === carToRemove.id)).toBeUndefined();
      });
    });

    it('should not affect data if id does not exist', () => {
      const initialLength = DATA.length;

      service.remove('non-existent-id');

      service.getCars().pipe(take(1)).subscribe(cars => {
        expect(cars.length).toBe(initialLength);
      });
    });

    it('should update internal data property', () => {
      const carToRemove = DATA[0];
      const initialLength = service.data.length;

      service.remove(carToRemove.id);

      expect(service.data.length).toBe(initialLength - 1);
      expect(service.data.find(car => car.id === carToRemove.id)).toBeUndefined();
    });
  });
});
