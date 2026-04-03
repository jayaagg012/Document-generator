import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Briefcase, 
  User,
  MapPin,
  Calendar,
  IndianRupee
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('invoice');

  // --- GST INVOICE STATE ---
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-001`,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    supplier: { name: '', address: '', gstin: '', state: '', stateCode: '' },
    recipient: { name: '', address: '', gstin: '', state: '', stateCode: '' },
    items: [{ id: 1, description: '', hsn: '', qty: 1, rate: 0, gstRate: 18 }],
    notes: 'Thank you for your business!',
    terms: '1. Goods once sold will not be taken back.\n2. Interest @18% p.a. will be charged if payment is not made within due date.'
  });

  // --- NDA STATE ---
  const [ndaData, setNdaData] = useState({
    effectiveDate: new Date().toISOString().split('T')[0],
    disclosingParty: '',
    receivingParty: '',
    purpose: 'evaluating a potential business relationship',
    duration: '2',
    governingLaw: 'India',
    jurisdiction: 'New Delhi'
  });

  // --- INVOICE CALCULATIONS ---
  const totals = useMemo(() => {
    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const isInterstate = invoiceData.supplier.stateCode !== invoiceData.recipient.stateCode && 
                        invoiceData.recipient.stateCode !== '';

    invoiceData.items.forEach(item => {
      const lineTotal = item.qty * item.rate;
      subtotal += lineTotal;
      const taxAmount = (lineTotal * item.gstRate) / 100;
      
      if (isInterstate) {
        igst += taxAmount;
      } else {
        cgst += taxAmount / 2;
        sgst += taxAmount / 2;
      }
    });

    return { subtotal, cgst, sgst, igst, total: subtotal + cgst + sgst + igst };
  }, [invoiceData]);

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { id: Date.now(), description: '', hsn: '', qty: 1, rate: 0, gstRate: 18 }]
    });
  };

  const removeItem = (id) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({ ...invoiceData, items: invoiceData.items.filter(i => i.id !== id) });
    }
  };

  const updateItem = (id, field, value) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    });
  };

  // --- ACTIONS ---
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">BizDocs<span className="text-indigo-600">Gen</span></h1>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('invoice')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'invoice' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <FileText size={16} /> GST Invoice
            </button>
            <button 
              onClick={() => setActiveTab('nda')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'nda' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <ShieldCheck size={16} /> NDA
            </button>
          </nav>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {activeTab === 'invoice' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* INVOICE EDITOR */}
            <div className="lg:col-span-7 space-y-6 print:hidden">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><Briefcase size={18} /> Business Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Supplier Name" value={invoiceData.supplier.name} onChange={v => setInvoiceData({...invoiceData, supplier: {...invoiceData.supplier, name: v}})} />
                  <Input label="Supplier GSTIN" placeholder="15-digit Alphanumeric" value={invoiceData.supplier.gstin} onChange={v => setInvoiceData({...invoiceData, supplier: {...invoiceData.supplier, gstin: v}})} />
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                      value={invoiceData.supplier.address}
                      onChange={e => setInvoiceData({...invoiceData, supplier: {...invoiceData.supplier, address: e.target.value}})}
                    />
                  </div>
                  <Input label="State" value={invoiceData.supplier.state} onChange={v => setInvoiceData({...invoiceData, supplier: {...invoiceData.supplier, state: v}})} />
                  <Input label="State Code" value={invoiceData.supplier.stateCode} onChange={v => setInvoiceData({...invoiceData, supplier: {...invoiceData.supplier, stateCode: v}})} />
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><User size={18} /> Client Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Recipient Name" value={invoiceData.recipient.name} onChange={v => setInvoiceData({...invoiceData, recipient: {...invoiceData.recipient, name: v}})} />
                  <Input label="Recipient GSTIN" value={invoiceData.recipient.gstin} onChange={v => setInvoiceData({...invoiceData, recipient: {...invoiceData.recipient, gstin: v}})} />
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Billing Address</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                      value={invoiceData.recipient.address}
                      onChange={e => setInvoiceData({...invoiceData, recipient: {...invoiceData.recipient, address: e.target.value}})}
                    />
                  </div>
                  <Input label="State" value={invoiceData.recipient.state} onChange={v => setInvoiceData({...invoiceData, recipient: {...invoiceData.recipient, state: v}})} />
                  <Input label="State Code" value={invoiceData.recipient.stateCode} onChange={v => setInvoiceData({...invoiceData, recipient: {...invoiceData.recipient, stateCode: v}})} />
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Line Items</h2>
                  <button onClick={addItem} className="text-xs flex items-center gap-1 text-indigo-600 font-bold hover:underline">
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div className="space-y-4">
                  {invoiceData.items.map((item, idx) => (
                    <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-red-200"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6">
                          <Input label="Description" value={item.description} onChange={v => updateItem(item.id, 'description', v)} />
                        </div>
                        <div className="col-span-3">
                          <Input label="HSN/SAC" value={item.hsn} onChange={v => updateItem(item.id, 'hsn', v)} />
                        </div>
                        <div className="col-span-3">
                          <Input label="Qty" type="number" value={item.qty} onChange={v => updateItem(item.id, 'qty', parseFloat(v) || 0)} />
                        </div>
                        <div className="col-span-4">
                          <Input label="Rate" type="number" value={item.rate} onChange={v => updateItem(item.id, 'rate', parseFloat(v) || 0)} />
                        </div>
                        <div className="col-span-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GST %</label>
                          <select 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            value={item.gstRate}
                            onChange={(e) => updateItem(item.id, 'gstRate', parseInt(e.target.value))}
                          >
                            {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                          </select>
                        </div>
                        <div className="col-span-4 flex flex-col justify-end">
                          <span className="text-xs text-slate-400 font-bold uppercase mb-1">Amount</span>
                          <div className="text-sm font-bold bg-slate-200/50 p-2 rounded-lg">₹ {(item.qty * item.rate).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* INVOICE PREVIEW */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white p-8 shadow-2xl border border-slate-200 rounded-lg min-h-[700px] w-full mx-auto print:shadow-none print:border-none print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start mb-8 border-b-2 border-indigo-600 pb-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">TAX INVOICE</h1>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Original for Recipient</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{invoiceData.supplier.name || 'Your Company'}</p>
                    <p className="text-xs text-slate-500">GSTIN: <span className="text-slate-800">{invoiceData.supplier.gstin || 'N/A'}</span></p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-1">Billed To</h3>
                    <p className="font-bold text-sm">{invoiceData.recipient.name || 'Client Name'}</p>
                    <p className="text-[11px] text-slate-600 whitespace-pre-wrap mt-1 leading-relaxed">{invoiceData.recipient.address || 'Address...'}</p>
                    <p className="text-[11px] font-bold mt-2">GSTIN: {invoiceData.recipient.gstin || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-1">Invoice Details</h3>
                    <p className="text-[11px] mb-1">No: <span className="font-bold">{invoiceData.invoiceNumber}</span></p>
                    <p className="text-[11px] mb-1">Date: <span className="font-bold">{invoiceData.date}</span></p>
                    {invoiceData.dueDate && <p className="text-[11px]">Due: <span className="font-bold">{invoiceData.dueDate}</span></p>}
                    <p className="text-[11px] mt-2">Place of Supply: <span className="font-bold">{invoiceData.recipient.state || 'N/A'} ({invoiceData.recipient.stateCode})</span></p>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full text-[11px] mb-8">
                  <thead>
                    <tr className="border-b-2 border-slate-800 text-slate-800 uppercase">
                      <th className="py-2 text-left">Item</th>
                      <th className="py-2 text-center">HSN</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Taxable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="py-3 font-medium">{item.description || 'Description'}</td>
                        <td className="py-3 text-center text-slate-500">{item.hsn || '-'}</td>
                        <td className="py-3 text-center">{item.qty}</td>
                        <td className="py-3 text-right">₹{item.rate.toLocaleString()}</td>
                        <td className="py-3 text-right font-bold">₹{(item.qty * item.rate).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-48 space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span>Subtotal:</span>
                      <span>₹{totals.subtotal.toLocaleString()}</span>
                    </div>
                    {totals.igst > 0 ? (
                      <div className="flex justify-between text-[11px] text-indigo-600 font-medium">
                        <span>IGST:</span>
                        <span>₹{totals.igst.toLocaleString()}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-[11px]">
                          <span>CGST:</span>
                          <span>₹{totals.cgst.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span>SGST:</span>
                          <span>₹{totals.sgst.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-base font-black border-t pt-2 border-slate-800">
                      <span>TOTAL:</span>
                      <span>₹{totals.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 text-[9px] text-slate-400 leading-relaxed grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-slate-600 mb-1">Notes & Terms</h4>
                    <p className="whitespace-pre-wrap">{invoiceData.notes}</p>
                    <p className="whitespace-pre-wrap mt-2">{invoiceData.terms}</p>
                  </div>
                  <div className="text-right flex flex-col justify-end items-end">
                    <div className="w-32 border-b border-slate-300 mb-2 mt-8"></div>
                    <p className="font-bold text-slate-800">Authorized Signatory</p>
                    <p className="text-[8px]">For {invoiceData.supplier.name || 'Your Company'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* NDA EDITOR */}
            <div className="lg:col-span-5 space-y-6 print:hidden">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><ShieldCheck size={18} /> Agreement Parameters</h2>
                <div className="space-y-4">
                  <Input label="Effective Date" type="date" value={ndaData.effectiveDate} onChange={v => setNdaData({...ndaData, effectiveDate: v})} />
                  <Input label="Disclosing Party (Owner)" placeholder="Full Legal Name" value={ndaData.disclosingParty} onChange={v => setNdaData({...ndaData, disclosingParty: v})} />
                  <Input label="Receiving Party (Recipient)" placeholder="Full Legal Name" value={ndaData.receivingParty} onChange={v => setNdaData({...ndaData, receivingParty: v})} />
                  <Input label="Purpose of Sharing" placeholder="e.g. evaluating a merger" value={ndaData.purpose} onChange={v => setNdaData({...ndaData, purpose: v})} />
                  <Input label="Confidentiality Period (Years)" type="number" value={ndaData.duration} onChange={v => setNdaData({...ndaData, duration: v})} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Governing Law" value={ndaData.governingLaw} onChange={v => setNdaData({...ndaData, governingLaw: v})} />
                    <Input label="Jurisdiction City" value={ndaData.jurisdiction} onChange={v => setNdaData({...ndaData, jurisdiction: v})} />
                  </div>
                </div>
              </section>
            </div>

            {/* NDA PREVIEW */}
            <div className="lg:col-span-7">
              <div className="bg-white p-12 shadow-2xl border border-slate-200 rounded-lg min-h-[800px] w-full mx-auto font-serif leading-relaxed text-slate-800 print:shadow-none print:border-none print:p-0">
                <h1 className="text-2xl font-bold text-center border-b-2 border-slate-800 pb-4 mb-10">NON-DISCLOSURE AGREEMENT (NDA)</h1>
                
                <div className="text-sm space-y-6 text-justify">
                  <p>
                    This Non-Disclosure Agreement (the "Agreement") is entered into as of <strong>{ndaData.effectiveDate}</strong>, 
                    by and between <strong>{ndaData.disclosingParty || "[Disclosing Party Name]"}</strong> ("Disclosing Party") 
                    and <strong>{ndaData.receivingParty || "[Receiving Party Name]"}</strong> ("Receiving Party").
                  </p>

                  <h3 className="font-bold border-b border-slate-200 pb-1 mt-6 uppercase text-xs tracking-wider">1. Definition of Confidential Information</h3>
                  <p>
                    "Confidential Information" shall mean any and all technical and non-technical information provided by Disclosing Party to Receiving Party that is either: 
                    (a) marked as "Confidential" or "Proprietary"; or (b) by its nature should be reasonably understood to be confidential. 
                    This includes, without limitation, business plans, financial data, customer lists, software code, designs, and know-how.
                  </p>

                  <h3 className="font-bold border-b border-slate-200 pb-1 mt-6 uppercase text-xs tracking-wider">2. Purpose</h3>
                  <p>
                    The Receiving Party shall use the Confidential Information solely for the purpose of <strong>{ndaData.purpose}</strong>. 
                    The Receiving Party shall not use the Confidential Information for any other purpose or for its own benefit or the benefit of any third party.
                  </p>

                  <h3 className="font-bold border-b border-slate-200 pb-1 mt-6 uppercase text-xs tracking-wider">3. Non-Disclosure Obligations</h3>
                  <p>
                    Receiving Party agrees to: (a) hold the Confidential Information in strict confidence; (b) exercise at least the same degree of care to protect it as it uses for its own confidential info; 
                    and (c) disclose it only to its employees or agents who have a "need to know" and are bound by similar confidentiality obligations.
                  </p>

                  <h3 className="font-bold border-b border-slate-200 pb-1 mt-6 uppercase text-xs tracking-wider">4. Term and Survival</h3>
                  <p>
                    This Agreement shall remain in effect during the discussions between the parties. The obligations of confidentiality shall survive 
                    for a period of <strong>{ndaData.duration} years</strong> from the date of disclosure.
                  </p>

                  <h3 className="font-bold border-b border-slate-200 pb-1 mt-6 uppercase text-xs tracking-wider">5. Governing Law</h3>
                  <p>
                    This Agreement shall be governed by and construed in accordance with the laws of <strong>{ndaData.governingLaw}</strong>. 
                    Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts of <strong>{ndaData.jurisdiction}</strong>.
                  </p>

                  <div className="pt-20 grid grid-cols-2 gap-20">
                    <div className="border-t border-slate-400 pt-2">
                      <p className="font-bold uppercase text-xs">For Disclosing Party</p>
                      <p className="text-slate-400 text-xs mt-8 italic">Signature & Date</p>
                    </div>
                    <div className="border-t border-slate-400 pt-2">
                      <p className="font-bold uppercase text-xs">For Receiving Party</p>
                      <p className="text-slate-400 text-xs mt-8 italic">Signature & Date</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Print Overlay CSS */}
      <style>{`
        @media print {
          @page { margin: 10mm; size: auto; }
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:p-0 { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}

// Reusable UI Components
function Input({ label, type = "text", placeholder = "", value, onChange }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
