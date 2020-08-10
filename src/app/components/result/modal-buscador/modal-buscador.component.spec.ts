import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBuscadorComponent } from './modal-buscador.component';

describe('ModalBuscadorComponent', () => {
  let component: ModalBuscadorComponent;
  let fixture: ComponentFixture<ModalBuscadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBuscadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
