function Login() {
    return (
        <div className="sign">
            <form className="sign__form">
                <h2 className="sign__form-title">Вход</h2>
                <input className="sign__form-input" placeholder='Email'></input>
                <input className="sign__form-input" placeholder='Пароль'></input>
                <button className="sign__form-button">Войти</button>
            </form>
        </div>
    )
}

export default Login;