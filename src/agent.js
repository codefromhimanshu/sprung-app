import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import firebase from 'firebase';


const app = firebase.initializeApp({
  apiKey: "AIzaSyDl6cXZO7Jm-s0qahQqpEo8ax2rv3jlKlk",
  authDomain: "sprung-5c945.firebaseapp.com",
  databaseURL: "https://sprung-5c945.firebaseio.com",
  projectId: "sprung-5c945",
  storageBucket: "sprung-5c945.appspot.com",
  messagingSenderId: "263688550982"
});


const db = firebase.firestore();



const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'https://conduit.productionready.io/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

// const Auth = {
//   current: () =>
//     requests.get('/user'),
//   login: (email, password) =>
//     requests.post('/users/login', { user: { email, password } }),
//   register: (username, email, password) =>
//     requests.post('/users', { user: { username, email, password } }),
//   save: user =>
//     requests.put('/user', { user })
// };

const Auth = {
  current: () => {
    const user = firebase.auth().currentUser;
    if (user){
      return user;
    }
    return null;
  },
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
        resolve(user);
      }).catch(function(error) {
        console.log(error.message);
        reject(error);
      });
    });
  },
  register: (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {

        const username = email.split('@')[0];

        const data = {
          username,
          email,
        };

        db.collection('users').doc(user.user.uid).set(data).then(() => {
          console.log("User successfully generated!!");
          resolve(user);
        }).catch(function(error) {
          console.error("Error adding User: ", error);
          reject(error);
        });

        // resolve(user);
      }).catch(function(error) {
        console.log(error.message);
        reject(error);
      });
    })
  }
}

const Tags = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.collection('posts').get().then((doc) => {
        const list = [], tagList = [];
        doc.forEach(d => {
          list.push(d.data());
        })
        list.forEach(item => {
          if(item.tagList && item.tagList.length){
            item.tagList.forEach(tag => {
              tagList.push(tag);
            })
          }
        })
        resolve(tagList);
      }).catch(function(error) {
        reject(error);
      });
    })
  }
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: (page) => {
    return new Promise((resolve, reject) => {
      db.collection('posts').get().then((doc) => {
        let list = [];
        doc.forEach(d => {
          list.push(d.data());
        })
        resolve(list);
      }).catch(function(error) {
        reject(error);
      });
    })
  },
  byAuthor: (author, page) => {
    return new Promise((resolve, reject) => {
      db.collection('posts').get().then((doc) => {
        let list = [];
        doc.forEach(d => {
          if(d.data().author && d.data().author === "/users/" + author){
            list.push(d.data());
          }
        })
        resolve(list);
      }).catch(function(error) {
        reject(error);
      });
    })
  },
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/articles/${slug}`),
  favorite: slug =>
    requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () => {
    return new Promise((resolve, reject) => {
      db.collection('posts').get().then((doc) => {
        let list = [];
        doc.forEach(d => {
          const currentUser = JSON.parse(window.localStorage.getItem('authUser'));
          if(d.data().author && d.data().author === "/users/" + currentUser.uid)
          list.push(d.data());
        })
        resolve(list);
      }).catch(function(error) {
        reject(error);
      });
    })
  },
  get: slug => {
    return new Promise((resolve, reject) => {
      db.collection('posts').doc(slug).get().then((doc) => {
        doc.exists ? resolve(doc.data()) : reject();
      })
      .catch(function(error) {
        reject(error);
      });
    })
  },
  unfavorite: slug =>
    requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  // create: article =>
  //   requests.post('/articles', { article })
  create: article => {
    return new Promise((resolve, reject) => {
      const currentUser = JSON.parse(window.localStorage.getItem('authUser'));
      const slug = article.title.split(' ').join('-');
      const data = {
        author: '/users/' + JSON.parse(window.localStorage.getItem('authUser')).uid,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        slug: article.title.split(' ').join('-'),
      };

      db.collection('posts').doc(slug).set(data).then(() => {
        console.log("Document successfully written!");
        resolve(data);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
        reject(error);
      });
    });
  }
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug => ([]),
};

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  get: username => {
    return new Promise((resolve, reject) => {
      db.collection('users').doc(username).get().then((doc) => {
        doc.exists ? resolve(doc.data()) : reject();
      })
      .catch(function(error) {
        reject(error);
      });
    })
  },
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`)
};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: _token => { token = _token; }
};
