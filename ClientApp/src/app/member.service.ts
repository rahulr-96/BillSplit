import { Injectable } from '@angular/core';

import { MemberDEM } from '../app/groups-table/groups-table.component'

@Injectable({
  providedIn: 'root'
})
export class MemberService {


  public UserData: MemberDEM

  constructor() {
  }

  myMethod(data: MemberDEM) {
    console.log(data); // I have data! Let's return it so subscribers can use it!
    // we can do stuff with data if we want
    this.UserData = data;
  }

  getUser() {
   return this.UserData 
  }
}
