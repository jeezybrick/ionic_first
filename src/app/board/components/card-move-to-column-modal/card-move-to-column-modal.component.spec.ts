import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardMoveToColumnModalComponent } from './card-move-to-column-modal.component';

describe('CardMoveToColumnModalComponent', () => {
  let component: CardMoveToColumnModalComponent;
  let fixture: ComponentFixture<CardMoveToColumnModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardMoveToColumnModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardMoveToColumnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
