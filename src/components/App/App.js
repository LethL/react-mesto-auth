import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ImagePopup from "../ImagePopup/ImagePopup";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import EditProfilePopup from "../EditProfilePopup/EditProfilePopup";
import EditAvatarPopup from "../EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "../AddPlacePopup/AddPlacePopup";
import Loader from "../Loader/Loader";
import api from "../../utils/api";
import React, { useEffect } from "react";
import { Route } from 'react-router-dom';

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setselectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />

        <Route path="/sign-up">
          <div>sign-up</div>
        </Route>

        <Route path="/sign-in">
          <div>sign-in</div>
        </Route>

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

        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          cards={cards}
          handleCardLike={handleCardLike}
          handleCardDelete={handleCardDelete}
        />

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
