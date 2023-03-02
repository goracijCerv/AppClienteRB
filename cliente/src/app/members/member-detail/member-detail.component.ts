import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit{
  memeber: Member | undefined;
  gallaryOptions: NgxGalleryOptions[]=[];
  gallaryImages: NgxGalleryImage[]= [];
  constructor(private memebersService: MembersService, private route: ActivatedRoute){}

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
}
