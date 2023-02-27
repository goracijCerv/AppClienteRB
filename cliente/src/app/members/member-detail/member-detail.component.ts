import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit{
  memeber: Member | undefined;

  constructor(private memebersService: MembersService, private route: ActivatedRoute){}

  ngOnInit(): void {
    
  }

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memebersService.getMember(username).subscribe({
      next: member => this.memeber = member
    });
  }
}
