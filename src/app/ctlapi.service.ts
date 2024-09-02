import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CtlapiService {

  private apiUrl = '/ctl'
  constructor(
    private http: HttpClient
  ) { 
  }
  getcount(): Observable<any>{
    return this.http.get(this.apiUrl+"/getcount/");
  }
  getGenerations(index : number): Observable<any>{
    return this.http.get(this.apiUrl+"/generations/"+index);
  }
  searchFilter(id : string): Observable<any>{
    return this.http.get(this.apiUrl+"/gens/"+id);
  }
  getFullGeneration(genID : string): Observable<any>{
    return this.http.get(this.apiUrl+"/gen/"+genID);
  }
}
