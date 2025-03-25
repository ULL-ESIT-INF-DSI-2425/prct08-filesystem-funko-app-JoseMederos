import chalk from 'chalk';
import { FunkoModel } from "./funko.js";
import { Collection } from "./collection.js";

export class User {
  constructor(public username: string, public collection: Collection = new Collection()) {}


  addFunkoToCollection(funko: FunkoModel): void {
    if (this.collection.addFunko(funko)) {
      console.log(chalk.green(`Funko with ID ${funko.id} has been added to the collection`));
    } else {
      throw new Error(`Funko with ID ${funko.id} already exists.`);
    }
  }

  listFunkosInCollection(): void {
    console.log(`${this.username}'s Funko Collection:`);
    this.collection.showFunkos();
  }

  saveCollection(): void {
    this.collection.saveToFile(this);
  }

  loadCollection(): void {
    this.collection.loadFromFile(this);
  }
}