import { Injectable } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private globalService: GlobalService
  ) { }

  // API to check status
  checkStatus() {
    return this.globalService.DataGet('/check');
  }

  // API to get history
  getHistory(params: any) {
    return this.globalService.DataGet('/roast/history/'+params);
  }

  // API to create job queue
  createJobQueue(payloads: any) {
    return this.globalService.DataPost('/roast/queue', payloads);
  }

  // API to get job queue
  getJobQueue(params: any) {
    return this.globalService.DataGet('/roast/queue/'+params);
  }

  // API to create job advice queue
  createJobAdviceQueue(payloads: any) {
    return this.globalService.DataPost('/advice/queue', payloads);
  }

  // API to get job advice queue
  getJobAdviceQueue(params: any) {
    return this.globalService.DataGet('/advice/queue/'+params);
  }
}
