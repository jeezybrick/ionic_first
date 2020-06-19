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
      worked: [0, Validators.required],
      workedTimeSuffix: [this.logTimeValues[0].value, Validators.required],
      estimate: [null, Validators.required],
      estimateTimeSuffix: [null, Validators.required],
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

    setTimeout(() => {
      this.loaderService.dismissLoading();
      this.toastService.presentToast('Время успешно залогировано');
      this.dismiss();
    }, 1000);


    // this.subs.sink = this.boardService.addUsersToBoard(this.board._id, this.selectedUsers.map(item => item._id))
    //     .pipe(finalize(() => this.loaderService.dismissLoading()))
    //     .subscribe((response: User[]) => {
    //       this.dismiss(response);
    //       this.toastService.presentToast('Пользователи упешно добавлены');
    //     }, (error) => {
    //       this.toastService.presentErrorToast();
    //     });
  }


}
