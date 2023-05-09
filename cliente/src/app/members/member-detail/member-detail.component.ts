import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit{
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  memeber: Member = {} as Member;
  gallaryOptions: NgxGalleryOptions[]=[];
  gallaryImages: NgxGalleryImage[]= [];
  activateTab?: TabDirective;
  messages: Message[] =[];
  
  constructor(private memebersService: MembersService, private route: ActivatedRoute, private messageService: MessageService){}
  
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.memeber = data['member']
    });


    this.route.queryParams.subscribe({
      next: params =>{
        params['tab'] && this.selectTab(params['tab'])
      }
    });

    this.gallaryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.gallaryImages = this.getImages();
  }

  getImages(){
    if(!this.memeber) return [];
    const imageUrls = [];
    
    for(const photo of this.memeber.photos){
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      });
    }
    return imageUrls;
  }

  

  selectTab(heading: string){
    if(this.memberTabs){
      this.memberTabs!.tabs!.find(x => x.heading === heading)!.active = true;
    }
  }

  loadMessages(){
    if(this.memeber){
      this.messageService.getMessagesThread(this.memeber.username).subscribe({
        next: messages => this.messages =messages
      });
    }
  }

  onTabActivated(data: TabDirective){
    this.activateTab=data;
    if(this.activateTab.heading==='Messages'){
      this.loadMessages();
    }
  }
}
