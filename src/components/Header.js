import { Link } from "react-router-dom";
import logo from "../images/logo.svg";

function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="лого" />
      <Link to="/signin" className="header__button">Войти</Link>
    </header>
  );
}

export default Header;
