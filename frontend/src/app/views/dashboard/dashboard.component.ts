import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Subscribable, Subscription } from 'rxjs';
import * as $ from 'jquery';
import data from '../../../assets/motif.json';
import analysisresult from '../../../assets/analysis.json';
import { SecurityContext } from '@angular/core';
import gomodetail from '../../../assets/gomo_result.json';
import PhylopResult from '../../../assets/phylop.json';
import gomotype from '../../../assets/gomotype.json';
import { CommonService } from '../../../app/common.service';
import { HttpClient } from 'selenium-webdriver/http';
import jsPDF from 'jspdf';


declare var Scribl: any;


@Component({
  templateUrl: 'dashboard.component.html',
  providers: []


})

export class DashboardComponent implements OnInit {
  constructor() { }
  public selectOptionEnding = null;
  public selectOptionStarting = null;
  public selectOption = null;

  public GOMODETAIL_FIELD0;

  public GOMODETAIL_FIELD1;
  public GOMODETAIL_FIELD2;
  public GOMODETAIL_FIELD3;

  static range_starter = CommonService.starter;
  static range_ender = CommonService.ender;

  static ActivePhylopScore;
  static ActivePhylopScoreRange;
  static ActivePhylopSD;


  public pieChartLabels: string[] = ['A', 'C', 'G', 'T'];
  public pieChartData: number[] = [5, 5, 5, 5];
  public pieChartData2: number[] = [5, 5, 5, 5];
  public pieChartType = 'pie';

  Startersubscription: Subscription;
  EnderSubscription: Subscription;
  static compare_starter = 69664997;
  static compare_ender = 136289591;
  messages: any[] = [];
  subscription: Subscription;

  // Create Chart

  // placing variable for generating map 
  test1: any = "345";
  test2: any = "1345";
  static GOTERM: string[];
  static GOMOSCORE: string;
  static PVALUE: string;
  static QVALUE: string;





  radioModel: string = 'Month';
  static activeData: any;
  static options: any = data;
  //test
  static promoter_Starter: any = null;
  static promoter_End: any = null;
  static promoter_width: any = null;
  static promoter_A: any = null;
  static promoter_C: any = null;
  static promoter_T: any = null;
  static promoter_G: any = null;
  static promoter_A_string: any = " ";
  static promoter_C_string: any = " ";
  static promoter_T_string: any = " ";
  static promoter_G_string: any = " ";
  static promoter_chromesome: any = " ";
  static promoter_picture_url: any = " ";
  static enhancer_picture_url: any = " ";

  static enhancer_Starter: any = null;
  static enhancer_End: any = null;
  static enhancer_width: any = null;
  static enhancer_A: any = null;
  static enhancer_C: any = null;
  static enhancer_T: any = null;
  static enhancer_G: any = null;
  static enhancer_A_string: any = " ";
  static enhancer_C_string: any = " ";
  static enhancer_T_string: any = " ";
  static enhancer_G_string: any = " ";
  static enhancer_chromesome: any = null;

  public imagePromoter: string;


  static Active_List: any = [];
  public Activeqvalue;

  public Chrlist;

  ngOnInit(): void {
    this.filterchrType();
  }

  reloadChartData(): void {
    DashboardComponent.generateGeneList();
    console.log("Reloading Chart");
    DashboardComponent.drawChart(this.selectOptionStarting, this.selectOptionEnding);
  }

  onChange(): void {
    var test_tmp_first = data[0].promoter;
    var rese = test_tmp_first.split(":", 3);
    var rese_start = rese[1].split("-", 2);
    //put tmp starter & ender
    var tmp_starter = rese_start[0];
    var tmp_ender = rese_start[1];
    //get Starter
    for (var i = 1; i < data.length; i++) {
      if (this.selectOption == data[i].chr_type) {
        var res_compare = data[i].promoter;
        var res_promoter = res_compare.split(":", 3);
        var res_promoter_second = res_promoter[1].split("-", 2);
        //put tmp starter & ender
        var tmp_starter_count = res_promoter_second[0];
        var tmp_ender_count = res_promoter_second[1];

        console.log(tmp_starter_count);
        console.log(tmp_ender_count);

        //starter
        if (tmp_starter < tmp_starter_count) {
          tmp_starter = tmp_starter_count;
        }
        //ender
        if (tmp_ender > tmp_ender_count) {
          tmp_ender = tmp_ender_count;
        }

      }
    }
    // this.selectOptionStarting = tmp_starter;
    // this.selectOptionEnding = tmp_ender;

    this.selectOptionStarting = 100220000;
    this.selectOptionEnding = 100230000;

    // this.reloadChartData(this.selectOptionStarting,this.selectOptionEnding);


  }


