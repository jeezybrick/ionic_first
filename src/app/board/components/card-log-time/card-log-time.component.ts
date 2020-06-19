import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BoardService } from '../../../shared/services/board.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Card } from '../../../shared/models/card.model';
import { SubSink } from 'subsink';
import { finalize } from 'rxjs/operators';
import { User } from '../../../shared/models/user.model';
import { CardService } from '../../../shared/services/card.service';
import { CardLogTimeSubmitDataInterface } from '../../../shared/interfaces/card-log-time-submit-data.interface';

@Component({
  selector: 'app-card-log-time',
  templateUrl: './card-log-time.component.html',
  styleUrls: ['./card-log-time.component.scss'],
})
export class CardLogTimeComponent implements OnInit, OnDestroy {
  public logTimeValues: { value: string; viewValue: string; }[] = [
    {
      value: 'm',
      viewValue: 'Минут',
    },
    {
      value: 'h',
      viewValue: 'Часов',
    },
  ];
  public logTimeForm: FormGroup;
  private subs = new SubSink();

  @Input() card: Card;

  constructor(public modalController: ModalController,
              private cardService: CardService,
              private fb: FormBuilder,
              private toastService: ToastService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.logTimeForm = this.fb.group({
      date: [new Date().toISOString(), Validators.required],
      workedValue: [0, Validators.required],
      workedSuffix: [this.logTimeValues[0].value, Validators.required],
      estimateValue: [null, Validators.required],
      estimateSuffix: [null, Validators.required],
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public dismiss(data?) {
    this.modalController.dismiss(data);
  }

  public async submit() {
    await this.loaderService.presentLoading('Сохранение...');
    const data: CardLogTimeSubmitDataInterface = {
      ...this.logTimeForm.value,
      date: new Date(this.logTimeForm.value.date).toISOString(),
    };

    this.subs.sink = this.cardService.logTime(this.card._id, data)
        .pipe(finalize(() => this.loaderService.dismissLoading()))
        .subscribe((response: Card) => {
          this.dismiss(response);
          this.toastService.presentToast('Время успешно залогировано');
        }, (error) => {
          this.toastService.presentErrorToast();
        });
  }


}
