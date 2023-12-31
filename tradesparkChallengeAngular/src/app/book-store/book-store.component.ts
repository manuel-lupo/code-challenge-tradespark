import { Component, OnInit } from '@angular/core';
import { BookStoreService } from '../book-store.service';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css']
})
export class BookStoreComponent implements OnInit {

  books: any[] = [];
  booksDisplaying: any[] = [];

  searchTerm: string = ""
  selectedCategories: string[] = new Array<string>();
  constructor(private bookStoreService: BookStoreService) { }

  showPopup = false;
  popup_content = {
    title: "",
    categories : ""
  };

  ngOnInit(): void {
    this.updateBooks()
    //Al momento de iniciar el componente se pushea 'title' a las categorias seleccionadas para que funcione la busqueda al cargar
    this.selectedCategories.push('title')
  }

  /**
   * Funcion que actualiza la lista de libros desde la DB
   */
  updateBooks(){
    this.bookStoreService.getBooks().subscribe((data: any[]) => {
      this.books = data;
      this.booksDisplaying = this.books;
    })
  }

  /**
   * 
   * Funcion que filtra la lista completa de libros por titulo, autor o categoria dependiendo de lo indicado por el usuario
   * 
   */
  applyFilter(): void {
    this.booksDisplaying = this.books.filter(book => {
      return this.selectedCategories.includes("title") && book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.selectedCategories.includes("author") && book.author.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.selectedCategories.includes("categories") && this.categoriesToString(book.categories).toLowerCase().includes(this.searchTerm.toLowerCase())
    })
  }

  /**
 * Funcion que actualiza la lista de categorias seleccionadas cada vez que se da un evento de tipo 'change' en el checkbox
 * 
 * @param event evento de tipo 'change'
 */
  onCheckboxChange(event: any) {
    const value: string = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(value);
    } else {
      this.selectedCategories = this.selectedCategories.filter(category => category !== value);
    }
  }

  /**
   * Funcion que actualiza el termino de busqueda cuando se actualiza el input
   * 
   * @param event evento de tipo 'input'
   */
  onTextInput(event: any) {
    const value: string = event.target.value;
    this.searchTerm = value;
    this.applyFilter()
  }

  openPopup(title, categories): void{
    this.popup_content = {
      title : title,
      categories: categories
    }
     this.showPopup = true;
  }

  closePopup() :void{
    this.showPopup = false
    this.updateBooks()
  }

  //**Funcion que toma los datos del libro indicado y realiza la correspondiente solicitud a la API*/
  async handleRemCategory(event){
    event.preventDefault()
    const data = new FormData(event.target)
    data.append('title', document.getElementById('selected_title').innerHTML)
    await this.bookStoreService.removeCategory(data.get('title'), data.get('category'))
    .toPromise()
    .then(response => console.log(response))
    if (this.showPopup)
      this.closePopup()
  }

  categoriesToString(categories: any[]): string {
    let categoriesString = "";
    categories.forEach((category, index) => {
      categoriesString += category.name;
      if (index < categories.length - 1) {
        categoriesString += ", ";
      }
    });
    return categoriesString;
  }


}
