import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  MessageCard,
  SearchField,
  Footer,
} from '../components';

interface VicharScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

interface VicharItem {
  id: string;
  typeLabel: string;
  title: string;
  date: string;
  preview: string;
  author: string;
  topic?: string;
}

const mockVicharList: VicharItem[] = [
  {
    id: '1',
    typeLabel: '📝 संदेश',
    title: 'अहिंसा का वास्तविक अर्थ',
    date: '7 सितंबर 2026',
    preview:
      'अहिंसा केवल हिंसा से दूर रहना नहीं, बल्कि अपने विचार, वचन और कर्म में सभी के प्रति सद्भाव रखना है...',
    author: 'अहिंसा शिक्षा मिशन',
    topic: 'अहिंसा',
  },
  {
    id: '5',
    typeLabel: '📝 संदेश',
    title: 'शिक्षा का उद्देश्य',
    date: '5 सितंबर 2026',
    preview:
      'सच्ची शिक्षा वह है जो मनुष्य को भीतर से स्वतंत्र, विचारशील और संवेदनशील बनाए, केवल सांसारिक ज्ञान और सूचनाओं का संचय नहीं...',
    author: 'अहिंसा शिक्षा मिशन',
    topic: 'शिक्षा',
  },
  {
    id: '6',
    typeLabel: '📝 संदेश',
    title: 'मानवता सबसे बड़ा धर्म',
    date: '2 सितंबर 2026',
    preview:
      'मानवता से बढ़कर कोई धर्म नहीं और निःस्वार्थ सेवा से बढ़कर कोई पूजा नहीं। जब हम दूसरों के दुःख को अपना समझें, तभी संसार में सच्ची शांति संभव है...',
    author: 'स्वामी विवेकानंद विचार मंच',
    topic: 'मानवता',
  },
  {
    id: '2',
    typeLabel: '📝 संदेश',
    title: 'सत्य और आंतरिक शांति',
    date: '1 सितंबर 2026',
    preview:
      'सत्य की राह में कठिनाइयाँ हो सकती हैं, किंतु वही मार्ग अंतरात्मा को निर्भय और स्थिर बनाता है। जहाँ भय नहीं, वहीं वास्तविक शांति है...',
    author: 'महात्मा गांधी',
    topic: 'सत्य',
  },
  {
    id: '3',
    typeLabel: '📝 संदेश',
    title: 'क्रोध पर विजय और मन का संयम',
    date: '28 अगस्त 2026',
    preview:
      'क्रोध को शांति से, बुराई को भलाई से, स्वार्थ को उदारता से और असत्य को सत्य से जीता जा सकता है। क्रोध के क्षण में शांत रहना ही सबसे बड़ा पराक्रम है...',
    author: 'भगवान बुद्ध',
    topic: 'संयम',
  },
  {
    id: '4',
    typeLabel: '📝 संदेश',
    title: 'सद्भावना और परस्पर बंधुत्व का मार्ग',
    date: '25 अगस्त 2026',
    preview:
      'सच्चा प्रेम और सद्भाव सीमाओं, जातियों और भाषाओं से परे होता है। जब तक हम दूसरों के सुख-दुःख को अपना नहीं समझते, तब तक मानवीय उन्नति अधूरी है...',
    author: 'आचार्य विनोबा भावे',
    topic: 'सद्भाव',
  },
  {
    id: '7',
    typeLabel: '📝 संदेश',
    title: 'चरित्र और सदाचार की शक्ति',
    date: '20 अगस्त 2026',
    preview:
      'मनुष्य की वास्तविक पहचान उसके धन, पद या बाह्य प्रतिष्ठा से नहीं, अपितु उसके चारित्रिक सौंदर्य और दूसरों के प्रति उसके निष्कपट व्यवहार से होती है...',
    author: 'अहिंसा शिक्षा मिशन',
    topic: 'सदाचार',
  },
  {
    id: '8',
    typeLabel: '📝 संदेश',
    title: 'प्रकृति और जीवन का सह-अस्तित्व',
    date: '16 अगस्त 2026',
    preview:
      'प्रकृति हर प्राणी की आवश्यकता पूरी करने में समर्थ है, किंतु किसी के लोभ की पूर्ति नहीं कर सकती। प्रकृति के प्रति कृतज्ञता और संतुलन ही सच्ची शांति है...',
    author: 'सर्वोदय विचार मंच',
    topic: 'पर्यावरण',
  },
];

export const VicharScreen: React.FC<VicharScreenProps> = ({ onNavigateToDetail }) => {
  const [search, setSearch] = useState('');

  // Clean filter by search query
  const filteredMessages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockVicharList;
    return mockVicharList.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.preview.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        (item.topic && item.topic.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <PageContainer>
      {/* 1. Page Header */}
      <SectionHeading
        title="विचार"
        subtitle="अहिंसा, शिक्षा, मानवता और जीवन से जुड़े विचार।"
        level={1}
        className="mb-2"
      />

      {/* 2. Compact Search Field */}
      <SearchField
        value={search}
        onChange={setSearch}
        placeholder="🔎 विचार खोजें..."
        className="mb-3"
      />

      {/* 3. Subtle Sort / Count Label */}
      <div className="flex items-center justify-between text-[13px] text-[#5C6773] mb-3.5 px-0.5">
        <span>कुल {filteredMessages.length} विचार</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#16325C]/80">
          <ArrowUpDown size={12} />
          नवीनतम पहले
        </span>
      </div>

      {/* 4. Message List or Empty State */}
      {filteredMessages.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {filteredMessages.map((item) => (
            <MessageCard
              key={item.id}
              typeLabel={item.typeLabel}
              title={item.title}
              date={item.date}
              content={item.preview}
              author={item.author}
              topic={item.topic}
              onReadMore={() => onNavigateToDetail?.(`/vichar/${item.id}`)}
            />
          ))}
        </div>
      ) : (
        /* Empty State Component: Only displayed when search yields no match */
        <div
          role="status"
          className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-2xl border border-[#E8E5DF] my-2"
        >
          <div className="w-12 h-12 rounded-full bg-[#EEF3FA] text-[#16325C] flex items-center justify-center mb-3">
            <Search size={20} />
          </div>
          <h3 className="text-[16px] font-semibold text-[#16325C] mb-1">
            अभी कोई विचार उपलब्ध नहीं है।
          </h3>
          <p className="text-[13px] text-[#5C6773] max-w-[260px] leading-relaxed">
            आपके द्वारा खोजे गए शब्द से संबंधित कोई विचार नहीं मिला। कृपया अन्य शब्द का प्रयास करें।
          </p>
        </div>
      )}

      {/* 5. Clean Footer */}
      <Footer />
    </PageContainer>
  );
};
