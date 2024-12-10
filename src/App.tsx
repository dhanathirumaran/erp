import { Routes, Route } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Sales from './components/Sales';
import Purchases from './components/Purchases';
import Contacts from './components/Contacts';
import Quotations from './components/Quotations';
import Attendance from './components/Attendance';
import { useAppState } from './hooks/useAppState';

function App() {
  const { 
    state, 
    error: saveError, 
    isLoading: isSaving,
    updateProducts,
    addTransaction,
    addPurchase,
    updateContacts,
    addQuotation,
    updateQuotation,
    updateAttendance,
    addSalesReturn,
    addPurchaseReturn
  } = useAppState();

  return (
    <MainLayout>
      {isSaving && (
        <div className="mb-4 text-blue-600 text-sm">
          Saving changes...
        </div>
      )}
      {saveError && (
        <div className="mb-4 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {saveError}
        </div>
      )}
      <Routes>
        <Route path="/" element={<Dashboard state={state} />} />
        <Route 
          path="/products" 
          element={<Products products={state.products} onUpdate={updateProducts} />} 
        />
        <Route 
          path="/sales" 
          element={
            <Sales 
              state={state} 
              onNewTransaction={addTransaction}
              onSalesReturn={addSalesReturn}
            />
          } 
        />
        <Route 
          path="/purchases" 
          element={
            <Purchases 
              state={state} 
              onNewPurchase={addPurchase}
              onPurchaseReturn={addPurchaseReturn}
            />
          } 
        />
        <Route 
          path="/quotations" 
          element={
            <Quotations 
              state={state} 
              onNewQuotation={addQuotation} 
              onUpdateQuotation={updateQuotation}
            />
          } 
        />
        <Route 
          path="/contacts" 
          element={<Contacts contacts={state.contacts} onUpdate={updateContacts} />} 
        />
        <Route 
          path="/attendance" 
          element={<Attendance state={state} onUpdateAttendance={updateAttendance} />} 
        />
      </Routes>
    </MainLayout>
  );
}

export default App;