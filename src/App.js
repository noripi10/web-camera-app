import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { CameraScreen, HomeScreen } from './pages';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={HomeScreen} />
				<Route exact path="/camera" component={CameraScreen} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
