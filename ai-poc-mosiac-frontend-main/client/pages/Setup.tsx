import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FC, SVGProps } from 'react';
import Stepper from '@/components/ui/Stepper';
import SuccessModal from '@/components/ui/SuccessModal';

interface DataSource {
  id: string;
  name: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  category: 'Sample' | 'Data System';
  previewType?: 'PRIVATE PREVIEW' | 'SAMPLE';
}

const AudienceIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 019 12.125v-2.625a3.375 3.375 0 013.375-3.375H15V5.25A2.25 2.25 0 0012.75 3H12a2.25 2.25 0 00-2.25 2.25v2.25H6.625a3.375 3.375 0 00-3.375 3.375v2.625a3.375 3.375 0 003.375 3.375h2.625a3.375 3.375 0 013.375-3.375z" />
  </svg>
);
const SnowflakeIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.31 2.31L12 6.62 9.69 4.31 12 2m4.31 2.31L14.0001 6.62 16.31 9l2.31-2.31-2.31-2.38zM7.38 6.62L5.07 4.31 2.76 6.62 5.07 9l2.31-2.38zM12 8.03l2.31 2.31L12 12.65l-2.31-2.31L12 8.03zm6.92 2.31l2.32 2.32-2.32 2.31-2.31-2.31 2.31-2.32zM2.76 11.62l2.31 2.31-2.31 2.32-2.32-2.32 2.32-2.31zM12 14.06l2.31 2.31L12 18.68l-2.31-2.31 2.31-2.31zm4.31 2.31L14.0001 18.68 16.31 21l2.31-2.31-2.31-2.32zM7.38 18.68L5.07 21l-2.31-2.31L5.07 16.37l2.31 2.31zM12 20.09l2.31 2.31L12 24.71l-2.31-2.31L12 20.09z" />
  </svg>
);
const CheckCircleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const dataSources: DataSource[] = [
  { id: 'b2b-saas', name: 'B2B SaaS', icon: AudienceIcon, category: 'Sample', previewType: 'SAMPLE' },
  { id: 'b2c-ecommerce', name: 'B2C eCommerce', icon: AudienceIcon, category: 'Sample', previewType: 'SAMPLE' },
  { id: 'athena', name: 'Amazon Athena', icon: () => <div className="text-yellow-500 font-bold">A</div>, category: 'Data System' },
  { id: 'redshift', name: 'Amazon Redshift', icon: () => <div className="text-orange-500 font-bold">R</div>, category: 'Data System' },
  { id: 'clickhouse', name: 'Clickhouse', icon: () => <div className="text-yellow-400 font-bold">C</div>, category: 'Data System' },
  { id: 'databricks', name: 'Databricks', icon: () => <div className="text-red-600 font-bold">D</div>, category: 'Data System' },
  { id: 'dremio', name: 'Dremio', icon: () => <div className="text-purple-500 font-bold">Dr</div>, category: 'Data System', previewType: 'PRIVATE PREVIEW' },
  { id: 'dynamodb', name: 'DynamoDB', icon: () => <div className="text-blue-500 font-bold">Dy</div>, category: 'Data System' },
  { id: 'elasticsearch', name: 'Elasticsearch', icon: () => <div className="text-teal-500 font-bold">E</div>, category: 'Data System' },
  { id: 'firebolt', name: 'Firebolt', icon: () => <div className="text-red-500 font-bold">F</div>, category: 'Data System' },
  { id: 'firestore', name: 'Firestore', icon: () => <div className="text-yellow-500 font-bold">Fs</div>, category: 'Data System', previewType: 'PRIVATE PREVIEW' },
  { id: 'bigquery', name: 'Google BigQuery', icon: () => <div className="text-blue-500 font-bold">G</div>, category: 'Data System' },
  { id: 'mongodb', name: 'MongoDB', icon: () => <div className="text-green-500 font-bold">M</div>, category: 'Data System' },
  { id: 'mysql', name: 'MySQL', icon: () => <div className="text-blue-400 font-bold">My</div>, category: 'Data System' },
  { id: 'oracle', name: 'Oracle', icon: () => <div className="text-red-500 font-bold">O</div>, category: 'Data System', previewType: 'PRIVATE PREVIEW' },
  { id: 'palantir', name: 'Palantir Foundry', icon: () => <div className="text-gray-700 font-bold">P</div>, category: 'Data System' },
  { id: 'postgres', name: 'PostgreSQL', icon: () => <div className="text-indigo-500 font-bold">Pg</div>, category: 'Data System' },
  { id: 'rockset', name: 'Rockset', icon: () => <div className="text-purple-600 font-bold">R</div>, category: 'Data System' },
  { id: 's3', name: 'S3', icon: () => <div className="text-red-500 font-bold">S3</div>, category: 'Data System' },
  { id: 'sql-server', name: 'SQL Server', icon: () => <div className="text-red-600 font-bold">S</div>, category: 'Data System' },
  { id: 'snowflake', name: 'Snowflake', icon: SnowflakeIcon, category: 'Data System' },
  { id: 'trino', name: 'Trino', icon: () => <div className="text-teal-500 font-bold">T</div>, category: 'Data System' },
];

