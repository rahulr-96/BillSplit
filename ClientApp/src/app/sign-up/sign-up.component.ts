import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MemberDEM } from '../groups-table/groups-table.component'
import { MemberService } from '../member.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  objMemberDEM = new MemberDEM();
  msg = false
  msgDesc = "";
  form: FormGroup = new FormGroup({
    Email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private objMemberService: MemberService, private _router: Router) { }

  ngOnInit() {
  }

  submit() {
    if (this.form.valid) {

      this.objMemberDEM.Email = this.form.controls['Email'].value
      this.objMemberDEM.MemberName = this.form.controls['username'].value
      this.objMemberDEM.PassWord = this.form.controls['password'].value

      //const httpOptions = {
      //  params: new HttpParams()
      //    .set('Email', this.form.controls['username'].value.toString())
      //    .set('Email', this.form.controls['username'].value.toString())
      //    .set('passWord', this.form.controls['password'].value.toString())
      //}
      this.msg = false
      this.http.post<MemberDEM>(this.baseUrl + 'BillSplit/SignUp', this.objMemberDEM).subscribe(result => {
        this.objMemberDEM = result
        if (!this.objMemberDEM) {
          this.msgDesc = "Error"
        }
        else {
          this._router.navigate(['login'])
        }
        console.log('objMemberDEM')
        console.log(this.objMemberDEM)

      }, error => console.error(error));
    }
  }
}
