import './App.css';
import GoldCard from './componant/GoldCard'; // Ensure correct spelling of "componant"
import Navbar from './componant/Navbar'; // Ensure correct spelling of "componant"
import PriceTable from './componant/PriceTable';

function App() {
  return (
    <div className="App">
      <Navbar />
      <GoldCard />
      <PriceTable/>
    </div>
  );
}

export default App;
