import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import data from '../../../assets/motif.json';
import { motif } from './json_format';
import { forEach } from '@angular/router/src/utils/collection';
import { stringify } from '@angular/core/src/util';
import {CommonService} from '../../common.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  providers: []
})

export class DefaultLayoutComponent implements OnDestroy {
  public navItems = navItems;
  public motifData;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  public selectOptionEnding = null;
  public selectOptionStarting = null;
  public selectOption = null;
  public options: any;
  public Chrlist = this.filterchrType();
  constructor(
    private service:CommonService,
    @Inject(DOCUMENT) _document?: any) {

    console.log(data);
    this.options = data;
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  onChange(): void {
    //split string
    var test_tmp_first = this.options[0].promoter;
    var rese = test_tmp_first.split(":", 3);
    var rese_start = rese[1].split("-", 2);
    //put tmp starter & ender
    var tmp_starter = rese_start[0];
    var tmp_ender = rese_start[1];

    //get Starter
    for (var i = 1; i < this.options.length; i++) {
      if (this.selectOption == this.options[i].chr_type) {
        var res_compare = this.options[i].promoter;
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
    this.selectOptionStarting = tmp_starter;
    this.selectOptionEnding = tmp_ender;
  }

  refreshChart(): any {
    console.log("Sending data to chart" + this.selectOptionStarting + this.selectOptionEnding);
    // this.service.setData(this.selectOptionStarting,this.selectOptionEnding);
  }

  getStartPosition(): any {
    for (var i = 0; i < data.length; i++) {
      if (this.selectOption == data[i]._id.$oid) {
        var res = this.options[i].promoter;

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

  ngOnInit(){
    // this.service.getMotif();
    this.service.getGOMO();
    console.log(this.motifData);

  }
  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
