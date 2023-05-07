import { Component, Input, OnInit } from '@angular/core';
import {Message} from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-massages',
  templateUrl: './member-massages.component.html',
  styleUrls: ['./member-massages.component.css']
})
export class MemberMassagesComponent implements OnInit {
  @Input() username?: string;
  @Input() messages: Message[] =[];
  
  constructor(private messageService: MessageService){}

  ngOnInit(): void {
    
  }

  

}