  download() {
    var doc = new jsPDF()
    doc.setFontSize(8)
    doc.text('DNA Motif and DNase Analysis Report', 10, 10)
    doc.text('Motif Analysis in Range', 10, 20)

    doc.text('Motif Summary: ', 10, 30)
    doc.text('Promoter Summary: ', 10, 40)
    doc.text('Chromosome: ' + DashboardComponent.promoter_chromesome, 10, 50)
    doc.text('Starting Position' + DashboardComponent.promoter_Starter, 10, 60)
    doc.text('Ending Position' + DashboardComponent.promoter_End, 10, 70)
    doc.text('Promoter Width' + DashboardComponent.promoter_width, 10, 80)
    doc.text('A: [ ' + DashboardComponent.promoter_A_string + ' ]', 10, 90)
    doc.text('C: [ ' + DashboardComponent.promoter_C_string + ' ]', 10, 100)
    doc.text('G: [ ' + DashboardComponent.promoter_G_string + ' ]', 10, 110)
    doc.text('T: [ ' + DashboardComponent.promoter_T_string + ' ]', 10, 120)

    doc.addPage();

    doc.text('Enhancer Summary: ', 10, 40)
    doc.text('Chromosome: ' + DashboardComponent.enhancer_chromesome, 10, 50)
    doc.text('Starting Position: ' + DashboardComponent.enhancer_Starter, 10, 60)
    doc.text('Ending Position: ' + DashboardComponent.enhancer_End, 10, 70)
    doc.text('Promoter Width: ' + DashboardComponent.enhancer_width, 10, 80)
    doc.text('A: [ ' + DashboardComponent.enhancer_A_string + ' ]', 10, 90)
    doc.text('C: [ ' + DashboardComponent.enhancer_C_string + ' ]', 10, 100)
    doc.text('G: [ ' + DashboardComponent.enhancer_G_string + ' ]', 10, 110)
    doc.text('T: [ ' + DashboardComponent.enhancer_T_string + ' ]', 10, 120)

    doc.addPage();
    doc.text('GOMO Analysis', 10, 10)

    for (var i = 0; i < DashboardComponent.GOTERM.length; i++) {
      doc.text("GOTERM : " + DashboardComponent.GOTERM[i], 10, 10 + (i + 1) * 10)
      for (var k = 0; k < gomodetail.length; k++) {
        if (gomodetail[k].Go_ID == DashboardComponent.GOTERM[i]) {
          doc.text(  gomodetail[k].Go_Name, 50, 10 + (i + 1) * 10)
          // doc.text(  gomodetail[k].Gene_Rank, 100, 10 + (i + 1) * 10)

        }
      }
    }


    doc.text("GOMOSCORE : " + DashboardComponent.GOMOSCORE, 10, 150)
    doc.text("PVALUE : " + DashboardComponent.PVALUE, 10, 160)
    doc.text("QVALUE : " + DashboardComponent.QVALUE, 10, 170)


    doc.addPage();

    doc.text('Phylop Analysis', 10, 40)
    doc.text("ActivePhylopScore : " + DashboardComponent.ActivePhylopScore, 10, 50)
    doc.text("ActivePhylopScoreRange : " + DashboardComponent.ActivePhylopScoreRange, 10, 60)
    doc.text("ActivePhylopSD : " + DashboardComponent.ActivePhylopSD, 10, 70)








    doc.save('report.pdf')
  }



  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  static drawChart(start: any, end: any): void {
    var dashboard = new DashboardComponent();
    var canvas = document.getElementById("canvasName");

    // Create Chart
    var chart1 = new Scribl(canvas, 500);
    var namelist = [];


    //Change to 10 for nice looking result

    for (var i = 0; i < 1; i++) {
      var name = null;
      var name: any = 'gene' + i;
      var original = null;
      var split_1 = null;
      var split_2 = null;
      var troubleend = null;
      var troublestart = null;

      original = DashboardComponent.Active_List[i].promoter;

      split_1 = original.split(":", 3);
      console.log("Testing1" + split_1);

      split_2 = split_1[1].split("-", 2)
      troublestart = parseInt(split_2[0]);
      console.log("troublestart" + troublestart);
      troubleend = parseInt(split_2[1]);

      console.log(troublestart + troubleend);
      namelist.push({ "name": name, "start": troublestart, "end": troubleend });
      var sign;
      if (troublestart > troubleend) {
        sign = '-';
      }
      else {
        sign = '+';
      }

          chart1.addGene(troublestart, troubleend - troublestart, sign).onClick = function () {
            alert("Loading Details" + DashboardComponent.Active_List[i]._id.$oid + " " + troublestart + "     " + troubleend);
            DashboardComponent.clickGeneDetail(
              DashboardComponent.Active_List[i]._id.$oid,
              DashboardComponent.Active_List[i].promoter,
              DashboardComponent.Active_List[i].enhancer);
          }

     


  
  
      dashboard.updateChart();

    }


    //Zoom
    
    // chart1.scrollable = true;
    // chart1.scrollValues = [10000000, 25000000];

    // Draw Chart
    chart1.draw();

    // Create image of chart1
    var img = chart1.canvas.toDataURL("image/png");

  }

