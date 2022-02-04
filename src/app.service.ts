import { Injectable } from '@nestjs/common';
import { CsvParser } from 'nest-csv-parser';
import * as fs from 'fs';

class Entity {
  kepoi_name: string;
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
}

type EntityFromStream = {
  list: Entity[];
};

@Injectable()
export class AppService {
  constructor(private readonly csvParser: CsvParser) {}

  planetsData: Entity[] = [];

  async parse() {
    const stream = fs.createReadStream('kepler_data.csv');

    this.planetsData = await this.csvParser
      .parse(stream, Entity, null, null, {
        strict: true,
        separator: ',',
      })
      .then((entities: EntityFromStream) => entities['list']);

    return this.planetsData;
  }
}
