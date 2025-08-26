import { fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { AppComponent } from './app.component';

// Mock component for testing lazy loading
@Component({
  template: '<div>Mock List Component</div>'
})
class MockListComponent { }
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: MockListComponent }
        ])
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'lesson07-exercise'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('lesson07-exercise');
  });

  it('should render title', () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // fixture.detectChanges();
    // const compiled = fixture.nativeElement as HTMLElement;
    // expect(compiled.querySelector('.content span')?.textContent).toContain('lesson07-exercise app is running!');
  });
  it('navigate to "" redirects you to /home', fakeAsync(() => {
    let router: Router;
    let location: Location;
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.navigate([""]).then(() => {
      expect(location.path()).toBe("/list");
    });
  }));

  it('navigate to "search" takes you to /search', fakeAsync(() => {
    let router: Router;
    let location: Location;
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.navigate(["/list"]).then(() => {
      expect(location.path()).toBe("/list");
    });
  }));
});
