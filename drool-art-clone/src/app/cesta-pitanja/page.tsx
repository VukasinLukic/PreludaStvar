import Faq from "@/components/Faq";

export const metadata = {
  title: 'PreludaStvar | Često postavljana pitanja',
  description: 'Odgovori na često postavljana pitanja o PreludaStvar posterima',
}

export default function FAQPage() {
  const faqData = {
    titleKey: "faq.title",
    subtitleKey: "faq.subtitle",
    faqList: [
      {
        questionKey: "faq.question1",
        answerKey: "faq.answer1"
      },
      {
        questionKey: "faq.question2",
        answerKey: "faq.answer2"
      },
      {
        questionKey: "faq.question3",
        answerKey: "faq.answer3"
      },
      {
        questionKey: "faq.question4",
        answerKey: "faq.answer4"
      },
      {
        questionKey: "faq.question5",
        answerKey: "faq.answer5"
      },
      {
        questionKey: "faq.question6",
        answerKey: "faq.answer6"
      }
    ],
    footerTextKey: "faq.footerText",
    footerButtonTitleKey: "common.contactUs",
    footerLink: "/kontakt"
  };

  return (
    <main className="min-h-screen pt-24">
      <Faq data={faqData} />
    </main>
  );
} 