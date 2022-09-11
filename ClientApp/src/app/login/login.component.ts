import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MemberDEM } from '../groups-table/groups-table.component'
import { MemberService } from '../member.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  objMemberDEM = new MemberDEM();

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });


  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
       private objMemberService: MemberService, private _router: Router) {

  }

  ngOnInit() {
  }

  submit() {
    if (this.form.valid) {

      const httpOptions = {
        params: new HttpParams()
          .set('Email', this.form.controls['username'].value.toString())
          .set('passWord', this.form.controls['password'].value.toString())
      }

      this.http.get<MemberDEM>(this.baseUrl + 'BillSplit/Login', httpOptions).subscribe(result => {
        this.objMemberDEM = result
        console.log('objMemberDEM')
        console.log(this.objMemberDEM)

        this.objMemberService.myMethod(this.objMemberDEM);
        if (this.objMemberDEM) {
          this._router.navigate(['dash'])
        }
      }, error => console.error(error));
    }
  }

}
