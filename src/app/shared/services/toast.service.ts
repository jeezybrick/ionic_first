import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

const toastCommonConfig: any = {
    position: 'top',
    buttons: [{
        icon: 'close',
        role: 'cancel'
    }]
};

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    public toast;

    constructor(public toastController: ToastController) {
    }

    public async presentToast(message: string, color = 'primary') {
        this.toast = await this.toastController.create({
            ...toastCommonConfig,
            message,
            color,
        });
        await this.toast.present();
    }

    public async presentErrorToast(message: string = 'Что-то пошло не так :(') {
        this.toast = await this.toastController.create({
            ...toastCommonConfig,
            message,
            color: 'danger',
        });
        await this.toast.present();
    }

    public async dismissToast() {
        await this.toast.dismiss();
    }
}
