import { Link } from "react-router-dom/cjs/react-router-dom.min";
import logo from "../images/logo.svg";

function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="лого" />
      <Link to="/sign-in" className="header__button">Войти</Link>
    </header>
  );
}

export default Header;
