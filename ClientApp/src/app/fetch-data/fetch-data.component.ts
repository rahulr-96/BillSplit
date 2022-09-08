import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: WeatherForecast[];

  public objGroupDEM: GroupDEM



  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    console.log(baseUrl)

    //var obj: MemberDEM
    //obj.MemberName = 'BillSplit'
    //this.lstMemberDEM.push(obj)
    var GroupName = 'FromClient'
    var Purge = 0

    this.objGroupDEM = new GroupDEM()

    this.objGroupDEM.GroupName = 'FromClient'
    this.objGroupDEM.Purge = 0

    this.objGroupDEM.GroupMapDEMCollection = new Array<GroupMapDEM>();
    var loopcounter = 0
    var MemberID  =1
    while (loopcounter < 3) {
      var obj: GroupMapDEM
      obj = new GroupMapDEM()
      obj.GroupID = 0;
      obj.MemberID = MemberID++;

      this.objGroupDEM.GroupMapDEMCollection.push(obj)
      loopcounter++;
    }


    //this.objGroupDEM.GroupMapDEMCollection[0].GroupID = 0;
    //this.objGroupDEM.GroupMapDEMCollection[0].MemberID = 1;
    //this.objGroupDEM.GroupMapDEMCollection[1].GroupID = 0;
    //this.objGroupDEM.GroupMapDEMCollection[1].MemberID = 2;

    const params = new HttpParams()
      .set('objGroupDEM', JSON.stringify(this.objGroupDEM))
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    //http.get<WeatherForecast[]>(baseUrl + 'BillSplit').subscribe(result => {
    //  this.forecasts = result;
    //}, error => console.error(error))

 

    http.post<string>(baseUrl + 'BillSplit/SaveGroup', this.objGroupDEM, httpOptions).subscribe(result => {
        console.log(result)
    }, error => console.error(error));

    //http.post<string>(baseUrl + 'SaveGroup', MemberID).subscribe(result => {
    //  console.log(result)
    //}, error => console.error(error));
  }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface MemberDEM {
  MemberName: string;
}

export class GroupDEM {
  GroupName: string;
  Purge: number;
  GroupMapDEMCollection: GroupMapDEM[];
}

export class GroupMapDEM {
  GroupMapID: number;
  GroupID: number;
  MemberID: number;
}
