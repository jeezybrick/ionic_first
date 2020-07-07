import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TwilioMyComponent } from './twilio-my.component';

describe('TwilioMyComponent', () => {
  let component: TwilioMyComponent;
  let fixture: ComponentFixture<TwilioMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwilioMyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TwilioMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
