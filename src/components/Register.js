import { Link } from 'react-router-dom'; 

function Register() {
    return (
        <div className="sign">
            <form className="sign__form">
                <h2 className="sign__form-title">Регистрация</h2>
                <input className="sign__form-input" placeholder='Email'></input>
                <input className="sign__form-input" placeholder='Пароль'></input>
                <button className="sign__form-button">Зарегистрироваться</button>
                <Link to="/sign-in" className="sign__form-link">Уже зарегистрированы? Войти</Link>
            </form>
        </div>
    )
}

export default Register;