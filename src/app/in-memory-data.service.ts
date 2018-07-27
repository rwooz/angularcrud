import { InMemoryDbService } from 'angular-in-memory-web-api';
 
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const students = [
	  { id: 11, name: 'Albert' },
      { id: 12, name: 'Becky' },
      { id: 13, name: 'Charlie' },
      { id: 14, name: 'Debra' },
      { id: 15, name: 'Eric' }
    ];
    return {students};
  }
}