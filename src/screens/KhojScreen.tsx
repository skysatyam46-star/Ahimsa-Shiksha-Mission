import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import {
  PageContainer,
  SectionHeading,
  SearchField,
  SearchResultCard,
  EmptyState,
  Footer,
} from '../components';

interface KhojScreenProps {
  onNavigateToDetail?: (path: string) => void;
}

interface MockSearchResult {
  id: string;
  type: 'vichar' | 'video' | 'audio' | 'photo' | 'document' | 'notice';
  typeLabel: string;
  title: string;
  excerpt: string;
  date: string;
  route: string;
  keywords: string[];
}

const mockSearchDataset: MockSearchResult[] = [
  // 1. विचार (Messages)
  {
    id: '1',
    type: 'vichar',
    typeLabel: '📝 विचार',
    title: 'अहिंसा हमारे जीवन की शक्ति है',
    excerpt:
      'जब विचारों में करुणा आती है, तो व्यवहार में अहिंसा दिखाई देती है। अहिंसा केवल अस्त्र त्यागना नहीं, अंतःकरण की पवित्रता है।',
    date: '7 सितम्बर 2026',
    route: '/vichar/1',
    keywords: ['अहिंसा', 'जीवन', 'शक्ति', 'विचार', 'करुणा', 'सद्भाव'],
  },
  {
    id: '5',
    type: 'vichar',
    typeLabel: '📝 विचार',
    title: 'शिक्षा का वास्तविक उद्देश्य',
    excerpt:
      'सच्ची शिक्षा वह है जो मनुष्य को भीतर से स्वतंत्र, विचारशील और संवेदनशील बनाए, केवल सूचनाओं का संचय नहीं।',
    date: '5 सितम्बर 2026',
    route: '/vichar/5',
    keywords: ['शिक्षा', 'उद्देश्य', 'ज्ञान', 'संवेदनशीलता', 'विद्यार्थी'],
  },
  {
    id: '2',
    type: 'vichar',
    typeLabel: '📝 विचार',
    title: 'सत्य और आंतरिक शांति',
    excerpt:
      'सत्य की राह में कठिनाइयाँ हो सकती हैं, किंतु वही मार्ग अंतरात्मा को निर्भय और स्थिर बनाता है। जहाँ भय नहीं, वहीं शांति है।',
    date: '1 सितम्बर 2026',
    route: '/vichar/2',
    keywords: ['सत्य', 'शांति', 'आंतरिक', 'गांधी', 'निर्भय'],
  },
  {
    id: '6',
    type: 'vichar',
    typeLabel: '📝 विचार',
    title: 'मानवता सबसे बड़ा धर्म',
    excerpt:
      'मानवता से बढ़कर कोई धर्म नहीं और निःस्वार्थ सेवा से बढ़कर कोई पूजा नहीं। जब हम दूसरों के दुःख को अपना समझें, तभी सच्ची शांति संभव है।',
    date: '2 सितम्बर 2026',
    route: '/vichar/6',
    keywords: ['मानवता', 'धर्म', 'सेवा', 'शांति', 'सहानुभूति'],
  },

  // 2. वीडियो (Videos)
  {
    id: '1',
    type: 'video',
    typeLabel: '🎥 वीडियो',
    title: 'अहिंसा और मानवता का संबंध',
    excerpt:
      'इस वीडियो में अहिंसा, मानवता और हमारे दैनिक जीवन में सकारात्मक सोच के महत्व पर विशेष व्याख्यान प्रस्तुत किए गए हैं।',
    date: '6 सितम्बर 2026',
    route: '/video/1',
    keywords: ['अहिंसा', 'मानवता', 'संबंध', 'वीडियो', 'व्याख्यान', 'सोच'],
  },
  {
    id: '4',
    type: 'video',
    typeLabel: '🎥 वीडियो',
    title: 'अहिंसा और मूल्य आधारित शिक्षा',
    excerpt:
      'शिक्षा प्रणाली में अहिंसक मूल्यों, मानवीय संवेदनाओं और चरित्र निर्माण के समावेश पर विस्तृत परिचर्चा।',
    date: '3 सितम्बर 2026',
    route: '/video/4',
    keywords: ['शिक्षा', 'अहिंसा', 'मूल्य', 'चरित्र', 'स्कूल'],
  },
  {
    id: '2',
    type: 'video',
    typeLabel: '🎥 वीडियो',
    title: 'सत्याग्रह और अहिंसक संघर्ष',
    excerpt:
      'महात्मा गांधी के सत्याग्रह और अहिंसक संघर्ष के ऐतिहासिक सिद्धांतों की वर्तमान परिप्रेक्ष्य में समीक्षा।',
    date: '27 अगस्त 2026',
    route: '/video/2',
    keywords: ['सत्य', 'सत्याग्रह', 'गांधी', 'अहिंसा', 'संघर्ष'],
  },

  // 3. ऑडियो (Audio)
  {
    id: '1',
    type: 'audio',
    typeLabel: '🎧 ऑडियो',
    title: 'अहिंसा पर विशेष संदेश',
    excerpt:
      'दैनिक जीवन में अहिंसक सोच, वाणी के संयम और मानसिक तनाव से मुक्ति पर शांतिपूर्ण विचारणीय उद्बोधन।',
    date: '5 सितम्बर 2026',
    route: '/audio/1',
    keywords: ['अहिंसा', 'ऑडियो', 'संदेश', 'शांति', 'संयम', 'वाणी'],
  },

  // 4. दस्तावेज (Document)
  {
    id: '1',
    type: 'document',
    typeLabel: '📄 दस्तावेज',
    title: 'अहिंसा शिक्षा — अध्ययन सामग्री',
    excerpt:
      'अहिंसक समाज निर्माण एवं विद्यालयों में नैतिक चेतना विकसित करने हेतु आधिकारिक पाठ्य सामग्री व मार्गदर्शिका।',
    date: '2 सितम्बर 2026',
    route: '/document/1',
    keywords: ['अहिंसा', 'शिक्षा', 'दस्तावेज', 'pdf', 'अध्ययन', 'सामग्री'],
  },

  // 5. सूचना (Notice)
  {
    id: '1',
    type: 'notice',
    typeLabel: '📢 सूचना',
    title: 'अहिंसा शिक्षा कार्यक्रम की सूचना',
    excerpt:
      'आगामी राष्ट्रीय अहिंसा संगोष्ठी, शिक्षक प्रशिक्षण कार्यशाला एवं सहभागिता के दिशा-निर्देश।',
    date: '1 सितम्बर 2026',
    route: '/notice/1',
    keywords: ['अहिंसा', 'शिक्षा', 'सूचना', 'कार्यक्रम', 'कार्यशाला', 'घोषणा'],
  },

  // 6. फोटो (Photo)
  {
    id: '1',
    type: 'photo',
    typeLabel: '🖼️ फोटो',
    title: 'शिक्षा व सद्भाव कार्यक्रम की पावन झलकियाँ',
    excerpt:
      'सत्य और शांति के वातावरण में आयोजित अहिंसा विचार गोष्ठी के प्रेरणादायी दृश्य एवं सहभागिता।',
    date: '3 सितम्बर 2026',
    route: '/photo/1',
    keywords: ['फोटो', 'शिक्षा', 'सद्भाव', 'कार्यक्रम', 'झलकियाँ'],
  },
];

