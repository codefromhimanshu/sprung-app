import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

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

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Tags = {
  getAll: () => {
    return JSON.parse('{"tags":["dragons","test","training","tags","as","coffee","money","flowers","sushi","caramel","cars","sugar","happiness","japan","cookies","well","clean","animation","baby"]}')
  }
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: page => {
    return JSON.parse('{"articles":[{"title":"h","slug":"h-87sas1","body":"hnsedt","createdAt":"2019-04-13T09:03:58.209Z","updatedAt":"2019-04-13T09:03:58.209Z","tagList":["jnt"],"description":"hsdrtg","author":{"username":"cheng","bio":"This is my bio","image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false},"favorited":false,"favoritesCount":2},{"title":"zsvgvase","slug":"zsvgvase-kah320","body":"bhaserfbh","createdAt":"2019-04-13T09:02:15.469Z","updatedAt":"2019-04-13T09:02:15.469Z","tagList":["abher","bhaesrbh","ebh"],"description":"gbaser","author":{"username":"cheng","bio":"This is my bio","image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false},"favorited":false,"favoritesCount":1},{"title":"Who is from Europe?","slug":"who-is-from-europe-1sbif","body":"Hello world!","createdAt":"2019-04-13T08:20:54.350Z","updatedAt":"2019-04-13T08:20:54.350Z","tagList":[],"description":"europe","author":{"username":"vanapagan","bio":null,"image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false},"favorited":false,"favoritesCount":1},{"title":"Hy bud, wassup","slug":"hy-bud-wassup-e535wi","body":"go do better stuff","createdAt":"2019-04-13T07:53:33.053Z","updatedAt":"2019-04-13T07:53:33.053Z","tagList":["testing"],"description":"nothing","author":{"username":"kiranashok","bio":null,"image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false},"favorited":false,"favoritesCount":2},{"title":"This is a Test","slug":"this-is-a-test-fh4fxc","body":"Sed ligula enim, cursus sed dui rhoncus, gravida porta tortor. Fusce et lacinia quam. Aenean in nibh vitae tortor vulputate ultrices. Nunc fringilla sem a iaculis gravida. Aenean maximus suscipit urna vel bibendum. Morbi tincidunt condimentum velit sit amet fermentum. Donec sagittis elementum magna a suscipit. Suspendisse potenti.","createdAt":"2019-04-13T06:49:57.527Z","updatedAt":"2019-04-13T06:49:57.527Z","tagList":[],"description":"just messing around","author":{"username":"jwerre","bio":null,"image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false},"favorited":false,"favoritesCount":1},{"title":"grtbvz","slug":"grtbvz-lvnk0w","body":"bhsh","createdAt":"2019-04-13T06:16:46.980Z","updatedAt":"2019-04-13T06:16:46.980Z","tagList":["dragon"],"description":"gbvz","author":{"username":"cheng","bio":"This is my bio","image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false},"favorited":false,"favoritesCount":1},{"title":"sdgv","slug":"sdgv-efj93q","body":"fgbzsrfbh","createdAt":"2019-04-13T06:16:18.682Z","updatedAt":"2019-04-13T06:16:18.682Z","tagList":["bhaz","bhzser"],"description":"gvzsr","author":{"username":"cheng","bio":"This is my bio","image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false},"favorited":false,"favoritesCount":1},{"title":"Test post","slug":"test-post-rnr2xk","body":"Test post for Angular SSR","createdAt":"2019-04-13T05:42:42.007Z","updatedAt":"2019-04-13T05:42:42.007Z","tagList":[],"description":"With Angular SSR","author":{"username":"sanketmaru","bio":null,"image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false},"favorited":false,"favoritesCount":0},{"title":"top places in chicago","slug":"top-places-in-chicago-73uolw","body":"- zoo- museum- park","createdAt":"2019-04-13T02:48:08.214Z","updatedAt":"2019-04-13T02:48:08.214Z","tagList":["#zoo","#chicago"],"description":"this is a list for newcomers to visit","author":{"username":"tggtrg","bio":"svsdvdfsdsvdsvdsvds","image":"","following":false},"favorited":false,"favoritesCount":1},{"title":"Asdjldk","slug":"asdjldk-dhh4q","body":"dfghdfgh","createdAt":"2019-04-13T02:28:41.172Z","updatedAt":"2019-04-13T02:28:41.172Z","tagList":[],"description":"cklvjlsdkf","author":{"username":"Rodrigo","bio":null,"image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false},"favorited":false,"favoritesCount":1}],"articlesCount":500}')
  },
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/articles/${slug}`),
  favorite: slug =>
    requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/articles/feed?limit=10&offset=0'),
  get: slug =>
    requests.get(`/articles/${slug}`),
  unfavorite: slug =>
    requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: article =>
    requests.post('/articles', { article })
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug =>
    requests.get(`/articles/${slug}/comments`)
};

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  get: username =>
    requests.get(`/profiles/${username}`),
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
