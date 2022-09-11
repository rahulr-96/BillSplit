import { AfterViewInit, Component, OnInit, ViewChild, Inject} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { GroupsTableDataSource, GroupsTableItem } from './groups-table-datasource';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MemberService } from '../member.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-groups-table',
  templateUrl: './groups-table.component.html',
  styleUrls: ['./groups-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    ],
})
export class GroupsTableComponent implements  OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<GroupsTableItem>;
  dataSource: GroupsTableDataSource;

  public lstGroupDEM: GroupDEM[]

  public objMemberDEM: MemberDEM;

  public addObjGroupDEM: GroupDEM;

  public respObjGroupDEM: GroupDEM;

  public objTmpMemberDEM: MemberDEM


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];
  displayedColumnsExpanded = [ 'memberName'];
  constructor(public http: HttpClient, @Inject('BASE_URL') public  baseUrl: string,
    private objMemberService: MemberService, public dialog: MatDialog  ) {

 
  }
  ngOnInit() {

    
    this.objTmpMemberDEM = this.objMemberService.getUser() // And he have data here too!

      console.log('After APICAll this.objTmpMemberDEM.MemberID')
      console.log(this.objTmpMemberDEM.MemberID)

      const httpOptions = {
        params: new HttpParams()
          .set('MemberID', this.objTmpMemberDEM.MemberID.toString())
      }

      this.http.get<GroupDEM[]>(this.baseUrl + 'BillSplit/SelectGroupWithMemberID', httpOptions).subscribe(result => {
        this.lstGroupDEM = result
      }, error => console.error(error));

  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddGroupDialog, {
      width: '500px',
      height:'500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.addObjGroupDEM = result;

      var objGroupMapDEM: GroupMapDEM = new GroupMapDEM()

      objGroupMapDEM.MemberID = this.objTmpMemberDEM.MemberID

      this.addObjGroupDEM.GroupMapDEMCollection.push(objGroupMapDEM)

      this.http.post<GroupDEM>(this.baseUrl + 'BillSplit/SaveGroup', this.addObjGroupDEM).subscribe(result => {
        this.respObjGroupDEM = result

        const httpOptions = { 
          params: new HttpParams()
            .set('MemberID', this.objTmpMemberDEM.MemberID.toString())
        }

        this.http.get<GroupDEM[]>(this.baseUrl + 'BillSplit/SelectGroupWithMemberID', httpOptions).subscribe(result => {
          this.lstGroupDEM = result
        }, error => console.error(error));

        console.log('this.lstGroupDEM')
        console.log(this.lstGroupDEM)
      }, error => console.error(error));

    });
  }
}
export class GroupDEM {
  GroupName: string;
  GroupMapDEMCollection: GroupMapDEM[];
}

export class GroupMapDEM {
  GroupMapID: number;
  GroupID: number;
  MemberID: number;
  MemberName: string;
}

export class MemberDEM {
  MemberName: string;
  MemberID: number;
  Email: string;
  PassWord: string;
}

@Component({
  templateUrl: 'addGroup.component.html',
})
export class AddGroupDialog {
  public data: GroupDEM = new GroupDEM();
  public lstGroupMapDEM: GroupMapDEM[]
  public objMemberDEM: MemberDEM;
  public email: string;

  public errOrSuccess: boolean
  public msg: string;

  displayColumns = ['memberName']
  constructor(public http: HttpClient, @Inject('BASE_URL') public baseUrl: string,
    public dialogRef: MatDialogRef<AddGroupDialog>) { }

  public searchMember() {

    this.errOrSuccess = false
    const httpOptions = { params: new HttpParams().set('Email', this.email)}

    this.http.get<MemberDEM>(this.baseUrl + 'BillSplit/searchMemberWithEmailID', httpOptions).subscribe(result => {
      this.objMemberDEM = result

      if (this.objMemberDEM) {
        this.errOrSuccess = true
        this.msg = 'Member Found'
      }
      else {
        this.errOrSuccess = true
        this.msg = 'Member Not Found'
      }

    }, error => console.error(error));
  }

  public addMember() {
    this.errOrSuccess = false;
    var tmpObjGroupMapDEM: GroupMapDEM = new GroupMapDEM()
    tmpObjGroupMapDEM.GroupID = 0
    tmpObjGroupMapDEM.MemberID = this.objMemberDEM.MemberID;
    tmpObjGroupMapDEM.MemberName = this.objMemberDEM.MemberName;

    var tempData = this.lstGroupMapDEM

    if (!tempData) {
      tempData = new Array<GroupMapDEM>()
    }

    tempData.push(tmpObjGroupMapDEM)

    this.lstGroupMapDEM = tempData

    this.data.GroupMapDEMCollection = this.lstGroupMapDEM


    console.log('this.lstGroupMapDEM')
    console.log(this.lstGroupMapDEM)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
