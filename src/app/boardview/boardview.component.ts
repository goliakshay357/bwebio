import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import {HostListener} from '@angular/core';

import { HttpClient,HttpResponse,HttpHeaders } from '@angular/common/http';


import * as jsPDF from 'jspdf';


// import { $ } from 'protractor';
declare var $:any;

@Component({
  selector: 'app-boardview',
  templateUrl: './boardview.component.html',
  styleUrls: ['./boardview.component.scss']
})
export class BoardviewComponent implements OnInit {
 
  @ViewChild('myCanvas',null) canvas:any;

  canvasElement: any;
  scrHeight:any;
  scrWidth:any;
  mouseControl:any = false;
  globalListenFunc: Function;
  line_width: any = 5;
  colour_selector: any = '#000';

  onMousemoving:any;
  //content declarations
  ctx:any;

    


  //Add one

  //pen
  penIstrue: any = false;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  lastX: number;
  lastY: number;


  //brush
  brushIstrue = false;
  brush_startX: number;
  brush_startY: number;
  brush_currentX: number;
  brush_currentY: number;
  brush_lastX: number;
  brush_lastY: number;

  //glowpen
  glowIsTrue = false;
  glow_startX: number;
  glow_startY: number;
  glow_currentX: number;
  glow_currentY: number;
  glow_lastX: number;
  glow_lastY: number;

  //signaturePen
  sigIsTrue = false;
  sig_startX: number;
  sig_startY: number;
  sig_currentX: number;
  sig_currentY: number;
  sig_lastX: number;
  sig_lastY: number;
  c:any;
  d:any;

  //Point based pen.
  pointIsTrue: any;
  points = []; 
  strokepoints = {
    width: 1,
    colour: 1,
    points: []
  }

  //imges
  img:any;
  point_startX:any;
  point_startY:any;
  point_currentY:any;
  point_currentX:any;
  point_lastX: number;
  point_lastY: number;






