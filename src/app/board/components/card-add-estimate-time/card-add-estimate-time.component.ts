import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Card } from '../../../shared/models/card.model';
import { SubSink } from 'subsink';
import { finalize } from 'rxjs/operators';
import { CardService, logTimeValues } from '../../../shared/services/card.service';
import { CardLogTimeSuffixType } from '../../../shared/interfaces/card-log-time-submit-data.interface';
import { CardEstimateTimeSubmitDataInterface } from '../../../shared/interfaces/card-estimate-time-submit-data.interface';

@Component({
  selector: 'app-card-add-estimate-time',
  templateUrl: './card-add-estimate-time.component.html',
  styleUrls: ['./card-add-estimate-time.component.scss'],
})
export class CardAddEstimateTimeComponent implements OnInit, OnDestroy {
  public logTimeValues: { value: CardLogTimeSuffixType; viewValue: string; }[] = [...logTimeValues];
  public estimateTimeForm: FormGroup;
  private subs = new SubSink();

  @Input() card: Card;

  constructor(public modalController: ModalController,
              private cardService: CardService,
              private fb: FormBuilder,
              private toastService: ToastService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.estimateTimeForm = this.fb.group({
      value: [this.card.estimateTime ? this.card.estimateTime.value : null],
      suffix: [this.card.estimateTime ? this.card.estimateTime.suffix : this.logTimeValues[0].value, Validators.required],
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
    const data: CardEstimateTimeSubmitDataInterface = {
      ...this.estimateTimeForm.value,
    };

    this.subs.sink = this.cardService.estimateTime(this.card._id, data)
        .pipe(finalize(() => this.loaderService.dismissLoading()))
        .subscribe((response: Card) => {
          this.dismiss(response);
          this.toastService.presentToast('Время успешно сохранено');
        }, (error) => {
          this.toastService.presentErrorToast();
        });
  }


}
