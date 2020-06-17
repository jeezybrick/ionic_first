import { Injectable, OnDestroy } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';
import { TokenStorage } from './token.storage';
import { SubSink } from 'subsink';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

export const socketConfig: SocketIoConfig = {
  url: environment.api,
  options: {}
};

const attachedToBoard = 'attachedToBoard';
const deAttachedFromBoard = 'deAttachedFromBoard';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket implements OnDestroy {
  private subs = new SubSink();

  constructor(private tokenStorage: TokenStorage,
              private socket: Socket,
              private toastService: ToastService,
              private authService: AuthService,
  ) {
    super({
      url: socketConfig.url,
      options: {
        ...socketConfig.options,
        transportOptions: {
          polling: {
            extraHeaders: {
              // Authorization: tokenStorage.getToken()
            }
          }
        }
      }
    });

    this.subs.add(
        this.socket.fromEvent(attachedToBoard).subscribe((res) => {
          console.log(res);
          this.toastService.presentToast('Вы были добавлены к доске');
        }),
        this.socket.fromEvent(deAttachedFromBoard).subscribe((res) => {
          console.log(res);
          this.toastService.presentToast('Вы были удалены с доски');
        }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
