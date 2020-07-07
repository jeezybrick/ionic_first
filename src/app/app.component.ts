import { Component, ElementRef, ViewChild } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BoardService } from './shared/services/board.service';
import { ToastService } from './shared/services/toast.service';
import { TwilioService } from './shared/services/twilio.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  message: string;
  accessToken: string;
  roomName: string;
  username: string;

  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;


  ngOnInit() {
    this.twilioService.localVideo = this.localVideo;
    this.twilioService.remoteVideo = this.remoteVideo;
  }

  log(message) {
    this.message = message;
  }

  disconnect() {
    if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
      this.twilioService.roomObj.disconnect();
      this.twilioService.roomObj = null;
    }
  }

  connect(): void {
    debugger;
    const storage = JSON.parse(localStorage.getItem('token') || '{}');
    const date = Date.now();
    if (!this.roomName || !this.username) { this.message = 'enter username and room name.'; return; }
    if (storage.token && storage.created_at + 3600000 > date) {
      this.accessToken = storage.token;
      this.twilioService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } });
      return;
    }
    this.twilioService.getToken(this.username).subscribe(d => {
          this.accessToken = d.token;
          localStorage.setItem('token', JSON.stringify({
            token: this.accessToken,
            created_at: date
          }));
          this.twilioService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } });
        },
        error => this.log(JSON.stringify(error)));

  }
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private boardService: BoardService,
    private toastService: ToastService,
    private twilioService: TwilioService,
  ) {
    this.initializeApp();
    this.twilioService.msgSubject.subscribe(r => {
      this.message = r;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.boardService.startPollingInviteToBoard().subscribe((value) => {
        this.toastService.presentToast('Вы были добавлены к одной или несколим доскам');
      });
    });
  }
}
