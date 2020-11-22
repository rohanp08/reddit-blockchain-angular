import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { SessionStorageService } from 'ngx-webstorage';

let SocialNetwork = require('../../abis/SocialNetwork.json');
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class EthereumService {

  web3Provider: any;
  account: any;
  contract: any;
  networkData: any;
  socialNetwork: any;
  web3: any;
  postCount: any;
  posts = [];

  constructor(private sessionStorage: SessionStorageService) {
  }

  loadWeb3() {
    if (window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    window.web3 = new Web3(this.web3Provider);
    window.ethereum.enable();
  }

  async loadContract() {
    this.web3 = window.web3;
    const accounts = await this.web3.eth.getAccounts();
    this.account = accounts[0];
    this.sessionStorage.store("account", this.account);
    const networkId = await this.web3.eth.net.getId();
    this.networkData = SocialNetwork.networks[networkId];
  }

  async loadPosts() {
    if(this.networkData) {
      this.socialNetwork = new this.web3.eth.Contract(SocialNetwork.abi, this.networkData.address);
      this.postCount = await this.socialNetwork.methods.postCount().call()
      // Load Posts
      for(var i = 1 ; i <= this.postCount ; i++) {
        const post = await this.socialNetwork.methods.posts(i).call()
        post.tipAmount = window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether');
        this.posts.push(post);
      }
      // Sort posts, show highest tipped posts first
      this.posts.sort((a, b) => b.tipAmount - a.tipAmount );
      this.sessionStorage.store("posts", this.posts);
    } else {
      window.alert('SocialNetwork contract not deployed to detected network')
    }
  }

  createPost(content: any) {
    this.socialNetwork.methods.createPost(content).send({ from: this.sessionStorage.retrieve("account") })
    .on('receipt', function(receipt: any){
      console.log(receipt);
    })
    .then(function(newContractInstance: any){
      console.log(newContractInstance);
    });
  }

  tipPost(id: any) {
    let tipAmount = window.web3.utils.toWei('0.1', 'Ether');
    this.socialNetwork.methods.tipPost(id).send({ from: this.sessionStorage.retrieve("account"), value: tipAmount })
    .on('receipt', function(receipt: any){
      console.log(receipt);
    })
    .then(function(newContractInstance: any){
      console.log(newContractInstance);
    });
  }

}
