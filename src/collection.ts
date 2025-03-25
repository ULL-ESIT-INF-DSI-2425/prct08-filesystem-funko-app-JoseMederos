import chalk from "chalk";
import fs from "fs";
import * as path from "path";
import { join } from "path";
import { FunkoModel } from "./funko.js";
import { User } from "./user.js";

const projectRoot = process.cwd();
const dataDir = join(projectRoot, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export class Collection {
  private funkos: FunkoModel[] = [];

  constructor(initialFunkos?: FunkoModel[]) {
    this.funkos = initialFunkos || [];
  }

  getNextId(): number {
    if (this.funkos.length === 0) return 1;
    const maxId = Math.max(...this.funkos.map((f) => parseInt(f.id, 10)));
    return maxId + 1;
  }

  getFunkoById(id: string): FunkoModel | undefined {
    return this.funkos.find((f) => f.id === id);
  }

  addFunko(funko: FunkoModel, preserveId = false): boolean {
    if (!preserveId) {
      funko.id = this.getNextId().toString();
    }

    if (this.funkos.some((f) => f.id === funko.id)) {
      return false;
    }
    this.funkos.push(funko);
    return true;
  }

  updateFunko(
    id: string,
    updatedData: Partial<Omit<FunkoModel, "id">>,
  ): boolean {
    const funko = this.getFunkoById(id);
    if (!funko) return false;

    if (updatedData.name !== undefined) funko.name = updatedData.name;
    if (updatedData.description !== undefined)
      funko.description = updatedData.description;
    if (updatedData.type !== undefined) funko.type = updatedData.type;
    if (updatedData.genre !== undefined) funko.genre = updatedData.genre;
    if (updatedData.franchise !== undefined)
      funko.franchise = updatedData.franchise;
    if (updatedData.number !== undefined) funko.number = updatedData.number;
    if (updatedData.exclusive !== undefined)
      funko.exclusive = updatedData.exclusive;
    if (updatedData.market_value !== undefined)
      funko.setMarketValue(updatedData.market_value);

    return true;
  }

  removeFunko(id: string, user: User): boolean {
    const funkoIndex = this.funkos.findIndex((f) => f.id === id);
    if (funkoIndex === -1) {
      return false;
    }

    const userDir = path.join(dataDir, user.username);
    const funkoFilePath = path.join(userDir, `${id}.json`);

    try {
      if (fs.existsSync(funkoFilePath)) {
        fs.unlinkSync(funkoFilePath);
      }
      this.funkos.splice(funkoIndex, 1);
      return true;
    } catch {
      return false;
    }
  }

  showFunkos() {
    this.funkos.forEach((funko) => {
      const marketValue = funko.getMarketValue();
      let marketColor: string;

      if (marketValue! >= 500) {
        marketColor = chalk.green(marketValue);
      } else if (marketValue! >= 200) {
        marketColor = chalk.yellow(marketValue);
      } else if (marketValue! >= 50) {
        marketColor = chalk.rgb(255, 153, 0)(marketValue);
      } else {
        marketColor = chalk.red(marketValue);
      }

      console.log(chalk.green(`ID: ${funko.id}`));
      console.log(chalk.green(`Name: ${funko.name}`));
      console.log(chalk.green(`Description: ${funko.description}`));
      console.log(chalk.green(`Type: ${funko.type}`));
      console.log(chalk.green(`Genre: ${funko.genre}`));
      console.log(chalk.green(`Franchise: ${funko.franchise}`));
      console.log(chalk.green(`Number: ${funko.number}`));
      console.log(chalk.green(`Exclusive: ${funko.exclusive ? "Yes" : "No"}`));
      console.log(chalk.green(`Market Value: ${marketColor}`));
      console.log("-----------------------------------");
    });
  }

  saveToFile(user: User): void {
    const userDir = path.join(dataDir, user.username);

    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      // Save each Funko
      this.funkos.forEach((funko) => {
        const filePath = path.join(userDir, `${funko.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(funko.toJSON(), null, 2));
      });

      
    } catch {
      return;
    }
  }

  loadFromFile(user: User): void {
    const userDir = path.join(dataDir, user.username);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
        this.funkos = []; // Initialize empty collection
        return;
    }

    // Only try to read files if directory exists
    this.funkos = [];
    const funkoFiles = fs.readdirSync(userDir)
        .filter(file => file.endsWith('.json'));

    funkoFiles.forEach(file => {
        try {
            const filePath = path.join(userDir, file);
            const fileData = fs.readFileSync(filePath, 'utf-8');
            const funkoData = JSON.parse(fileData);
            const funko = FunkoModel.fromJSON(funkoData);
            this.addFunko(funko, true); // Preserve the loaded ID
        } catch (error) {
            console.error(chalk.red(`Error loading ${file}: ${error}`));
        }
    });
}
}
