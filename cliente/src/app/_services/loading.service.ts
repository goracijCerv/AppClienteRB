import { Injectable } from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingRequestCount =0;
  
  constructor(private spinnerService: NgxSpinnerService) { }

  loading(): void{
    this.loadingRequestCount++;
    this.spinnerService.show(undefined,{
      type: 'fire',
      bdColor:'rgba(0,0,0,0)',
      color: '#b026ff'
    });
  }

  idle(): void {
    this.loadingRequestCount--;
    if(this.loadingRequestCount <=0){
      this.loadingRequestCount=0;
      this.spinnerService.hide();
    }
  }
}
