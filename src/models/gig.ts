export interface Gig {
    _id?: string;
    title: string;
    company: string;
    description: string;
    deadline: Date;
    guidelines: string;
    evaluationCriteria: string;
    bounty: number;
    breakdown: string;
    contact: string;
    skills: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export class Gig {
    constructor(gigData: any) {
      this.title = gigData.title;
      this.company = gigData.company;
      this.description = gigData.description;
      this.deadline = new Date(gigData.deadline);
      this.guidelines = gigData.guidelines;
      this.evaluationCriteria = gigData.evaluationCriteria;
      this.bounty = gigData.bounty;
      this.breakdown = gigData.breakdown;
      this.contact = gigData.contact;
      this.skills = gigData.skills;
    }

    validateBounty() {
      // This method may need to be updated or removed based on the new structure
      throw new Error('Method not implemented');
    }

    getTotalBounty(): number {
      return this.bounty;
    }

    getBountyBreakdown(): string {
      return this.breakdown;
    }
  }