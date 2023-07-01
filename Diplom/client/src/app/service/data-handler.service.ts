import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {
  
  selected_book : string = "";
  selected_chapter : string = "";
  selected_page : string = "";

  constructor(private http: HttpClient){ }

  getAllNotebooks() {
    this.http.post('http://127.0.0.1:2525/api/notebook/all','').toPromise().then((data : any) => {
    });
  }
  addNewBook(text : string) {
    this.http.post('http://127.0.0.1:2525/api/notebook/add', {'name' : text}).toPromise().then((data : any) => {
    });
  }
  editOldBook(id : number, text : string) {
    this.http.post('http://127.0.0.1:5003/edit_old_notebooks', {'text' : text, 'id' : id}).toPromise().then((data : any) => {
    });
  }
  deleteBook(id : number) {
    this.http.post('http://127.0.0.1:5003/delete_notebooks', {'id' : id}).toPromise().then((data : any) => {
    });
  }
  //---chapters
  fillChapterByBook_id(id_book : string) {
    this.http.post('http://127.0.0.1:5003/get_chapters_by_book', {'id_book' : id_book}).toPromise().then((data : any) => {
    });
  }
  addNewChapt(text : string) {
    this.http.post('http://127.0.0.1:5003/add_new_chapter', {'text' : text, 'id_book' : this.selected_book}).toPromise().then((data : any) => {
    });
  }
  editOldChapt(id_chapt : number, text : string) {
    this.http.post('http://127.0.0.1:5003/edit_old_chapter', {'id' : id_chapt, 'text' : text, 'id_book' : this.selected_book}).toPromise().then((data : any) => {
    });
  }
  deleteChapt(id_chapt : number) {
    this.http.post('http://127.0.0.1:5003/delete_chapter', {'id' : id_chapt, 'id_book' : this.selected_book}).toPromise().then((data : any) => {
    });
  }
  //---pages
  fillPagesOfChapt(id_chapter : string) {
    this.http.post('http://127.0.0.1:5003/get_pages_by_chapt', {'id_chapter' : id_chapter}).toPromise().then((data : any) => {
    });
  }
  addNewPage(text : string) {
    this.http.post('http://127.0.0.1:5003/add_new_pages', {'text' : text, 'id_chatp' : this.selected_chapter}).toPromise().then((data : any) => {
    });
  }
  editOldPage(id_page : number, text : string) {
    this.http.post('http://127.0.0.1:5003/edit_old_pages', {'text' : text, 'id' : id_page, 'id_chapt' : this.selected_chapter}).toPromise().then((data : any) => {
    });
  }
  deletePage(id_page : number) {
    this.http.post('http://127.0.0.1:5003/delete_pages', {'id' : id_page, 'id_chapt' : this.selected_chapter}).toPromise().then((data : any) => {
    });
  }
  //---notes
  fillNotePage(id_page : string) {
    this.http.post('http://127.0.0.1:5003/get_notes_by_page', {'id_page' : id_page}).toPromise().then((data : any) => {
    });
  }
  addNewNote(text : string) {
    this.http.post('http://127.0.0.1:5003/add_new_note', {'text' : text, 'id_page' : this.selected_page}).toPromise().then((data : any) => {
    });
  }
  editOldNote(id_node : number, text : string) {
    this.http.post('http://127.0.0.1:5003/edit_old_note', {'text' : text, 'id' : id_node, 'id_page' : this.selected_page}).toPromise().then((data : any) => {
    });
  }
  deleteNote(id_node : number) {
    this.http.post('http://127.0.0.1:5003/delete_note', {'id' : id_node, 'id_page' : this.selected_page}).toPromise().then((data : any) => {
    });
  }
}