import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-credit-table',
  templateUrl: './credit-table.component.html',
  styleUrls: ['./credit-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreditTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public lstAcPayRecMasterDEM: AcPayRecMasterDEM[]

  public objAcPayRecMasterDEM: AcPayRecMasterDEM

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['BillName', 'GroupName', 'TotalAmount'];
  displayedColumnsExpanded = ['memberName', 'Amount'];
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    this.objAcPayRecMasterDEM = new AcPayRecMasterDEM();
    this.objAcPayRecMasterDEM.PaidBy = 3 //need to remove

    const httpOptions = {
      params: new HttpParams()
        .set('PaidBy', this.objAcPayRecMasterDEM.PaidBy.toString())
    }

    http.get<AcPayRecMasterDEM[]>(baseUrl + 'BillSplit/SelectAcPayRecMasterWithPaidBy', httpOptions).subscribe(result => {
      this.lstAcPayRecMasterDEM = result
      console.log('this.lstAcPayRecMasterDEM')
      console.log(this.lstAcPayRecMasterDEM)
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
export class AcPayRecMasterDEM {

  GroupName: string;
  BillName: string;
  PaidByName: string;
  PaidBy: number;
  AcPayRecMasterID: number;
  GroupID: number;
  TotalAmount: number;
 AcPayRecDetailsDEMCollection: AcPayRecDetailsDEM[];
}

export class AcPayRecDetailsDEM {
  MemberName: string;
  MemberID: number;
  Amount: number;
  AcPayRecMasterID: number;
  AcPayRecDetailID: number;
}
