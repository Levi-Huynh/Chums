import { inject, injectable } from "inversify";
import { TYPES } from "../constants";
import {
  CampusRepository
} from ".";

@injectable()
export class Repositories {
  private _campus: CampusRepository;

  public get campus(): CampusRepository {
    return this._campus;
  }


  constructor(
    @inject(TYPES.CampusRepository) campusRepository: CampusRepository
  ) {
    this._campus = this.campus;
  }
}