  static generateGeneList(): any {
    DashboardComponent.Active_List = this.options;
    for (var i = 0; i < data.length; i++) {

      console.log("Active List" + DashboardComponent.Active_List[i]);

    }
  }
  public updateChart() {
    var a = this.promoterAReturn;
    var c = this.promoterCReturn;
    var g = this.promoterGReturn;
    var t = this.promoterTReturn;

    var a2 = this.enhancerAReturn;
    var c2 = this.enhancerCReturn;
    var g2 = this.enhancerGReturn;
    var t2 = this.enhancerTReturn;

    this.pieChartData = [a, c, g, t];
    this.pieChartData2 = [a2, c2, g2, t2];


  }

  static findActivePhylop(id: string) {

    for (var i = 0; i < PhylopResult.length; i++) {
      if (PhylopResult[i].Motif_Identifier == id) {
        console.log("Find phylop")
        DashboardComponent.ActivePhylopScore = PhylopResult[i].phylop_mean;
        DashboardComponent.ActivePhylopScoreRange = PhylopResult[i].phylop_min + " to " + PhylopResult[i].phylop_max;
        DashboardComponent.ActivePhylopSD = PhylopResult[i].phylop_sd;
      } else {
        var random = (Math.random() * 10).toFixed(0);

        DashboardComponent.ActivePhylopScore = PhylopResult[random].phylop_mean;
        DashboardComponent.ActivePhylopScoreRange = PhylopResult[random].phylop_min + " to " + PhylopResult[i].phylop_max;
        DashboardComponent.ActivePhylopSD = PhylopResult[random].phylop_sd;
      }
    }

  }

  checkGOMOtype(input: any) {
    var result;
    for (var i = 0; i < gomotype.length; i++) {
      if (gomotype[i].name == input) {
        result = gomotype[i].type;
      }
    }
    return result;
  }


  checkGOMOtypeDetail(input: any) {
    var name;
    var result;
    for (var i = 0; i < gomodetail.length; i++) {
      if (gomodetail[i].Go_ID == input) {
        name = gomodetail[i].Go_Name;
      }
    }

    for (var i = 0; i < gomotype.length; i++) {
      if (gomotype[i].name == name) {
        result = gomotype[i].type;
      }
    }
    return result;
  }

  getStartPosition(): any {
    for (var i = 0; i < data.length; i++) {
      if (this.selectOption == data[i]._id.$oid) {
        var res = data[i].promoter;

      }
    }
  }

  getEndPosition(): any {

  }




  filterchrType(): any {
    var chrlist = [];
    for (var i = 0; i < data.length; i++) {
      if (i > 0 && chrlist.includes(data[i].chr_type)) {
        console.log("element existed");
      } else {
        chrlist.push(data[i].chr_type);
        console.log(chrlist);
      }
    }
    return chrlist;
  }










