import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private readonly key = 'listArgsEdit';

  getList(): any[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  // salva e acrescenta um item na lista
  // saveItem(item: any): void {
  //   const list = this.getList();
  //   list.push(item);
  //   localStorage.setItem(this.key, JSON.stringify(list));
  // }



  // setList(list: any[]): void {
  //   localStorage.setItem(this.key, JSON.stringify(list));
  // }

  saveOrUpdate(item: any): void {
    const list = this.getList();

    // procura se já existe com mesmo id e name
    const index = list.findIndex(
      (x: any) => x.id === item.id && x.name === item.name
    );

    if (index > -1) {
      // já existe → atualizar
      list[index] = item;
    } else {
      // não existe → adicionar
      list.push(item);
    }

    localStorage.setItem(this.key, JSON.stringify(list));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
