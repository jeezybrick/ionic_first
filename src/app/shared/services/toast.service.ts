import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    public toast;

    constructor(public toastController: ToastController) {}

    public async presentToast(message: string, color = 'primary') {
        this.toast = await this.toastController.create({
            message,
            color,
            duration: 3000,
        });
        await this.toast.present();
    }

    public async presentErrorToast(message: string = 'Что-то пошло не так :(') {
        this.toast = await this.toastController.create({
            message,
            color: 'danger',
            duration: 4000,
        });
        await this.toast.present();
    }

    public async dismissToast() {
        await this.toast.dismiss();
    }
}
