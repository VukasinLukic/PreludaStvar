'use client';

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface FaqItems {
  questionKey: string;
  answerKey: string;
}

interface FaqData {
  faqList: FaqItems[];
  titleKey: string;
  subtitleKey: string;
  footerTextKey?: string;
  footerButtonTitleKey?: string;
  footerLink?: string;
}

interface FAQProps {
  data: FaqData;
}

const Faq = ({ data }: FAQProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { t } = useLanguage();

  const toggleItem = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-lg md:text-xl font-medium tracking-wider text-blue-600 mb-3">
            {t(data.titleKey)}
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            {t(data.subtitleKey)}
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {data.faqList.map((item, index) => (
            <div
              key={index}
              className="mb-4"
            >
              <motion.div 
                className={`bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 overflow-hidden ${
                  expandedId === index ? 'shadow-lg' : ''
                }`}
                initial={false}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  onClick={() => toggleItem(index)}
                  className="p-6 cursor-pointer flex justify-between items-center"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t(item.questionKey)}
                  </h3>
                  <div className="flex-shrink-0 ml-4">
                    <AnimatePresence initial={false} mode="wait">
                      {expandedId === index ? (
                        <motion.div
                          key="chevron-up"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronUp className="w-5 h-5 text-blue-600" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="chevron-down"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-blue-600" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                
                <AnimatePresence initial={false}>
                  {expandedId === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <motion.p 
                          className="text-gray-600 leading-relaxed pt-4"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          {t(item.answerKey)}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
        </div>
        
        {data.footerTextKey && (
          <motion.div
            className="text-center mt-12 py-16 bg-black text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">{t(data.footerTextKey)}</h2>
              
              {data.footerButtonTitleKey && data.footerLink && (
                <Link 
                  href={data.footerLink} 
                  className="mt-6 bg-white text-black px-8 py-4 rounded-md font-medium inline-block hover:bg-gray-200 transition duration-300"
                >
                  {t(data.footerButtonTitleKey)}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Faq; 