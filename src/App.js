import './App.css';
import { GuessContextWrapper } from './GuessContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pages from './Pages';
import Admin from './Admin';

function App() {

  const homeElement = (
    <div className="App">
      <h1 className="app-header">
        <div className='css-logo'>
          <div className='logo-letter letter-green'>C</div>
          <div className='logo-letter letter-green'>I</div>
          <div className='logo-letter letter-green'>R</div>
          <div className='logo-letter letter-green'>C</div>
          <div className='logo-letter letter-green'>L</div>
          <div className='logo-letter letter-green'>E</div>
          <div className='logo-letter letter-grey'>D</div>
          <div className='logo-letter letter-grey'>R</div>
          <div className='logo-letter letter-grey'>O</div>
          <div className='logo-letter letter-grey'>P</div>
          <div className='logo-letter letter-yellow'>R</div>
          <div className='logo-letter letter-yellow'>O</div>
          <div className='logo-letter letter-yellow'>Y</div>
          <div className='logo-letter letter-yellow'>A</div>
          <div className='logo-letter letter-yellow'>L</div>
          <div className='logo-letter letter-yellow'>E</div>
        </div>
      </h1>

      <GuessContextWrapper>
        <Pages />
      </GuessContextWrapper>
    </div>
  )

  if (!(window.location.href.includes("home") || window.location.href.includes("admin"))) {
    window.location.replace(window.location.origin + "/home")
  }
  return (
    <Router>
      <Routes>
        <Route exact path='/home' element={homeElement} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
