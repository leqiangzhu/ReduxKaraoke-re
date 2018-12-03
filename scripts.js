const songList = {
  1: "Don't want to be a fool for you, Just another player in your game for two, You may hate me but it ain't no lie, Baby bye bye bye, Bye bye, I Don't want to make it tough, I just want to tell you that I've had enough, It might sound crazy but it ain't no lie, Baby bye bye bye".split(', '),
  2: "Twenty-five years and my life is still, Trying to get up that great big hill of hope, For a destination, I realized quickly when I knew I should, That the world was made up of this brotherhood of man, For whatever that means, And so I cry sometimes when I'm lying in bed, Just to get it all out what's in my head, And I, I am feeling a little peculiar, And so I wake in the morning and I step outside, And I take a deep breath and I get real high, and I Scream from the top of my lungs, What's going on?, And I say hey yeah yeah hey yeah yeah, I said hey what's going on?, And I say hey yeah yeah hey yeah yeah,I said hey what's going on?".split(', ')
};

// STATE
const initialState = {
  currentSong: null,
  songList: {
    byeByeBye: {
      title: 'Bye Bye Bye',
      artist: "N'Sync",
      lyrics: songList[1],
      position: 0
    },
    whatsGoinOn: {
      title: "What\'s Goin\' On",
      artist: '4 Non Blondes',
      lyrics: songList[2],
      position: 0
    }
  }  
}

// REDUCER
const lyricReducer = (state = initialState.songList, action) => {
  let newState = Object.assign({}, state);
  switch(action.type) {
    case 'NEXT_LYRIC':
      newState[action.songTitle].position++;
      return newState;
    case 'RESTART_SONG':
      newState[action.songTitle].position = 0;
      return newState;
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSong, action) => {
  switch (action.type) {
    case 'CHANGE_SONG':
      return action.songTitle;
    default:
      return state;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentSong: songChangeReducer,
  songList: lyricReducer
});

// REDUX STORE
const { createStore } = Redux;
const store = createStore(rootReducer);

// LOGIC
function switchPhrase(song) {
  let action;
  if (store.getState().songList[song].position < store.getState().songList[song].lyrics.length - 1) {
    action = {
      type: 'NEXT_LYRIC',
      songTitle: song
    }
    store.dispatch(action);
  } else {
    action = {
      type: 'RESTART_SONG',
      songTitle: song
    }
    store.dispatch(action);
  }
}

function selectSong(song) {
  let action = {
    type: 'CHANGE_SONG',
    songTitle: song
  }
  store.dispatch(action);
}

const renderSongs = () => {
  const songList = store.getState().songList;
  for (const songKey in songList) {
    const song = songList[songKey]
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const songTitle = document.createTextNode(song.title);
    const songArtist = document.createTextNode(' by ' + song.artist);
    em.appendChild(songTitle);
    h3.appendChild(em);
    h3.appendChild(songArtist);
    h3.addEventListener('click', function() {
      selectSong(songKey);
    });
    li.appendChild(h3);
    document.getElementById('songs').appendChild(li);
  }
}

const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }

  if (store.getState().currentSong) {
    const currentLine = document.createTextNode(store.getState().songList[store.getState().currentSong].lyrics[store.getState().songList[store.getState().currentSong].position]);
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
    const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
    document.getElementById('lyrics').appendChild(selectSongMessage);
  }
}


window.onload = function() {
  renderSongs();
  renderLyrics();
}

function userClick() {
  switchPhrase(store.getState().currentSong);
}

store.subscribe(renderLyrics);