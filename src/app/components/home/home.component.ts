import { Component, OnInit } from '@angular/core';
import { EthereumService } from 'src/app/providers/ethereum.service';
import { SessionStorageService } from 'ngx-webstorage';
import { FormControl } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  posts = [];
  content = new FormControl('');

  constructor(
    private ehterService: EthereumService,
    private sessionStorage: SessionStorageService
  ) { }

  ngOnInit() {
    this.ehterService.loadWeb3();
    this.ehterService.loadContract().then(()=> {
      this.ehterService.loadPosts();
    });
    
    this.posts = this.sessionStorage.retrieve("posts");
    console.log(this.posts);
  }

  addPost() {
    this.ehterService.createPost(this.content.value);
  }

  tipPost(id) {
    this.ehterService.tipPost(id);
  }

}
