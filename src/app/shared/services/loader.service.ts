import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private loader;

    constructor(private loadingController: LoadingController) {}

    public async presentLoading(message: string = 'Загрузка...') {
        this.loader = await this.loadingController.create({
            message,
        });

        await this.loader.present();
    }

    public async dismissLoading() {
        await this.loader.dismiss();
    }

}
