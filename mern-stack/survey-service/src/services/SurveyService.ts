import { getMongoRepository, MongoRepository, FindOneOptions } from "typeorm";

import Survey from "../models/Survey";

class SurveyService {
  repository: MongoRepository<Survey>;

  constructor() {
    this.repository = getMongoRepository(Survey);
  }

  async get(data: any): Promise<Survey[]> {
    const surveys = await this.repository.find(data);

    return surveys;
  }

  async getById(id: string): Promise<Survey> {
    const survey = await this.repository.findOne(id);

    return survey;
  }

  async create(data: any): Promise<Survey> {
    const survey = new Survey(data);
    const newSurvey = await this.repository.save(survey);

    return newSurvey;
  }

  async update(data: any): Promise<Survey> {
    const newSurvey = await this.repository.updateOne(data, { id: data.id });
    const survey = await this.repository.findOne(data.id);

    return survey;
  }
}

export default SurveyService;
