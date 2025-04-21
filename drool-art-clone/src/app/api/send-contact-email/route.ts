import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the expected request body structure
interface ContactRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ContactRequestBody;
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- Send email using Resend --- 
    const adminEmail = 'bojnikola@gmail.com'; // Destination email address
    const emailSubject = `New Contact Form Submission: ${subject}`;
    const emailHtmlBody = `
      <h1>New Contact Message from PreludaStvar</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p> // Replace newlines with <br> for HTML email
    `;

    const { data, error: sendError } = await resend.emails.send({
      from: 'PreludaStvar Contact <kontakt@mg.preludatstvar.com>', // TODO: Replace with your verified Resend domain/email
      to: [adminEmail],
      subject: emailSubject,
      html: emailHtmlBody,
      replyTo: email, // Corrected parameter name
    });

    if (sendError) {
      console.error('Resend API Error:', sendError);
      return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
    }

    console.log('Resend API Success:', data);
    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 