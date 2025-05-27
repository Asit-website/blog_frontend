import React, { useState, useEffect } from 'react';

const Accordion = ({ content }) => {
  const [accordionContent, setAccordionContent] = useState([]);

  useEffect(() => {
    // Parse the accordion content from the TinyMCE editor
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const accordionItems = doc.querySelectorAll('.accordion-item');

    const parsedContent = [];
    accordionItems.forEach((item) => {
      const header = item.querySelector('.accordion-header').textContent;
      const body = item.querySelector('.accordion-content').innerHTML;
      parsedContent.push({ header, body });
    });

    setAccordionContent(parsedContent);
  }, [content]);

  return (
    <div className="accordion">
      {accordionContent.map((item, index) => (
        <AccordionItem key={index} header={item.header} body={item.body} />
      ))}
    </div>
  );
};

const AccordionItem = ({ header, body }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="accordion-item">
      <div
        className={`accordion-header \${isExpanded ? 'active' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {header}
      </div>
      <div
        className="accordion-content"
        style={{ display: isExpanded ? 'block' : 'none' }}
      >
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
};

export default Accordion;