const Step1_SelectSource: FC<{ onSelect: (source: DataSource) => void }> = ({ onSelect }) => {
  const renderSourceGrid = (category: 'Sample' | 'Data System') => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {dataSources.filter((s) => s.category === category).map((source) => (
        <button
          key={source.id}
          onClick={() => onSelect(source)}
          className="relative group p-4 border border-gray-200 rounded-lg text-left hover:border-purple-500 hover:shadow-lg transition-all duration-200 flex items-center space-x-4 bg-white"
        >
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-md text-purple-600">
            <source.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{source.name}</p>
          </div>
          {source.previewType && (
            <span
              className={`absolute top-2 right-2 text-xs font-bold text-white px-2 py-0.5 rounded-full ${
                source.previewType === 'SAMPLE' ? 'bg-orange-400' : 'bg-blue-500'
              }`}
            >
              {source.previewType}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Source catalog</h2>

      <h3 className="text-md font-semibold text-gray-700 mb-3 mt-6">Sample datasets</h3>
      <p className="text-sm text-gray-500 mb-4">Try setting up your first sync using one of our sample datasets.</p>
      {renderSourceGrid('Sample')}

      <h3 className="text-md font-semibold text-gray-700 mb-3 mt-8">Data systems</h3>
      <p className="text-sm text-gray-500 mb-4">Connect to your data warehouse, data lake, transactional database, or any other data system.</p>
      {renderSourceGrid('Data System')}
    </div>
  );
};

const Step2_ConnectSource: FC<{ selectedSource: DataSource | null }> = ({ selectedSource }) => {
  if (!selectedSource) return null;

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md text-purple-600">
          <selectedSource.icon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Connect {selectedSource.name}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700">Account</label>
          <input type="text" id="account" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="your-account.region.cloud" />
        </div>
        <div>
          <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700">Warehouse</label>
          <input type="text" id="warehouse" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="YOUR_WAREHOUSE" />
        </div>
        <div>
          <label htmlFor="database" className="block text-sm font-medium text-gray-700">Database</label>
          <input type="text" id="database" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="YOUR_DATABASE" />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" id="username" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="YOUR_USER" />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <input type="text" id="role" defaultValue="DEFAULT" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
        </div>
      </div>
    </div>
  );
};

const Step3_FinishSource: FC<{ selectedSource: DataSource | null }> = ({ selectedSource }) => {
  if (!selectedSource) return null;

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md text-purple-600">
          <selectedSource.icon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Connect {selectedSource.name}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" defaultValue={selectedSource.name} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
          <div className="relative mt-1">
            <input type="text" id="slug" defaultValue={`${selectedSource.id}-u3fcd`} className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm pr-20" readOnly />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-green-600">
              <CheckCircleIcon className="w-5 h-5 mr-1" /> Available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SetupPage: FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const steps = ['Select', 'Connect', 'Finish'];

  const handleSelectSource = (source: DataSource) => {
    setSelectedSource(source);
    setStep(2);
  };

  const handleContinue = async () => {
    if (step < steps.length) {
      setStep((s) => s + 1);
      return;
    }

    // step === Finish
    if (selectedSource) {
      // helper to read uncontrolled inputs (keeps your original form structure)
      const getVal = (id: string) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        return el ? el.value : '';
      };

      const account = getVal('account');
      const warehouse = getVal('warehouse');
      const database = getVal('database');
      const username = getVal('username');
      const role = getVal('role');
      const nameInput = getVal('name') || selectedSource.name;

      // backend requires port and password — send defaults if user didn't provide
      const payload = {
        name: nameInput,
        type: selectedSource.id,
        credentials: {
          account: account,
          database: database,
          username: username,
          password: '',   // password not collected in current UI -> send empty
          port: 5432,    // default
          warehouse: warehouse,
          role: role
        }
      };

      console.log('📤 Sending payload to POST /sources:', payload);

      try {
        const response = await fetch('http://127.0.0.1:8000/sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
          const errText = await response.text();
          console.error('❌ Backend rejected source creation:', errText);
          // show a visible error (so user isn't left wondering)
          alert('Failed to save source: ' + (errText || response.status));
          return;
        }

        const result = await response.json();
        console.log('✅ Source saved:', result);

        // show same success modal UI you had originally
        setShowSuccessModal(true);
      } catch (err) {
        console.error('💥 Network/Fetch error while saving source:', err);
        alert('Network error while saving source: ' + (err as Error).message);
      }
    }
  };

  const handleViewSources = () => {
    setShowSuccessModal(false);
    navigate('/app/sources');
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleCancel = () => {
    setStep(1);
    setSelectedSource(null);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1_SelectSource onSelect={handleSelectSource} />;
      case 2:
        return <Step2_ConnectSource selectedSource={selectedSource} />;
      case 3:
        return <Step3_FinishSource selectedSource={selectedSource} />;
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Source Connected Successfully!"
        message={`${selectedSource?.name} has been successfully configured and connected to your iNitro workspace.`}
        actionLabel="View Sources"
        onAction={handleViewSources}
      />
      <div className="bg-white p-6 rounded-t-lg border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add a new source</h1>
            {step > 1 && selectedSource && (
              <p className="text-sm text-gray-500 mt-1">Configuring {selectedSource.name}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 shadow-sm disabled:opacity-50"
              disabled={!selectedSource}
            >
              {step === steps.length ? 'Finish' : 'Continue'}
            </button>
          </div>
        </div>
        <Stepper currentStep={step} steps={steps} />
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-sm">{renderStepContent()}</div>
      {step > 1 && (
        <div className="mt-6 flex justify-start">
          <button onClick={handleBack} className="text-sm font-medium text-gray-600 hover:text-gray-900">
            &larr; Back
          </button>
        </div>
      )}
    </div>
  );
};

export default SetupPage;



