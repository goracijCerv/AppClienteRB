import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})

export class MemberCardComponent implements OnInit{
  @Input() member: Member | undefined;

  constructor(private memberService: MembersService, private toaster: ToastrService){}

  ngOnInit(): void {
    
  }
  
  addLike(member: Member){
    this,this.memberService.addLike(member.username).subscribe({
      next: () => this.toaster.success('Le has dado me gusta a ' + member.knownAs)
    });
  }
}
