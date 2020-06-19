import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardAddEstimateTimeComponent } from './card-add-estimate-time.component';

describe('CardAddEstimateTimeComponent', () => {
  let component: CardAddEstimateTimeComponent;
  let fixture: ComponentFixture<CardAddEstimateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAddEstimateTimeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardAddEstimateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
