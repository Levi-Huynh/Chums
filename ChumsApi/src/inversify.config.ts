import { AsyncContainerModule } from "inversify";
import {
  AnswerRepository,
  AttendanceRepository,
  CampusRepository,
  DonationBatchRepository,
  DonationRepository,
  FormRepository,
  FormSubmissionRepository,
  FundDonationRepository,
  FundRepository,
  GroupRepository,
  GroupMemberRepository,
  GroupServiceTimeRepository,
  HouseholdRepository,
  NoteRepository,
  PersonRepository,
  QuestionRepository,
  ServiceRepository,
  ServiceTimeRepository,
  SessionRepository,
  VisitRepository,
  VisitSessionRepository,
  Repositories
} from "./repositories";
import { TYPES } from "./constants";
import { WinstonLogger } from "./helpers/Logger";

// This is where all of the binding for constructor injection takes place
export const bindings = new AsyncContainerModule(async (bind) => {
  await require("./controllers");
  bind<AnswerRepository>(TYPES.AnswerRepository).to(AnswerRepository).inSingletonScope();
  bind<AttendanceRepository>(TYPES.AttendanceRepository).to(AttendanceRepository).inSingletonScope();
  bind<CampusRepository>(TYPES.CampusRepository).to(CampusRepository).inSingletonScope();
  bind<DonationBatchRepository>(TYPES.DonationBatchRepository).to(DonationBatchRepository).inSingletonScope();
  bind<DonationRepository>(TYPES.DonationRepository).to(DonationRepository).inSingletonScope();
  bind<FormRepository>(TYPES.FormRepository).to(FormRepository).inSingletonScope();
  bind<FormSubmissionRepository>(TYPES.FormSubmissionRepository).to(FormSubmissionRepository).inSingletonScope();
  bind<FundDonationRepository>(TYPES.FundDonationRepository).to(FundDonationRepository).inSingletonScope();
  bind<FundRepository>(TYPES.FundRepository).to(FundRepository).inSingletonScope();
  bind<GroupRepository>(TYPES.GroupRepository).to(GroupRepository).inSingletonScope();
  bind<GroupMemberRepository>(TYPES.GroupMemberRepository).to(GroupMemberRepository).inSingletonScope();
  bind<GroupServiceTimeRepository>(TYPES.GroupServiceTimeRepository).to(GroupServiceTimeRepository).inSingletonScope();
  bind<HouseholdRepository>(TYPES.HouseholdRepository).to(HouseholdRepository).inSingletonScope();
  bind<NoteRepository>(TYPES.NoteRepository).to(NoteRepository).inSingletonScope();
  bind<PersonRepository>(TYPES.PersonRepository).to(PersonRepository).inSingletonScope();
  bind<QuestionRepository>(TYPES.QuestionRepository).to(QuestionRepository).inSingletonScope();
  bind<ServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository).inSingletonScope();
  bind<ServiceTimeRepository>(TYPES.ServiceTimeRepository).to(ServiceTimeRepository).inSingletonScope();
  bind<SessionRepository>(TYPES.SessionRepository).to(SessionRepository).inSingletonScope();
  bind<VisitRepository>(TYPES.VisitRepository).to(VisitRepository).inSingletonScope();
  bind<VisitSessionRepository>(TYPES.VisitSessionRepository).to(VisitSessionRepository).inSingletonScope();
  bind<Repositories>(TYPES.Repositories).to(Repositories).inSingletonScope();
  bind<WinstonLogger>(TYPES.LoggerService).to(WinstonLogger);
});
