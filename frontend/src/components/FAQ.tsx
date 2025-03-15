import { useState } from "react";
import "../assets/faq.css";

const faqData = [
  {
    question: "Comment créer un compte ?",
    answer: "Cliquez sur 'S'inscrire' en haut à droite et remplissez le formulaire avec vos informations.",
  },
  {
    question: "Comment ajouter une tâche ?",
    answer: "Une fois connecté, accédez à votre tableau de bord et cliquez sur 'Ajouter une tâche'.",
  },
  {
    question: "Comment suivre l'avancement de mes projets ?",
    answer: "Utilisez le tableau Kanban pour voir les statuts des tâches en temps réel.",
  },
  {
    question: "Les professeurs peuvent-ils voir toutes les tâches des étudiants ?",
    answer: "Oui, les professeurs ont une vue globale des projets et peuvent suivre l’avancement.",
  },
  {
    question: "Comment contacter le support ?",
    answer: "Envoyez un email à support@gestiontaches.com ou utilisez le formulaire de contact.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <h2>Foire aux Questions (FAQ)</h2>
      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question}
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
