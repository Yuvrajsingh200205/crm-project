import { useState } from 'react';
import { Briefcase, Settings, FileText, Plus, Search, Filter, Download, MoreVertical, Eye } from 'lucide-react';

// Mock Data from Screenshots
const workAwardedData = [
  {
    id: 1,
    nameOfWork: 'Electrical work in connection',
    natureOfWork: 'Electrical work in connection with (i) Provision of IBPS in SPJ division NKE - SAHI (UP & DN directions) (ii) Provision of IBPS in SPJ division PPA - JDR (UP & DN directions). (iii) Provision of IBPS in SPJ division BUG - VKNR (UP direction)',
    clientNameAddress: '1. Near musharwa halt Vill- musharwa, NIKE-SAHI SITE 845449 2. Near raj Kunwar Singh halt Kalyanpur road vill- kuriya, PPA-JDR 845416 3. Near ashwani halt, bagha-valmiki nagar road, BUG-VKNR 845107',
    contractNo: '10849570094823',
    contractValue: '393,937.77',
    awardDate: '05.01.2024'
  },
  {
    id: 2,
    nameOfWork: 'Electrical(G) works related to augmentation of Memu Shed, Jhajha.',
    natureOfWork: 'Electrical(G) works related to augmentation of Memu Shed, Jhajha.',
    clientNameAddress: 'Jhajha memu shed, Jhajha railway Station, Bihar-811308',
    contractNo: '10849570107487',
    contractValue: '1,465,143.03',
    awardDate: '10.07.2024'
  },
  {
    id: 3,
    nameOfWork: 'Shifting of OHE ATD and ACC',
    natureOfWork: 'Shifting of OHE ATD and ACC at MGR Bridge (Bridge No. - 17) in between section SBDP -',
    clientNameAddress: 'MUNGER GANGA BRIDGE',
    contractNo: '10849570114123',
    contractValue: '4,735,690.40',
    awardDate: '03.10.2024'
  },
  {
    id: 4,
    nameOfWork: 'Electrical work in connection',
    natureOfWork: 'Electrical work in connection with (A) Provision of Multi Section Digital Axle Counter (MSDAC) in waterlogging prone area of Dhanbad Yard (B) Supply installation & commissioning of Hot Axle Box Detector (HABD) for DEMU (QTY -02), CNF (QTY-01), DSME (QTY-01) and MWF (QTY-01) In Dhanbad Division (C) Koderma - Pipradih - Provision of IBP between Koderma- Pipradih (D) Hazaribagh Town - Kansar Nawada - Provision of IBP between Hazaribagh Town and Kansar Nawada',
    clientNameAddress: 'Dhanbad Yard',
    contractNo: '10849570141940',
    contractValue: '1,641,345.62',
    awardDate: '2025-10-17'
  },
  {
    id: 5,
    nameOfWork: 'Electrical work in connection',
    natureOfWork: 'Schedule-A:- Provision of air-condition in Engineering Department under Sr.DEN/C/DNR Schedule-B:- Provision of Type-II quarters at Rajendra Pul, Barahiya, Bakhtiyarpur and Jamui (04 nos.) for trackman in Sr.DEN/2/DNR section. Schedule-C:- Electrical(G) works related to provision of RCC OH tank 50000 gallon capacity with water supply arrangement at Mahendru ghat colony under ADEN/W/PNBE.',
    clientNameAddress: 'Engineering Dep- Danapur,Rajendra Paul- Barahiya, Mahendru Ghat',
    contractNo: '10849570140824',
    contractValue: '1,695,117.42',
    awardDate: '2025-10-06'
  }
];

const machineriesData = [
  { id: 1, desc: 'Post Hole Digger', available: 'Owned', purchaseDate: '12/29/2023', driving: 'Electric', condition: 'Running', inspected: 'Yes', qty: '01 Nos' },
  { id: 2, desc: 'Concrete Mixture Machine', available: 'Owned', purchaseDate: '01/02/2023', driving: 'Diesel', condition: 'Running', inspected: 'Yes', qty: '01 Nos' },
  { id: 3, desc: 'Water Tank 5000Ltr', available: 'Owned', purchaseDate: '01/02/2023', driving: '-', condition: 'Running', inspected: 'Yes', qty: '01 Nos' },
  { id: 4, desc: 'Shuttering Plate', available: 'Owned', purchaseDate: '01/02/2023', driving: '-', condition: 'Running', inspected: 'Yes', qty: '450 Sqmm' },
  { id: 5, desc: 'Concrete Lift Machine', available: 'Owned', purchaseDate: '01/02/2023', driving: 'Diesel', condition: 'Running', inspected: 'Yes', qty: '01 Nos' },
  { id: 6, desc: 'Quib Mold', available: 'Owned', purchaseDate: '02/03/2023', driving: '-', condition: 'Running', inspected: 'Yes', qty: '06 Nos' },
  { id: 7, desc: 'Quib Compressive Test Machine', available: 'Owned', purchaseDate: '02/03/2023', driving: '-', condition: 'Running', inspected: 'Yes', qty: '01 Nos' },
  { id: 8, desc: 'Electronics Weight Machine Capacity 30kg', available: 'Owned', purchaseDate: '02/03/2023', driving: '-', condition: 'Running', inspected: 'Yes', qty: '01 Nos' },
  { id: 9, desc: 'Plate Vibrator', available: 'Owned', purchaseDate: '02/04/2023', driving: 'Diesel', condition: 'Running', inspected: 'Yes', qty: '01 Nos' },
  { id: 10, desc: 'Needle Vibrator', available: 'Owned', purchaseDate: '02/04/2023', driving: 'Diesel', condition: 'Running', inspected: 'Yes', qty: '01 Nos' },
  { id: 11, desc: 'Staging Pipe', available: 'Owned', purchaseDate: '02/04/2023', driving: '-', condition: 'Running', inspected: 'Yes', qty: '250 Mtr' },
];

