import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})

export class MembersService {
  baseUrl = environment.apiUrl
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>
  constructor(private http: HttpClient) { }

  getMembers(page?: number, itemsPerPage?: number){
    let params = new HttpParams();

    if(page && itemsPerPage){
      params = params.append('pageNumber',page);
      params = params.append('pageSize',itemsPerPage);
    }

    // if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users', {observe:'response',params}).pipe(
      map(response =>{
        if(response.body){
          this.paginatedResult.result =response.body;
        }
        const pagination = response.headers.get('Pagination');
        if(pagination){
          this.paginatedResult.pagination =JSON.parse(pagination)
        }
        return this.paginatedResult
      })
    );
  }

  getMember(username: string) : Observable<Member>{
    const member = this.members.find(x => x.username === username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl+'users/'+username);
  }

  updateMemeber(member: Member){
    return this.http.put(this.baseUrl + 'users',member).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members[index]= {...this.members[index], ...member};
      })
    );
  }

  setMainPhoto(photoId: number): Observable<Object>{
    return this.http.put(this.baseUrl, 'users/set-main-photo/'+photoId,{})
  }

  delatePhoto(photoId: number): Observable<Object>{
    return this.http.delete(this.baseUrl + 'users/delete-photo/'+photoId);
  }
}