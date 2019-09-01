import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import {HostListener} from '@angular/core';

import { HttpClient,HttpResponse,HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  
  scrHeight:any;
  scrWidth:any;

  canvasElement: any;
  ctx:any;

  constructor(public renderer:Renderer) { 
    this.getScreenSize();
  }

  ngOnInit() {
    this.canvasElement=this.canvas.nativeElement;
    this.ctx = this.canvasElement.getContext('2d');
  this.renderer.setElementAttribute(this.canvasElement, 'width', this.scrWidth);
  this.renderer.setElementAttribute(this.canvasElement, 'height', this.scrHeight);
  }

  @ViewChild('myCanvas',null) canvas:any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;

        console.log(this.scrHeight, this.scrWidth);
        // console.log(window.pageXOffset,"pageXOffset");
        
  }

  mouse:any = {
    x: null,
    y: null,
    startX:null,
    StartY: null,
  }

  mouseControl:any = false;
  element:HTMLElement =null;
  SVG(){
    console.log("svg tested!!");
    var img = new Image();
    this.ctx.drawImage(img, 0, 0);
    console.log(img.onload);
    
   img.src = "http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg";
    
  }

  globalListenFunc: Function;

  rect(){
    console.log("worked!!");
    document.getElementById("myBtn").style.cursor = "crosshair";
      this.globalListenFunc = this.renderer.listen('document', 'mousedown', e => {
      this.mouseControl = true;
    // console.log(e,"Mouse down");
      this.mouse.startX = e.pageX;
      this.mouse.startY = e.pageY;
      // console.log(this.mouse);
        console.log(this.mouse.Start);
        
      this.element =  document.getElementById("tested");

      console.log(this.element);
      
      console.log(document.getElementById("myBtn"));
      this.element = document.createElement("div");
      this.element.style.border = '3px solid #000000';
      this.element.style.position = 'absolute';
      this.element.style.left = this.mouse.x + 'px';
      this.element.style.top = this.mouse.y + 'px';
      this.element.style.borderRadius = "100%";
      this.element.style.backgroundColor = "#000000"
      // this.canvas.style.zIndex = '1000';
      document.getElementById("tested").appendChild(this.element)
      console.log(this.element);

  })


  //Mouse move
  this.globalListenFunc = this.renderer.listen('document', 'mousemove', e => {
    this.mouse.x = e.pageX+window.pageXOffset;
    this.mouse.y = e.pageY+window.pageYOffset;
    // console.log(this.mouse.x,this.mouse.y,"lolololol");
    
    if (this.element !== null){

      this.element.style.height = Math.abs(this.mouse.y - this.mouse.startY) + 'px';
      this.element.style.width =  Math.abs(this.mouse.x - this.mouse.startX) + 'px';
      console.log(this.mouse.y,"mouse y value");
      console.log(this.mouse.startY,"mouse startyy");
      
      
      console.log(Math.abs(this.mouse.y - this.mouse.startY));
      
      // console.log(Math.abs(this.mouse.x - this.mouse.startX));
      this.element.style.left = (this.mouse.x - this.mouse.startX < 0) ? this.mouse.x + 'px' : this.mouse.startX + 'px';
      this.element.style.top = (this.mouse.y - this.mouse.startY < 0) ? this.mouse.y + 'px' : this.mouse.startY + 'px';
    }

  })

  this.globalListenFunc = this.renderer.listen('document', 'mouseup', e => {
       this.element = null;
  });




    
  }




}
