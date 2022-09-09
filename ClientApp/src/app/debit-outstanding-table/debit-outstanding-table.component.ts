import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-debit-outstanding-table',
  templateUrl: './debit-outstanding-table.component.html',
  styleUrls: ['./debit-outstanding-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DebitOutstandingTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public lstDebitOutstandingDEM: DebitOutstandingDEM[]


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['BillName', 'GroupName', 'Amount', 'memberName' ];
  //displayedColumnsExpanded = ['memberName', 'Amount'];
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    const memberId = 3

    const httpOptions = {
      params: new HttpParams()
        .set('MemberID', memberId.toString())
    }

    http.get<DebitOutstandingDEM[]>(baseUrl + 'BillSplit/SelectAcPayRecDetailWithMemberID', httpOptions).subscribe(result => {
      this.lstDebitOutstandingDEM = result
      console.log('this.lstDebitOutstandingDEM')
      console.log(this.lstDebitOutstandingDEM)
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
export class DebitOutstandingDEM {

  GroupName: string;
  BillName: string;
  GroupID: number;
  MemberID: number;
  MemberName: string;
  Amount: number;
}
