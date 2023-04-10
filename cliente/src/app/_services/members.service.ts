import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { User } from '../_models/user';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})

export class MembersService {
  baseUrl = environment.apiUrl
  members: Member[] = [];
  memebersCache = new Map();
  user: User | undefined
  userParams : UserParams | undefined;
  
  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    });
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params
  }

  resetUserParams(){
    if(this.user){
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return
  }

  getMembers(userParams: UserParams){
    const response = this.memebersCache.get(Object.values(userParams).join('-'))
    if(response) return of(response);
    
    let params = this.getPaginationHeaders(userParams.pageNumber,userParams.pageSize);
    
    params = params.append('minAge',userParams.minAge);
    params= params.append('maxAge',userParams.maxAge);
    params = params.append('gender',userParams.gender);
    params = params.append('orderBy',userParams.orderBy);

    // if(this.members.length > 0) return of(this.members);
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params).pipe(
      map(response => {
        this.memebersCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(username: string) : Observable<Member>{
    const member = [...this.memebersCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result),[])
      .find((member: Member) => member.username === username);

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

  private getPaginatedResult<T>(url: string,params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize:number) {
    let params = new HttpParams();

    params = params.append('pageNumber',pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }

  setMainPhoto(photoId: number): Observable<Object>{
    return this.http.put(this.baseUrl, 'users/set-main-photo/'+photoId,{})
  }

  delatePhoto(photoId: number): Observable<Object>{
    return this.http.delete(this.baseUrl + 'users/delete-photo/'+photoId);
  }
}