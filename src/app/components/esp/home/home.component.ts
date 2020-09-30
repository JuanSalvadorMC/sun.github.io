import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 
})

export class HomeComponent implements OnInit {

  bgColor = 'primary';
  color = 'warn';
  ocultarRegistro: boolean = true;

  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem('idusu')){
      this.ocultarRegistro = false;
     
    }
  /*   var extension = {
      cycle: function (e, extra) {
        e || (this.paused = false)
    
        this.interval && clearTimeout(this.interval)
    
        var nextInterval;
        var $active    = this.$element.find('carousel-item.active')
        if (!extra) {
          nextInterval = $active.data("duration") || this.options.interval;
        } else {
          var $next    = this.getItemForDirection('next', $active)
          nextInterval = $next.data("duration") || this.options.interval;
        }
    
        !this.paused
          && (this.interval = setTimeout($.proxy(this.nextProxy, this), nextInterval))
    
        return this
      }, 
      pause: function (e) { 
        e || (this.paused = true)
    
        if (this.$element.find('.next, .prev').length && $.support.transition) {
          this.$element.trigger($.support.transition.end)
          this.cycle(true)
        }
        this.interval = clearTimeout(this.interval)
    
        return this
      },
      nextProxy: function() {
        this.next()
        this.cycle(true, true)
      }
    } */
    
  }

}