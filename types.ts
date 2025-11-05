export interface CampaignData {
  subjectLines: string[];
  body: string;
}

export interface CampaignResult extends CampaignData {
  imageUrl: string | null;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}
