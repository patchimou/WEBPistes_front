import {TabsPage} from "../tabs/tabs";
import {TeamService} from "./team.service";
import {AboutService} from "../about/about.service";
import { Component } from '@angular/core';
import { HttpModule, Headers, RequestOptions } from "@angular/http";
import { NavController } from 'ionic-angular';

@Component({
  selector: 'team',
  templateUrl: 'team.html'
})
export class Team {

  private teamColor : any;
  private listColors : Array<any>;
  private teamName : string;

  constructor(
    private nav: NavController,
    private teamService : TeamService) {
    this.listColors = [
      {name: "blue", value: "#6C96FF"},
      {name: "red", value: "#FD7567"},
      {name: "green", value: "#00E74D"},
      {name: "yellow", value: "#FDF569"},
      {name: "orange", value: "#FF9900"},
      {name: "pink", value: "#E661AC"},
      {name: "lightblue", value: "#6CE8E8"},
      {name: "purple", value: "#8E67FD"}
    ]
  }

  //============================================================================
  // Lifecycle
  //============================================================================

  //============================================================================
  // Utils
  //============================================================================

  signUp() : void {
    this.nav.setRoot(TabsPage);
    /*if (this.teamName != "") {
      this.teamService.signUp(this.teamName).subscribe(res => {
        console.log(res);
      })
    }*/
  }
}
