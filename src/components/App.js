import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Loader from "./Loader/Loader";
import api from "../utils/api";
import React, { useEffect } from "react";
import { Route, Redirect } from 'react-router-dom';
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from '../utils/auth.js';
import successLogo from "../images/success-logo.svg";
import errorLogo from "../images/error-logo.svg";

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setselectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [status, setStatus] = React.useState({image: null, message: ''});

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setselectedCard(card);
  }

  function handlecloseAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setselectedCard(null);
    setInfoTooltipOpen(false)
  }

  function handleUpdateUser(user) {
    setLoading(true)
    api
      .editUserInfo(user)
      .then(data => {
        setCurrentUser(data)
        handlecloseAllPopups()
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  function onUpdateAvatar(avatarLink) {
    setLoading(true)
    api
      .editAvatar(avatarLink)
      .then(data => {
        setCurrentUser(data)
        handlecloseAllPopups()
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  function handleAddPlace(place) {
    setLoading(true)
    api
      .addCard(place)
      .then((newCard) => {
        setCards([newCard, ...cards])
        handlecloseAllPopups()
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    api
      .getUserInfo()
      .then(setCurrentUser)
      .catch((err) => console.log(err));
  }, [])

  useEffect(() => {
    api
      .getInitialCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) {
    return <Loader />
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((newCard) => newCard !== card))
    })
    .catch((err) => console.log(err));
  }

  function handleRegister(password, email) {
    auth.register(password, email)
    .then((data) => {
      console.log(data);
      setStatus({image: successLogo, message: 'Вы успешно зарегистрировались!'})
    })
    .catch(() =>
      setStatus({image: errorLogo, message: 'Что-то пошло не так! Попробуйте ещё раз.'}))
    .finally(() => setInfoTooltipOpen(true))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />

          <Switch>
            <Route path="/signup">
              <Register 
              onRegister={handleRegister}/>
            </Route>

            <Route path="/signin">
              <Login />
            </Route>

            
            <ProtectedRoute
            path="/main"
            loggedIn={loggedIn}
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            handleCardLike={handleCardLike}
            handleCardDelete={handleCardDelete}> 
            </ProtectedRoute>

            <Route exact path="/">
              {loggedIn ? <Redirect to="/main" /> : <Redirect to="/signup" />}
            </Route> 
          </Switch>

            {/* <Route path="/main"> */}
              <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={handlecloseAllPopups}
              onUpdateAvatar={onUpdateAvatar}>
              </EditAvatarPopup>

              <EditProfilePopup
                onUpdateUser={handleUpdateUser}
                isOpen={isEditProfilePopupOpen}
                onClose={handlecloseAllPopups}
              ></EditProfilePopup>

              <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={handlecloseAllPopups}
              onAddPlace={handleAddPlace}>
              </AddPlacePopup>

              <ImagePopup card={selectedCard} onClose={handlecloseAllPopups} />

              <InfoTooltip
              onClose={handlecloseAllPopups}
              isOpen={isInfoTooltipOpen}
              image={status.image}
              message={status.message}/>

              {/* <Main
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards={cards}
                handleCardLike={handleCardLike}
                handleCardDelete={handleCardDelete}
              /> */}

              <Footer />
            {/* </Route> */}

          
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
