import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TeamRequest } from 'src/app/models/teamRequest.model';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


import { MAT_DATE_FORMATS } from '@angular/material/core';
import { TeamsService } from 'src/app/services/teams.service';
import { ICatalog } from 'src/app/models/catalog.model';
import { Team } from 'src/app/models/team.model';

export const MyDateFormat = {
  parse:{
    dateInput:'YYYY/MM/DD'
  },
  display:{
    dateInput:'YYYY/MM/DD',
    monthYearLabel:'YYYY MMMM',
    dateA11yLabel:'LL',
    monthYearA11yLabel:'YYYY MMMM'
  }
}

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
  providers: [{provide:MAT_DATE_FORMATS,useValue:MyDateFormat}]
})
export class AddEditComponent implements OnInit {
  constructor(
    private _catalogService:CatalogsService,
    private _dialogRef:MatDialogRef<AddEditComponent>,
    private _snackBar:MatSnackBar,
    private _teamService:TeamsService,
    @Inject(MAT_DIALOG_DATA) public dataTeam:Team
    ){
      const currentYear = new Date().getFullYear();
      this.minDate = new Date(currentYear - 20, 0, 1);
      this.maxDate = new Date(currentYear + 1, 11, 31);
    }

  teamForm = new FormGroup({
    Id: new FormControl(0),
    Name: new FormControl('',[Validators.required]),
    PlayerNumber: new FormControl('',[Validators.required]),
    countryList: new FormControl('',[Validators.required]),
    categoryList: new FormControl('',[Validators.required]),
    sportList: new FormControl('',[Validators.required]),
    AwardsWon: new FormControl('',[Validators.required]),
    FoundationDate: new FormControl('',[Validators.required]),
  });
  minDate: Date | undefined;
  maxDate: Date | undefined;
  formTitle:string="Create new team"
  btnAction:string="Save"
  selectedSport :number = 0;
  selectedCountry :number = 0;
  selectedCategory :number = 0;
  IsUpdateProcess :boolean=false;

  countries : any;
  sports : any;
  categories : any;
  async ngOnInit(): Promise<void> {
    await this.GetCatalogs();
    this.IsUpdateProcess = this.dataTeam ? true: false;
    if(this.IsUpdateProcess){
      this.teamForm.patchValue({
        Id: this.dataTeam.idTeam,
        Name:this.dataTeam.nameTeam,
        PlayerNumber:String(this.dataTeam.playersNumber),
        AwardsWon : String(this.dataTeam.awardsWon),
        FoundationDate : this.dataTeam.foundationDate
      });
      const selectedCat = this.categories.find((x: { name: string; }) => x.name === this.dataTeam.category);
      const selectedCounutry = this.countries.find((x: { name: string; }) => x.name === this.dataTeam.country);
      const selectedSport = this.sports.find((x: { name: string; }) => x.name === this.dataTeam.sport);

      this.teamForm.get("countryList")?.setValue(selectedCounutry.id);
      this.teamForm.get("categoryList")?.setValue(selectedCat.id);
      this.teamForm.get("sportList")?.setValue(selectedSport.id);
      this.btnAction = "Upadate";
      this.formTitle = "Team editor.";
    }
  }

  async AddOrEdit(){
    const teamObj : TeamRequest = {
      id: !this.IsUpdateProcess ? 0 : this.dataTeam.idTeam,
      nameTeam: String(this.teamForm.value.Name),
      playersNumber:parseInt(String(this.teamForm.value.PlayerNumber)),
      awardsWon : parseInt(String(this.teamForm.value.AwardsWon)),
      foundationDate:moment.utc(this.teamForm.value.FoundationDate).format("YYYY-MM-DD"),//String(moment(this.teamForm.value.FoundationDate).format("YYYY/MM/DD")),
      idSport: this.selectedSport,
      idCountry: this.selectedCountry,
      idCategory:this.selectedCategory
    }
    if(this.IsUpdateProcess){
      var responseUpdate = await this._teamService.UpadateTeam(teamObj);
      if(responseUpdate){
        this.Alert("It was upadted","Process Success.");
        this._dialogRef.close("updated");
      }
      else{
        this.Alert("Something went wrong, please try again later.","Process Failure.");
      }
    }else{
      var responseInsert = await this._teamService.SaveTeam(teamObj);
      if(responseInsert){
        this.Alert("It was created new row","Process Success.");
        this._dialogRef.close("ok");
      }
      else{
        this.Alert("Something went wrong, please try again later.","Process Failure.");
      }
    }
  }
  Alert(msg: string, action: string) {
    this._snackBar.open(msg, action,{
      horizontalPosition:"center",
      verticalPosition:"top",
      duration:3000
    });
  }

  async GetCatalogs(): Promise<void>{
    if(sessionStorage.getItem("countries") == null){
      var respContry= await this._catalogService.GetCountryCatalog();
      if(respContry !== undefined){
        sessionStorage.setItem("countries",JSON.stringify(respContry));
        this.countries = respContry;
      }
    }else{
      this.countries = JSON.parse(sessionStorage.getItem("countries")|| '{}') as ICatalog[];
    }

    if(sessionStorage.getItem("categories") == null){
      var respCat= await this._catalogService.GetCategoryCatalog();
      if(respCat !== undefined){
        sessionStorage.setItem("categories",JSON.stringify(respCat));
        this.categories = respCat;
      }
    }else{
      this.categories = JSON.parse(sessionStorage.getItem("categories")|| '{}') as ICatalog[];
    }

    if(sessionStorage.getItem("sports") == null){
      var respSport= await this._catalogService.GetSportCatalog();
      if(respSport !== undefined){
        sessionStorage.setItem("sports",JSON.stringify(respSport));
        this.sports = respSport;
      }
    }else{
      this.sports = JSON.parse(sessionStorage.getItem("sports")|| '{}') as ICatalog[];
    }
  }
}
