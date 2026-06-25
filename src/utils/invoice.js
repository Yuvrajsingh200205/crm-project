export function calculateInvoiceData(formData, party, material, invoiceNo) {
    const cgstRate = Number(formData.cgstRate) || material?.cgstRate || 9;
    const sgstRate = Number(formData.sgstRate) || material?.sgstRate || 9;
    const dateStr = new Date(formData.date || new Date()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });

    const hsn = formData.hsn || material?.hsn || '998519';
    const qty = Number(formData.quantity) || 1;
    const matRate = material?.avgPurchaseRate || material?.rate || material?.price || 0;
    const rate = Number(formData.rate) || (Number(formData.amount) || 0) / qty || matRate;
    
    const baseAmount = rate * qty;
    const cgstAmt = parseFloat(((baseAmount * cgstRate) / 100).toFixed(2));
    const sgstAmt = parseFloat(((baseAmount * sgstRate) / 100).toFixed(2));
    const totalTax = parseFloat((cgstAmt + sgstAmt).toFixed(2));
    
    const taxableValue = baseAmount;
    const grandTotal = parseFloat((baseAmount - totalTax).toFixed(2));
    const materialDesc = formData.materialName || material?.materialName || material?.name || 'Service';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    function numToWords(n) {
        n = Math.round(n);
        if (n === 0) return 'Zero';
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
        if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
        if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
        return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    }
    const paise = Math.round((grandTotal % 1) * 100);
    const grandWords = 'INR ' + numToWords(Math.floor(grandTotal)) + ' and ' + (paise ? numToWords(paise) + ' paise' : 'Zero paise') + ' Only';
    const taxPaise = Math.round((totalTax % 1) * 100);
    const taxWords = 'INR ' + numToWords(Math.floor(totalTax)) + ' and ' + (taxPaise ? numToWords(taxPaise) + ' paise' : 'Zero paise') + ' Only';

    const partyName = party?.partyName || party?.name || party?.vendorName || formData.partyName || 'Party Name';
    const partyAddr = [party?.address, party?.city, party?.state, party?.pincode].filter(Boolean).join(', ');
    const partyGSTIN = party?.gstin || '';

    return {
        cgstRate, sgstRate, dateStr, hsn, qty, rate, baseAmount, cgstAmt, sgstAmt, totalTax,
        taxableValue, grandTotal, materialDesc, grandWords, taxWords, partyName, partyAddr, partyGSTIN, invoiceNo
    };
}

