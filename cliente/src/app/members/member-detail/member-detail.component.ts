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
  @ViewChild('memberTabs') memberTabs?: TabsetComponent;
  memeber: Member | undefined;
  gallaryOptions: NgxGalleryOptions[]=[];
  gallaryImages: NgxGalleryImage[]= [];
  constructor(private memebersService: MembersService, private route: ActivatedRoute, private messageService: MessageService){}
  activateTab?: TabDirective;
  messages: Message[] =[];
  ngOnInit(): void {
    this.loadMember();
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

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memebersService.getMember(username).subscribe({
      next: member => {
        this.memeber = member;
        this.gallaryImages = this.getImages();
      }
    });
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
