export type MessageRecipient = 'guest' | 'cleaner' | 'team';

export interface MessageTemplate {
  id: string;
  organization_id: string;
  title: string;
  recipient: MessageRecipient;
  template: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageTemplateData {
  title: string;
  recipient: MessageRecipient;
  template: string;
}

export interface UpdateMessageTemplateData {
  title?: string;
  recipient?: MessageRecipient;
  template?: string;
}

// Available template variables
export const TEMPLATE_VARIABLES = {
  guest: [
    { label: 'Guest Name', value: '{{guest_name}}' },
    { label: 'Property Name', value: '{{property_name}}' },
    { label: 'Check-in Date', value: '{{check_in_date}}' },
    { label: 'Check-out Date', value: '{{check_out_date}}' },
    { label: 'Booking Reference', value: '{{booking_reference}}' },
    { label: 'Total Price', value: '{{total_price}}' },
    { label: 'Number of Guests', value: '{{num_guests}}' },
  ],
  cleaner: [
    { label: 'Cleaner Name', value: '{{cleaner_name}}' },
    { label: 'Property Name', value: '{{property_name}}' },
    { label: 'Property Address', value: '{{property_address}}' },
    { label: 'Cleaning Date', value: '{{cleaning_date}}' },
    { label: 'Special Instructions', value: '{{special_instructions}}' },
  ],
  team: [
    { label: 'Team Member Name', value: '{{team_member_name}}' },
    { label: 'Property Name', value: '{{property_name}}' },
    { label: 'Task Description', value: '{{task_description}}' },
    { label: 'Due Date', value: '{{due_date}}' },
  ],
};

// Sample data for preview
export const SAMPLE_DATA = {
  guest: {
    guest_name: 'John Doe',
    property_name: 'Sunset Villa',
    check_in_date: '15 Dec 2025',
    check_out_date: '18 Dec 2025',
    booking_reference: 'BK12345',
    total_price: 'RM 750.00',
    num_guests: '2',
  },
  cleaner: {
    cleaner_name: 'Mary Smith',
    property_name: 'Sunset Villa',
    property_address: '123 Beach Road, Langkawi',
    cleaning_date: '14 Dec 2025',
    special_instructions: 'Deep clean kitchen and bathrooms',
  },
  team: {
    team_member_name: 'Alex Johnson',
    property_name: 'Sunset Villa',
    task_description: 'Check air conditioning unit',
    due_date: '10 Dec 2025',
  },
};
