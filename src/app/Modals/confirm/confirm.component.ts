import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from 'src/app/models/team.model';
import { TeamsService } from 'src/app/services/teams.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  constructor(
    private _dialogRef:MatDialogRef<ConfirmComponent>,
    private _teamService:TeamsService,
    @Inject(MAT_DIALOG_DATA) public dataTeam:Team
  ){

  }
  ngOnInit(): void {
    
  }

  // async DeleteTeam(teamReq:Team){
  //   var respDelete = await this._teamService.DeleteTeam(teamReq.idTeam);
  //   if(respDelete){
      
  //   }
  // }
}