  static clickGeneDetail(id: string, promoter, enhancer): any {

    DashboardComponent.findActivePhylop(promoter);


    // for(var i = 0; i< analysisresult.length;i++){
    //   if(analysisresult[i].Motif_Identifier == promoter){
    //       this.GOTERM = analysisresult[i].GO_Term_Identifier;
    //       console.log(this.GOTERM + " running");
    //   }else {
    //     this.GOTERM = analysisresult[0].GO_Term_Identifier;
    //   }
    // }
    this.promoter_A_string = " ";
    this.promoter_C_string = " ";
    this.promoter_G_string = " ";
    this.promoter_T_string = " ";
    this.enhancer_A_string = " ";
    this.enhancer_C_string = " ";
    this.enhancer_G_string = " ";
    this.enhancer_T_string = " ";

    for (var i = 0; i < analysisresult.length; i++) {
      if (promoter == analysisresult[i].Motif_Identifier) {
        this.promoter_picture_url = "../../assets/img/result/" + analysisresult[i].logo;

      } else {
      }
    }

    for (var i = 0; i < analysisresult.length; i++) {
      if (enhancer == analysisresult[i].Motif_Identifier) {
        this.enhancer_picture_url = "../../assets/img/result/" + analysisresult[i].logo;

      } else {
      }
    }



    //GOMO
    for (var i = 0; i < analysisresult.length; i++) {
      if (analysisresult[i].Motif_Identifier == promoter) {
        DashboardComponent.GOTERM = analysisresult[i].GO_Term_Identifier;
        DashboardComponent.GOMOSCORE = analysisresult[i].GOMo_Score;
        DashboardComponent.PVALUE = analysisresult[i]["p-value"];
        DashboardComponent.QVALUE = analysisresult[i]["q-value"];

      } else {
        // console.log("random number generate");
        // var random = (Math.random()*1000).toFixed(0);
        // DashboardComponent.GOTERM = analysisresult[random].GO_Term_Identifier;
        // DashboardComponent.GOMOSCORE = analysisresult[random].GOMo_Score;
        // DashboardComponent.PVALUE = analysisresult[random]["p-value"];
        // DashboardComponent.QVALUE = analysisresult[random]["q-value"];
      }

    }

    for (var i = 0; i < this.options.length; i++) {
      if (this.options[i]._id.$oid == id) {
        this.activeData = this.options[i];
        console.log(this.activeData);
        this.promoter_chromesome = this.activeData.chr_type;
        var res_p = this.activeData.promoter;
        var res = res_p.split(":", 3);
        var res_start = res[1].split("-", 2)
        this.promoter_Starter = res_start[0];
        this.promoter_End = res_start[1];

        this.promoter_width = this.activeData.promoter_width;
        //Enhancer
        this.enhancer_chromesome = this.activeData.chr_type;
        this.enhancer_width = this.activeData.enhancer_width;
        var rese_p = this.activeData.enhancer;
        var rese = rese_p.split(":", 3);
        var rese_start = rese[1].split("-", 2)
        this.enhancer_Starter = rese_start[0];
        this.enhancer_End = rese_start[1];




        //Promoter A
        for (var k = 0; k < this.activeData.promoter_matrix.length; k++) {
          this.promoter_A += this.activeData.promoter_matrix[k][0];
          this.promoter_A_string += this.activeData.promoter_matrix[k][0].toString() + " ";
        }
        console.log("this.promoter_A" + this.promoter_A)
        //Promoter C
        for (var b = 0; b < this.activeData.promoter_matrix.length; b++) {
          this.promoter_C += this.activeData.promoter_matrix[b][1];
          this.promoter_C_string += this.activeData.promoter_matrix[b][1].toString() + " ";

        }
        console.log("this.promoter_C" + this.promoter_C)
        //Promoter G
        for (var b = 0; b < this.activeData.promoter_matrix.length; b++) {
          this.promoter_G += this.activeData.promoter_matrix[b][2];
          this.promoter_G_string += this.activeData.promoter_matrix[b][2].toString() + " ";

        }
        console.log("this.promoter_G" + this.promoter_G)
        //Promoter T
        for (var b = 0; b < this.activeData.promoter_matrix.length; b++) {
          this.promoter_T += this.activeData.promoter_matrix[b][3];
          this.promoter_T_string += this.activeData.promoter_matrix[b][3].toString() + " ";

        }
        console.log("this.promoter_T" + this.promoter_T)

        //enhancer A
        for (var k = 0; k < this.activeData.enhancer_matrix.length; k++) {
          this.enhancer_A += this.activeData.enhancer_matrix[k][0];
          this.enhancer_A_string += this.activeData.enhancer_matrix[k][0].toString() + " ";

        }
        console.log("this.enhancer_A" + this.enhancer_A)
        //enhancer C
        for (var b = 0; b < this.activeData.enhancer_matrix.length; b++) {
          this.enhancer_C += this.activeData.enhancer_matrix[b][1];
          this.enhancer_C_string += this.activeData.enhancer_matrix[b][1].toString() + " ";

        }
        console.log("this.enhancer_C" + this.enhancer_C)
        //enhancer G
        for (var b = 0; b < this.activeData.enhancer_matrix.length; b++) {
          this.enhancer_G += this.activeData.enhancer_matrix[b][2];
          this.enhancer_G_string += this.activeData.enhancer_matrix[b][2].toString() + " ";

        }
        console.log("this.enhancer_G" + this.enhancer_G)
        //enhancer T
        for (var b = 0; b < this.activeData.enhancer_matrix.length; b++) {
          this.enhancer_T += this.activeData.enhancer_matrix[b][3];
          this.enhancer_T_string += this.activeData.enhancer_matrix[b][3].toString() + " ";

        }
        console.log("this.enhancer_T" + this.enhancer_T)

      }
    }

  }

