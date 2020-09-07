import { Donation } from "./";

export class FundDonation {
    public id?: number;
    public churchId?: number;
    public donationId?: number;
    public fundId?: number;
    public contentId?: number;
    public amount?: number;

    public donation?: Donation;
}
