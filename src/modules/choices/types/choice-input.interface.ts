export interface ChoiceInput {
  choice_id: string; // Temp ID for new (format: 'temp_<uuid>'), or real UUID for existing
  choice_text: string;
}
