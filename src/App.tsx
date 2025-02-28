import "src/App.css";
import WeatherWidget from "src/components/WeatherWidget";
import useNetworkStatus from "src/utils/Network";

function App() {
  const { isOnline } = useNetworkStatus();
  return <>{isOnline ? <WeatherWidget /> : <h1>Offline</h1>}</>;
}

export default App;
