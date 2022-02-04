import { Injectable } from '@nestjs/common';
import { CsvParser } from 'nest-csv-parser';
import * as fs from 'fs';

class PlanetData {
  kepoi_name: string;
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
}

type EntityFromStream = {
  list: PlanetData[];
};

@Injectable()
export class AppService {
  constructor(private readonly csvParser: CsvParser) {}

  planetsData: PlanetData[] = [];

  async parse() {
    const stream = fs.createReadStream('kepler_data.csv');

    function isHabitablePlanet(planetData) {
      return planetData['koi_disposition'] === 'CONFIRMED';
    }

    this.planetsData = await this.csvParser
      .parse(stream, PlanetData, null, null, {
        strict: true,
        separator: ',',
      })
      .then((entities: EntityFromStream) => entities['list'])
      .then((entities) => entities.filter(isHabitablePlanet));

    console.log(this.planetsData.length);

    return this.planetsData;
  }
}
