import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

 /* public lstGroupDEM: GroupDEM[]*/

  //public objMemberDEM: MemberDEM

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    //this.objMemberDEM = new MemberDEM();
    //this.objMemberDEM.MemberID = 3 //need to remove

    //    const httpOptions = {
    //      params: new HttpParams()
    //        .set('MemberID', this.objMemberDEM.MemberID.toString())
    //}

    //http.get<GroupDEM[]>(baseUrl + 'BillSplit/SelectGroupWithMemberID', httpOptions).subscribe(result => {
    //  this.lstGroupDEM = result
    //  console.log(this.lstGroupDEM)
    //}, error => console.error(error));

  }
  ngOninit() {

        
  }

}