  //download as pdf..
  imgData: any;
  specialElementHandlers: any;
  


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        console.log(this.scrHeight, this.scrWidth);
  }

  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e) {
    this.onMousemoving=e;
  }


  

  constructor(public renderer:Renderer, private http : HttpClient ) {
    this.getScreenSize();
    console.log(this.penIstrue,"Before");
   }

  ngOnInit() { 
    
    console.log(this.canvas);
    this.canvasElement=this.canvas.nativeElement;
    this.ctx = this.canvasElement.getContext('2d');

    console.log(this.canvasElement,"canvas element"); 

    this.renderer.setElementAttribute(this.canvasElement, 'width', this.scrWidth);
    this.renderer.setElementAttribute(this.canvasElement, 'height', this.scrHeight);

    // this.globalListenFunc = this.renderer.listen('document', 'mousemove', e => {
    //   console.log(e);
    // });
    $('#inp').change(function(e) {
      this.img = new Image();
      this.img.onload = this.ctx.drawImage(this.img,0,0);
      // this.img.onerror = this.failed();
      this.img.src = URL.createObjectURL(this.files[0]);

    })      
  }

  failed(){
    console.error("The provided file couldn't be loaded as an Image media");   
  }

  brushclick(){
    console.log("brush is playing");
    
    this.penIstrue = false;
    this.brushIstrue = true;
    this.glowIsTrue = false;
    this.sigIsTrue = false;
    this.pointIsTrue = false;
    this.rectIsTrue = false;

    console.log("Brush activatated!");
    if(this.brushIstrue){

      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = 'rgb(0, 0, 0)';
    }
    
    if(this.brushIstrue){
          
    this.globalListenFunc = this.renderer.listen('document', 'mousedown', e => {
      this.mouseControl = true;
      // console.log(e,"Mouse down");
      this.brush_startX = e.pageX;
      this.brush_startY = e.pageY;

      // console.log(this.startX,this.startY);

      this.globalListenFunc = this.renderer.listen('document', 'mousemove', e => {
        if(this.mouseControl){
          this.brush_currentX = e.pageX;
          this.brush_currentY=e.pageY;
          // console.log(this.brush_currentX,this.brush_currentY);
          // this.ctx.lineJoin = 'round';
          this.ctx.beginPath();

          if(this.brushIstrue){
            this.ctx.moveTo(this.brush_startX,this.brush_startY);
            this.ctx.lineTo(this.brush_currentX,this.brush_currentY);
            this.ctx.closePath();
            this.ctx.strokeStyle = this.colour_selector;
            this.ctx.lineWidth = this.line_width;
            this.ctx.stroke();
  
            this.ctx.moveTo(this.brush_startX+2,this.brush_startY+2);
            this.ctx.lineTo(this.brush_currentX+2,this.brush_currentY+2);
            this.ctx.closePath();
            this.ctx.strokeStyle = this.colour_selector;
            this.ctx.lineWidth = this.line_width;
            this.ctx.stroke();
  
            this.ctx.moveTo(this.brush_startX-2,this.brush_startY-2);
            this.ctx.lineTo(this.brush_currentX-2,this.brush_currentY-2);
            this.ctx.closePath();
            this.ctx.strokeStyle = this.colour_selector;
            this.ctx.lineWidth = this.line_width;
            this.ctx.stroke();
  
            this.ctx.moveTo(this.brush_startX+4,this.brush_startY+4);
            this.ctx.lineTo(this.brush_currentX+4,this.brush_currentY+4);
            this.ctx.closePath();
            this.ctx.strokeStyle = this.colour_selector;
            this.ctx.lineWidth = this.line_width;
            this.ctx.stroke();
  
            this.ctx.moveTo(this.brush_startX-4,this.brush_startY-4);
            this.ctx.lineTo(this.brush_currentX-4,this.brush_currentY-4);
            this.ctx.closePath();
            this.ctx.strokeStyle = this.colour_selector;
            this.ctx.lineWidth = this.line_width;
            this.ctx.stroke();
          }
          
          // console.log(e,"Mouse move");
          this.brush_startX = this.brush_currentX;
          this.brush_startY = this.brush_currentY;

        }
  
      });
  
      this.globalListenFunc = this.renderer.listen('document', 'mouseup', e => {
        this.mouseControl = false;
        // console.log(e,"Mouse up");
        this.brush_lastX = e.pageX;
        this.brush_lastY = e.pageY;
      });  

      
    });
    }
  }
  
  penclick(){
    console.log("Pen is playing");
    
    this.penIstrue = true;
    this.brushIstrue = false;
    this.glowIsTrue = false;
    this.sigIsTrue = false;
    this.pointIsTrue = false;
    this.rectIsTrue = false;

    if(this.penIstrue){

      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = 'rgb(0, 0, 0)';
    }
  
    
    if(this.penIstrue){
      console.log(this.penIstrue,"After");
      // console.log(this.mouseControl);
   
      this.globalListenFunc = this.renderer.listen('document', 'mousedown', e => {
        this.mouseControl = true;
        // console.log(e,"Mouse down");
        this.startX = e.pageX;
        this.startY = e.pageY;
        // console.log(this.startX,this.startY);
      });
  
  
      this.globalListenFunc = this.renderer.listen('document', 'mousemove', e => {
        if(this.mouseControl){
          this.currentX = e.pageX;
          this.currentY=e.pageY;
          // console.log(this.currentX,this.currentY);
          this.ctx.lineJoin = 'round';
          this.ctx.beginPath();
  
          if(this.penIstrue){
            this.ctx.moveTo(this.startX,this.startY);
            this.ctx.lineTo(this.currentX,this.currentY);
            this.ctx.closePath();
            this.ctx.strokeStyle = this.colour_selector;
            this.ctx.lineWidth = this.line_width;
            this.ctx.stroke();
          }
          
          // console.log(e,"Mouse move");
          this.startX = this.currentX;
          this.startY = this.currentY;

        }
  
      });
  
      this.globalListenFunc = this.renderer.listen('document', 'mouseup', e => {
        this.mouseControl = false;
        // console.log(e,"Mouse up");
        this.lastX = e.pageX;
        this.lastY = e.pageY;
      });
  
    }
  }



  glowclick(){
    this.glowIsTrue = true;
    this.penIstrue = false;
    this.brushIstrue=false;
    this.sigIsTrue=false;
    this.pointIsTrue = false;
    this.rectIsTrue = false;
    if(this.glowIsTrue){
        
      if(this.glowIsTrue){

          console.log(this.ctx.lineWidth);
          
          this.ctx.shadowBlur = 20;
          this.ctx.shadowColor = 'rgb(0, 0, 0)';
        }
            
      this.globalListenFunc = this.renderer.listen('document', 'mousedown', e => {
        this.mouseControl = true;
        // console.log(e,"Mouse down");
        this.glow_startX = e.pageX;
        this.glow_startY = e.pageY;
  
        // console.log(this.startX,this.startY);
  
        this.globalListenFunc = this.renderer.listen('document', 'mousemove', e => {
          if(this.mouseControl){
            this.glow_currentX = e.pageX;
            this.glow_currentY=e.pageY;
            this.ctx.lineWidth = this.line_width;
            this.ctx.lineJoin = 'round';
            this.ctx.beginPath();
    
            this.ctx.moveTo(this.glow_startX,this.glow_startY);
            this.ctx.lineTo(this.glow_currentX,this.glow_currentY);
            this.ctx.closePath();
            this.ctx.strokeStyle = this.colour_selector;
            this.ctx.stroke();
            
            // console.log(e,"Mouse move");
            this.glow_startX = this.glow_currentX;
            this.glow_startY = this.glow_currentY;

          }
    
        });
    
        this.globalListenFunc = this.renderer.listen('document', 'mouseup', e => {
          this.mouseControl = false;
          // console.log(e,"Mouse up");
          this.glow_lastX = e.pageX;
          this.glow_lastY = e.pageY;
        });  
  
        
      });
      }

    }

    signatureclick(){
      this.sigIsTrue=true;
      this.glowIsTrue = false;
      this.penIstrue = false;
      this.brushIstrue=false;
      this.pointIsTrue = false;
      this.rectIsTrue = false;
      if(this.sigIsTrue){
        
        if(this.sigIsTrue){

          this.ctx.shadowBlur = 0;
          this.ctx.shadowColor = 'rgb(0, 0, 0,0.1)';
          this.ctx.strokeStyle = this.colour_selector;
        }
    
        
        this.globalListenFunc = this.renderer.listen('document', 'mousedown', e => {
          this.mouseControl = true;
          // console.log(e,"Mouse down got!!");
          this.sig_startX = e.pageX;
          this.sig_startY = e.pageY;

    
          // console.log(this.startX,this.startY);
    
          this.globalListenFunc = this.renderer.listen('document', 'mousemove', e => {
            if(this.mouseControl){
              this.sig_currentX = e.pageX;
              this.sig_currentY=e.pageY;
  
              if(this.sigIsTrue){
                this.ctx.lineJoin = 'round';
                this.ctx.strokeStyle = this.colour_selector;
                this.ctx.beginPath();
                this.ctx.lineWidth = this.line_width;
                this.ctx.moveTo(this.sig_startX,this.sig_startY);
                // this.c=this.sig_currentX;
                // this.d = this.sig_currentY;
                // this.ctx.lineTo(this.sig_currentX,this.sig_currentY)
             
                this.ctx.lineTo(this.sig_currentX,this.sig_currentY);
                this.ctx.closePath();

                this.ctx.stroke();
              }
              
              // console.log(e,"Mouse move");
              this.sig_startX = this.sig_currentX;
              this.sig_startY = this.sig_currentY;
  
            }
      
          });
      
          this.globalListenFunc = this.renderer.listen('document', 'mouseup', e => {
            this.mouseControl = false;
            // console.log(e,"Mouse up");
            this.sig_lastX = e.pageX;
            this.sig_lastY = e.pageY;
          });  
    
          
        });
        
    }
  }  

  pointBasedPen(){
      // console.log("point based is working");
      this.pointIsTrue = true;
      this.penIstrue = false;
      this.brushIstrue = false;
      this.glowIsTrue = false;
      this.sigIsTrue = false;
      this.rectIsTrue = false;

      if(this.pointIsTrue){

        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'rgb(0, 0, 0)';
      }

      if(this.pointIsTrue){
        // console.log("Tested!");

        this.globalListenFunc = this.renderer.listen('document', 'mousedown', e => {
          this.mouseControl = true;
          // console.log(e,"Mouse down");
          this.point_startX = e.pageX;
          this.point_startY = e.pageY;
          this.points.push({
            x: this.point_startX,
            y: this.point_startY
          });

          this.globalListenFunc = this.renderer.listen('document', 'mousemove', e => {
            if(this.mouseControl){
              this.point_currentX = e.pageX;
              this.point_currentY = e.pageY;

              this.points.push({
                x: this.point_currentX,
                y: this.point_currentY
              })
              this.ctx.lineJoin = 'round';
              this.ctx.beginPath();
              if(this.pointIsTrue){
                this.ctx.moveTo(this.point_startX,this.point_startY);
                this.ctx.lineTo(this.point_currentX,this.point_currentY);
                this.ctx.closePath();
                this.ctx.strokeStyle = this.colour_selector;
                this.ctx.lineWidth = this.line_width;
                this.ctx.stroke();
              }

              this.point_startX = this.point_currentX;
              this.point_startY = this.point_currentY;

            }      
          });
          
          this.globalListenFunc = this.renderer.listen('document', 'mouseup', e => {
            this.mouseControl = false;
            // console.log(e,"Mouse up");
            this.point_lastX = e.pageX;
            this.point_lastY = e.pageY;

            this.points.push({
              x: this.point_lastX,
              y: this.point_lastY

            })
            
            this.strokepoints.points.push(this.points);
            this.strokepoints.colour = this.ctx.strokeStyle;
            this.strokepoints.width = this.ctx.lineWidth;

            //pushing points to backend!
            this.http.post("http://localhost:5555/Bwebio",{
              "stroke" : this.strokepoints,
              "datatype" : "point_based_pen" 
            }).subscribe(
              (data: any) => {
                // this.products = res.json();
                // this.products = data;
                console.log(data);
                
              }
            )
            
          });  


          // console.log(this.startX,this.startY);
        });
        
      }


      
  }

  small(){
       if(this.penIstrue || this.brushIstrue || this.sigIsTrue || this.glowIsTrue || this.pointIsTrue || this.rectIsTrue){
        this.line_width = 20;
       }
    
  }
  medium(){
    if(this.penIstrue || this.brushIstrue || this.sigIsTrue || this.glowIsTrue || this.pointIsTrue || this.rectIsTrue){
      this.line_width = 40;
     }
    
  }
  large(){
    if(this.penIstrue || this.brushIstrue || this.sigIsTrue || this.glowIsTrue || this.pointIsTrue || this.rectIsTrue){
      this.line_width = 80;
     }
  }

  red(){
    if(this.penIstrue || this.brushIstrue || this.sigIsTrue || this.glowIsTrue || this.pointIsTrue || this.rectIsTrue){
      this.colour_selector = 'red';
     }
  }

  green(){
    if(this.penIstrue || this.brushIstrue || this.sigIsTrue || this.glowIsTrue || this.rectIsTrue){
      this.colour_selector = 'green';
     }
  }

  black(){
    if(this.penIstrue || this.brushIstrue || this.sigIsTrue || this.glowIsTrue || this.pointIsTrue || this.rectIsTrue){
      this.colour_selector = 'black';
     }
  }

  blue(){
    if(this.penIstrue || this.brushIstrue || this.sigIsTrue || this.glowIsTrue || this.pointIsTrue || this.rectIsTrue){
      this.colour_selector = 'blue';
     }
  }

  // pdfdownload(){
  //   console.log("All okay!");
  //   console.log(this.canvas.toDataURL);
    
  //   var imgData = this.canvas.toDataURL();
  //   console.log(imgData);
    
  //   const doc = new jsPDF();
  //   // doc.addImage(this.imgData, 'JPEG', 0, 0,this.scrWidth,this.scrHeight);

  //   // doc.text('some text here',10,10);
  //   // doc.save("download.pdf");
  // }


  //Adding Rectangle
  rect_startX: any;
  rect_startY: any;
  rect_endX: any;
  rect_endY: any;
  rectIsTrue: any;
  rect_height : any;
  rect_width: any;

  rect(){
 
    
    this.rectIsTrue = true;
    this.penIstrue = false;
    this.brushIstrue = false;
    this.glowIsTrue = false;
    this.sigIsTrue = false;
    this.pointIsTrue = false;


    if(this.rectIsTrue){

      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = 'rgb(0, 0, 0)';
    }

    if(this.rectIsTrue){
          // console.log("Reatcnagle works!!");

          this.globalListenFunc = this.renderer.listen('document', 'mousedown', e => {
            this.mouseControl = true;
            this.rect_startX = e.pageX;
            this.rect_startY = e.pageY;

            });
          
            this.globalListenFunc = this.renderer.listen('document', 'mousemove', e => {
              if(this.mouseControl){
                this.rect_endX = e.pageX
                this.rect_endY = e.pageY
                

                this.ctx.lineJoin = 'round';
                // this.ctx.clearRect(0, 0, this.rect_width, this.rect_height);
               

                if(this.rectIsTrue){
                  // this.ctx.strokeRect(50, 50, 50, 50);
                  //calculating width and height
                                      this.rect_width = this.rect_endX - this.rect_startX;
                                      this.rect_height = this.rect_endY - this.rect_startY
                  // if(this.rect_startX <= this.rect_endX){
                  //   this.rect_width = this.rect_endX - this.rect_startX;
                  // }
                  // else{
                  //   this.rect_width = this.rect_startX - this.rect_endX;
                  // }

                  // if(this.rect_startY <= this.rect_endY){
                  //   this.rect_height = this.rect_endY - this.rect_startY
                  // }
                  // else{
                  //   this.rect_height = this.rect_startY - this.rect_endY
                  // }
                  console.log(this.ctx.strokeStyle);

                  this.ctx.strokeRect(this.rect_startX, this.rect_startY, this.rect_width, this.rect_height);
                  this.ctx.strokeStyle = this.colour_selector;
                  this.ctx.lineWidth = this.line_width;
 
                }

              }

            });

            this.globalListenFunc = this.renderer.listen('document', 'mouseup', e => {
              this.mouseControl = false;
              // console.log(e,"Mouse up");
              this.rect_endX = e.pageX;
              this.rect_endY = e.pageY;
            });


    }

    
  }

  //pdf making
  images = [{
    name: "Image 1", url:"https://4.bp.blogspot.com/-OuIrYzKE1lM/WJ1nqskJ5pI/AAAAAAAAOww/v9JfD7Hb_Fwe_K1svBN7gz2A_BUKxbqGwCLcB/s400/mindblowing-awasome-wallpapers-imgs.jpg"
  },
  {
    name:"Image 2",
    url:"https://akm-img-a-in.tosshub.com/indiatoday/559_102017023826.jpg?TZlWXro5W8Rj4VbO.MpENgo1F2MX93j"
  }]

  // pdfdownload(){
  //   let doc = new jsPDF();
  //   let imagedata = canvas.toDataURL("image/png");
  //   console.log(imagedata);
    
  // }
  
  
  

  

  

}
