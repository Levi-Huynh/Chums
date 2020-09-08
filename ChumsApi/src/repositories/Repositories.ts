import { inject, injectable } from "inversify";
import { TYPES } from "../constants";
import {
  AnswerRepository,
  AttendanceRepository,
  CampusRepository,
  DonationRepository,
  DonationBatchRepository,
  FormRepository,
  FormSubmissionRepository,
  FundDonationRepository,
  FundRepository,
  GroupMemberRepository,
  GroupRepository,
  GroupServiceTimeRepository,
  HouseholdRepository,
  NoteRepository,
  PersonRepository,
  QuestionRepository,
  ServiceRepository,
  ServiceTimeRepository,
  SessionRepository,
  VisitRepository,
  VisitSessionRepository
} from ".";

@injectable()
export class Repositories {
  public answer: AnswerRepository;
  public attendance: AttendanceRepository;
  public campus: CampusRepository;
  public donationBatch: DonationBatchRepository;
  public donation: DonationRepository;
  public form: FormRepository;
  public formSubmission: FormSubmissionRepository;
  public fundDonation: FundDonationRepository;
  public fund: FundRepository;
  public groupMember: GroupMemberRepository;
  public group: GroupRepository;
  public groupServiceTime: GroupServiceTimeRepository;
  public household: HouseholdRepository;
  public note: NoteRepository;
  public person: PersonRepository;
  public question: QuestionRepository;
  public service: ServiceRepository;
  public serviceTime: ServiceTimeRepository;
  public session: SessionRepository;
  public visit: VisitRepository;
  public visitSession: VisitSessionRepository;


  constructor(
    @inject(TYPES.AnswerRepository) answerRepository: AnswerRepository,
    @inject(TYPES.AttendanceRepository) attendanceRepository: AttendanceRepository,
    @inject(TYPES.CampusRepository) campusRepository: CampusRepository,
    @inject(TYPES.DonationBatchRepository) donationBatchRepository: DonationBatchRepository,
    @inject(TYPES.DonationRepository) donationRepository: DonationRepository,
    @inject(TYPES.FormRepository) formRepository: FormRepository,
    @inject(TYPES.FormSubmissionRepository) formSubmissionRepository: FormSubmissionRepository,
    @inject(TYPES.FundDonationRepository) fundDonationRepository: FundDonationRepository,
    @inject(TYPES.FundRepository) fundRepository: FundRepository,
    @inject(TYPES.GroupMemberRepository) groupMemberRepository: GroupMemberRepository,
    @inject(TYPES.GroupRepository) groupRepository: GroupRepository,
    @inject(TYPES.GroupServiceTimeRepository) groupServiceTimeRepository: GroupServiceTimeRepository,
    @inject(TYPES.HouseholdRepository) householdRepository: HouseholdRepository,
    @inject(TYPES.NoteRepository) noteRepository: NoteRepository,
    @inject(TYPES.PersonRepository) personRepository: PersonRepository,
    @inject(TYPES.QuestionRepository) questionRepository: QuestionRepository,
    @inject(TYPES.ServiceRepository) serviceRepository: ServiceRepository,
    @inject(TYPES.ServiceTimeRepository) serviceTimeRepository: ServiceTimeRepository,
    @inject(TYPES.SessionRepository) sessionRepository: SessionRepository,
    @inject(TYPES.VisitRepository) visitRepository: VisitRepository,
    @inject(TYPES.VisitSessionRepository) visitSessionRepository: VisitSessionRepository,
  ) {
    this.answer = answerRepository;
    this.attendance = attendanceRepository;
    this.campus = campusRepository;
    this.donationBatch = donationBatchRepository;
    this.donation = donationRepository;
    this.form = formRepository;
    this.formSubmission = formSubmissionRepository;
    this.fundDonation = fundDonationRepository;
    this.fund = fundRepository;
    this.groupMember = groupMemberRepository;
    this.group = groupRepository;
    this.groupServiceTime = groupServiceTimeRepository;
    this.household = householdRepository;
    this.note = noteRepository;
    this.person = personRepository;
    this.question = questionRepository;
    this.service = serviceRepository;
    this.serviceTime = serviceTimeRepository;
    this.session = sessionRepository;
    this.visit = visitRepository;
    this.visitSession = visitSessionRepository;
  }
}
