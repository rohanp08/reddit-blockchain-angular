import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { EthereumService } from 'src/app/providers/ethereum.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public account: any;

  constructor(
    private sessionStorage: SessionStorageService,
    private etherService: EthereumService
  ) { }

  ngOnInit() {
    this.etherService.loadWeb3();
    this.etherService.loadContract();
    this.sessionStorage.observe("account").subscribe((data) => {
      this.account = data;
    });
  }

}
