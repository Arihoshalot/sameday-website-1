import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SDRoutes } from './routes';
import { Home, About, Contact, Blogs, Login, Register, ForgotPassword, Shop } from './pages/index';

function App() {
  return (
    <div className="App">
      <h1>
        <BrowserRouter>
          <Routes>
            <Route path={SDRoutes.Home.path} element={<Home />} />
            <Route path={SDRoutes.About.path} element={<About />} />
            <Route path={SDRoutes.Contact.path} element={<Contact />} />
            <Route path={SDRoutes.Blogs.path} element={<Blogs />} />
            <Route path={SDRoutes.Login.path} element={<Login />} />
            <Route path={SDRoutes.Register.path} element={<Register />} />
            <Route path={SDRoutes.ForgotPassword.path} element={<ForgotPassword />} />
            <Route path={SDRoutes.Shop.path} element={<Shop />} />
          </Routes>
        </BrowserRouter>
      </h1>
    </div>
  );
}
export default App;