export function generateInvoiceHTML(formData, party, material, invoiceNo) {
    const {
        cgstRate, sgstRate, dateStr, hsn, qty, rate, baseAmount, cgstAmt, sgstAmt,
        taxableValue, grandTotal, materialDesc, grandWords, taxWords, partyName, partyAddr, partyGSTIN
    } = calculateInvoiceData(formData, party, material, invoiceNo);

    const emptyRows = Array(6).fill(0).map(() =>
        '<tr>' + Array(8).fill('<td style="height:22px;"></td>').join('') + '</tr>'
    ).join('');

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Tax Invoice - ${invoiceNo}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #000; background: #fff; }
  .page { width: 800px; margin: 0 auto; padding: 20px; }
  h1.title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 8px; border: 2px solid #000; padding: 6px; }
  table { width: 100%; border-collapse: collapse; }
  td, th { border: 1px solid #555; padding: 5px 7px; vertical-align: top; }
  th { background: #f0f0f0; font-weight: bold; text-align: center; }
  .bold { font-weight: bold; }
  .right { text-align: right; }
  .center { text-align: center; }
  .italic-bold { font-style: italic; font-weight: bold; }
  .grand-total { font-size: 13px; font-weight: bold; }
  .amount-words { font-style: italic; font-size: 10px; }
  .declaration { font-size: 9.5px; color: #333; }
</style>
</head>
<body>
<div class="page">
  <h1 class="title">Tax Invoice</h1>
  <table>
    <tr>
      <td rowspan="9" style="width:48%;">
        <div class="bold" style="font-size:12px;">Morlatis Engineering And Construction Pvt Ltd</div>
        <div>01, Ramanad Nagar, Keshonaryanpur, Gram</div>
        <div>Panchayat Office, Keshonaryanpur, Bond Dih</div>
        <div>Dakhli, Samastipur, Bihar, 848504</div>
        <div><span class="bold">GSTIN/UIN:</span> 10AAMCM1665L2ZC</div>
        <div><span class="bold">State Name:</span> Bihar, Code: 10</div>
        <br/>
        <div class="bold">Consignee (Ship to)</div>
        <div class="bold" style="font-size:11px;">${partyName}</div>
        <div>${partyAddr}</div>
        ${partyGSTIN ? `<div><span class="bold">GSTIN/UIN</span> : ${partyGSTIN}</div>` : ''}
        <br/>
        <div class="bold">Buyer (Bill to)</div>
        <div class="bold" style="font-size:11px;">${partyName}</div>
        <div>${partyAddr}</div>
        ${partyGSTIN ? `<div><span class="bold">GSTIN/UIN</span> : ${partyGSTIN}</div>` : ''}
      </td>
      <td style="width:26%;"><div>Invoice No.</div><div class="bold">${invoiceNo}</div></td>
      <td style="width:26%;"><div>Dated</div><div class="bold">${dateStr}</div></td>
    </tr>
    <tr><td>Delivery Note</td><td>Mode/Terms of Payment</td></tr>
    <tr><td>Reference No. &amp; Date.</td><td>Other References</td></tr>
    <tr><td><div>Buyer's Order No.</div><div class="bold">PI/2026-27/07</div></td><td><div>Dated</div><div class="bold">${dateStr}</div></td></tr>
    <tr><td><div>Dispatch Doc No.</div><div class="bold">${invoiceNo}</div></td><td>Delivery Note Date</td></tr>
    <tr><td>Dispatched through</td><td>Destination</td></tr>
    <tr><td><div>Bill of Lading/LR-RR No.</div><div class="bold">dt. ${dateStr}</div></td><td>Motor Vehicle No.</td></tr>
    <tr><td colspan="2">Terms of Delivery</td></tr>
  </table>

  <table style="margin-top:8px;">
    <thead>
      <tr>
        <th style="width:5%;">Sl No.</th>
        <th>Description of Services</th>
        <th style="width:10%;">HSN/SAC</th>
        <th style="width:8%;">Qty</th>
        <th style="width:12%;">Rate</th>
        <th style="width:5%;">per</th>
        <th style="width:15%;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="center">1</td>
        <td class="bold">${materialDesc}</td>
        <td class="center">${hsn}</td>
        <td class="center bold">${qty}</td>
        <td class="right bold">${rate.toFixed(2)}</td>
        <td class="center">Nos</td>
        <td class="right bold">${baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
      ${emptyRows}
      <tr>
        <td></td>
        <td class="right italic-bold">CGST</td>
        <td></td><td></td>
        <td class="right italic-bold">${cgstRate}%</td>
        <td></td>
        <td class="right bold">${cgstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
      <tr>
        <td></td>
        <td class="right italic-bold">SGST</td>
        <td></td><td></td>
        <td class="right italic-bold">${sgstRate}%</td>
        <td></td>
        <td class="right bold">${sgstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
      <tr>
        <td></td><td class="right bold">Total</td><td></td><td></td><td></td><td></td>
        <td class="right grand-total">₹ ${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
    </tbody>
  </table>

  <table style="border-top:none;">
    <tr>
      <td colspan="4" style="border-top:none;">
        <div>Amount Chargeable (in words)</div>
        <div class="bold amount-words">${grandWords}</div>
      </td>
    </tr>
    <tr>
      <td class="right bold" style="width:50%;">HSN/SAC</td>
      <td class="right bold" style="width:15%;">Taxable Value</td>
      <td class="center bold" style="width:17.5%;">CGST Amount</td>
      <td class="center bold" style="width:17.5%;">SGST Amount</td>
    </tr>
    <tr>
      <td class="right">${hsn}</td>
      <td class="right">${taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td class="center">${cgstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td class="center">${sgstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
    <tr>
      <td class="right bold">Total</td>
      <td class="right bold">${taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td class="center bold">${cgstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td class="center bold">${sgstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
    <tr>
      <td colspan="4">
        <div>Tax Amount (in words) : <span class="bold amount-words">${taxWords}</span></div>
      </td>
    </tr>
  </table>

  <table style="margin-top:8px;">
    <tr>
      <td style="width:50%; border-right:none;" class="declaration">
        <span class="bold" style="text-decoration:underline;">Declaration</span><br/>
        We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
      </td>
      <td style="width:50%; border-left:none;" class="right declaration">
        <div class="bold">for Morlatis Engineering And Construction Pvt Ltd</div>
        <br/><br/><br/>
        <div>Authorised Signatory</div>
      </td>
    </tr>
  </table>
  <div class="center declaration" style="margin-top:5px;">This is a Computer Generated Invoice</div>
</div>
</body>
</html>`;
}

export function downloadInvoice(formData, party, material) {
    const year = new Date(formData.date).getFullYear();
    const nextShortYear = String(year + 1).slice(2);
    const invoiceNo = `RK/${year}-${nextShortYear}/01`;
    const html = generateInvoiceHTML(formData, party, material, invoiceNo);
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${invoiceNo.replace(/\//g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
