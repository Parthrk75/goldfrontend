import './App.css';
import GoldCard from './componant/GoldCard'; // Ensure correct spelling of "componant"
import GoldChart from './componant/GoldChart';
import GoldPrice from './componant/GoldPrice';
// import LastEntries from './componant/LastEntries';
import Navbar from './componant/Navbar'; // Ensure correct spelling of "componant"
// import PriceTable from './componant/PriceTable';

function App() {
  return (
    <div className="App">
      <Navbar />
      <GoldPrice/>
      <GoldCard />
      {/* <PriceTable/> */}
      <GoldChart/>
      {/* <LastEntries/> */}
    </div>
  );
}

export default App;
