import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]>{
    return this.http.get<Member[]>(this.baseUrl+'users',this.getHttpOptions());
  }

  getMember(username: string) : Observable<Member>{
    return this.http.get<Member>(this.baseUrl+'users/'+username,this.getHttpOptions());
  }

  getHttpOptions(): {headers: HttpHeaders;} | undefined{
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user = JSON.parse(userString);
    return{
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    };
  }
}