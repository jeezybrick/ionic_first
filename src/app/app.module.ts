import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthHeaderInterceptor } from './shared/interceptors/header.interceptor';
import { socketConfig, SocketService } from './shared/services/socket.service';
import { SocketIoModule } from 'ngx-socket-io';
import { NgxStripeModule } from 'ngx-stripe';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(socketConfig),
    NgxStripeModule.forRoot('pk_test_51H2EoUEW52dlACmR09FDqCahZlArzqD6oGJExz54fUIOWH7x1QaxsSyx5Xu6ExGaIc5zuRkuhQfwob5kICOnZOaj00WDpWYgYi'),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => null,
      deps: [SocketService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
