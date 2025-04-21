import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicijalizacija Resend sa API ključem iz env varijabli
const resend = new Resend(process.env.RESEND_API_KEY);

// Definisanje strukture tela zahteva
interface OrderEmailRequestBody {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderItems: Array<{
    name: string;
    price: number;
    quantity: number;
    size?: string;
    finish?: string;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  orderTotal: number;
  igDiscount?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as OrderEmailRequestBody;
    const { orderId, customerName, customerEmail, orderItems, shippingAddress, orderTotal, igDiscount } = body;

    // Osnovna validacija
    if (!orderId || !customerName || !customerEmail || !orderItems || !shippingAddress) {
      return NextResponse.json({ error: 'Nedostaju obavezna polja' }, { status: 400 });
    }

    // Kreiranje HTML tabele za stavke narudžbine
    const itemsTable = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="border-bottom: 1px solid #ddd;">
            <th style="padding: 10px; text-align: left;">Proizvod</th>
            <th style="padding: 10px; text-align: center;">Količina</th>
            <th style="padding: 10px; text-align: right;">Cena</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems.map(item => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; text-align: left;">
                ${item.name}
                ${item.size ? `<br><span style="font-size: 12px; color: #666;">Veličina: ${item.size}</span>` : ''}
                ${item.finish ? `<br><span style="font-size: 12px; color: #666;">Okvir: ${item.finish}</span>` : ''}
              </td>
              <td style="padding: 10px; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right;">${item.price * item.quantity} RSD</td>
            </tr>
          `).join('')}
          ${igDiscount ? `
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Instagram popust:</td>
              <td style="padding: 10px; text-align: right; color: #e53e3e;">-${igDiscount} RSD</td>
            </tr>
          ` : ''}
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Ukupno:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">${orderTotal} RSD</td>
          </tr>
        </tbody>
      </table>
    `;

    // Kreiranje HTML tela email-a
    const emailHtmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000; text-align: center; margin-bottom: 30px;">Potvrda porudžbine</h1>
        
        <p>Poštovani/a ${customerName},</p>
        
        <p>Hvala Vam na porudžbini! Primili smo Vašu porudžbinu i trenutno je obrađujemo.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0; font-size: 18px;">Detalji porudžbine</h2>
          <p><strong>Broj porudžbine:</strong> ${orderId}</p>
          <p><strong>Datum:</strong> ${new Date().toLocaleDateString('sr-RS')}</p>
        </div>
        
        <h3>Poručeni proizvodi</h3>
        ${itemsTable}
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Adresa za dostavu</h3>
          <p>${customerName}</p>
          <p>${shippingAddress.address}</p>
          <p>${shippingAddress.postalCode} ${shippingAddress.city}</p>
          <p>${shippingAddress.country}</p>
        </div>
        
        <p>Očekujte isporuku u roku od 3-5 radnih dana.</p>
        
        <p>Za sva pitanja možete nas kontaktirati na <a href="mailto:info@preludastvar.rs">info@preludastvar.rs</a>.</p>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} PreludaStvar. Sva prava zadržana.
          </p>
        </div>
      </div>
    `;

    // Slanje email-a pomoću Resend-a
    const { data, error: sendError } = await resend.emails.send({
      from: 'PreludaStvar <porudzbine@mg.preludastvar.com>', // Promeniti u vašu verifikovanu Resend adresu
      to: [customerEmail],
      bcc: ['info@preludastvar.rs'], // Kopirajte vlasnike prodavnice
      subject: `Potvrda porudžbine #${orderId}`,
      html: emailHtmlBody,
    });

    if (sendError) {
      console.error('Resend API Greška:', sendError);
      return NextResponse.json({ error: 'Neuspešno slanje email-a. Pokušajte ponovo kasnije.' }, { status: 500 });
    }

    console.log('Resend API Uspeh:', data);
    return NextResponse.json({ message: 'Email uspešno poslat!' }, { status: 200 });

  } catch (error) {
    console.error('API Route Greška:', error);
    return NextResponse.json({ error: 'Interna greška servera' }, { status: 500 });
  }
} 