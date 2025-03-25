import chalk from 'chalk';

export enum FunkoType {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VYNIL_SODA = "Vynil Soda",
  VYNIL_GOLD = "Vynil Gold"
}

export enum FunkoGenre {
  AMT = "Animación, Películas y TV",
  VIDEOGAMES = "Videojuegos",
  SPORTS = "Deportes",
  MUSIC = "Música ",
  ANIME = "Ánime",
  OTHER = "Otros"
}

export interface Funko {
  id: string;
  name: string;
  description: string;
  type: FunkoType;
  genre: FunkoGenre;
  franchise: string;
  number: number;
  exclusive: boolean;
  market_value: number;
}

export class FunkoModel implements Funko {
  private static nextId = 1;
  id: string;

  constructor(
    public name: string,
    public description: string,
    public type: FunkoType,
    public genre: FunkoGenre,
    public franchise: string,
    public number: number,
    public exclusive: boolean,
    public market_value: number
  ) {
    this.id = (FunkoModel.nextId++).toString();
  }

  getMarketValue(): number | undefined {
    return this.market_value;
  }

  setMarketValue(value: number) {
    if (value <= 0) {
      console.log(chalk.red("Market value must be a positive number."));
    }
    this.market_value = value;
  }

  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      genre: this.genre,
      franchise: this.franchise,
      number: this.number,
      exclusive: this.exclusive,
      market_value: this.market_value,
    };
  }

  static fromJSON(data: Partial<FunkoModel>): FunkoModel {
    return new FunkoModel(
      data.name!,
      data.description!,
      data.type!,
      data.genre!,
      data.franchise!,
      data.number!,
      data.exclusive!,
      data.market_value!,
    );
  }
}