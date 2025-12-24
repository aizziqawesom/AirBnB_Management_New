import * as React from 'react';

interface BookingEmailTemplateProps {
  guestName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingReference: string;
  totalPrice: string;
  numGuests: string;
  status: string;
}

export function BookingEmailTemplate({
  guestName,
  propertyName,
  checkInDate,
  checkOutDate,
  bookingReference,
  totalPrice,
  numGuests,
  status,
}: BookingEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f9fafb', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#111827', fontSize: '28px', marginBottom: '10px' }}>
          StayFlow
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Property Management</p>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '40px 20px' }}>
        <h2 style={{ color: '#111827', fontSize: '24px', marginBottom: '20px' }}>
          Hello {guestName}! 👋
        </h2>

        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          Your booking status has been updated to: <strong>{status}</strong>
        </p>

        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
          <h3 style={{ color: '#111827', fontSize: '18px', marginTop: '0', marginBottom: '15px' }}>
            Booking Details
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280', fontSize: '14px' }}>Reference:</td>
              <td style={{ padding: '8px 0', color: '#111827', fontSize: '14px', fontWeight: 'bold', textAlign: 'right' }}>
                {bookingReference}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280', fontSize: '14px' }}>Property:</td>
              <td style={{ padding: '8px 0', color: '#111827', fontSize: '14px', textAlign: 'right' }}>
                {propertyName}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280', fontSize: '14px' }}>Check-in:</td>
              <td style={{ padding: '8px 0', color: '#111827', fontSize: '14px', textAlign: 'right' }}>
                {checkInDate}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280', fontSize: '14px' }}>Check-out:</td>
              <td style={{ padding: '8px 0', color: '#111827', fontSize: '14px', textAlign: 'right' }}>
                {checkOutDate}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280', fontSize: '14px' }}>Guests:</td>
              <td style={{ padding: '8px 0', color: '#111827', fontSize: '14px', textAlign: 'right' }}>
                {numGuests}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280', fontSize: '14px', borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                Total Price:
              </td>
              <td style={{ padding: '8px 0', color: '#059669', fontSize: '18px', fontWeight: 'bold', textAlign: 'right', borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                {totalPrice}
              </td>
            </tr>
          </table>
        </div>

        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginTop: '30px' }}>
          If you have any questions, please don't hesitate to contact us.
        </p>

        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginTop: '15px' }}>
          Best regards,<br />
          <strong>The StayFlow Team</strong>
        </p>
      </div>

      <div style={{ backgroundColor: '#f9fafb', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>
          This is an automated message from StayFlow Property Management
        </p>
      </div>
    </div>
  );
}
