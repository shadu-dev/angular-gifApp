import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private _historial:string[] = [];
  private apiKey:string = '9ew3ciVWUg1G9prhnLCTjn3A8fo3PRLW';
  private servicioUrl:string = 'https://api.giphy.com/v1/gifs';
  public resultados:Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
    // if (localStorage.getItem('historial')) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);

    // }
  }

  buscarGifs( query:string ) {
    query = query.trim().toLocaleLowerCase();
    if( !this._historial.includes(query) ) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', 10)
    .set('q', query);
    
    // el metodo suscribe es similar a un then en una promesa
    // las peticiones http devuelven observables
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
    .subscribe((res) => {
      this.resultados = res.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados));
        })

  }


}
