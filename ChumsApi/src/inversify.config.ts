import { AsyncContainerModule } from "inversify";
import {
  CampusRepository,
  Repositories
} from "./repositories";
import { TYPES } from "./constants";
import { WinstonLogger } from "./logger";

// This is where all of the binding for constructor injection takes place
export const bindings = new AsyncContainerModule(async (bind) => {
  await require("./controllers");
  bind<CampusRepository>(TYPES.CampusRepository).to(CampusRepository).inSingletonScope();
  bind<Repositories>(TYPES.Repositories).to(Repositories).inSingletonScope();
  bind<WinstonLogger>(TYPES.LoggerService).to(WinstonLogger);
});
