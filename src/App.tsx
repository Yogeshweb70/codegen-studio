import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { defaultTemplate, generateEmailHtml, generateEmailHtmlFromFigmaLink } from './utils';
import { EmailTemplateModel } from './types';

function App() {
  const [model, setModel] = useState<EmailTemplateModel>(defaultTemplate());
  const [figmaLink, setFigmaLink] = useState('');
  const [activePreview, setActivePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [generatedHtml, setGeneratedHtml] = useState<string>(generateEmailHtml(defaultTemplate()));
  const [generationMessage, setGenerationMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFieldChange = (field: keyof EmailTemplateModel, value: string) => {
    setModel((prev) => ({ ...prev, [field]: value }));
  };

  const exportHtml = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'email-template.html';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const generateTemplate = async () => {
    setIsGenerating(true);
    setGenerationMessage(figmaLink.trim() ? 'Reading the Figma design and generating responsive email HTML...' : 'Generating HTML from your reference...');

    try {
      if (figmaLink.trim()) {
        const result = await generateEmailHtmlFromFigmaLink(model, figmaLink);
        setGeneratedHtml(result.html);
        setGenerationMessage(result.message);
        return;
      }

      const html = generateEmailHtml(model);
      setGeneratedHtml(html);
      setGenerationMessage('HTML generated successfully. Preview updated.');
    } catch (error) {
      setGenerationMessage(error instanceof Error ? error.message : 'Unable to generate the email template from the Figma link.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyHtml = async () => {
    await navigator.clipboard.writeText(generatedHtml);
    alert('HTML copied to clipboard.');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(model, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'email-model.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const previewWidth = activePreview === 'desktop' ? 640 : activePreview === 'tablet' ? 480 : 360;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-card">
          <h2>Campaign Content</h2>
          <label>
            Subject
            <input value={model.subject} onChange={(e) => handleFieldChange('subject', e.target.value)} />
          </label>
          <label>
            Preheader
            <input value={model.preheader} onChange={(e) => handleFieldChange('preheader', e.target.value)} />
          </label>
          <label>
            Logo
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Logo URL</div>
            <input value={model.logoUrl} onChange={(e) => handleFieldChange('logoUrl', e.target.value)} />
          </label>
          <label>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Logo URL for logo link</div>
            <input value={model.logoLink ?? ''} onChange={(e) => handleFieldChange('logoLink', e.target.value)} />
          </label>
          <label>
            Header CTA Text
            <input value={model.headerButtonText ?? ''} onChange={(e) => handleFieldChange('headerButtonText', e.target.value)} />
          </label>
          <label>
            Header CTA URL
            <input value={model.headerButtonUrl ?? ''} onChange={(e) => handleFieldChange('headerButtonUrl', e.target.value)} />
          </label>
          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#111827', marginBottom: 8 }}>Document Content</span>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
              <ReactQuill 
                value={model.docContent ?? ''} 
                onChange={(value) => handleFieldChange('docContent', value)}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                theme="snow"
                style={{ height: 200 }}
              />
            </div>
          </label>
        </div>

        <div className="sidebar-card">
          <h2>Generate Email</h2>
          <label>
            Figma Template Link
            <input value={figmaLink} onChange={(e) => setFigmaLink(e.target.value)} placeholder="Paste Figma link here" />
          </label>
          <button type="button" className="primary" onClick={generateTemplate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate from reference'}
          </button>
          {generationMessage && <p style={{ marginTop: 12, color: '#111827' }}>{generationMessage}</p>}
        </div>

        <div className="sidebar-card">
          <h2>Export</h2>
          <button type="button" onClick={exportHtml}>
            Download HTML
          </button>
          <button type="button" onClick={copyHtml}>
            Copy HTML
          </button>
          <button type="button" onClick={exportJson}>
            Export JSON
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <div className="preview-toolbar">
          <div>
            <h1>Live Email Preview</h1>
            <p>Template: {figmaLink || 'Selected layout preview'}</p>
          </div>
          <div className="preview-modes">
            {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
              <button key={mode} type="button" className={activePreview === mode ? 'active' : ''} onClick={() => setActivePreview(mode)}>
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="preview-frame" style={{ width: previewWidth + 24 }}>
          <iframe
            title="Email preview"
            srcDoc={generatedHtml}
            sandbox="allow-scripts allow-same-origin"
            style={{ width: previewWidth, minHeight: 720, border: '1px solid #d0d5db', borderRadius: 12 }}
          />
        </div>

        <div className="editor-panel">
          <h2>Generated HTML</h2>
          <textarea value={generatedHtml} readOnly rows={18} />
        </div>
      </main>
    </div>
  );
}

export default App;
