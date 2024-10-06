import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";

function App() {
    const userRole = "user";
  return (
    <div className="App">
      <Header userRole={userRole}/>
    </div>
  );
}

export default App;
