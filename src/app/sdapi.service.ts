import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SdapiService {
  private apiUrl = '/internal'
  private parameterMap: { [name: string]: string } = {};
  public httpOptions: { headers: HttpHeaders };
  private token: string = "";
  private uip : string = "0";
  constructor(
    private http: HttpClient,
  ){
    /* this.getIP(); */
    this.getCookie();
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      })
    };
  }
  ngOnInit() {
    
  }

  calli2i(mode: number, base64img : string, extraPromts: string, facePromts: string, denoise:  number ): Observable<any>{
    const partialPayload = {image: base64img, i2imode: mode, extras: extraPromts, face: facePromts, weight: denoise};
    return this.http.post(this.apiUrl+"/img2img", partialPayload, this.httpOptions);
  }

  getServerStatus(): Observable<any>{
    return this.http.get(this.apiUrl+"/progress", this.httpOptions);
  }

  getRecentGens(): Observable<any>{
      return this.http.get(this.apiUrl+"/pastgens", this.httpOptions);
  }
  
  verifyConnection(): Observable<any> {
    return this.http.get("https://api.ipify.org?format=json").pipe(
      mergeMap((result: any) => {
        if (!this.token) {
          return this.http.post(this.apiUrl + '/register', { ip: result.ip }, this.httpOptions);
        } else {
          return this.http.post(this.apiUrl + '/verify', { ip: result.ip }, this.httpOptions);
        }
      })
    );
  }

  setHeader(newtoken: string){
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': newtoken
      })
    };
  }

  getIP(): Observable<any> {
    return this.http.get('https://api.ipify.org?format=json'); 
/*     this.http.get('https://api.ipify.org?format=json').subscribe({
      next: (result: any) => {
        this.uip = result.ip;
      },
      error: (e) => {
        console.log(e);
      }
    }); */
  }

  getCookie(): void {
    if (document.cookie) {
      const paramList = document.cookie.split(';');
      paramList.forEach(parameter => {
        const values = parameter.trim().split('=');
        this.parameterMap[values[0].trim()] = values[1].trim();
      });
    }
    if (this.parameterMap.hasOwnProperty("Token")) {
      this.token =  this.parameterMap["Token"];
    }
  }
  
  saveCookie(newtoken: string): void {
    if(newtoken){
      let cookieString = `Token=${newtoken}; `;
      let date = new Date();
      date.setFullYear(date.getFullYear() + 2);
      document.cookie = cookieString  + "domain=."+document.location.hostname+";path=/;expires="+date.toUTCString()+";";
    }
  }
}