export default function Tenders() {
  const [activeTab, setActiveTab] = useState('work-awarded');

  const tabs = [
    { id: 'work-awarded', label: 'Work Awarded (Last 7 Years)', icon: Briefcase },
    { id: 'machineries', label: 'Machineries, Tools & Plants', icon: Settings },
    { id: 'conditions', label: 'Special Conditions of Contract', icon: FileText }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile / Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tender Submissions & Annexures</h1>
          <p className="text-sm text-slate-500 mt-1">Manage standard technical and financial appendices required for e-tendering</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="btn px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm font-medium rounded-lg flex items-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button className="btn px-4 py-2 bg-[#22c55e] text-white hover:bg-[#16a34a] shadow-sm font-medium rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Record
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-200">
        <div className="flex gap-6 min-w-max px-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-[#22c55e] text-[#15803d]'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#22c55e]' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* WORK AWARDED TAB */}
        {activeTab === 'work-awarded' && (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 w-full">
              <h3 className="font-semibold text-slate-800">Details of Work Awarded to Tenderer During Last Seven Years</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search works..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#22c55e]" />
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 border-r border-slate-200 text-center w-12">S.No</th>
                    <th className="px-4 py-3 border-r border-slate-200 w-48">Name Of Work</th>
                    <th className="px-4 py-3 border-r border-slate-200 min-w-[300px]">Nature of Work & Brief Description</th>
                    <th className="px-4 py-3 border-r border-slate-200 w-64">Name & Address of the Client/Organization</th>
                    <th className="px-4 py-3 border-r border-slate-200 whitespace-pre-wrap leading-tight w-24">Letter of Acceptance / Contract No</th>
                    <th className="px-4 py-3 border-r border-slate-200 whitespace-pre-wrap leading-tight w-24">Contract Value (Lakh ₹)</th>
                    <th className="px-4 py-3">Date of Award</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workAwardedData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-500 text-center border-r border-slate-100">{row.id}</td>
                      <td className="px-4 py-3 text-slate-800 font-medium whitespace-pre-wrap border-r border-slate-100">{row.nameOfWork}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-pre-wrap text-xs leading-relaxed border-r border-slate-100">{row.natureOfWork}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-pre-wrap text-xs border-r border-slate-100">{row.clientNameAddress}</td>
                      <td className="px-4 py-3 text-slate-700 font-mono text-xs border-r border-slate-100">{row.contractNo}</td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold border-r border-slate-100">₹{row.contractValue}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{row.awardDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MACHINERIES TAB */}
        {activeTab === 'machineries' && (
          <div className="flex flex-col h-full animate-fade-in w-full">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 w-full">
              <h3 className="font-semibold text-slate-800">Annexure D - Details of Construction Machineries, Tools, and Plants</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search equipment..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#22c55e]" />
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 border-r border-slate-200 text-center w-12">Sl. No.</th>
                    <th className="px-4 py-3 border-r border-slate-200 min-w-[200px]">Description of equipment</th>
                    <th className="px-4 py-3 border-r border-slate-200 text-center whitespace-pre-wrap w-28">Number available (Owned/hired)</th>
                    <th className="px-4 py-3 border-r border-slate-200 text-center w-28">Date of Purchase</th>
                    <th className="px-4 py-3 border-r border-slate-200 text-center whitespace-pre-wrap w-28">Driving of (Petrol/Diesel/Electrical)</th>
                    <th className="px-4 py-3 border-r border-slate-200 text-center whitespace-pre-wrap w-28">Condition of the equipment</th>
                    <th className="px-4 py-3 border-r border-slate-200 text-center whitespace-pre-wrap w-28">Whether equipment can be inspected</th>
                    <th className="px-4 py-3 text-center w-24">Qty.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {machineriesData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 font-medium text-slate-500 text-center border-r border-slate-100">{row.id}</td>
                      <td className="px-4 py-2 text-slate-800 font-medium whitespace-pre-wrap border-r border-slate-100">{row.desc}</td>
                      <td className="px-4 py-2 text-slate-600 text-center border-r border-slate-100">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${row.available === 'Owned' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{row.available}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-600 text-center border-r border-slate-100">{row.purchaseDate}</td>
                      <td className="px-4 py-2 text-slate-600 text-center border-r border-slate-100">{row.driving}</td>
                      <td className="px-4 py-2 border-r border-slate-100 text-center">
                         <div className="flex items-center justify-center gap-1.5">
                           <span className={`w-1.5 h-1.5 rounded-full ${row.condition === 'Running' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                           <span className="text-slate-600 text-xs font-medium">{row.condition}</span>
                         </div>
                      </td>
                      <td className="px-4 py-2 text-slate-600 text-center border-r border-slate-100">{row.inspected}</td>
                      <td className="px-4 py-2 text-slate-800 font-semibold text-center">{row.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Mock */}
            <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500 w-full">
               <span>Showing 1 to {machineriesData.length} of {machineriesData.length} entries</span>
               <div className="flex space-x-1">
                  <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed">Previous</button>
                  <button className="px-3 py-1 bg-[#22c55e] text-white font-medium rounded">1</button>
                  <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed">Next</button>
               </div>
            </div>
          </div>
        )}

        {/* CONDITIONS TAB */}
        {activeTab === 'conditions' && (
          <div className="flex flex-col h-full animate-fade-in w-full bg-white">
             <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0">
               <div>
                 <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-600" /> Special Condition of Contract</h3>
                 <p className="text-xs text-slate-500 mt-0.5">East Central Railway / General Clauses / Annexures</p>
               </div>
               <button className="btn px-3 py-1.5 border border-slate-200 text-slate-600 bg-white hover:bg-slate-100 text-xs rounded font-medium">Edit Terms</button>
             </div>
             
             <div className="p-6 md:px-12 md:py-8 max-w-5xl mx-auto space-y-6 text-slate-700 text-sm leading-relaxed overflow-y-auto w-full">
                
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">65.1 Scope:</h4>
                  <p className="text-justify px-2 text-slate-600">This Chapter deals with the special condition of contract over and above the general conditions of contract, under which the various works coming under the purview of this contract are to be executed by the contractor. Where there is any conflict between instructions to tenderers and condition of tendering contained in Chapter - I and special conditions of contract contained in this chapter on the one hand and General Conditions of Contract (as amended up to April 2022) on the other, the former shall prevail.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">65.2 Condition of contract:</h4>
                  <p className="text-justify px-2 text-slate-600">In the event of a tender submitted by tenderer being accepted and the contract awarded to the tenderer the various works coming within the purview of the contract shall be governed by the terms and conditions included in the tender paper covering the following: -</p>
                  <ul className="list-[lower-roman] pl-10 space-y-1 text-slate-600">
                     <li>Instruction to tenderers and conditions of tendering as included in Tender document.</li>
                     <li>General conditions of contract amended up to April 2022.</li>
                     <li>Special conditions of contract as included in this Chapter.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">65.3 Work to be done as approved:</h4>
                  <p className="text-justify px-2 text-slate-600">The tender shall be finalized in consultation with the purchaser and approved before commencement of the work and the contractor shall be held responsible for the execution of the work in full compliance with detailed technical specifications, approved design and drawings and drawings modified at site by the purchaser's Engineer shall be treated as approved. However, such modifications shall be incorporated in the design and drawings and resubmitted for formal approval.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">65.4 Quality of material:</h4>
                  <p className="text-justify px-2 text-slate-600">All electrical work carried out shall also be of reputed make with best quality acceptable to the Sr.DEE(G)/ADEE (G), East Central Railway/Sonpur who shall have the power to reject the material or order for removal of any work done in his opinion is faulty or insecure and the contractor shall replace the same to his satisfaction.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">65.5 Contractor organization:</h4>
                  <div className="space-y-3 px-2 text-slate-600 text-justify">
                    <p>(1) Contractor should have 'valid Electrical Contractor license and Supervisory license of required voltage level from any state/Central Government Licensing Board'.</p>
                    <p>(2) Documents testifying tenderer's previous experience and financial status should be produced along with the tender or when desired by the competent authority. Tenderer (s) who has/have not carried out any work so far on this Railway and who is/are not borne on the approved list of the contractors should submit along with his/their tender credentials to establish:-<br />
                    (i) His capacity to carry out the work satisfactorily.<br />
                    (ii) His financial status supported by Bank reference and other documents.<br />
                    (iii) Certificates duly attested and testimonials regarding contracting experience for the type of job for which tender is invited with list of works carried out in the past.</p>
                    <p>(3) The contractor shall arrange all tools & plants and facilities necessary for wiring, erection, commissioning, and testing of the equipment's in compliance with the specification at his own cost.</p>
                    <p>(4) The contractor shall bring only materials, tools and plants and other accessories to the site of work, which is to be used in the execution of the contract. The contractor may store such materials tools and plants etc at site of work where suitable covered and open space would be made available to him free of charge. All these expense connected with the storage and safe custody of the materials etc shall be incurred by the contractor.</p>
                  </div>
                </div>

             </div>
          </div>
        )}

      </div>
    </div>
  );
}