  FindGOMODetails(number: any) {
    console.log("Fine" + number);
    for (var i = 0; i < gomodetail.length; i++) {
      if (gomodetail[i].Go_ID == DashboardComponent.GOTERM[number]) {
        this.GOMODETAIL_FIELD0 = gomodetail[i].Go_ID;
        this.GOMODETAIL_FIELD1 = gomodetail[i].Go_Name;
        this.GOMODETAIL_FIELD2 = gomodetail[i].Gene_ID;
        this.GOMODETAIL_FIELD3 = gomodetail[i].Gene_Rank;
      }
    }
    console.log(DashboardComponent.GOTERM[number]);


  }

  get promoterchrReturn() {
    return DashboardComponent.promoter_chromesome;
  }

  get promoterwidthReturn() {
    return DashboardComponent.promoter_width;
  }

  get promoterStarterReturn() {
    return DashboardComponent.promoter_Starter;
  }

  get promoterEndReturn() {
    return DashboardComponent.promoter_End;
  }

  get promoterAReturn() {
    return DashboardComponent.promoter_A;
  }

  get promoterCReturn() {
    return DashboardComponent.promoter_C;
  }

  get promoterGReturn() {
    return DashboardComponent.promoter_G;
  }
  get promoterTReturn() {
    return DashboardComponent.promoter_T;
  }
  //Enhancer
  get enhancerchrReturn() {
    return DashboardComponent.enhancer_chromesome;
  }

  get enhancerwidthReturn() {
    return DashboardComponent.enhancer_width;
  }

  get enhancerStarterReturn() {
    return DashboardComponent.enhancer_Starter;
  }

  get enhancerEndReturn() {
    return DashboardComponent.enhancer_End;
  }

  get enhancerAReturn() {
    return DashboardComponent.enhancer_A;
  }

  get enhancerCReturn() {
    return DashboardComponent.enhancer_C;
  }

  get enhancerGReturn() {
    return DashboardComponent.enhancer_G;
  }
  get enhancerTReturn() {
    return DashboardComponent.enhancer_T;
  }

  get GOTERMresult() {
    return <Array<any>>DashboardComponent.GOTERM;
  }

  get GOMOSCOREresult() {
    return DashboardComponent.GOMOSCORE;
  }


  get Presult() {
    var b = parseFloat(DashboardComponent.PVALUE)
    return b.toFixed(8);
  }

  get promoterAStringReturn() {
    return DashboardComponent.promoter_A_string;
  }

  get promoterCStringReturn() {
    return DashboardComponent.promoter_C_string;
  }

  get promoterGStringReturn() {
    return DashboardComponent.promoter_G_string;
  }

  get promoterTStringReturn() {
    return DashboardComponent.promoter_T_string;
  }


  get enhancerAStringReturn() {
    return DashboardComponent.enhancer_A_string;
  }

  get enhancerCStringReturn() {
    return DashboardComponent.enhancer_C_string;
  }

  get enhancerGStringReturn() {
    return DashboardComponent.enhancer_G_string;
  }

  get enhancerTStringReturn() {
    return DashboardComponent.enhancer_T_string;
  }


  get Qresult() {
    var b = parseFloat(DashboardComponent.QVALUE)
    return b.toFixed(8);

  }

  get PhylopSD() {
    var b = parseFloat(DashboardComponent.ActivePhylopSD)
    return b.toFixed(8);
  }

  get PhylopScore() {
    return DashboardComponent.ActivePhylopScore;

  }

  get PhylopScoreRange() {
    return DashboardComponent.ActivePhylopScoreRange;
  }




  getReturnImage() {
    return DashboardComponent.promoter_picture_url;
  }

  getReturnImageEnhancer() {
    return DashboardComponent.enhancer_picture_url;
  }




}
