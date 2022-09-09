import { AfterViewInit, Component, OnInit, ViewChild, Inject} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { GroupsTableDataSource, GroupsTableItem } from './groups-table-datasource';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
export class GroupsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<GroupsTableItem>;
  dataSource: GroupsTableDataSource;

  public lstGroupDEM: GroupDEM[]

  public objMemberDEM: MemberDEM

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];
  displayedColumnsExpanded = [ 'memberName'];
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    this.objMemberDEM = new MemberDEM();
    this.objMemberDEM.MemberID = 3 //need to remove

    const httpOptions = {
      params: new HttpParams()
        .set('MemberID', this.objMemberDEM.MemberID.toString())
    }

    http.get<GroupDEM[]>(baseUrl + 'BillSplit/SelectGroupWithMemberID', httpOptions).subscribe(result => {
      this.lstGroupDEM = result
      console.log(this.lstGroupDEM)
    }, error => console.error(error));

  }
  ngOnInit() {
   // this.dataSource = new GroupsTableDataSource();
  }

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
    //this.table.dataSource = this.dataSource;
  }
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

export class MemberDEM {
  MemberName: string;
  MemberID: number;
}
