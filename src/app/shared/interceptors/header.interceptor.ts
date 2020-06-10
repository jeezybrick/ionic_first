import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TokenStorage } from '../services/token.storage';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header
        const token = new TokenStorage();
        const tokenVal = token.getToken();

        const newUrl = req.url.includes('http')
            ? req.url
            : environment.api + req.url;

        const clonedRequest = req.clone({
            url: newUrl,
            headers: req
                .headers
                .set('Authorization', tokenVal ? `Bearer ${tokenVal}` : '')
        });

        return next.handle(clonedRequest);
    }
}
