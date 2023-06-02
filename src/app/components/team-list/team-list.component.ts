import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import {Chart, registerables} from 'chart.js'
import { LoginService } from 'src/app/services/login.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TeamsService } from 'src/app/services/teams.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditComponent } from 'src/app/Modals/add-edit/add-edit.component';
import { TeamRequest } from 'src/app/models/teamRequest.model';
import { ConfirmComponent } from 'src/app/Modals/confirm/confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit{
  constructor(private loginService: LoginService, private teamService : TeamsService, 
    public dialog: MatDialog,
    private _snackBar:MatSnackBar){
  }
  displayedColumns: string[] = ['idTeam', 'nameTeam', 'playersNumber', 'awardsWon', 'foundationDate', 'category', 'country', 'sport','action'];
  dataSource = new MatTableDataSource<Team>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  teams : Team[] =[];
  xLabels :string [] =[];
  xData : number[] =[];
  bgColors : string[] =[];
  borderColors : string[] =[];
  myChart : any;

  ngOnInit(): void {
    Chart.register(...registerables);
    this.GetTeamsInformation();
  }
  async GetTeamsInformation(){
    var getSession = sessionStorage.getItem("token");
    if(getSession == null){
      var newToken = await this.loginService.GetToken();
      await this.FillTable(newToken);
    }else{
      await this.FillTable(getSession.toString());
    }
    this.dataSource.paginator = this.paginator;
    this.BuildGraphContainer();
  }
  async FillTable(token:string){
    this.dataSource.data=[];
    this.teams=[];
    var respTbl= await this.teamService.GetTeams(token);
    if(respTbl !== undefined)
      this.dataSource.data = respTbl;
      this.dataSource.data.forEach(el=>{
        this.teams.push(el);
      })
  }
  BuildGraphContainer(){
    this.teams.forEach(el=>{
      this.xLabels.push(el.nameTeam);
      this.xData.push(el.awardsWon);
      this.bgColors.push(`rgba(${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 3) + 1)})`);
      this.borderColors.push(`rgba(${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 3) + 1)})`);
    });
    this.myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: this.xLabels,
          datasets: [{
              label: 'Team awards total',
              data : this.xData,
              backgroundColor : this.bgColors,
              borderColor : this.borderColors
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  async createTeam() {
     this.dialog.open(AddEditComponent,{
      disableClose:true,
      width:"850px"
     }).afterClosed().subscribe(async result => {
        if(result === "ok")
          await this.RefreshData();
    });
  }
  async EditTeam(teamReq:Team){
    this.dialog.open(AddEditComponent,{
      disableClose:true,
      width:"850px",
      data: teamReq
     }).afterClosed().subscribe(async result => {
        if(result === "updated")
          await this.RefreshData();
    });
  }
  async DeleteTeam(teamReq:Team){

    this.dialog.open(ConfirmComponent,{
      disableClose:true,
      data: teamReq
     }).afterClosed().subscribe(async result => {
        if(result)
        {
          var respDelete = await this.teamService.DeleteTeam(teamReq.idTeam);
          if(respDelete){
            this.Alert("Register was deleted new row","Process Success.");
            this.RefreshData();
          }
          else{
            this.Alert("Something went wrong, please try again later.","Process Failure.");
          }
        }
    });
    
  }

  async RefreshData(){
    var refresh = await this.loginService.GetToken();
    this.FillTable(refresh);

    // this.teams.forEach(el=>{
    //   this.xLabels.push(el.nameTeam);
    //   this.xData.push(el.awardsWon);
    //   this.bgColors.push(`rgba(${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 3) + 1)})`);
    //   this.borderColors.push(`rgba(${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 3) + 1)})`);
    // });
    // this.myChart.data.datasets[0].data = this.xData.map((item) => item.);
    // this.myChart.update();
  }

  Alert(msg: string, action: string) {
    this._snackBar.open(msg, action,{
      horizontalPosition:"center",
      verticalPosition:"top",
      duration:3000
    });
  }
}
