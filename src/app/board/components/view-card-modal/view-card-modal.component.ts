import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../../../shared/services/toast.service';
import { CardService } from '../../../shared/services/card.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Card } from '../../../shared/models/card.model';

@Component({
  selector: 'app-view-card-modal',
  templateUrl: './view-card-modal.component.html',
  styleUrls: ['./view-card-modal.component.scss'],
})
export class ViewCardModalComponent implements OnInit {
  @Input() card: Card;

  constructor(public modalController: ModalController,
              private toastService: ToastService,
              private cardService: CardService,
              private loaderService: LoaderService) {}

  ngOnInit() {}

  public dismiss(data?) {
    this.modalController.dismiss(data);
  }

}