const suggestions = ['अहिंसा', 'शिक्षा', 'सत्य', 'मानवता'];

export const KhojScreen: React.FC<KhojScreenProps> = ({ onNavigateToDetail }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const trimmedQuery = searchTerm.trim().toLowerCase();

  // Filter dataset based on query
  const searchResults = useMemo(() => {
    if (!trimmedQuery) return [];
    return mockSearchDataset.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmedQuery) ||
        item.excerpt.toLowerCase().includes(trimmedQuery) ||
        item.typeLabel.toLowerCase().includes(trimmedQuery) ||
        item.keywords.some((k) => k.toLowerCase().includes(trimmedQuery))
    );
  }, [trimmedQuery]);

  const hasSearched = trimmedQuery.length > 0;

  return (
    <PageContainer>
      {/* 1. Header */}
      <SectionHeading
        title="खोजें"
        subtitle="विचार, वीडियो और सामग्री खोजें"
        level={1}
        className="mb-3"
      />

      {/* 2. Compact, Touch-Friendly Search Input */}
      <SearchField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="🔎 विचार, वीडियो और सामग्री खोजें…"
        onClear={() => setSearchTerm('')}
        className="mb-4"
      />

      {/* 3. Initial Search State (Shown when no search term is entered) */}
      {!hasSearched && (
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 my-1 flex flex-col gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-[#16325C]">
              क्या खोजें?
            </h3>
            <p className="text-[13px] text-[#5C6773] mt-0.5 leading-normal">
              मिशन के विचार, वीडियो, ऑडियो व दस्तावेज खोजने हेतु नीचे दिए गए विषयों पर टैप करें:
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setSearchTerm(suggestion)}
                className="px-3.5 py-2 bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl text-[14px] font-medium text-[#16325C] hover:bg-[#EEF3FA] hover:border-[#16325C]/30 tap-active transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Search Results State */}
      {hasSearched && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[13px] text-[#5C6773] px-0.5">
            <span className="font-semibold text-[#16325C]">
              खोज परिणाम ({searchResults.length})
            </span>
            <span className="text-[#8C96A3]">
              “{searchTerm}” के लिए
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {searchResults.map((result) => (
                <SearchResultCard
                  key={`${result.type}-${result.id}`}
                  typeLabel={result.typeLabel}
                  title={result.title}
                  excerpt={result.excerpt}
                  date={result.date}
                  onClick={() => onNavigateToDetail?.(result.route)}
                />
              ))}
            </div>
          ) : (
            /* No Results State */
            <EmptyState
              icon={<Search size={22} className="text-[#16325C]" />}
              title="कोई परिणाम नहीं मिला"
              description="किसी दूसरे शब्द से खोजने का प्रयास करें।"
              className="my-2"
            />
          )}
        </div>
      )}

      {/* 5. Clean Minimal Footer */}
      <Footer />
    </PageContainer>
  );
};
